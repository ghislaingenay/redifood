import { rest } from "msw";

export const handlers = [
  rest.post("/api/auth/login", async (req, res, ctx) => {
    const { username, password }: { username: string; password: string } = await req.json();
    if (username === "test" && password === "pit") {
      return res(ctx.status(200), ctx.json({ currentUser: { username } }));
    } else {
      return res(ctx.status(400), ctx.json({ errors: [{ message: "Invalid credentials" }] }));
    }
  }),

  rest.post("/api/auth/signup", async (req, res, ctx) => {
    const { username }: { username: string; password: string } = await req.json();
    if (username === "test") {
      return res(ctx.status(400), ctx.json({ errors: [{ message: "Invalid credentials" }] }));
    } else {
      return res(ctx.status(201), ctx.json({ currentUser: { username } }));
    }
  }),
];
