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
     * Compares two database columns using type checks and appropriate comparators.
     *
     * @param obj1 The first column object.
     * @param obj2 The second column object.
     * @return An integer indicating the comparison result:
     *         - 0 if the columns are equal.
     *         - A positive value if obj1 is greater than obj2.
     *         - A negative value if obj2 is greater than obj1.
     * @throws IllegalArgumentException if no suitable comparator is found for the
     *         columns' data types.
     */
    public static int compare(Object obj1, Object obj2) {
        Objects.requireNonNull(obj1, "Object 1 cannot be null");
        Objects.requireNonNull(obj2, "Object 2 cannot be null");

        // Check for null values
        if (obj1 == null || obj2 == null) {
            return handleNulls(obj1, obj2);
        }

        // Use built-in or registered comparators based on data types
        Class<?> type1 = obj1.getClass();
        Comparator<Object> comparator = defaultComparators.get(type1);
        if (comparator != null) {
            return comparator.compare(obj1, obj2);
        }
        else if (type1.isPrimitive()) {
            // Handle primitive types using specific comparisons
            // (e.g., int, char, etc.)
            // Throw an exception if the type is not supported
            throw new IllegalArgumentException("Unsupported data type: " + type1);
        } else {
            // Handle custom or unsupported data types
            throw new IllegalArgumentException("Unsupported data type: " + type1);
        }
    }

    private static int handleNulls(Object obj1, Object obj2) {
        // Customize null handling behavior as needed (e.g., nulls last, nulls equal)
        if (obj1 == obj2) {
            return 0; // Both null, consider them equal
        } else if (obj1 == null) {
            return -1; // Null is less than non-null
        } else {
            return 1; // Non-null is greater than null
        }
    }
}