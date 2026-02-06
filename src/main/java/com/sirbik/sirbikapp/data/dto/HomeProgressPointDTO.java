package com.sirbik.sirbikapp.data.dto;

import java.time.LocalDate;

public record HomeProgressPointDTO(
        LocalDate date,
        Double weight
) {
}
