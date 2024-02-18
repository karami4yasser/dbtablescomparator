package com.dbtablecomparator.dbtablescomparatorapi.utils;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompareResult {

    private Row table;
    private Row temp_table;
    private Boolean areEquals;
}
