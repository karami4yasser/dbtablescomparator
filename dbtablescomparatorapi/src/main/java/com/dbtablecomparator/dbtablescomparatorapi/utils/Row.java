package com.dbtablecomparator.dbtablescomparatorapi.utils;

import java.util.HashMap;
import java.util.Map;

public class Row {
    Map<String,Object> rowColumnsMap = new HashMap<>();

    public Row() {
    }
    public Row(Map<String, Object> rowColumnsMap) {
        this.rowColumnsMap = rowColumnsMap;
    }

    public void addColumn(String columnName,Object value) {
        rowColumnsMap.put(columnName,value);
    }

    public Map<String, Object> getRowColumnsMap() {
        return rowColumnsMap;
    }

    public void setRowColumnsMap(Map<String, Object> rowColumnsMap) {
        this.rowColumnsMap = rowColumnsMap;
    }
}
