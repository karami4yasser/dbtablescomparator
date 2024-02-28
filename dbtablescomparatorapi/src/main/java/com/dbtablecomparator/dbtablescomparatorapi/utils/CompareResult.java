package com.dbtablecomparator.dbtablescomparatorapi.utils;

import java.util.Set;

public class CompareResult {



    private Row table;
    private Row temp_table;
    private Boolean areEquals;
    private Set<String> diffColumns;

    public CompareResult(Row table, Row temp_table, Boolean areEquals, Set<String> diffColumns) {
        this.table = table;
        this.temp_table = temp_table;
        this.areEquals = areEquals;
        this.diffColumns = diffColumns;
    }
    public CompareResult(Row table, Row temp_table, Boolean areEquals) {
        this.table = table;
        this.temp_table = temp_table;
        this.areEquals = areEquals;
        this.diffColumns = diffColumns;
    }

    public CompareResult() {
    }

    public Row getTable() {
        return table;
    }

    public void setTable(Row table) {
        this.table = table;
    }

    public Row getTemp_table() {
        return temp_table;
    }

    public void setTemp_table(Row temp_table) {
        this.temp_table = temp_table;
    }

    public Boolean getAreEquals() {
        return areEquals;
    }

    public void setAreEquals(Boolean areEquals) {
        this.areEquals = areEquals;
    }

    public Set<String> getDiffColumns() {
        return diffColumns;
    }

    public void setDiffColumns(Set<String> diffColumns) {
        this.diffColumns = diffColumns;
    }
}
