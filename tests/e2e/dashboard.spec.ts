import { expect, test } from "@playwright/test";

test.describe("UPYOG dashboard", () => {
  test("renders exact KPI values and updates them when tenant changes", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: "Property tax command centre for UPYOG cities.",
      }),
    ).toBeVisible();
    await expect(page.getByText("1,000 records")).toBeVisible();
    await expect(page.getByText("Total Properties Registered")).toBeVisible();
    await expect(page.getByText("Total Collection", { exact: true })).toBeVisible();
    await expect(page.getByText("Total collection by tenant")).toBeVisible();

    await expect(
      page
        .locator("article")
        .filter({ hasText: "Total Properties Registered" })
        .getByText("1,000"),
    ).toBeVisible();
    await expect(
      page.locator("article").filter({ hasText: "Total Properties Approved" }).getByText("610"),
    ).toBeVisible();
    await expect(
      page.locator("article").filter({ hasText: "Total Properties Rejected" }).getByText("185"),
    ).toBeVisible();
    await expect(
      page.locator("article").filter({ hasText: "Total Collection" }).getByText("Rs. 21.80 L"),
    ).toBeVisible();

    const tenantSelect = page.getByLabel("Select Tenant");
    await expect(tenantSelect.locator("option")).toHaveCount(11);

    await tenantSelect.selectOption("Mumbai");

    await expect(tenantSelect).toHaveValue("Mumbai");
    await expect(
      page
        .locator("article")
        .filter({ hasText: "Total Properties Registered" })
        .getByText("106"),
    ).toBeVisible();
    await expect(
      page.locator("article").filter({ hasText: "Total Properties Approved" }).getByText("67"),
    ).toBeVisible();
    await expect(
      page.locator("article").filter({ hasText: "Total Properties Rejected" }).getByText("14"),
    ).toBeVisible();
    await expect(
      page.locator("article").filter({ hasText: "Total Collection" }).getByText("Rs. 3.59 L"),
    ).toBeVisible();
  });

  test("shows all ten cities in the comparison chart", async ({ page }) => {
    await page.goto("/");

    for (const city of [
      "Delhi",
      "Mumbai",
      "Pune",
      "Bengaluru",
      "Chennai",
      "Hyderabad",
      "Ahmedabad",
      "Kolkata",
      "Jaipur",
      "Lucknow",
    ]) {
      await expect(
        page.locator(".recharts-cartesian-axis-tick text").filter({ hasText: city }).first(),
      ).toBeVisible();
    }
  });

  test("answers a deterministic chat sample question without requiring Gemini", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "Mumbai rejections" }).click();

    await expect(page.getByText("Mumbai has")).toBeVisible();
    await expect(page.getByText(/rejected properties\./)).toBeVisible();
  });

  test("keeps long chat conversations inside the scrollable chat panel", async ({
    page,
  }) => {
    await page.goto("/");

    const before = await page.evaluate(() => {
      const chat = document.querySelector("aside");
      const messages = chat?.children[2] as HTMLElement | undefined;

      return {
        pageHeight: document.body.scrollHeight,
        chatHeight: chat?.getBoundingClientRect().height,
        messagesClientHeight: messages?.clientHeight,
      };
    });

    for (let i = 0; i < 8; i += 1) {
      await page.getByRole("button", { name: "Pune vs Jaipur" }).click();
    }

    const after = await page.evaluate(() => {
      const chat = document.querySelector("aside");
      const messages = chat?.children[2] as HTMLElement | undefined;

      return {
        pageHeight: document.body.scrollHeight,
        chatHeight: chat?.getBoundingClientRect().height,
        messagesClientHeight: messages?.clientHeight,
        messagesScrollHeight: messages?.scrollHeight,
      };
    });

    expect(after.pageHeight).toBe(before.pageHeight);
    expect(after.chatHeight).toBe(before.chatHeight);
    expect(after.messagesClientHeight).toBe(before.messagesClientHeight);
    expect(after.messagesScrollHeight).toBeGreaterThan(after.messagesClientHeight ?? 0);
  });
});
