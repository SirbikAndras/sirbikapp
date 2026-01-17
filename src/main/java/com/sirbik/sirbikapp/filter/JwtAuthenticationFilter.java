package com.sirbik.sirbikapp.filter;

import com.sirbik.sirbikapp.enums.Role;
import com.sirbik.sirbikapp.jwt.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        if (StringUtils.isBlank(authorization) || !authorization.startsWith("Bearer ")) {
            log.trace("JWT not found");
        } else {
            String jwt = authorization.substring(7);
            try {
                JwtUtil.DecodedTokenData tokenData = jwtUtil.checkToken(jwt);
                SecurityContextHolder.getContext().setAuthentication(new JwtAuthenticationToken(jwt, tokenData.subject(), tokenData.role()));
            } catch (Exception _) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    public static class JwtAuthenticationToken extends AbstractAuthenticationToken {

        private final String jwt;
        private final Long principal;

        public JwtAuthenticationToken(@NonNull String jwt, @NonNull Long principal, @NonNull Role role) {
            super(Collections.singleton(new SimpleGrantedAuthority("ROLE_" + role.name())));
            this.jwt = jwt;
            this.principal = principal;
            setAuthenticated(true);
        }

        @Override
        public @Nullable Object getCredentials() {
            return this.jwt;
        }

        @Override
        public @Nullable Object getPrincipal() {
            return this.principal;
        }
    }

}
