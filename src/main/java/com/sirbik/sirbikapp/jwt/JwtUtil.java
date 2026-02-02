package com.sirbik.sirbikapp.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.sirbik.sirbikapp.enums.Role;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class JwtUtil {

    private static final String JWT_SECRET_ENV = "JWT_SECRET";
    private final Algorithm algorithm;

    public JwtUtil() {
//        log.trace("Attempt to read jwtSecret from env({})", JWT_SECRET_ENV);
//        String jwtSecret = System.getenv(JWT_SECRET_ENV);
        String jwtSecret = "dsjfsjdhfsdhfhsadkfhksdlfas";

        if (StringUtils.length(jwtSecret) < 10) {
            log.error("JWT_SECRET is too short");
            System.exit(1);
        }

        this.algorithm = Algorithm.HMAC512(jwtSecret);
    }

    public @NonNull String createToken(@NonNull Long subject, @NonNull Role role) {
        return JWT.create()
                .withIssuer("sirbik")
                .withSubject(subject.toString())
                .withClaim("role", role.name())
                .sign(algorithm);
    }

    public DecodedTokenData checkToken(@NonNull String token) {
        DecodedJWT decodedJWT = JWT.require(algorithm).withIssuer("sirbik").build().verify(token);
        return new DecodedTokenData(Long.parseLong(decodedJWT.getSubject()), Role.valueOf(decodedJWT.getClaim("role").asString()));
    }

    public record DecodedTokenData(Long subject, Role role) {
    }

}
