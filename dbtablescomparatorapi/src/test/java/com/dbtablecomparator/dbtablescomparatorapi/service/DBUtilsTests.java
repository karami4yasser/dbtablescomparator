package com.dbtablecomparator.dbtablescomparatorapi.service;

import com.dbtablecomparator.dbtablescomparatorapi.utils.CompareResult;
import com.dbtablecomparator.dbtablescomparatorapi.utils.Data;
import com.dbtablecomparator.dbtablescomparatorapi.utils.DataFilter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
public class DBUtilsTests {

    @Autowired
    private DBUtils dbUtils;

    @Test
    void contextLoads() {
    }


    @Test
    void getTables_Test() {

        List<String> tables = dbUtils.getTables();
        assertNotNull(tables);
        assertEquals(6,tables.size());
    }

    @Test
    void getTable_Columns() {

        List<String> tables = dbUtils.getTableColumns("ORDERS");
        assertNotNull(tables);
        assertEquals(3,tables.size());
    }

    @Test
    void getTable_WithDetails() {

        Map<String,List<String>> tables = dbUtils.getTablesWithDetails();
        assertNotNull(tables);
        assertEquals(6,tables.size());
    }

    @Test
    void saveTempTables() {

        Boolean bo = dbUtils.createTempTable("USERS","ORDERS","ORDERDETAILS");

        assertEquals(Boolean.TRUE,bo);
    }



    @Test
    void getTableOldAndNewData() {

        Map<String, Data> result = dbUtils.getTableOldAndNewData("ORDERDETAILS");

        assertNotNull(result);

    }

    @Test
    void compareTablesData() {

        List<CompareResult> result = dbUtils.compareTablesData("ORDERS", Optional.of(DataFilter.ALL),"USERID");

        assertNotNull(result);

    }
}
