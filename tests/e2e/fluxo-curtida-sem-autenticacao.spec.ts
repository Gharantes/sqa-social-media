import { test, expect } from '@playwright/test';

const URL = 'http://localhost:3000/';

test.describe("Fluxo de Curtida sem Autenticação", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(URL);
    })

    test('Fazer Curtida', async ({ page }) => {
        await expect(page.getByRole("button", { name: "Criar Conta" })).toBeVisible();

        const primeirosBotoesCurtir = page.getByRole("button", { name: "Curtir" });
        await expect(primeirosBotoesCurtir.first()).toBeVisible();

        let dialogMessage = '';
        page.on('dialog', async (dialog) => {
            dialogMessage = dialog.message();
            await dialog.dismiss();
        });

        await primeirosBotoesCurtir.first().click();

        expect(dialogMessage).toBe("Você precisa estar autenticado para curtir posts!");
    });

});