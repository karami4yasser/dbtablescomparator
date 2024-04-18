package com.dbtablecomparator.dbtablescomparatorapi.service;

import com.dbtablecomparator.dbtablescomparatorapi.utils.*;
import org.hibernate.Session;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.ParameterMode;
import javax.persistence.StoredProcedureQuery;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.*;

@Service
@Transactional
public class DBUtils {
    private final  EntityManagerFactory entityManagerFactory;

    public DBUtils(EntityManagerFactory entityManagerFactory) {
        this.entityManagerFactory = entityManagerFactory;
    }

    public String getTablesSqlQuery() {
        return "SELECT * FROM user_tables LEFT JOIN user_objects ON user_objects.object_type = 'TABLE'  AND user_objects.object_name = user_tables.table_name WHERE user_objects.oracle_maintained != 'Y'  AND NOT REGEXP_LIKE(user_tables.table_name, '^TEMP_')";
    }
    public List<String> getTables(){
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Session session = entityManager.unwrap(Session.class);
        String sql = getTablesSqlQuery();
        List<String> results = new ArrayList<>();
        session.doWork(connection -> {
            ResultSet rs = connection.createStatement().executeQuery(sql);
            while (rs.next()) {
                results.add(rs.getString(1));
            }

        });
        session.close();
        entityManager.close();
        return results;
    }

    public List<String> getTableColumns(String tableName) {

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Session session = entityManager.unwrap(Session.class);
        List<String> results = new ArrayList<>();
        session.doWork(connection -> {
            PreparedStatement preparedStatement = connection
                    .prepareStatement("SELECT  column_name FROM USER_TAB_COLUMNS WHERE table_name=?");
            preparedStatement.setString(1,tableName);
            ResultSet rs = preparedStatement.executeQuery();
            while (rs.next()) {
                results.add(rs.getString(1));
            }
        });
        session.close();
        entityManager.close();
        return results;
    }

    public Map<String,List<String>> getTablesWithDetails() {
        Map<String,List<String>> map = new HashMap<>();
        List<String> tables = getTables();
        for (String table : tables) {
            map.put(table,getTableColumns(table));
        }
        return map;
    }

    public Boolean createTempTable(String... selectedTables) {
        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Session session = entityManager.unwrap(Session.class);

        try {
            // Prepare comma-separated string of table names
            String commaSeparatedTables = String.join(",", selectedTables);

            // Create stored procedure query
            StoredProcedureQuery query = session.createStoredProcedureQuery("CreateAndInsertTempTables");

            query.registerStoredProcedureParameter("p_tableList", String.class, ParameterMode.IN);
            // Set input parameter (assuming the procedure expects a single string param)
            query.setParameter("p_tableList", commaSeparatedTables);

            // Execute the stored procedure
            query.execute();

            // Handle output or side effects as needed (assuming no output is returned)

            return Boolean.TRUE;
        } catch (Exception e) {

            return Boolean.FALSE;
        } finally {
            session.close();
            entityManager.close();
        }
    }

    public Map<String, Data> getTableOldAndNewData(String tableName) {

        EntityManager entityManager = entityManagerFactory.createEntityManager();
        Session session = entityManager.unwrap(Session.class);
        List<String> columns = getTableColumns(tableName);

        String commaSeparatedColumns = String.join(",", columns);
        String sqlDataTable = String.format("SELECT * FROM %s ORDER BY %s",tableName,commaSeparatedColumns);

        String sqlDataTableTemp = String.format("SELECT * FROM temp_%s ORDER BY %s",tableName,commaSeparatedColumns);

        Data dataTable = new Data();

        Data dataTableTemp = new Data();
        session.doWork(connection -> {
            ResultSet rsDataTable = connection.createStatement().executeQuery(sqlDataTable);
            while (rsDataTable.next()) {
                Row row = new Row();
                for (String col:columns) {
                    row.addColumn(col,rsDataTable.getObject(col));
                }
                dataTable.addRow(row);
            }

            ResultSet rsDataTabletEMP = connection.createStatement().executeQuery(sqlDataTableTemp);
            while (rsDataTabletEMP.next()) {
                Row row = new Row();
                for (String col:columns) {
                    row.addColumn(col,rsDataTabletEMP.getObject(col));
                }
                dataTableTemp.addRow(row);
            }

        });

        Map<String,Data> result = new HashMap<>();
        result.put( tableName, dataTable);
        result.put( String.format("temp_%s",tableName) , dataTableTemp);
        session.close();
        entityManager.close();
        return result;
    }

    public List<CompareResult> compareTablesData(String tableName, Optional<DataFilter> filter, String... columns)
    {

        Map<String,Data> result = getTableOldAndNewData(tableName);
        List<Row> currentTableRows  = result.get(tableName).getRows();
        List<Row> tempTableDataRows = result.get(String.format("temp_%s",tableName)).getRows();

        boolean getAll = filter.isPresent() && filter.get() == DataFilter.ALL ? Boolean.TRUE : Boolean.FALSE;


        List<CompareResult> rows = new ArrayList<>();
        int minSize = Math.min(currentTableRows.size(), tempTableDataRows.size());
        for (int i = 0; i < minSize; i++)
        {
            Map<String,Object> currentTableRowCol = currentTableRows.get(i).getRowColumnsMap();
            Map<String,Object> tempTableDataRowCol = tempTableDataRows.get(i).getRowColumnsMap();
            boolean areEquals=Boolean.TRUE;
            Set<String> diffColumns = new HashSet<>();
            for(String col:columns)
            {
                if(DatabaseColumnComparator.compare(currentTableRowCol.get(col),tempTableDataRowCol.get(col)) !=0 )
                {
                    areEquals=Boolean.FALSE;
                    diffColumns.add(col);
                }
            }
            if(getAll == Boolean.FALSE)
            {
                if(areEquals==Boolean.FALSE) {
                    rows.add(new CompareResult(currentTableRows.get(i),tempTableDataRows.get(i),areEquals,diffColumns));
                }

            }
            else {
                rows.add(new CompareResult(currentTableRows.get(i),tempTableDataRows.get(i),areEquals,diffColumns));
            }
        }


            if (currentTableRows.size() == tempTableDataRows.size())
            {
                return rows;
            }

        else if(currentTableRows.size()>minSize)
        {
            for (int i = minSize; i < currentTableRows.size(); i++)
            {
                rows.add(new CompareResult(currentTableRows.get(i),null,false));
            }
        } else if(tempTableDataRows.size()>minSize)
        {
            for (int i = minSize; i < tempTableDataRows.size(); i++)
            {
                rows.add(new CompareResult(null,tempTableDataRows.get(i),false));
            }
        }
        return rows;
    }


}
