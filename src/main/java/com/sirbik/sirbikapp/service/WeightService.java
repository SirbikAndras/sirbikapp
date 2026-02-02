package com.sirbik.sirbikapp.service;

import com.sirbik.sirbikapp.data.dto.PageDTO;
import com.sirbik.sirbikapp.data.dto.WeightRecordDTO;
import com.sirbik.sirbikapp.data.entity.Weight;
import com.sirbik.sirbikapp.data.repository.WeightRepository;
import com.sirbik.sirbikapp.filter.UserSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeightService {

    private final WeightRepository weightRepository;

    public void addWeight(Double value) {
        Assert.notNull(value, "Weight value must be provided");
        Long userId = getCurrentUserId();

        OffsetDateTime now = OffsetDateTime.now();
        Weight weight = new Weight();
        weight.setUser(userId);
        weight.setDate(LocalDate.now());
        weight.setValue(BigDecimal.valueOf(value));
        weight.setCreatedAt(now);
        weight.setUpdatedAt(now);

        weightRepository.save(weight);
    }

    public PageDTO<WeightRecordDTO> getWeightHistory(int page, int size) {
        Long userId = getCurrentUserId();

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "date"));
        Page<Weight> weightPage = weightRepository.findByUserOrderByDateDesc(userId, pageRequest);

        List<WeightRecordDTO> records = weightPage.getContent().stream()
                .map(weight -> new WeightRecordDTO(weight.getDate(), weight.getValue().doubleValue()))
                .toList();

        return new PageDTO<>(records, weightPage.getTotalElements(), weightPage.getSize(), weightPage.getNumber());
    }

    private Long getCurrentUserId() {
        SecurityContext context = SecurityContextHolder.getContext();
        Assert.isInstanceOf(UserSecurityContext.class, context, "User security context is required");
        Long userId = ((UserSecurityContext) context).getUserId();
        Assert.notNull(userId, "User id must be provided");
        return userId;
    }
}
