package com.dbtablecomparator.dbtablescomparatorapi.service;

import com.dbtablecomparator.dbtablescomparatorapi.utils.CompareResult;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DbTablesComparatorService

{
    private final DBUtils dbUtils;

    public DbTablesComparatorService(DBUtils dbUtils) {
        this.dbUtils = dbUtils;
    }

    public List<String> getTables() {
        return dbUtils.getTables();
    }
    public List<String> getTableColumns(String tableName) {
        return dbUtils.getTableColumns(tableName);
    }

    public Map<String,List<String>> getTablesColumns(String... tableNames) {
          Map<String,List<String>> tableColumns = new HashMap<>();
          for(String tableName: tableNames) {
              tableColumns.put(tableName,getTableColumns(tableName)) ;
          }
         return tableColumns;
    }

    public boolean createTempTable(String... tables){
        return dbUtils.createTempTable(tables);
    }

    public List<CompareResult> compareTablesData(String tableName, String... columns){
        return dbUtils.compareTablesData(tableName,columns);
    }
}
