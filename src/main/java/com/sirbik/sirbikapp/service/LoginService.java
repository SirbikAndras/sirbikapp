package com.sirbik.sirbikapp.service;

import com.sirbik.sirbikapp.enums.Role;
import com.sirbik.sirbikapp.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginService {

    private final JwtUtil jwtUtil;

    public Optional<String> login(String email, String password) {
        log.trace("Attempt to login with email: {} and password: {}", email, password);
        if (StringUtils.isBlank(email)) {
            return Optional.empty();
        }
        return Optional.of(jwtUtil.createToken(1L, Role.ADMIN));
    }

}
