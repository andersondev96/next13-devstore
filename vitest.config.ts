import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: ["tests/**/*.test.ts", "tests/**/*.spec.ts"],
          name: "unit",
          environment: "node",
        },
      },
      {
        test: {
          include: [
            "tests/browser/**/*.{test,spec}.ts",
            "tests/**/*.browser.{test,spec}.ts",
          ],
          name: "browser",
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
