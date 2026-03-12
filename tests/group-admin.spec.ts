import { test, expect } from "@playwright/test"

test.describe.configure({ mode: "serial" })

// This test risks failing when multiple runners mess with the database simultaneously
test("Groups are editable by an admin", async ({ page }) => {
    // Log in as admin
    await page.goto("http://localhost:5173")
    await page.getByRole("link", { name: "Profil" }).click()
    await expect(page).toHaveURL("http://localhost:5173/login")
    await page.getByRole("textbox", { name: "NTNU Brukernavn" }).fill("admin")
    await page.getByRole("textbox", { name: "Passord" }).fill("admin")
    await page.locator("[type=submit]").click()
    await expect(page).toHaveURL("http://localhost:5173")

    // Enter admin panel of a totally random group anyone could've chosen
    await page.goto("http://localhost:5173/undergrupper/webkom")
    await expect(
        page.getByRole("link", { name: "Hemmelige Saker (Adminpanel)" }),
    ).toBeVisible()
    await page.getByRole("link", { name: "(Adminpanel)" }).click()

    // Set about text to something recognizable
    await expect(
        page.getByRole("button", { name: "Lagre ny tekst" }),
    ).toBeVisible()
    await page.getByLabel("Edit text").fill("Waaaa")

    // Need to give the DB time to adapt. Unsure of a smarter way
    await new Promise((r) => setTimeout(r, 500))
    if (
        !(await page
            .getByRole("button", { name: "Lagre ny tekst" })
            .isDisabled())
    ) {
        await page.getByRole("button", { name: "Lagre ny tekst" }).click()
        await expect(page.getByText("Waaaa", { exact: true })).toBeVisible()
    }
    // Check if saved about text is actually saved
    await page.goto("http://localhost:5173/undergrupper/webkom")
    await expect(page.getByRole("link", { name: "Adminpanel" })).toBeVisible()
    await expect(page.getByText("Waaaa", { exact: true })).toBeVisible()
})
