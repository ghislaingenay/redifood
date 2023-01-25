import { rest } from "msw";
import { mockedFoodData } from "./mockFoodData";
import { allDataOrders, getListUnpaidOrders } from "./mockOrdersData";

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
    const resres = await req.json();
    console.log("rerererer", resres.params);
    const { selectedOption }: { selectedOption: string } = await req.json();
    const filter = selectedOption ? selectedOption : null;

    if (!filter) {
      return res.once(ctx.status(200), ctx.json({ allDataOrders, getListUnpaidOrders }));
    } else {
      let res: any = allDataOrders.find((item) => item.orderId === filter);
      return res.once(ctx.status(200), ctx.json({ allDataOrders: res, getListUnpaidOrders }));
    }
  }),

  rest.get("/api/foods", async (req, res, ctx) => {
    const response = await req.json();
    return res.once(ctx.status(200), ctx.json({ foodList: mockedFoodData, status: "success" }));
    // const response = await req.json();
    // console.log("rerererer", response.params);

    // const filter = "all";
    // if (filter === "all") {

    //   return res(ctx.status(200), ctx.json({ foodList: mockedFoodData, status: "success" }));
    // }

    // const filteredData = changeActiveButton(filter, ["pizza", "dessert", "drink"], mockedFoodData);
    // return res(ctx.status(200), ctx.json({ foodList: filteredData, status: "error" }));
  }),
];
