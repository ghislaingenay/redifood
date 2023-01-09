import { rest } from "msw";

export const handlers = [
  rest.post("http://localhost:3030/api/auth/login", async (req, res, ctx) => {
    console.log(req);
    const { username, password }: { username: string; password: string } =
      await req.json();
    console.log(username, password);
    if (username !== "test")
      return res(ctx.status(401), ctx.json({ message: "Invalid username" }));
    if (password !== "pit")
      return res(ctx.status(401), ctx.json({ message: "Invalid password" }));
    return res(ctx.status(201), ctx.json({ message: "Success" }));
  }),
];
