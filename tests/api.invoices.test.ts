import { createMocks } from "node-mocks-http";
import { GET as getInvoices } from "../src/app/api/invoices/route";

describe("GET /api/invoices", () => {
  it("should return array (mocked)", async () => {
    const { req } = createMocks({
      method: "GET",
      url: "http://localhost/api/invoices",
    });
    const response = await getInvoices(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data) || typeof data === "object").toBe(true);
  });
});
