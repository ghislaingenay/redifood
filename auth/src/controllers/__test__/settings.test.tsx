import request from "supertest";
import { app } from "../../app";
import { EMessageErrors } from "../../interfaces/err.interface";
import { ISettings } from "../../interfaces/settings.interface";

const emailValid = "test@test.com";
const fakeUserId = "dndsnfkdg";

const settingsObject: Partial<ISettings> = {
  userId: fakeUserId,
  currency: "USD",
  vat: 7,
  language: "en",
  haveFoodDescription: false,
  haveFoodImage: false,
};

describe("POST /api/settings", () => {
  it("Fails when userid is incorrect", async () => {
    const response = await request(app).post("/api/settings").send(settingsObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.INVALID_CREDENTIALS);
  });

  it("Fails when userid is not provided", async () => {
    const updatedObject = { ...settingsObject };
    updatedObject.userId = undefined;
    const response = await request(app).post("/api/settings").send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when vat is not provided", async () => {
    const updatedObject = { ...settingsObject };
    updatedObject.vat = undefined;
    const response = await request(app).post("/api/settings").send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when language is not provided", async () => {
    const updatedObject = { ...settingsObject };
    updatedObject.language = undefined;
    const response = await request(app).post("/api/settings").send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when currency is not provided", async () => {
    const updatedObject = { ...settingsObject };
    updatedObject.vat = undefined;
    const response = await request(app).post("/api/settings").send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when food description is not provided", async () => {
    const updatedObject = { ...settingsObject };
    updatedObject.haveFoodDescription = undefined;
    const response = await request(app).post("/api/settings").send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when food image is not provided", async () => {
    const updatedObject = { ...settingsObject };
    updatedObject.haveFoodImage = undefined;
    const response = await request(app).post("/api/settings").send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Succesfully create the settings", async () => {
    const signUpRes = await request(app)
      .post("/api/auth/signup")
      .send({
        email: emailValid,
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);
    const updatedObject = { ...settingsObject };
    updatedObject.userId = signUpRes.body.id;
    const response = await request(app).post("/api/settings").send(updatedObject).expect(201);
    expect(response.body.message).toEqual("Settings succesfully created");
  });
});
describe("GET /api/settings/:userid", () => {
  it("Get the proper settings information from the user", async () => {
    const signUpRes = await request(app)
      .post("/api/auth/signup")
      .send({
        email: emailValid,
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);
    const updatedObject = { ...settingsObject };
    updatedObject.userId = signUpRes.body.id;
    const response = await request(app).post("/api/settings").send(updatedObject).expect(201);
    expect(response.body.message).toEqual("Settings succesfully created");
    const getResponse = await request(app).get("/api/settings").query({ userId: updatedObject.userId }).expect(200);
    expect(getResponse.body.results).toEqual(updatedObject);
  });
});

describe("PUT /api/settings/:userid", () => {
  it("Fails whe value from w");
});
