export const allDataOrders = [
  {
    _id: "APP1",
    orderStatus: "CREATED",
    orderDate: "2021-01-01",
    tableNumber: 2,
    orderTotal: 100,
    orderItems: [
      {
        itemId: 456,
        itemName: "ab",
        itemSection: "DRINK",
        itemExtra: "HOT DRINK",
        itemQuantity: 1,
        itemPrice: 56,
        currency: "USD",
      },
    ],
  },
  {
    _id: "FTP2",
    orderStatus: "CREATED",
    orderDate: "2021-04-05",
    tableNumber: 5,
    orderTotal: 200,
    orderItems: [
      {
        itemName: "cd",
        itemSection: "PIK",
        itemExtra: "MAN Z",
        itemQuantity: 2,
        itemPrice: 78,
        currency: "USD",
      },
      {
        itemName: "sff",
        itemSection: " sbfs",
        itemExtra: "dvdvz Z",
        itemQuantity: 2,
        itemPrice: 150,
        currency: "USD",
      },
    ],
  },
  {
    _id: "KBB3",
    orderStatus: "CREATED",
    orderDate: "2021-07-04",
    tableNumber: 8,
    orderTotal: 1890,
    orderItems: [
      {
        itemName: "Pottaes",
        itemSection: "Choco",
        itemExtra: "SOFT 12",
        itemQuantity: 1,
        itemPrice: 80,
        currency: "USD",
      },
      {
        itemName: "Kiyu",
        itemSection: "Salad",
        itemExtra: "FTY",
        itemQuantity: 8,
        itemPrice: 10,
        currency: "USD",
      },
    ],
  },
];

export const getListUnpaidOrders = ["ALL", "APP1", "FTP2", "KBB3"];

export const mockOneOrder = {
  _id: "APP1",
  orderStatus: "CREATED",
  orderDate: "2021-01-01",
  tableNumber: 2,
  orderTotal: 10.65,
  orderItems: [
    {
      itemId: "8",
      itemName: "Sprite can - 500 mL",
      itemPhoto:
        "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      itemPrice: 1.6,
      itemDescription: "Sprite can of 500 mL",
      itemSection: "drink",
      itemExtra: "soda",
      itemQuantity: 4,
      itemCurrency: "USD",
    },
    {
      itemId: "3",
      itemName: "Millefeuille",
      itemPhoto:
        "https://images.unsplash.com/photo-1587122569949-ae6e755c6bdc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=885&q=80",
      itemPrice: 4.25,
      itemDescription: "The traditional French Millefeuille",
      itemSection: "dessert",
      itemExtra: "pastry",
      itemQuantity: 1,
      itemCurrency: "USD",
    },
  ],
};
