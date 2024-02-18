package com.dbtablecomparator.dbtablescomparatorapi.utils;

import java.util.ArrayList;
import java.util.List;

@lombok.Data
public class Data {
    List<Row> rows = new ArrayList<>();
    public void addRow(Row row) {
        this.rows.add(row);
    }
}