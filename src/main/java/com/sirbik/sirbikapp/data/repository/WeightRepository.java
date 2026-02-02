package com.sirbik.sirbikapp.data.repository;

import com.sirbik.sirbikapp.data.entity.Weight;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WeightRepository extends JpaRepository<Weight, Long> {
    Page<Weight> findByUserOrderByDateDesc(Long user, Pageable pageable);
}
