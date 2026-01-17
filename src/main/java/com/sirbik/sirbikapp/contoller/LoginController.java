package com.sirbik.sirbikapp.contoller;

import com.sirbik.sirbikapp.data.dto.LoginRequestDTO;
import com.sirbik.sirbikapp.data.dto.LoginResponseDTO;
import com.sirbik.sirbikapp.exception.IncorrectCredentialsException;
import com.sirbik.sirbikapp.service.LoginService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/login")
public class LoginController {

    private final LoginService loginService;

    @PostMapping
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return loginService.login(request.email(), request.password())
                .map(token -> ResponseEntity.ok(new LoginResponseDTO(token)))
                .orElseThrow(IncorrectCredentialsException::new);
    }

}
