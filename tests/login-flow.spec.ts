import { test, expect } from "@playwright/test"

test("Login by pressing the profile link", async ({ page }) => {
    await page.goto("http://localhost:5173/")

    // From main page, login via the profile icon
    await page.getByRole("link", { name: "Profil" }).click()
    await expect(page).toHaveURL("http://localhost:5173/login")
    await page.getByRole("textbox", { name: "NTNU Brukernavn" }).fill("user")
    await page.getByRole("textbox", { name: "Passord" }).fill("user")
    await page.locator("[type=submit]").click()

    // Make sure login is finished and have been forwarded back
    await expect(page).toHaveURL("http://localhost:5173")

    // Make sure we're registered as logged in
    await page.getByRole("link", { name: "Profil" }).click()
    await expect(page).toHaveURL("http://localhost:5173/profil")
})
