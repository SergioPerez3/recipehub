import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Recipe from "../src/models/Recipe.js";

const OWNER_EMAIL = "owner@test.com";
const OTHER_EMAIL = "other@test.com";

const registerAndLogin = async (name, email) => {
  await request(app)
    .post("/auth/register")
    .send({ name, email, password: "123456" });

  const response = await request(app)
    .post("/auth/login")
    .send({ email, password: "123456" });

  return { token: response.body.token, id: response.body.user._id };
};

describe("Recetas", function () {
  let owner;
  let other;
  let recipeId;

  const recipe = {
    title: "Tortilla de patatas",
    description: "La clásica",
    ingredients: "4 patatas\n6 huevos\n1 cebolla\nAceite de oliva\nSal",
    steps: "Pela las patatas\nFríelas\nMezcla con el huevo\nCuaja la tortilla",
    category: "cena",
    difficulty: "media",
    cookingTime: 40,
  };

  before(async () => {
    await User.deleteMany({ email: { $in: [OWNER_EMAIL, OTHER_EMAIL] } });
    await Recipe.deleteMany({});

    owner = await registerAndLogin("Owner", OWNER_EMAIL);
    other = await registerAndLogin("Other", OTHER_EMAIL);
  });

  after(async () => {
    await Recipe.deleteMany({});
    await User.deleteMany({ email: { $in: [OWNER_EMAIL, OTHER_EMAIL] } });
  });

  it("debería devolver un array de recetas", async () => {
    const response = await request(app).get("/recipes");

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  it("debería devolver 401 al crear una receta sin token", async () => {
    const response = await request(app).post("/recipes").send(recipe);

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property("message", "No autorizado");
  });

  it("debería devolver 422 si faltan campos obligatorios", async () => {
    const response = await request(app)
      .post("/recipes")
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ title: "Sin pasos" });

    expect(response.status).to.equal(422);
  });

  it("el usuario debería poder crear una receta", async () => {
    const response = await request(app)
      .post("/recipes")
      .set("Authorization", `Bearer ${owner.token}`)
      .send(recipe);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property(
      "message",
      "Receta creada correctamente",
    );
    expect(response.body.recipe.title).to.equal("Tortilla de patatas");
    expect(response.body.recipe.author).to.equal(owner.id);

    recipeId = response.body.recipe._id;
  });

  it("debería devolver una receta por id con el nombre del autor", async () => {
    const response = await request(app).get(`/recipes/${recipeId}`);

    expect(response.status).to.equal(200);
    expect(response.body.title).to.equal("Tortilla de patatas");
    expect(response.body.author.name).to.equal("Owner");
  });

  it("debería devolver 400 si el id no es válido", async () => {
    const response = await request(app).get("/recipes/123");

    expect(response.status).to.equal(400);
  });

  it("debería devolver 404 si la receta no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/recipes/${fakeId}`);

    expect(response.status).to.equal(404);
  });

  it("el autor debería poder editar su receta", async () => {
    const response = await request(app)
      .put(`/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${owner.token}`)
      .send({ title: "Tortilla mejorada", cookingTime: 45 });

    expect(response.status).to.equal(200);
    expect(response.body.recipe.title).to.equal("Tortilla mejorada");
    expect(response.body.recipe.cookingTime).to.equal(45);
  });

  it("otro usuario NO debería poder editar la receta (403)", async () => {
    const response = await request(app)
      .put(`/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${other.token}`)
      .send({ title: "Receta robada" });

    expect(response.status).to.equal(403);
  });

  it("otro usuario NO debería poder borrar la receta (403)", async () => {
    const response = await request(app)
      .delete(`/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${other.token}`);

    expect(response.status).to.equal(403);
  });


  it("el autor debería poder borrar su receta", async () => {
    const response = await request(app)
      .delete(`/recipes/${recipeId}`)
      .set("Authorization", `Bearer ${owner.token}`);

    expect(response.status).to.equal(200);

    const check = await request(app).get(`/recipes/${recipeId}`);
    expect(check.status).to.equal(404);
  });
});
