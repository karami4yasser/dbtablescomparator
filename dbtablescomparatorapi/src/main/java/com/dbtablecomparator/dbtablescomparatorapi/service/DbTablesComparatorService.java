package com.dbtablecomparator.dbtablescomparatorapi.service;

import com.dbtablecomparator.dbtablescomparatorapi.utils.CompareResult;
import com.dbtablecomparator.dbtablescomparatorapi.utils.DataFilter;
import com.dbtablecomparator.dbtablescomparatorapi.utils.FileType;
import com.lowagie.text.Font;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.opencsv.CSVWriter;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.awt.*;
import java.io.IOException;
import java.util.List;
import java.util.*;

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

    public List<CompareResult> compareTablesData(String tableName,Optional<DataFilter> filter, String... columns){
        return dbUtils.compareTablesData(tableName,filter,columns);
    }

    public void generateDocumentCompareResult(HttpServletResponse response, String tableName, Optional<FileType> fileType,Optional<DataFilter> filter, String... columns) throws IOException, DocumentException, CsvRequiredFieldEmptyException, CsvDataTypeMismatchException {

        if (fileType.isEmpty() || fileType.get() == FileType.PDF ) {
            generatePdfDocumentCompareResult(response,tableName,filter,columns);
        }
        else {
            generateCsvFileCompareResult(response,tableName,filter,columns);
        }

    }


    public void generatePdfDocumentCompareResult(HttpServletResponse response, String tableName,Optional<DataFilter> filter, String... columns) throws IOException, DocumentException {

        List<CompareResult> compareResults = compareTablesData(tableName,filter,columns);

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();


        List<String> columnNames = getTableColumns(tableName);
        int numColumn = 2* columnNames.size()  +2;



        Font font = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        font.setSize(18);
        font.setColor(Color.BLACK);

        Paragraph p = new Paragraph(String.format("Comparing %s",tableName), font);
        p.setAlignment(Paragraph.ALIGN_CENTER);

        document.add(p);

        PdfPTable table = new PdfPTable(numColumn);
        table.setWidthPercentage(100f);

        table.setSpacingBefore(10);

        writeTableHeader(table,columnNames);
        for(CompareResult compareResult:compareResults)
        {
            writeTableData(table,compareResult,columnNames);
        }

        document.add(table);
        document.close();

    }
    private void writeTableHeader(PdfPTable table,List<String> columnNames) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.WHITE);
        cell.setPadding(5);

        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.BLACK);
        font.setSize(8);

        cell.setPhrase(new Phrase("Current Data", font));
        table.addCell(cell);

        for(String columnName:columnNames)
        {
            cell.setPhrase(new Phrase(columnName, font));
            table.addCell(cell);
        }

        cell.setPhrase(new Phrase("Old Data", font));
        table.addCell(cell);

        for(String columnName:columnNames)
        {
            cell.setPhrase(new Phrase(columnName, font));
            table.addCell(cell);
        }
    }

    private void writeTableData(PdfPTable table,CompareResult compareResult,List<String> columnNames) {
        Color color = Color.PINK;
        Font font = FontFactory.getFont(FontFactory.HELVETICA);
        font.setColor(Color.black);
        font.setSize(8);
        PdfPCell cell = new PdfPCell();
        cell.setPhrase(new Phrase("",font));
        table.addCell(cell);


        Set<String> diffColmns = compareResult.getDiffColumns();

        for(String columnName:columnNames) {
            PdfPCell cell1 = new PdfPCell();
            if(diffColmns.contains(columnName))
            {
                cell1.setBackgroundColor(color);
            }

            cell1.setPhrase(new Phrase(String.valueOf(compareResult.getTable().getRowColumnsMap().get(columnName)),font));
            table.addCell(cell1);
        }

        PdfPCell cell2 = new PdfPCell();
        cell2.setPhrase(new Phrase("",font));
        table.addCell(cell2);

        for(String columnName:columnNames) {
            PdfPCell cell1 = new PdfPCell();
            if(diffColmns.contains(columnName))
            {
                cell1.setBackgroundColor(color);
            }
            cell1.setPhrase(new Phrase(String.valueOf(compareResult.getTemp_table().getRowColumnsMap().get(columnName)),font));
            table.addCell(cell1);
        }

    }



    public void generateCsvFileCompareResult(HttpServletResponse response, String tableName, Optional<DataFilter> filter, String... columns) throws IOException {

        List<CompareResult> compareResults = compareTablesData(tableName, filter, columns);

        try (CSVWriter csvWriter = new CSVWriter(response.getWriter())) {

            // Write CSV header
            List<String> columnNames = getTableColumns(tableName);
            String[] header = createCsvHeader(columnNames);
            csvWriter.writeNext(header);

            // Write CSV data
            for (CompareResult compareResult : compareResults) {
                String[] rowData = createCsvRow(compareResult, columnNames);
                csvWriter.writeNext(rowData);
            }
        }
    }

    private String[] createCsvHeader(List<String> columnNames) {
        List<String> headerList = new ArrayList<>();
        headerList.add("Current Data");

        for (String columnName : columnNames) {
            headerList.add(columnName);
        }

        headerList.add("Old Data");

        for (String columnName : columnNames) {
            headerList.add(columnName);
        }

        return headerList.toArray(new String[0]);
    }

    private String[] createCsvRow(CompareResult compareResult, List<String> columnNames) {
        List<String> rowList = new ArrayList<>();
        rowList.add("");

        Set<String> diffColumns = compareResult.getDiffColumns();

        for (String columnName : columnNames) {
            if (diffColumns.contains(columnName)) {
                rowList.add("");  // You may want to handle the special case when the column is different
            } else {
                rowList.add(String.valueOf(compareResult.getTable().getRowColumnsMap().get(columnName)));
            }
        }

        rowList.add("");

        for (String columnName : columnNames) {
            if (diffColumns.contains(columnName)) {
                rowList.add("");  // You may want to handle the special case when the column is different
            } else {
                rowList.add(String.valueOf(compareResult.getTemp_table().getRowColumnsMap().get(columnName)));
            }
        }

        return rowList.toArray(new String[0]);
    }

}
