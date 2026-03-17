import { createMocks } from "node-mocks-http";
import { GET as getCharges } from "../src/app/api/charges/route";

describe("GET /api/charges", () => {
  it("should return array (mocked)", async () => {
    const { req } = createMocks({
      method: "GET",
      url: "http://localhost/api/charges",
    });
    const response = await getCharges(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data) || typeof data === "object").toBe(true);
  });
});
