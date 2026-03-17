import { createMocks } from "node-mocks-http";
import { GET as getTimeline } from "../src/app/api/timeline/route";

describe("GET /api/timeline", () => {
  it("should return 400 if no params", async () => {
    const { req, res } = createMocks({
      method: "GET",
      url: "http://localhost/api/timeline",
    });
    const response = await getTimeline(req);
    expect(response.status).toBe(400);
  });
  // Thêm test mock Stripe ở đây nếu cần
});
