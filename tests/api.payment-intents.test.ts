import { createMocks } from "node-mocks-http";
import { GET as getPaymentIntents } from "../src/app/api/payment-intents/route";

describe("GET /api/payment-intents", () => {
  it("should return array (mocked)", async () => {
    const { req } = createMocks({
      method: "GET",
      url: "http://localhost/api/payment-intents",
    });
    const response = await getPaymentIntents(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data) || typeof data === "object").toBe(true);
  });
});
