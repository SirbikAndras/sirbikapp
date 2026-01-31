package com.sirbik.sirbikapp.data.dto;

import java.util.List;
import java.util.function.Function;

public record PageDTO<T>(
        List<T> content,
        long totalNumberOfElements,
        int pageSize,
        int currentPage
) {

    public <N> PageDTO<N> map(Function<T, N> mapper) {
        return new PageDTO<>(
                content.stream().map(mapper).toList(),
                totalNumberOfElements,
                pageSize,
                currentPage
        );
    }

}
