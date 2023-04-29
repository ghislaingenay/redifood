// Type of the food card
export interface Food {
  _id?: string;
  name: string;
  photo: string;
  price: number;
  description?: string;
  section: string;
  extra: string;
}

// Type of what the user wants (/orders)
export interface Menu {
  food: Food;
  qty: number;
}

// Type for one order
export interface Order {
  _id: string;
  table: number;
  paid: boolean;
  total: number;
  menu: Menu[];
  date?: Date;
  payment: string;
}

// Interface for the section
export interface Section {
  name: string;
  extra: string[];
}

// Interface - request for history page (search: payment choice)
export interface Request {
  search: string;
  datefrom: string;
  dateto: string;
}

// Interface that concern the user (Authentification)
export interface User {
  userId?: string;
  name: string;
  username: string;
  password: string;
}
