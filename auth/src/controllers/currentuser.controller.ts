import express, { Request, Response } from "express";
const router = express.Router();

router.get("/api/auth/currentuser", (req: Request, res: Response) => {
  res.send("Registered");
});

export { router as currentUserRouter };
