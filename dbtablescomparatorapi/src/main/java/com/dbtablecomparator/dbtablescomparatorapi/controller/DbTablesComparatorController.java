package com.dbtablecomparator.dbtablescomparatorapi.controller;

import com.dbtablecomparator.dbtablescomparatorapi.service.DbTablesComparatorService;
import com.dbtablecomparator.dbtablescomparatorapi.utils.CompareResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping(  "/api/dbtablescomparator")
@CrossOrigin(origins = "http://localhost:3000")
public class DbTablesComparatorController
{


   private final DbTablesComparatorService dbTablesComparatorService;

    public DbTablesComparatorController(DbTablesComparatorService dbTablesComparatorService) {
        this.dbTablesComparatorService = dbTablesComparatorService;
    }

    @GetMapping("/tables")
    public List<String> getTables() {
        return dbTablesComparatorService.getTables();
    }

    @GetMapping("/tables/details")
    public Map<String,List<String>> getTablesColumns(@RequestParam("tableNames") String... tableNames) {
        return dbTablesComparatorService.getTablesColumns(tableNames);
    }

    @GetMapping("/savetemp")
    public boolean createTempTable(@RequestParam(name = "tables") String... tables){
        return dbTablesComparatorService.createTempTable(tables);
    }

    @GetMapping("/{tableName}")
    public List<CompareResult> compareTablesData(@PathVariable("tableName") String tableName,@RequestParam(name = "columns") String... columns){
        return dbTablesComparatorService.compareTablesData(tableName,columns);
    }
}
