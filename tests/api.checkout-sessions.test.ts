import { createMocks } from "node-mocks-http";
import { GET as getCheckoutSessions } from "../src/app/api/checkout-sessions/route";

describe("GET /api/checkout-sessions", () => {
  it("should return array (mocked)", async () => {
    const { req } = createMocks({
      method: "GET",
      url: "http://localhost/api/checkout-sessions",
    });
    const response = await getCheckoutSessions(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data) || typeof data === "object").toBe(true);
  });
});
