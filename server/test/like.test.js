import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Recipe from "../src/models/Recipe.js";

const AUTHOR_EMAIL = "likes-author@test.com";
const FAN_EMAIL = "likes-fan@test.com";

const registerAndLogin = async (name, email) => {
  await request(app)
    .post("/auth/register")
    .send({ name, email, password: "123456" });

  const response = await request(app)
    .post("/auth/login")
    .send({ email, password: "123456" });

  return { token: response.body.token, id: response.body.user._id };
};

describe("Likes", function () {
  let author;
  let fan;
  let recipeId;

  before(async () => {
    await User.deleteMany({ email: { $in: [AUTHOR_EMAIL, FAN_EMAIL] } });
    await Recipe.deleteMany({});

    author = await registerAndLogin("Autor", AUTHOR_EMAIL);
    fan = await registerAndLogin("Fan", FAN_EMAIL);

    const response = await request(app)
      .post("/recipes")
      .set("Authorization", `Bearer ${author.token}`)
      .send({
        title: "Receta con likes",
        ingredients: "Algo",
        steps: "Algo",
      });

    recipeId = response.body.recipe._id;
  });

  after(async () => {
    await Recipe.deleteMany({});
    await User.deleteMany({ email: { $in: [AUTHOR_EMAIL, FAN_EMAIL] } });
  });

  it("debería devolver 401 al dar like sin token", async () => {
    const response = await request(app).post(`/recipes/${recipeId}/likes`);

    expect(response.status).to.equal(401);
  });

  it("un usuario debería poder dar like", async () => {
    const response = await request(app)
      .post(`/recipes/${recipeId}/likes`)
      .set("Authorization", `Bearer ${fan.token}`);

    expect(response.status).to.equal(200);
    expect(response.body.likes).to.have.lengthOf(1);
    expect(response.body.likes).to.include(fan.id);
  });

  it("dar like dos veces no debería duplicarlo", async () => {
    const response = await request(app)
      .post(`/recipes/${recipeId}/likes`)
      .set("Authorization", `Bearer ${fan.token}`);

    expect(response.status).to.equal(200);
    expect(response.body.likes).to.have.lengthOf(1);
  });

  it("la receta debería mostrar sus likes", async () => {
    const response = await request(app).get(`/recipes/${recipeId}`);

    expect(response.status).to.equal(200);
    expect(response.body.likes).to.include(fan.id);
  });

  it("debería devolver las recetas que le gustan al usuario", async () => {
    const response = await request(app)
      .get("/recipes/liked")
      .set("Authorization", `Bearer ${fan.token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(1);
    expect(response.body[0].title).to.equal("Receta con likes");
  });

  it("otro usuario no debería ver esa receta entre sus likes", async () => {
    const response = await request(app)
      .get("/recipes/liked")
      .set("Authorization", `Bearer ${author.token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array").that.is.empty;
  });

  it("debería poder quitar el like", async () => {
    const response = await request(app)
      .delete(`/recipes/${recipeId}/likes`)
      .set("Authorization", `Bearer ${fan.token}`);

    expect(response.status).to.equal(200);
    expect(response.body.likes).to.be.an("array").that.is.empty;
  });

  it("debería devolver 404 si la receta no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post(`/recipes/${fakeId}/likes`)
      .set("Authorization", `Bearer ${fan.token}`);

    expect(response.status).to.equal(404);
  });

  it("debería devolver 400 si el id no es válido", async () => {
    const response = await request(app)
      .post("/recipes/123/likes")
      .set("Authorization", `Bearer ${fan.token}`);

    expect(response.status).to.equal(400);
  });
});