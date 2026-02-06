package com.sirbik.sirbikapp.contoller;

import com.sirbik.sirbikapp.data.dto.HomeProgressPointDTO;
import com.sirbik.sirbikapp.data.dto.HomeStatsDTO;
import com.sirbik.sirbikapp.service.HomeService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/home")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping("/stats")
    public ResponseEntity<HomeStatsDTO> getStats() {
        return ResponseEntity.ok(homeService.getStats());
    }

    @GetMapping("/progress")
    public ResponseEntity<List<HomeProgressPointDTO>> getProgress(@RequestParam(defaultValue = "7") int days) {
        Assert.isTrue(days > 0 && days <= 30, "Days must be between 1 and 30");
        return ResponseEntity.ok(homeService.getProgress(days));
    }
}
