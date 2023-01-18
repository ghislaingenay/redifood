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

  rest.get("/api/orders/all", async (req, res, ctx) => {
    const { orderId }: { orderId: string } = await req.json();
    const filter = orderId ? { orderId } : null;

    const data = [
      {
        orderId: "APP1",
        orderStatus: "CREATED",
        orderDate: "2021-01-01",
        tableNumber: 2,
        orderTotal: 100,
        orderItems: [
          {
            foodName: "ITEM1",
            foodSection: "DRINK",
            foodExtra: "HOT DRINK",
            itemQuantity: 1,
            itemPrice: 100,
            currency: "USD",
          },
        ],
      },
      {
        orderId: "FTP2",
        orderStatus: "CREATED",
        orderDate: "2021-04-05",
        tableNumber: 5,
        orderTotal: 200,
        orderItems: [
          {
            foodName: "ITEM1",
            foodSection: "PIK",
            foodExtra: "MAN Z",
            itemQuantity: 2,
            itemPrice: 100,
            currency: "USD",
          },
        ],
      },
      {
        orderId: "KBB3",
        orderStatus: "CREATED",
        orderDate: "2021-07-04",
        tableNumber: 8,
        orderTotal: 100,
        orderItems: [
          {
            foodName: "ITEM3",
            foodSection: "DRINK",
            foodExtra: "SOFT DRINK",
            itemQuantity: 1,
            itemPrice: 80,
            currency: "USD",
          },
        ],
      },
    ];

    if (!filter) {
      return res(ctx.status(200), ctx.json(data));
    } else {
      let res: any = data.find((item) => item.orderId === filter.orderId);
      return res(ctx.status(200), ctx.json(res));
    }
  }),
];
