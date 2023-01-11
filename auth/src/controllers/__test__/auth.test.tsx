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
        password: "Fyu89*_vhhvgh",
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
