package com.sirbik.sirbikapp.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping(value = {
            "/{path:^(?!assets|static|public|swagger-ui|index\\.html).*$}/**",
            "/{path:^(?!assets|static|public|swagger-ui|index\\.html).*$}"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
