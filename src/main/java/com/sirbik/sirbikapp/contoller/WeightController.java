package com.sirbik.sirbikapp.contoller;

import com.sirbik.sirbikapp.data.dto.PageDTO;
import com.sirbik.sirbikapp.data.dto.WeightRecordDTO;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/weight")
@SecurityRequirement(name = "bearerAuth")
public class WeightController {

    private static final List<Double> mockWeightList = new ArrayList<>();

    @PutMapping
    public void addWeight(@RequestBody AddWeightRequest weight) {
        mockWeightList.add(weight.weight());
    }

    @GetMapping
    public ResponseEntity<PageDTO<WeightRecordDTO>> getWeightHistory(@RequestParam int page, @RequestParam int size) {
        Assert.isTrue(page >= 0, "Page number must be positive");
        Assert.isTrue(size > 0, "Page size must be positive");

        int fromIndex = page * size;
        if (fromIndex >= mockWeightList.size()) {
            return ResponseEntity.ok(new PageDTO<>(List.of(), mockWeightList.size(), page, size));
        }

        List<WeightRecordDTO> result = new ArrayList<>();
        for (int i = fromIndex; i < Math.min(fromIndex + size, mockWeightList.size()); i++) {
            result.add(new WeightRecordDTO(LocalDate.now().minusDays(i - fromIndex + 1), mockWeightList.get(i)));
        }
        return ResponseEntity.ok(new PageDTO<>(result, mockWeightList.size(), page, size));
    }

    public record AddWeightRequest(Double weight) {}

}
