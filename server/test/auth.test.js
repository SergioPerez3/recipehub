import { expect } from "chai";
import request from "supertest";
import app from "../src/app.js";
import User from "../src/models/User.js";

describe("Auth", function () {
  const user = {
    name: "User",
    email: "user@test.com",
    password: "abc123",
  };

  before(async () => {
    await User.deleteMany({ email: user.email });
  });

  after(async () => {
    await User.deleteMany({ email: user.email });
  });

  it("debería registrar un usuario", async () => {
    const response = await request(app).post("/auth/register").send(user);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property(
      "message",
      "Usuario registrado correctamente",
    );
    expect(response.body.user).to.not.have.property("password");
  });

  it("debería devolver 400 si el usuario ya existe", async () => {
    const response = await request(app).post("/auth/register").send(user);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property(
      "message",
      "El correo ya esta registrado",
    );
  });

  it("debería devolver 422 si faltan campos", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ email: "otro@test.com" });

    expect(response.status).to.equal(422);
    expect(response.body).to.have.property(
      "message",
      "Todos los campos son obligatorios",
    );
  });

  it("debería devolver 422 si el correo no es válido", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ name: "User", email: "correo-malo", password: "abc123" });

    expect(response.status).to.equal(422);
    expect(response.body).to.have.property("message", "El correo no es válido");
  });

  it("debería devolver 422 si la contraseña es muy corta", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ name: "User", email: "corta@test.com", password: "123" });

    expect(response.status).to.equal(422);
    expect(response.body).to.have.property(
      "message",
      "Contraseña muy corta, mínimo 6 caracteres",
    );
  });

  it("debería devolver un token si el email y la contraseña son correctos", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property("token");
    expect(response.body.user).to.not.have.property("password");
  });

  it("debería devolver 401 si la contraseña es incorrecta", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "incorrecta" });

    expect(response.status).to.equal(401);
    expect(response.body).to.have.property("message", "Credenciales invalidas");
  });

  it("debería devolver 401 si el email no existe", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "noexiste@test.com", password: "abc123" });

    expect(response.status).to.equal(401);
  });
});

