package com.sirbik.sirbikapp;

import com.sirbik.sirbikapp.data.dto.ErrorMessageDTO;
import com.sirbik.sirbikapp.exception.IncorrectCredentialsException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(IncorrectCredentialsException.class)
    public ResponseEntity<ErrorMessageDTO> handleIncorrectCredentialsException(IncorrectCredentialsException exception) {
        return ResponseEntity.badRequest().body(new ErrorMessageDTO("Incorrect credentials"));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorMessageDTO> handleIllegalArgumentException(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(new ErrorMessageDTO(exception.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessageDTO> handleUnknownExceptions(Exception exception) {
        log.error(exception.getMessage(), exception);
        return ResponseEntity.internalServerError().body(new ErrorMessageDTO("Internal server error"));
    }

}
