package com.sirbik.sirbikapp.contoller;

import lombok.SneakyThrows;
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
        sleep();
        return ResponseEntity.ok(counter.get());
    }

    @PutMapping
    public ResponseEntity<Long> incrementCounter() {
        sleep();
        return ResponseEntity.ok(counter.incrementAndGet());
    }

    @SneakyThrows
    private void sleep() {
        Thread.sleep(2_000);
    }

}
