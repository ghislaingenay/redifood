import { Injectable } from '@nestjs/common';

@Injectable()
export class HistoryService {
  // Recover paid orders according to the filtering system
  getAllPaidOrders(paymentChoice, ordersDateFrom, ordersDateTo) {
    // findAllOrders and filter them by paid === true
    // And then filter them
    if (paymentChoice !== '') {
      // Apply one filter
    }
    if (ordersDateFrom !== '') {
      // Apply one filter
    }
    if (ordersDateTo !== '') {
      // Apply one filter
    }
    // Then return to users what it's left. Verify the length of the array. Create a copy with spread operator and send back to user
    return [
      {
        _id: 'AVGVHB5373DHUDFBHSCC',
        table: 4,
        paid: false,
        total: 15.2,
        payment: '',
        menu: [
          {
            food: {
              _id: '4',
              photo: '',
              name: 'Cheese Cake Vanilla',
              price: 4.8,
              section: 'dessert',
              extra: 'cakes',
            },
            qty: 2,
          },
          {
            food: {
              _id: '3',
              photo: '',
              name: 'Hot coffee',
              price: 2.8,
              section: 'drink',
              extra: 'hot',
            },
            qty: 2,
          },
        ],
      },
    ];
  }
}
