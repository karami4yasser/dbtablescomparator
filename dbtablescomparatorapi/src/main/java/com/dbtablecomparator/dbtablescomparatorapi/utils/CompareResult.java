package com.dbtablecomparator.dbtablescomparatorapi.utils;

import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class CompareResult {



    private Row table;
    private Row temp_table;
    private Boolean areEquals;
    private Set<String> diffColumns;

}
