package com.sirbik.sirbikapp.service;

import com.sirbik.sirbikapp.data.repository.UserRepository;
import com.sirbik.sirbikapp.enums.Role;
import com.sirbik.sirbikapp.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class LoginService {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<String> login(String email, String password) {
        log.trace("Attempt to login with email: {}", email);
        if (StringUtils.isBlank(email) || StringUtils.isBlank(password)) {
            return Optional.empty();
        }
        return userRepository.findByEmailIgnoreCase(email.trim())
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> {
                    Role role = user.getRole() != null ? user.getRole() : Role.USER;
                    return jwtUtil.createToken(user.getId(), role);
                });
    }

}
