import { expect } from "chai";
import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app.js";
import User from "../src/models/User.js";
import Recipe from "../src/models/Recipe.js";

const PROFILE_EMAIL = "profile@test.com";
const EMPTY_EMAIL = "empty@test.com";

const registerAndLogin = async (name, email) => {
  await request(app)
    .post("/auth/register")
    .send({ name, email, password: "123456" });

  const response = await request(app)
    .post("/auth/login")
    .send({ email, password: "123456" });

  return { token: response.body.token, id: response.body.user._id };
};

describe("Usuarios", function () {
  let profileUser;
  let emptyUser;

  before(async () => {
    await User.deleteMany({ email: { $in: [PROFILE_EMAIL, EMPTY_EMAIL] } });
    await Recipe.deleteMany({});

    profileUser = await registerAndLogin("Perfil", PROFILE_EMAIL);
    emptyUser = await registerAndLogin("Vacio", EMPTY_EMAIL);

    // El usuario "Perfil" publica dos recetas
    const recipes = [
      {
        title: "Paella",
        ingredients: "Arroz\nPollo\nAzafrán",
        steps: "Sofríe\nAñade el arroz\nCuece 20 minutos",
      },
      {
        title: "Gazpacho",
        ingredients: "Tomate\nPepino\nPimiento",
        steps: "Tritura todo\nEnfría",
      },
    ];

    for (const recipe of recipes) {
      await request(app)
        .post("/recipes")
        .set("Authorization", `Bearer ${profileUser.token}`)
        .send(recipe);
    }
  });

  after(async () => {
    await Recipe.deleteMany({});
    await User.deleteMany({ email: { $in: [PROFILE_EMAIL, EMPTY_EMAIL] } });
  });

  it("debería devolver el perfil público de un usuario", async () => {
    const response = await request(app).get(`/users/${profileUser.id}`);

    expect(response.status).to.equal(200);
    expect(response.body.user).to.have.property("name", "Perfil");
    expect(response.body.user).to.have.property("createdAt");
  });

  it("no debería exponer el email ni la contraseña", async () => {
    const response = await request(app).get(`/users/${profileUser.id}`);

    expect(response.body.user).to.not.have.property("email");
    expect(response.body.user).to.not.have.property("password");
  });

  it("debería incluir las recetas del usuario", async () => {
    const response = await request(app).get(`/users/${profileUser.id}`);

    expect(response.body.recipes).to.be.an("array");
    expect(response.body.recipes).to.have.lengthOf(2);

    const titles = response.body.recipes.map((recipe) => recipe.title);
    expect(titles).to.have.members(["Paella", "Gazpacho"]);
  });

  it("debería devolver un array vacío si el usuario no tiene recetas", async () => {
    const response = await request(app).get(`/users/${emptyUser.id}`);

    expect(response.status).to.equal(200);
    expect(response.body.recipes).to.be.an("array").that.is.empty;
  });

  it("debería devolver 400 si el id no es válido", async () => {
    const response = await request(app).get("/users/123");

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property("message", "ID no válido");
  });

  it("debería devolver 404 si el usuario no existe", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/users/${fakeId}`);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property("message", "Usuario no encontrado");
  });
});

