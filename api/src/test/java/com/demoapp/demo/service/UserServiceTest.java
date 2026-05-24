package com.demoapp.demo.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class UserServiceTest {

    @Autowired
    private UserService userService;

    @Test
    @DisplayName("Teste válido: senha forte válida retorna true")
    void isPasswordValid_senhaForte_retornaTrue() {
        assertTrue(userService.isPasswordValid("Senha@123"));
    }

    @Test
    @DisplayName("Teste válido: senha sem caractere especial retorna false")
    void isPasswordValid_semCaractereEspecial_retornaFalse() {
        assertFalse(userService.isPasswordValid("Senha1234"));
    }

    @Test
    @DisplayName("Teste válido: senha sem letra maiúscula retorna false")
    void isPasswordValid_semMaiuscula_retornaFalse() {
        assertFalse(userService.isPasswordValid("senha@123"));
    }

    @Test
    @DisplayName("Teste válido: senha com menos de 8 caracteres retorna false")
    void isPasswordValid_menorQueOito_retornaFalse() {
        assertFalse(userService.isPasswordValid("Se@1"));
    }

    @Test
    @DisplayName("Teste com bug: e-mail sem a primeira parte é aceito incorretamente → deve ser false")
    void isEmailValid_semParte1_deveRetornarFalse() {
        assertFalse(userService.isEmailValid("user@"));
    }
    @Test
    @DisplayName("Teste com bug: e-mail sem domínio é aceito incorretamente → deve ser false")
    void isEmailValid_semParte2_deveRetornarFalse() {
        assertFalse(userService.isEmailValid("@dominio.com"));
    }

}
