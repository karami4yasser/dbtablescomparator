package com.dbtablecomparator.dbtablescomparatorapi.controller;

import com.dbtablecomparator.dbtablescomparatorapi.service.DbTablesComparatorService;
import com.dbtablecomparator.dbtablescomparatorapi.utils.CompareResult;
import com.dbtablecomparator.dbtablescomparatorapi.utils.DataFilter;
import com.dbtablecomparator.dbtablescomparatorapi.utils.FileType;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Validated
@Controller
@RequestMapping(  "/api/dbtablescomparator")
@CrossOrigin(origins = "http://localhost:3000")

public class DbTablesComparatorController
{


   private final DbTablesComparatorService dbTablesComparatorService;

    public DbTablesComparatorController(DbTablesComparatorService dbTablesComparatorService) {
        this.dbTablesComparatorService = dbTablesComparatorService;
    }

    @GetMapping("/tables")
    @ResponseBody
    public List<String> getTables() {
        return dbTablesComparatorService.getTables().stream().sorted().toList();
    }

    @GetMapping("/tables/details")
    @ResponseBody
    public Map<String,List<String>> getTablesColumns(@RequestParam("tableNames") String... tableNames) {
        return dbTablesComparatorService.getTablesColumns(tableNames);
    }

    @GetMapping("/savetemp")
    @ResponseBody
    public boolean createTempTable(@RequestParam(name = "tables") String... tables){
        return dbTablesComparatorService.createTempTable(tables);
    }

    @GetMapping("/{tableName}")
    @ResponseBody
    public List<CompareResult> compareTablesData(
            @PathVariable("tableName") String tableName,
            @RequestParam(name ="filter", required = false,defaultValue = "ALL") Optional<DataFilter> filter,
            @RequestParam(name = "columns") String... columns){
        return dbTablesComparatorService.compareTablesData(tableName,filter,columns);
    }


    @GetMapping("/doc/{tableName}")

    public void generateDoc(HttpServletResponse response,
                            @PathVariable("tableName") String tableName,
                            @RequestParam(name ="filetype", required = false ,defaultValue = "PDF" ) Optional<FileType> fileType,
                            @RequestParam(name ="filter", required = false,defaultValue = "ALL") Optional<DataFilter> filter,
                            @RequestParam(name = "columns",required = false) String... columns
                            ) throws IOException, CsvRequiredFieldEmptyException, CsvDataTypeMismatchException {

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());
        String headerValue;
        String headerKey = "Content-Disposition";
        if (fileType.isEmpty() || fileType.get() == FileType.PDF ) {
            response.setContentType("application/pdf");
            headerValue = "attachment; filename="+tableName+"_CompareResult_" + currentDateTime + ".pdf";
        }
        else {
            response.setContentType("text/csv");
            headerValue = "attachment; filename="+tableName+"_CompareResult_" + currentDateTime + ".csv";
        }

        response.setHeader(headerKey, headerValue);
        dbTablesComparatorService.generateDocumentCompareResult(response,tableName, fileType, filter, columns);

    }
}
