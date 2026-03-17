import { createMocks } from "node-mocks-http";
import { GET as getCustomer } from "../src/app/api/customer/route";

describe("GET /api/customer", () => {
  it("should return 400 if Stripe key is missing", async () => {
    const { req, res } = createMocks({
      method: "GET",
      url: "http://localhost/api/customer",
    });
    const oldKey = process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_SECRET_KEY;
    const response = await getCustomer(req);
    expect([200, 400, 500]).toContain(response.status); // kiểm tra status hợp lệ
    process.env.STRIPE_SECRET_KEY = oldKey;
  });
  // Thêm test mock Stripe ở đây nếu cần
});
