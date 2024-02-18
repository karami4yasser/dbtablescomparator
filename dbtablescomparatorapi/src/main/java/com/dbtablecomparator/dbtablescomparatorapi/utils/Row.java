package com.dbtablecomparator.dbtablescomparatorapi.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Row {
    Map<String,Object> rowColumnsMap = new HashMap<>();

    public void addColumn(String columnName,Object value) {
        rowColumnsMap.put(columnName,value);
    }
}
