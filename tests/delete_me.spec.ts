// Temporary first test: logs in as admin, and checks i18n for a single button
// Test fails due to testing a nav-button only visible on desktop on mobile
import { test, expect } from "@playwright/test"

test("test", async ({ page }) => {
    await page.goto("http://localhost:5173/")
    await page.getByRole("link", { name: "profil" }).click()
    await page.getByRole("textbox", { name: "NTNU Username" }).click()
    await page.getByRole("textbox", { name: "NTNU Username" }).fill("admin")
    await page.getByRole("textbox", { name: "NTNU Username" }).press("Tab")
    await page.getByRole("textbox", { name: "Password" }).fill("admin")
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible()
    await page.getByRole("button", { name: "Log in" }).click()
    await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Om Nabla" })).toBeVisible()
    await page.getByRole("button", { name: "Switch language" }).click()
    await expect(page.getByRole("link", { name: "About Nabla" })).toBeVisible()
})
