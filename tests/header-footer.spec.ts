import { test, expect } from "@playwright/test"

test("Footer contains all info", async ({ page }) => {
    await page.goto("http://localhost:5173/")
    await expect(page.getByRole("contentinfo")).toMatchAriaSnapshot(`
        - heading "Adresse" [level=4]
        - paragraph: /Linjeforeningen Nabla Kjemiblokk 2, Realfagsbygget Sem Sælands vei \\d+, NTNU \\d+ Trondheim, Norway/
        `)
    await expect(
        page.getByText("Følg oss!FacebookTwitterInstagramLinkedIn"),
    ).toBeVisible()
    await page.getByRole("heading", { name: "Sponset av" }).click()
})

test("Committees exist", async ({ page }) => {
    await page.goto("http://localhost:5173/undergrupper")
    await expect(page.getByRole("link", { name: "WebKom" })).toBeVisible()
    await expect(page.getByRole("link", { name: "ProKom" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Redaksjonen" })).toBeVisible()
})
