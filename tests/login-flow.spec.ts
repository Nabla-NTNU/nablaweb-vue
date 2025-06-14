import { test, expect } from "@playwright/test"

test("Direct login from /profil", async ({ page }) => {
    await page.goto("http://localhost:5173/profil")
    await page.getByRole("textbox", { name: "NTNU Username" }).fill("user")
    await page.getByRole("textbox", { name: "Password" }).fill("user")
    await page.getByRole("button", { name: "Log in" }).click()
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible()
})
