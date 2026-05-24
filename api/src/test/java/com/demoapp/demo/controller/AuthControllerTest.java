package com.demoapp.demo.controller;

import com.demoapp.demo.service.PostService;
import com.demoapp.demo.service.UserService;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class AuthControllerTest {
    UserService userService = new UserService(null);
    AuthController authController = new AuthController(userService);

}
