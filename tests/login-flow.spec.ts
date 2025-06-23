import { test, expect } from "@playwright/test"

test("Direct login from /profil", async ({ page }) => {
    await page.goto("http://localhost:5173/profil")
    await page.getByRole("textbox", { name: "NTNU Brukernavn" }).fill("user")
    await page.getByRole("textbox", { name: "Passord" }).fill("user")
    await page.locator("[type=submit]").click()
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible()
})
