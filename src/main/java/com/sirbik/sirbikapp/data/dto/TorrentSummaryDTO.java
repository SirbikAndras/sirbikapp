package com.sirbik.sirbikapp.data.dto;

import com.sirbik.sirbikapp.enums.TorrentStatus;

import java.util.List;

public record TorrentSummaryDTO(
        String hash,
        String name,
        TorrentStatus status,
        String state,
        double progress,
        long size,
        long downloaded,
        long uploaded,
        long downloadSpeed,
        long uploadSpeed,
        int peers,
        int seeds,
        Long etaSeconds,
        String category,
        List<String> tags,
        double ratio
) {
}
