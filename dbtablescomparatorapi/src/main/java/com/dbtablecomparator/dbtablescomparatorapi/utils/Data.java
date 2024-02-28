package com.dbtablecomparator.dbtablescomparatorapi.utils;

import java.util.ArrayList;
import java.util.List;


public class Data {
    List<Row> rows = new ArrayList<>();

    public Data() {
    }

    public Data(List<Row> rows) {
        this.rows = rows;
    }

    public void addRow(Row row) {
        this.rows.add(row);
    }

    public List<Row> getRows() {
        return rows;
    }

    public void setRows(List<Row> rows) {
        this.rows = rows;
    }
}