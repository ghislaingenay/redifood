import express, { Request, Response } from "express";
import { currentUser } from "../middlewares/currentuser.mdwr";
const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get(
  "/api/auth/currentuser",
  currentUser,
  //  requireAuth,
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  },
);

export { router as currentUserRouter };
