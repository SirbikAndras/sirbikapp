package com.sirbik.sirbikapp.contoller;

import com.sirbik.sirbikapp.data.dto.TorrentCategoryDTO;
import com.sirbik.sirbikapp.data.dto.TorrentSummaryDTO;
import com.sirbik.sirbikapp.service.TorrentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/torrents")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class TorrentController {

    private final TorrentService torrentService;

    @GetMapping
    public ResponseEntity<List<TorrentSummaryDTO>> getTorrents(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(torrentService.getTorrents(category));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Void> addTorrent(@RequestParam("file") MultipartFile file,
                                           @RequestParam(required = false) String category) {
        torrentService.addTorrent(file, category);
        return ResponseEntity.accepted().build();
    }

    @DeleteMapping("/{hash}")
    public ResponseEntity<Void> deleteTorrent(@PathVariable String hash) {
        Assert.hasText(hash, "Torrent hash must be provided");
        torrentService.deleteTorrent(hash);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<TorrentCategoryDTO>> getCategories() {
        return ResponseEntity.ok(torrentService.getCategories());
    }
}
