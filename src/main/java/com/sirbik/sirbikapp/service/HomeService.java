package com.sirbik.sirbikapp.service;

import com.sirbik.sirbikapp.data.dto.HomeProgressPointDTO;
import com.sirbik.sirbikapp.data.dto.HomeStatsDTO;
import com.sirbik.sirbikapp.data.entity.User;
import com.sirbik.sirbikapp.data.entity.Weight;
import com.sirbik.sirbikapp.data.repository.UserRepository;
import com.sirbik.sirbikapp.data.repository.WeightRepository;
import com.sirbik.sirbikapp.filter.UserSecurityContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HomeService {

    private final UserRepository userRepository;
    private final WeightRepository weightRepository;

    @Value("${app.home.default-goal-weight:70.0}")
    private Double defaultGoalWeight;

    public HomeStatsDTO getStats() {
        Long userId = getCurrentUserId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Optional<Weight> latestWeight = weightRepository.findTopByUserOrderByDateDescCreatedAtDesc(userId);
        Integer streak = weightRepository.getCurrentStreak(userId);

        return new HomeStatsDTO(
                user.getName(),
                latestWeight.map(weight -> weight.getValue().doubleValue()).orElse(null),
                defaultGoalWeight,
                streak == null ? 0 : streak
        );
    }

    public List<HomeProgressPointDTO> getProgress(int days) {
        Long userId = getCurrentUserId();
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1L);

        List<Weight> weights = weightRepository.findByUserAndDateBetweenOrderByDateAscCreatedAtDesc(userId, startDate, today);
        Map<LocalDate, Double> latestWeightByDate = new LinkedHashMap<>();

        for (Weight weight : weights) {
            latestWeightByDate.putIfAbsent(weight.getDate(), weight.getValue().doubleValue());
        }

        List<HomeProgressPointDTO> progress = new ArrayList<>(days);
        for (int i = 0; i < days; i++) {
            LocalDate date = startDate.plusDays(i);
            progress.add(new HomeProgressPointDTO(date, latestWeightByDate.get(date)));
        }

        return progress;
    }

    private Long getCurrentUserId() {
        SecurityContext context = SecurityContextHolder.getContext();
        Assert.isInstanceOf(UserSecurityContext.class, context, "User security context is required");
        Long userId = ((UserSecurityContext) context).getUserId();
        Assert.notNull(userId, "User id must be provided");
        return userId;
    }
}
