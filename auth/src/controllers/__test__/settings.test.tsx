import request from "supertest";
import { ECurrency, ELanguage, ISettingsBody } from "../../../redifood-module/src/interfaces";
import { EMessageErrors, EMessageSuccess } from "../../../redifood-module/src/interfaces/msg.interface";
import { app } from "../../app";

const emailValid = "test@test.com";
// const fakeUserId = "dndsnfkdg";
const validPassword = "F4k3P4ssw0rd!";

const settingsObject: Partial<ISettingsBody> = {
  currency: ECurrency.USD,
  vat: 7,
  language: ELanguage.ENGLISH,
  haveFoodDescription: false,
  haveFoodImage: false,
};

describe("POST /api/settings", () => {
  it("Fails when no body is sent", async () => {
    const cookie = await global.signin();
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send().expect(400);
    expect(response.body.errors).toHaveLength(5);
  });

  it("Fails when the wrong credentials are used", async () => {
    await request(app).post("/api/settings").set("Cookie", "xsxs").send(settingsObject).expect(401);
  });

  it("Fails when vat is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.vat = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].message).toBe("vat should be defined");
  });

  it("Fails when language is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.language = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].message).toBe("language should be defined");
  });

  it("Fails when currency is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.currency = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].message).toBe("currency should be defined");
  });

  it("Fails when food description is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.haveFoodDescription = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].message).toBe("haveFoodDescription should be defined");
  });

  it("Fails when food image is not provided", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    updatedObject.haveFoodImage = undefined;
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].message).toBe("haveFoodImage should be defined");
  });

  it("Succesfully create the settings", async () => {
    const cookie = await global.signin();
    const updatedObject = { ...settingsObject };
    const response = await request(app).post("/api/settings").set("Cookie", cookie).send(updatedObject).expect(201);
    expect(response.body.message).toEqual(EMessageSuccess.SETTINGS_CREATED);
  });
});

describe("GET /api/settings/", () => {
  it("user is not authenticated", async () => {
    await request(app).get("/api/settings").expect(401);
  });
  it("Get the proper settings information from the user", async () => {
    const cookie = await global.signin();
    const getResponse = await request(app).get("/api/settings").set("Cookie", cookie).expect(200);
    expect(getResponse.body.message).toEqual(EMessageSuccess.SETTINGS_RETRIEVED);
  });
});

describe("PUT /api/settings/:userid", () => {
  it("Fails if the userid is not valid", async () => {
    const LoggedIn = await request(app).post("/api/auth/login").send({
      email: emailValid,
      password: validPassword,
    });

    await request(app)
      .put(`/api/settings/${LoggedIn.body.id}`)
      .send({ ...settingsObject, haveFoodDescription: true })
      .expect(401);
  });

  it("Fails if the userid in the req.params is undefined", async () => {
    const cookie = await global.signin();
    const response = await request(app)
      .put(`/api/settings/undefined`)
      .set("Cookie", cookie)
      .send({ ...settingsObject, haveFoodDescription: true })
      .expect(400);
    console.log("res", response.body);
    expect(response.body.message).toBe(EMessageErrors.MISSING_ATTRIBUTES);
  });

  it("Fails if a value sent in the body is undefined", async () => {
    const cookie = await global.signin();
    const LoggedIn = await request(app).post("/api/auth/login").send({
      email: emailValid,
      password: validPassword,
    });
    const response = await request(app)
      .put(`/api/settings/${LoggedIn.body.id}`)
      .set("Cookie", cookie)
      .send({ ...settingsObject, haveFoodDescription: undefined })
      .expect(400);
    expect(response.body.errors).toHaveLength(1);
    expect(response.body.errors[0].message).toBe("haveFoodDescription should be defined");
  });

  it("Fails if several values sent in the body is undefined", async () => {
    const cookie = await global.signin();
    const LoggedIn = await request(app).post("/api/auth/login").send({
      email: emailValid,
      password: validPassword,
    });
    const response = await request(app)
      .put(`/api/settings/${LoggedIn.body.id}`)
      .set("Cookie", cookie)
      .send({ ...settingsObject, haveFoodDescription: undefined, currency: undefined, vat: null })
      .expect(400);
    expect(response.body.errors).toHaveLength(3);
  });

  it("Successfully update the settings", async () => {
    const cookie = await global.signin();
    const loggedIn = await request(app).post("/api/auth/login").set("Cookie", cookie).send({
      email: emailValid,
      password: validPassword,
    });
    const {
      body: { id },
    } = loggedIn;
    // I need to create a settings first
    await request(app)
      .post("/api/settings")
      .set("Cookie", cookie)
      .send({ ...settingsObject });
    const response = await request(app)
      .put(`/api/settings/${id}`)
      .set("Cookie", cookie)
      .send({ ...settingsObject, haveFoodDescription: true, currency: ECurrency.EUR })
      .expect(200);
    expect(response.body.message).toEqual(EMessageSuccess.SETTINGS_UPDATED);
    await request(app).get("/api/settings").set("Cookie", cookie).expect(200);
  });
});
