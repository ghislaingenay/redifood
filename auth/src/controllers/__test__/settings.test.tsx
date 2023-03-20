import request from "supertest";
import { ECurrency } from "../../../../common/auth-settings/settings.intfc";
import { app } from "../../app";
import { EMessageErrors, EMessageSuccess } from "../../interfaces/err.interface";
import { ISettings } from "../../interfaces/settings.interface";

const emailValid = "test@test.com";
const fakeUserId = "dndsnfkdg";

const settingsObject: Partial<ISettings> = {
  user: fakeUserId,
  currency: "USD",
  vat: 7,
  language: "en",
  haveFoodDescription: false,
  haveFoodImage: false,
};

describe("POST /api/settings", () => {
  it("Fails when no bodu is sent", async () => {
    const cookie = await global.signin();
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send().expect(400);
    expect(response.body.message).toEqual(EMessageErrors.EMPTY_ATTRIBUTES);
  });
  it("Fails when userid is incorrect", async () => {
    const cookie = await global.signin();
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(settingsObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.INVALID_CREDENTIALS);
  });

  it("Fails when userid is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.user = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when vat is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.vat = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when language is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.language = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when currency is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.vat = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when food description is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.haveFoodDescription = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails when food image is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.haveFoodImage = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.message).toEqual(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Succesfully create the settings", async () => {
    const cookie = await global.signin();
    const signUpRes = await request(app)
      .post("/api/auth/signup")
      .set("Cookie", cookie)
      .send({
        email: emailValid,
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);
    const updatedObject = { ...settingsObject };
    updatedObject.user = signUpRes.body.id;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(201);
    expect(response.body.message).toEqual(EMessageSuccess.SETTINGS_CREATED);
  });
});
describe("GET /api/settings/:userid", () => {
  it("Get the proper settings information from the user", async () => {
    const cookie = await global.signin();
    const signUpRes = await request(app)
      .post("/api/auth/signup")
      .set("Cookie", cookie)
      .send({
        email: emailValid,
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);
    const updatedObject = { ...settingsObject };
    updatedObject.user = signUpRes.body.id;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(201);
    expect(response.body.message).toEqual(EMessageSuccess.SETTINGS_CREATED);
    const getResponse = await request(app)
      .get("/api/settings")
      .set("Cookie", cookie)
      .query({ userId: updatedObject.user })
      .expect(200);
    expect(getResponse.body.results).toEqual(updatedObject);
    expect(getResponse.body.message).toEqual(EMessageSuccess.SETTINGS_RETRIEVED);
  });
});

describe("PUT /api/settings/:userid", () => {
  it("Fails if the userid is not valid", async () => {
    const cookie = await global.signin();
    const signUpRes = await request(app)
      .post("/api/auth/signup")
      .set("Cookie", cookie)
      .send({
        email: emailValid,
        password: "Fyu89*_vhhvgh",
      })
      .expect(201);
    const response = await request(app)
      .put(`/api/settings/${signUpRes.body.id}`)
      .set("Cookie", cookie)
      .send({ ...settingsObject, haveFoodDescription: true })
      .expect(400);
    expect(response.body.message).toEqual(EMessageErrors.INVALID_CREDENTIALS);
  });

  it("Fails when a new value sent is undefined", async () => {
    const cookie = await global.signin();
    const response = await request(app)
      .put(`/api/settings/undefined`)
      .set("Cookie", cookie)
      .send({ ...settingsObject, haveFoodDescription: true })
      .expect(400);
    expect(response.body.message).toEqual(EMessageErrors.INVALID_CREDENTIALS);
  });
  it("Succesfully update the settings", async () => {
    const cookie = await global.signin();
    const signUpRes = await request(app).post("/api/auth/signup").set("Cookie", cookie).send({
      email: emailValid,
      password: "Fyu89*_vhhvgh",
    });
    const response = await request(app)
      .put(`/api/settings/${signUpRes.body.id}`)
      .set("Cookie", cookie)
      .send({ ...settingsObject, userId: signUpRes.body.id, haveFoodDescription: true, currency: ECurrency.EUR })
      .expect(200);
    expect(response.body.message).toEqual(EMessageSuccess.SETTINGS_UPDATED);
  });
});
