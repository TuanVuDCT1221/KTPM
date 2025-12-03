package com.flogin.backend.entity;

public enum CategoryType {
    ULTRABOOK("Ultrabook"),
    GAMING("Gaming"),
    BUSINESS("Business"),
    STUDENT("Student");

    private final String displayName;

    CategoryType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static CategoryType fromDisplayName(String value) {
        for (CategoryType c : values()) {
            if (c.displayName.equalsIgnoreCase(value)) {
                return c;
            }
        }
        throw new IllegalArgumentException("Danh mục không hợp lệ");
    }
}