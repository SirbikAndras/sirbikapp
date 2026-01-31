package com.sirbik.sirbikapp.contoller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/counter")
public class CounterController {

    private static final AtomicLong counter = new AtomicLong(0);

    @GetMapping
    public ResponseEntity<Long> getCounter() {
        return ResponseEntity.ok(counter.get());
    }

    @PutMapping
    public ResponseEntity<Long> incrementCounter() {
        return ResponseEntity.ok(counter.incrementAndGet());
    }

}
