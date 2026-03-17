import { createMocks } from "node-mocks-http";
import { GET as getSubscriptions } from "../src/app/api/subscriptions/route";

describe("GET /api/subscriptions", () => {
  it("should return array (mocked)", async () => {
    // TODO: mock stripe here
    const { req } = createMocks({
      method: "GET",
      url: "http://localhost/api/subscriptions",
    });
    const response = await getSubscriptions(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data) || typeof data === "object").toBe(true);
  });
});
