export const allDataOrders = [
  {
    orderId: "APP1",
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
    orderId: "FTP2",
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
    orderId: "KBB3",
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
