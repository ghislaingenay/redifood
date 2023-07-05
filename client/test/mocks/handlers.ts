import { rest } from "msw";
import { emailValid, passwordValid } from "../_tests_/auth/login.test";
import { mockedFoodData } from "./mockFoodData";
import { allDataOrders, getListUnpaidOrders } from "./mockOrdersData";

export const handlers = [
  rest.post("/api/auth/login", async (req, res, ctx) => {
    const { email, password }: { email: string; password: string } = await req.json();
    if (email === emailValid && password === passwordValid) {
      return res(ctx.status(200), ctx.json({ currentUser: { email } }));
    } else {
      return res(ctx.status(400), ctx.json({ errors: [{ message: "Invalid credentials" }] }));
    }
  }),

  rest.post("/api/auth/signup", async (req, res, ctx) => {
    const { email }: { email: string; password: string } = await req.json();
    if (email === emailValid) {
      return res(ctx.status(400), ctx.json({ errors: [{ message: "Invalid credentials" }] }));
    } else {
      return res(ctx.status(201), ctx.json({ currentUser: { email } }));
    }
  }),

  rest.get("/api/orders", async (req, res, ctx) => {
    const resres = await req.json();
    const { selectedOption }: { selectedOption: string } = await req.json();
    const filter = selectedOption ? selectedOption : null;

    if (!filter) {
      return res.once(ctx.status(200), ctx.json({ allDataOrders, getListUnpaidOrders }));
    } else {
      let res: any = allDataOrders.find((item) => item._id === filter);
      return res.once(ctx.status(200), ctx.json({ allDataOrders: res, getListUnpaidOrders }));
    }
  }),

  rest.get("/api/foods", async (req, res, ctx) => {
    console.log(req);
    // const response = await req.json();
    return res.once(ctx.status(200), ctx.json({ foodList: mockedFoodData, status: "success" }));
    // const response = await req.json();

    // const filter = "all";
    // if (filter === "all") {

    //   return res(ctx.status(200), ctx.json({ foodList: mockedFoodData, status: "success" }));
    // }

    // const filteredData = changeActiveButton(filter, ["pizza", "dessert", "drink"], mockedFoodData);
    // return res(ctx.status(200), ctx.json({ foodList: filteredData, status: "error" }));
  }),
];
