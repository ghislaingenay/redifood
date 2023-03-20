import express, { Request, Response } from "express";
import { ECurrency, ELanguage } from "../../redifood-module/src/interfaces";
import { EMessageErrors, EMessageSuccess, EStatusCodes } from "../interfaces/err.interface";
import { ISettingsBody } from "../interfaces/settings.interface";
import { currentUser } from "../middlewares/currentuser.mdwr";
import { requireAuth } from "../middlewares/require-auth.mdwr";
import { validateRequest } from "../middlewares/validationrequestnode.mdwr";
import { Setting } from "../models/settings.model";
import { User } from "../models/users.model";
import { validateSettings } from "../services/settings.const";
const router = express.Router();

// get settings
router.get("/api/settings", currentUser, requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser?.id;
  if (!userId) {
    res.send(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.INVALID_CREDENTIALS });
  }
  try {
    const settings = await Setting.find({ userId: userId });
    res.status(EStatusCodes.SUCCESS).send({ results: settings, message: EMessageSuccess.SETTINGS_RETRIEVED });
  } catch (err) {
    res
      .status(EStatusCodes.DATABASE_CONNECTION)
      .send({ results: { error: err }, message: EMessageErrors.DATABASE_CONNECTION });
  }
});

// create settings
router.post(
  "/api/settings",
  validateSettings,
  validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const body: ISettingsBody = req.body || {};
    if (!body) {
      res.send(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.EMPTY_ATTRIBUTES });
    }
    const foundUser = await User.findById({ _id: req.currentUser?.id });
    if (!foundUser) {
      res.send(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.INVALID_CREDENTIALS });
    }
    try {
      const newSettings = await Setting.build({
        user: req.currentUser?.id as string,
        language: body.language as ELanguage,
        haveFoodDescription: body.haveFoodDescription,
        currency: body.currency as ECurrency,
        haveFoodImage: body.haveFoodImage,
        vat: body.vat,
      });
      const savedSettings = await newSettings.save();
      if (!savedSettings) {
        res.send(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.INVALID_CREDENTIALS });
      }

      res.status(EStatusCodes.CREATED).send({ results: savedSettings, message: EMessageSuccess.SETTINGS_CREATED });
    } catch (err) {
      res
        .status(EStatusCodes.DATABASE_CONNECTION)
        .send({ results: { error: err }, message: EMessageErrors.DATABASE_CONNECTION });
    }
  },
);

// update settings
router.put(
  "/api/settings/:userid",
  validateSettings,
  validateRequest,
  currentUser,
  requireAuth,
  async (req: Request, res: Response) => {
    const userid = req.params?.userid;
    const body = req.body || {};

    if (userid !== req.currentUser?.id) {
      res.status(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.MISSING_ATTRIBUTES });
    }

    const foundUser = await User.findOne({ _id: req.currentUser?.id });
    if (!foundUser) {
      res.send(EStatusCodes.BAD_REQUEST).send({ results: {}, message: EMessageErrors.INVALID_CREDENTIALS });
    }
    try {
      await Setting.findOneAndUpdate({ user: userid }, body);
      res.status(EStatusCodes.SUCCESS).send({ results: {}, message: EMessageSuccess.SETTINGS_UPDATED });
    } catch (err: unknown) {
      res
        .status(EStatusCodes.DATABASE_CONNECTION)
        .send({ results: { error: err }, message: EMessageErrors.DATABASE_CONNECTION });
    }
  },
);

export { router as settingsRouter };
