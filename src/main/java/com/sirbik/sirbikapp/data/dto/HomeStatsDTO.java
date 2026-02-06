package com.sirbik.sirbikapp.data.dto;

public record HomeStatsDTO(
        String userName,
        Double currentWeight,
        Double goalWeight,
        int streak
) {
}
