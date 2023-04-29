import { Food, Section } from './app.interface';

export const foods: Food[] = [
  {
    _id: '1',
    name: 'Pizza Mediterranean',
    photo:
      'https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
    price: 12.5,
    description: 'Soo good',
    section: 'pizza',
    extra: 'tomato',
  },
  {
    _id: '2',
    name: 'Pizza Cheesy',
    photo:
      'https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    price: 13.99,
    description: 'Gorgonzola, gouda, mozzarella, blue cheese',
    section: 'pizza',
    extra: 'cream',
  },
  {
    _id: '3',
    name: 'Millefeuille',
    photo:
      'https://images.unsplash.com/photo-1587122569949-ae6e755c6bdc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=885&q=80',
    price: 4.25,
    description: 'The traditional French Millefeuille',
    section: 'dessert',
    extra: 'pastry',
  },
  {
    _id: '4',
    name: 'Profiteroles',
    photo:
      'https://images.unsplash.com/photo-1602903489862-1fe54b1f5ff2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=825&q=80',
    price: 3.75,
    description: 'Improve version of cream puff',
    section: 'dessert',
    extra: 'pastry',
  },
  {
    _id: '5',
    name: 'Carrot cake',
    photo:
      'https://images.unsplash.com/photo-1622926421334-6829deee4b4b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=496&q=80',
    price: 5.2,
    description: 'Ingredient A and B',
    section: 'dessert',
    extra: 'cake',
  },
  {
    _id: '6',
    name: 'Expresso',
    photo: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80',
    price: 1,
    description: 'Hard and strong with the perfect beans',
    section: 'drink',
    extra: 'hot drink',
  },
  {
    _id: '7',
    name: 'Sprite can - 330 mL',
    photo:
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    price: 1.2,
    description: 'Sprite can of 330 mL',
    section: 'drink',
    extra: 'soda',
  },
  {
    _id: '8',
    name: 'Sprite can - 500 mL',
    photo:
      'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
    price: 1.6,
    description: 'Sprite can of 500 mL',
    section: 'drink',
    extra: 'soda',
  },
  {
    _id: '9',
    name: 'Singha - 33 cL',
    photo:
      'https://images.unsplash.com/photo-1654081057025-93aec17feeca?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80',
    price: 1.58,
    description: 'Singha with 330 mL format',
    section: 'drink',
    extra: 'beer',
  },
];

export const section: Section[] = [
  {
    name: 'pizza',
    extra: ['tomato', 'cream'],
  },
  {
    name: 'dessert',
    extra: ['cake', 'pastry'],
  },
  {
    name: 'drink',
    extra: ['hot drink', 'soda', 'beer'],
  },
];
