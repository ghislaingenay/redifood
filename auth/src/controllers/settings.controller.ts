import express, { Request, Response } from "express";
import { ECurrency, ELanguage } from "../../../common/auth-settings/settings.intfc";
import { EMessageErrors, EMessageSuccess, EStatusCodes } from "../interfaces/err.interface";
import { ISettingsBody } from "../interfaces/settings.interface";
import { requireAuth } from "../middlewares/require-auth.mdwr";
import { validateRequest } from "../middlewares/validationrequestnode.mdwr";
import { Setting } from "../models/settings.model";
import { User } from "../models/users.model";
import { validateSettings } from "../services/settings.const";
const router = express.Router();

// get settings
router.get("/api/settings", requireAuth, async (req: Request, res: Response) => {
  const { userId } = req.query || {};
  if (!userId) {
    res.send(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.INVALID_CREDENTIALS });
  }
  try {
    const settings = await Setting.find({ userId: userId });
    res.status(EStatusCodes.SUCCESS).send({ results: settings, message: "Successfully retrieved" });
  } catch (err) {
    res
      .status(EStatusCodes.DATABASE_CONNECTION)
      .send({ results: { error: err }, message: EMessageErrors.DATABASE_CONNECTION });
  }
});

// create settings
router.post("/api/settings", validateSettings, validateRequest, requireAuth, async (req: Request, res: Response) => {
  const body: ISettingsBody = req.body || {};
  if (!body) {
    res.send(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.EMPTY_ATTRIBUTES });
  }

  const foundUser = await User.findById(body.userId);
  if (!foundUser) {
    res.send(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.INVALID_CREDENTIALS });
  }
  try {
    const newSettings = await Setting.build({
      user: body.userId,
      language: body.language as ELanguage,
      haveFoodDescription: body.haveFoodDescription,
      currency: body.currency as ECurrency,
      haveFoodImage: body.haveFoodImage,
      vat: body.vat,
    });
    await newSettings.save();

    res.status(EStatusCodes.CREATED).send({ results: newSettings, message: EMessageSuccess.SETTINGS_CREATED });
  } catch (err) {
    res
      .status(EStatusCodes.DATABASE_CONNECTION)
      .send({ results: { error: err }, message: EMessageErrors.DATABASE_CONNECTION });
  }
});

// update settings
router.put(
  "/api/settings/:userid",
  validateSettings,
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    const { userid } = req.params || {};
    const body = req.body || {};
    const foundUser = await User.findById(userid);
    if (!foundUser) {
      res.send(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.INVALID_CREDENTIALS });
    }
    try {
      await Setting.findOneAndUpdate({ user: userid }, body);
      res.send(EStatusCodes.SUCCESS).send({ results: {}, message: EMessageSuccess.SETTINGS_UPDATED });
    } catch (err: unknown) {
      res
        .status(EStatusCodes.DATABASE_CONNECTION)
        .send({ results: { error: err }, message: EMessageErrors.DATABASE_CONNECTION });
    }
  },
);

export { router as settingsRouter };
