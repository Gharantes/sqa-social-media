import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3000/';
const email = "Teste@gmail.com";
const password = "Teste123@";

test.describe("Fluxo de Cadastro e Login", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(URL);
    })

    test('Criar Conta', async ({ page }) => {
        await page.getByText("Criar Conta").click();

        await page.waitForTimeout(2000);

        await page.getByPlaceholder("seu@email.com").fill(email);

        await page.locator('input[type="password"]').nth(0).fill(password);
        
        await page.locator('input[type="password"]').nth(1).fill(password);

        await page.locator('button[type="submit"]', { hasText: 'Criar Conta' }).click();

        await page.waitForTimeout(1000);

        const errMessage = await page.locator('div', { hasText: 'E-mail já está em uso' }).first();

        if (await errMessage.isVisible()) {
            // await page.pause();

            await page.locator('button', { hasText: 'Entrar' }).first().click();
            // await page.waitForTimeout(1000);
            await page.waitForURL(URL + "signin");

            await page.getByPlaceholder("seu@email.com").fill(email);
            await page.locator('input[type="password"]').first().fill(password);
            // await page.pause();

            await page.locator('button[type="submit"]', { hasText: 'Entrar' }).first().click();
        } 

    
        // await page.pause();
        await expect(page).toHaveURL(URL);
        await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
        await expect(page.getByRole("button", { name: "Posts Curtidos" })).toBeVisible();
    });

});