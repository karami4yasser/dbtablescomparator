package com.dbtablecomparator.dbtablescomparatorapi.utils;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.*;

public class DatabaseColumnComparator {

    private static final Map<Class<?>, Comparator<Object>> defaultComparators = new HashMap<>();

    static {
        // Pre-register built-in comparators for common data types
        defaultComparators.put(String.class, (o1, o2) -> ((String) o1).compareTo((String) o2));
        defaultComparators.put(Integer.class, (o1, o2) -> ((Integer) o1).compareTo((Integer) o2));
        defaultComparators.put(Double.class, (o1, o2) -> ((Double) o1).compareTo((Double) o2));
        defaultComparators.put(BigDecimal.class, (o1, o2) -> ((BigDecimal) o1).compareTo((BigDecimal) o2));
        defaultComparators.put(Boolean.class, (o1, o2) -> ((Boolean) o1).compareTo((Boolean) o2));
        defaultComparators.put(Float.class, (o1, o2) -> ((Float) o1).compareTo((Float) o2));
        defaultComparators.put(Byte.class, (o1, o2) -> ((Byte) o1).compareTo((Byte) o2));
        defaultComparators.put(Long.class, (o1, o2) -> ((Long) o1).compareTo((Long) o2));
        defaultComparators.put(Date.class, (o1, o2) -> ((Date) o1).compareTo((Date) o2));
        defaultComparators.put(Timestamp.class, (o1, o2) -> ((Timestamp) o1).compareTo((Timestamp) o2));
        // ... add more as needed, including primitive types if applicable
    }

    /**
     *
     * @param obj1
     * @param obj2
     * @return comparison results, if returns 0 then equals , else are not equals
     */
    public static int compare(Object obj1, Object obj2) {

        if (obj1 == null && obj2 == null) {
            return 0;
        }
        if (obj1 == null || obj2 == null) {
            return 1;
        }
        // Use built-in or registered comparators based on data types
        Class<?> type1 = obj1.getClass();
        Comparator<Object> comparator = defaultComparators.get(type1);
        if (comparator != null) {
            return comparator.compare(obj1, obj2);
        }
         else {
            return -1;
        }
    }
}