package com.arch.server.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/pingdb")
    public String ping() {
        return "DB connected";
    }
}
