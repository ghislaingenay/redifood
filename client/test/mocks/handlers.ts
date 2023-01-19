import { rest } from "msw";
import { allDataOrders, getListUnpaidOrders } from "./mocked.data";

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

  rest.get("/api/orders", async (req, res, ctx) => {
    const { orderId }: { orderId: string } = await req.json();
    const filter = orderId ? { orderId } : null;

    if (!filter) {
      return res(ctx.status(200), ctx.json({ allDataOrders, getListUnpaidOrders }));
    } else {
      let res: any = allDataOrders.find((item) => item.orderId === filter.orderId);
      return res(ctx.status(200), ctx.json({ allDataOrders: res, getListUnpaidOrders }));
    }
  }),
];
