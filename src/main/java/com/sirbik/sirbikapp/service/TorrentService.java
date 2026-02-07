package com.sirbik.sirbikapp.service;

import com.sirbik.sirbikapp.config.QBittorrentProperties;
import com.sirbik.sirbikapp.data.dto.TorrentCategoryDTO;
import com.sirbik.sirbikapp.data.dto.TorrentSummaryDTO;
import com.sirbik.sirbikapp.data.repository.TorrentGroupRepository;
import com.sirbik.sirbikapp.enums.TorrentStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class TorrentService {

    private static final Duration SESSION_TTL = Duration.ofMinutes(10);

    private final QBittorrentProperties qbittorrentProperties;
    private final JsonMapper jsonMapper;

    private volatile String sessionCookie;
    private volatile Instant sessionValidUntil = Instant.EPOCH;

    private volatile RestClient restClient;

    private final TorrentGroupRepository torrentGroupRepository;

    private RestClient getRestClient() {
        if (restClient == null) {
            synchronized (this) {
                if (restClient == null) {
                    Assert.hasText(qbittorrentProperties.getBaseUrl(), "qBittorrent base URL must be configured");
                    restClient = RestClient.builder().baseUrl(qbittorrentProperties.getBaseUrl()).build();
                }
            }
        }
        return restClient;
    }

    public List<TorrentSummaryDTO> getTorrents(String category) {
        String payload = executeWithSession(cookie -> getRestClient().get()
                .uri("/api/v2/torrents/info?category={category}", category)
                .header(HttpHeaders.COOKIE, cookie)
                .retrieve()
                .body(String.class));

        JsonNode torrents = readJson(payload);
        List<TorrentSummaryDTO> summaries = new ArrayList<>();

        for (JsonNode torrentNode : torrents) {
            summaries.add(mapSummary(torrentNode));
        }

        summaries.sort(Comparator.comparing(TorrentSummaryDTO::name, String.CASE_INSENSITIVE_ORDER));
        return summaries;
    }

    public void addTorrent(MultipartFile torrentFile, String category) {
        Assert.notNull(torrentFile, "Torrent file must be provided");
        Assert.isTrue(!torrentFile.isEmpty(), "Torrent file must not be empty");
        Assert.isTrue(StringUtils.hasText(category), "Category must be provided");

        byte[] content;
        try {
            content = torrentFile.getBytes();
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to read torrent file", exception);
        }

        MultiValueMap<String, Object> form = new LinkedMultiValueMap<>();
        String originalFilename = Optional.ofNullable(torrentFile.getOriginalFilename()).orElse("upload.torrent");
        form.add("torrents", new NamedByteArrayResource(content, originalFilename));
        form.add("category", category.trim());

        executeWithSession(cookie -> {
            getRestClient().post()
                    .uri("/api/v2/torrents/add")
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .header(HttpHeaders.COOKIE, cookie)
                    .body(form)
                    .retrieve()
                    .toBodilessEntity();
            return null;
        });
    }

    public void deleteTorrent(String hash) {
        postForm("/api/v2/torrents/delete", Map.of("hashes", hash, "deleteFiles", "true"));
    }

    @Transactional
    public List<TorrentCategoryDTO> getCategories() {
        return torrentGroupRepository.findAll().stream()
                .map(tg -> new TorrentCategoryDTO(tg.getName(), tg.getSavepath()))
                .sorted(Comparator.comparing(TorrentCategoryDTO::name, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    private void postForm(String path, Map<String, String> values) {
        executeWithSession(cookie -> {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            values.forEach(form::add);

            getRestClient().post()
                    .uri(path)
                    .header(HttpHeaders.COOKIE, cookie)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .toBodilessEntity();
            return null;
        });
    }

    private <T> T executeWithSession(Function<String, T> callback) {
        String cookie = getOrCreateSessionCookie(false);
        try {
            return callback.apply(cookie);
        } catch (RestClientResponseException exception) {
            HttpStatus statusCode = HttpStatus.resolve(exception.getStatusCode().value());
            if (statusCode == HttpStatus.UNAUTHORIZED || statusCode == HttpStatus.FORBIDDEN) {
                String refreshedCookie = getOrCreateSessionCookie(true);
                return callback.apply(refreshedCookie);
            }
            throw exception;
        }
    }

    private String getOrCreateSessionCookie(boolean forceRefresh) {
        if (!forceRefresh && StringUtils.hasText(sessionCookie) && Instant.now().isBefore(sessionValidUntil)) {
            return sessionCookie;
        }

        synchronized (this) {
            if (!forceRefresh && StringUtils.hasText(sessionCookie) && Instant.now().isBefore(sessionValidUntil)) {
                return sessionCookie;
            }

            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("username", qbittorrentProperties.getUsername());
            form.add("password", qbittorrentProperties.getPassword());

            ResponseEntity<String> response = getRestClient().post()
                    .uri("/api/v2/auth/login")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .toEntity(String.class);

            String responseBody = Optional.ofNullable(response.getBody()).orElse("");
            Assert.isTrue(responseBody.startsWith("Ok"), "Failed to authenticate with qBittorrent");

            String setCookieHeader = response.getHeaders().getFirst(HttpHeaders.SET_COOKIE);
            Assert.hasText(setCookieHeader, "qBittorrent session cookie is missing");
            sessionCookie = setCookieHeader.split(";", 2)[0];
            sessionValidUntil = Instant.now().plus(SESSION_TTL);
            return sessionCookie;
        }
    }

    private JsonNode readJson(String payload) {
        try {
            return jsonMapper.readTree(Optional.ofNullable(payload).orElse(""));
        } catch (JacksonException exception) {
            throw new IllegalStateException("Failed to parse qBittorrent response", exception);
        }
    }

    private TorrentSummaryDTO mapSummary(JsonNode node) {
        String state = textOrNull(node, "state");
        double progress = node.path("progress").asDouble(0d);
        long downloadSpeed = node.path("dlspeed").asLong(0L);
        long uploadSpeed = node.path("upspeed").asLong(0L);

        return new TorrentSummaryDTO(
                textOrNull(node, "hash"),
                textOrNull(node, "name"),
                mapStatus(state, progress, downloadSpeed, uploadSpeed),
                state,
                progress,
                node.path("size").asLong(0L),
                node.path("downloaded").asLong(0L),
                node.path("uploaded").asLong(0L),
                downloadSpeed,
                uploadSpeed,
                node.path("num_leechs").asInt(0),
                node.path("num_seeds").asInt(0),
                sanitizeEta(node.path("eta").asLong(-1L)),
                textOrNull(node, "category"),
                splitTags(textOrNull(node, "tags")),
                node.path("ratio").asDouble(0d)
        );
    }

    private TorrentStatus mapStatus(String state, double progress, long downloadSpeed, long uploadSpeed) {
        String normalizedState = Optional.ofNullable(state).orElse("").toLowerCase();

        if (normalizedState.contains("pause")) {
            return TorrentStatus.PAUSED;
        }

        if (normalizedState.contains("upload") || normalizedState.contains("stalledup") || normalizedState.contains("queuedup") || normalizedState.contains("forcedup")) {
            return TorrentStatus.SEEDING;
        }

        if (progress >= 1.0d) {
            if (uploadSpeed > 0) {
                return TorrentStatus.SEEDING;
            }
            return TorrentStatus.COMPLETED;
        }

        if (normalizedState.contains("meta") || normalizedState.contains("down") || downloadSpeed > 0) {
            return TorrentStatus.DOWNLOADING;
        }

        return TorrentStatus.DOWNLOADING;
    }

    private List<String> splitTags(String tags) {
        if (!StringUtils.hasText(tags)) {
            return List.of();
        }

        return Arrays.stream(tags.split(","))
                .map(String::trim)
                .filter(StringUtils::hasText)
                .toList();
    }

    private String textOrNull(JsonNode node, String field) {
        String value = node.path(field).asString();
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return value;
    }

    private Long sanitizeEta(long eta) {
        if (eta < 0) {
            return null;
        }
        return eta;
    }

    private static final class NamedByteArrayResource extends ByteArrayResource {

        private final String filename;

        private NamedByteArrayResource(byte[] byteArray, String filename) {
            super(byteArray);
            this.filename = filename;
        }

        @Override
        public String getFilename() {
            return filename;
        }
    }
}
