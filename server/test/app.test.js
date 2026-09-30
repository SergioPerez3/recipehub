import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";

describe("GET /", () => {
  it("debería devolver un mensaje de bienvenida", async () => {
    const response = await request(app).get("/");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("message", "RecipeHub API 🍳");
  });
});
