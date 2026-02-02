package com.sirbik.sirbikapp.filter;

import lombok.Getter;
import org.jspecify.annotations.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;

import java.io.Serial;
import java.io.Serializable;

public final class UserSecurityContext implements SecurityContext, Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    private Authentication authentication;

    @Getter
    private final Long userId;

    public UserSecurityContext(@Nullable Authentication authentication, Long userId) {
        this.authentication = authentication;
        this.userId = userId;
    }

    @Override
    public @Nullable Authentication getAuthentication() {
        return authentication;
    }

    @Override
    public void setAuthentication(@Nullable Authentication authentication) {
        this.authentication = authentication;
    }
}
