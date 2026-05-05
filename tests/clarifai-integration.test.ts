import { describe, it, expect } from "vitest";

describe("Clarifai API Integration", () => {
  it("should validate Clarifai API credentials", async () => {
    const apiKey = process.env.CLARIFAI_API_KEY;
    const userId = process.env.CLARIFAI_USER_ID;
    const appId = process.env.CLARIFAI_APP_ID;

    expect(apiKey).toBeDefined();
    expect(userId).toBeDefined();
    expect(appId).toBeDefined();

    // Test API connectivity
    try {
      const response = await fetch(
        `https://api.clarifai.com/v2/users/${userId}/apps/${appId}/models`,
        {
          method: "GET",
          headers: {
            Authorization: `Key ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty("models");
    } catch (error) {
      console.error("Clarifai API test failed:", error);
      throw new Error("Failed to connect to Clarifai API");
    }
  });

  it("should have valid API key format", () => {
    const apiKey = process.env.CLARIFAI_API_KEY;
    expect(apiKey).toBeTruthy();
    expect(apiKey).toMatch(/^[a-zA-Z0-9_-]+$/);
  });

  it("should have valid User ID format", () => {
    const userId = process.env.CLARIFAI_USER_ID;
    expect(userId).toBeTruthy();
    expect(userId).toMatch(/^[a-zA-Z0-9_-]+$/);
  });

  it("should have valid App ID format", () => {
    const appId = process.env.CLARIFAI_APP_ID;
    expect(appId).toBeTruthy();
    expect(appId).toMatch(/^[a-zA-Z0-9_-]+$/);
  });
});
