import { rest } from "msw";

export const handlers = [
  rest.post("http://localhost:3030/api/auth/login", async (req, res, ctx) => {
    console.log(req);
    const { username, password }: { username: string; password: string } = await req.json();
    console.log(username, password);
    if (username === "test" && password === "pit") {
      return res(ctx.status(201), ctx.json({ message: "Success" }));
    } else {
      let errors = [];
      if (username !== "test") {
        errors.push("error username");
      }
      if (password !== "pit") {
        errors.push("error password");
      }
      let errorMessage = errors.join(", ");
      console.log("mean", errorMessage);
      return res(ctx.status(401), ctx.json({ message: "Invalid credentials", errorMessage }));
    }
  }),

  rest.post("http://localhost:3030/api/auth/signup", async (req, res, ctx) => {
    const { username, password }: { username: string; password: string } = await req.json();
    console.log(username, password);
    if (username === "test") {
      return res(ctx.status(400), ctx.json({ message: "Invalid credentials" }));
    } else {
      return res(ctx.status(201), ctx.json({ message: "Success" }));
    }
  }),
];
