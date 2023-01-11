import request from "supertest";
import { app } from "../../app";

describe("POST /api/auth/login", () => {
  it("fails when a username that does not exist is supplied", async () => {
    await request(app)
      .post("/api/auth/login")
      .send({
        username: "test",
        password: "hueheFy*_6",
      })
      .expect(400);
  });

  it("fails when an incorrect password is supplied", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "Fyu89*_vhVgh",
      })
      .expect(201);
    await request(app)
      .post("/api/auth/login")
      .send({
        username: "test",
        password: "passd",
      })
      .expect(400);
  });

  it("valid cookies with correct credentials", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);
    const response = await request(app)
      .post("/api/auth/login")
      .send({
        username: "test",
        password: "Fyu89*_vhhvgh",
      })
      .expect(200);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});

describe("POST /api/auth/signup", () => {
  it("returns a 201 on successful signup", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);
  });

  it("returns a 400 with an invalid username", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "te",
        password: "Fyu89*_vhhvgh",
      })
      .expect(400);
  });

  it("returns a 400 with an invalid password", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "Fyu89*_vhhvghFyu89*_vhhvghFyu89*_vhhvghFyu89*_vhhvgh",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "Fyu8h",
      })
      .expect(400);

    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "fyu89*_vhhvgh",
      })
      .expect(400);
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "fyu89vhHvgh",
      })
      .expect(400);
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "fyu*_vHhvgh",
      })
      .expect(400);
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);
  });

  it("returns a 400 with missing username and password", async () => {
    return request(app).post("/api/auth/signup").send({}).expect(400);
  });

  it("disallows duplicate usernames", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "Fyu89*_vhhvgh",
      })
      .expect(400);
  });
  it("sets a cookie after successful signup", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "test",
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined();
  });
});
