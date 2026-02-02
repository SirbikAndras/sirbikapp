package com.sirbik.sirbikapp.contoller;

import com.sirbik.sirbikapp.data.dto.PageDTO;
import com.sirbik.sirbikapp.data.dto.WeightRecordDTO;
import com.sirbik.sirbikapp.service.WeightService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weight")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class WeightController {

    private final WeightService weightService;

    @PutMapping
    public void addWeight(@RequestBody AddWeightRequest weight) {
        weightService.addWeight(weight.weight());
    }

    @GetMapping
    public ResponseEntity<PageDTO<WeightRecordDTO>> getWeightHistory(@RequestParam int page, @RequestParam int size) {
        Assert.isTrue(page >= 0, "Page number must be positive");
        Assert.isTrue(size > 0, "Page size must be positive");
        return ResponseEntity.ok(weightService.getWeightHistory(page, size));
    }

    public record AddWeightRequest(Double weight) {}
}
