package com.sirbik.sirbikapp.data.repository;

import com.sirbik.sirbikapp.data.entity.Weight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface WeightRepository extends JpaRepository<Weight, Long> {
    Page<Weight> findByUserOrderByDateDesc(Long user, Pageable pageable);

    Optional<Weight> findTopByUserOrderByDateDescCreatedAtDesc(Long user);

    List<Weight> findByUserAndDateBetweenOrderByDateAscCreatedAtDesc(Long user, LocalDate startDate, LocalDate endDate);

    @Query(value = """
            WITH RECURSIVE streak(day, cnt) AS (
                SELECT CURRENT_DATE, 0
                UNION ALL
                SELECT (day - INTERVAL '1 day')::date, cnt + 1
                FROM streak
                WHERE EXISTS (
                    SELECT 1
                    FROM weights w
                    WHERE w."userId" = :user
                      AND w.date = streak.day
                )
            )
            SELECT MAX(cnt) FROM streak
            """, nativeQuery = true)
    Integer getCurrentStreak(@Param("user") Long user);
}
