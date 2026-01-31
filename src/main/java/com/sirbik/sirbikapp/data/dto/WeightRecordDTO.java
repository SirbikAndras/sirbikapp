package com.sirbik.sirbikapp.data.dto;

import java.time.LocalDate;

public record WeightRecordDTO(LocalDate date,
                              double value) {
}
