import request from "supertest";
import { app } from "../../app";

describe("GET /api/users/currentuser", () => {
  it("responds with details about the current user", async () => {
    const cookie = await global.signin();

    const response = await request(app).get("/api/auth/currentuser").set("Cookie", cookie).send().expect(200);

    expect(response.body.currentUser.username).toEqual("testingUser");
  });

  it("current user of null is not authenticated", async () => {
    await request(app).get("/api/auth/currentuser").send().expect(401);
    // console.log(response);
    // expect(response.statusMessage).toEqual("Unauthorized");
  });
});
