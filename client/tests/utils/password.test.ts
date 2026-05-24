import { isPasswordValid, getPasswordValidationMessage } from "@/utils/password";

describe("Utils - Password", () => {
    describe("isPasswordValid", () => {

        test("Teste válido: Irá aceitar senha.", () => {
            expect(isPasswordValid("Password123@")).toBe(true);
        });

        test("Teste com bug: Não considera '!' como caractére especial", () => {
            // No regex "hasSpecialChar" não tem !
            expect(isPasswordValid("Password123!")).toBe(true);
        });

        test("Teste com bug: Os requerimentos pedem no mínimo 8 caractéres, mas o código usa <= 8", () => {
            const password = "Abc1234!"
            // Senha tem exatamente 8 caractéres, e atende todos os outros requisitos, mas como o código usa <=.
            // então precisa de no mínimo 9 caractéres em vez de 8.
            expect(isPasswordValid(password)).toBe(true);
        });

        test("Teste válido: irá tetornar true para senha sem caractére especial", () => {
            const password = "Abc1234AAA"
            expect(isPasswordValid(password)).toBe(false);
        });
    });

    describe("getPasswordValidationMessage", () => {

        test("Teste válido: erro quando senha não possui letra maiúscula", () => {
            const message = getPasswordValidationMessage("senha@123");
            expect(message).toContain("uma letra maiúscula");
        });

        test("Teste válido: sem erro quando usa senha válida com mais de 8 caracteres", () => {
            const message = getPasswordValidationMessage("Senh@1234");
            expect(message).toBe("");
        });

        test("Teste válido: deve retornar mensagem de erro para senha vazia", () => {
            const message = getPasswordValidationMessage("");
            expect(message).toBe("Senha é obrigatória");
        });
    });
});