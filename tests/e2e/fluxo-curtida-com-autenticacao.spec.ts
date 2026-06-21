import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3000/';
const email = "Teste@gmail.com";
const password = "Teste123@";

test.describe("Fluxo de Cadastro e Login", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(URL);
        await page.locator('button', { hasText: 'Entrar' }).first().click();
        await page.waitForURL(URL + "signin");
        await page.getByPlaceholder("seu@email.com").fill(email);
        await page.locator('input[type="password"]').first().fill(password);
        await page.locator('button[type="submit"]', { hasText: 'Entrar' }).first().click();
        await expect(page).toHaveURL(URL);
    })

    test('Fazer Curtida', async ({ page }) => {
        await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Posts Curtidos" })).toBeVisible();

        const primeirosBotoesCurtir = page.getByRole("button", { name: "Curtir" });
        await primeirosBotoesCurtir.first().click();

        await expect(page.getByRole("button", { name: "Curtido" }).first()).toBeVisible();
    });

});