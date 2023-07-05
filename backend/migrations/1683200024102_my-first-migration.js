/* eslint-disable camelcase */

exports.shorthands = undefined;

// CREATE TYPE orderstatus AS ENUM ('created', 'paid', 'cancelled', 'finished');
exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE food_section (
    id SERIAL PRIMARY KEY,
    section_order SMALLINT NOT NULL,
    user_id VARCHAR NOT NULL,
    section_name VARCHAR(30) UNIQUE NOT NULL,
    section_description VARCHAR(50) DEFAULT ''
  );

  CREATE TABLE food_extra (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    extra_name VARCHAR(30) UNIQUE NOT NULL,
    extra_order SMALLINT NOT NULL,
    extra_description VARCHAR(50) DEFAULT '',
    section_id INTEGER REFERENCES food_section(id)
  );

  CREATE TABLE food (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(20) UNIQUE NOT NULL,
    item_description VARCHAR(50) DEFAULT '',
    item_price NUMERIC NOT NULL CHECK (item_price > 0),
    item_photo VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL, 
    item_created_at DATE DEFAULT NOW(),
    section_id INTEGER REFERENCES food_section(id),
    extra_id INTEGER REFERENCES food_extra(id),
    item_quantity SMALLINT NOT NULL DEFAULT 0
  );

  CREATE TYPE orderstatus AS ENUM ('created', 'paid', 'cancelled', 'finished');

  CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    order_table_number INTEGER NOT NULL CHECK (order_table_number > 0),
    order_time NUMERIC NOT NULL DEFAULT 0,
    order_status orderstatus NOT NULL DEFAULT 'created',
    order_total NUMERIC NOT NULL CHECK (order_total > 0),
    user_id VARCHAR NOT NULL,
    order_finished TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    order_no VARCHAR(20) NOT NULL,
    order_items VARCHAR NOT NULL DEFAULT ''
);

  CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    user_id VARCHAR NOT NULL,
    food_id INTEGER DEFAULT 0 NOT NULL,
    order_item_quantity SMALLINT NOT NULL DEFAULT 0,
    order_item_name VARCHAR(20) NOT NULL,
    order_item_price NUMERIC NOT NULL CHECK (order_item_price > 0)
  );

  CREATE TYPE paytype AS ENUM ('cash', 'credit');
  CREATE TYPE discounttype AS ENUM ('percentage', 'amount');

  CREATE TABLE discount (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    discount_code VARCHAR(20) NOT NULL,
    discount_type discounttype NOT NULL DEFAULT 'percentage',
    discount_amount NUMERIC NOT NULL CHECK (discount_amount > 0),
    discount_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    discount_end TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    discount_active BOOLEAN NOT NULL DEFAULT true
  );

  CREATE TABLE payment (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    order_id INTEGER REFERENCES orders(id),
    payment_stripe_id VARCHAR NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'created',
    payment_type paytype NOT NULL,
    payment_amount NUMERIC NOT NULL CHECK (payment_amount > 0),
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    payment_discount_applied BOOLEAN NOT NULL DEFAULT false,
    payment_discount_id INTEGER DEFAULT 0 NOT NULL,
    payment_tax_amount NUMERIC NOT NULL CHECK (payment_tax_amount > 0)
  )
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE food;
  DROP TABLE food_extra;
  DROP TABLE food_section;
  DROP TABLE orders;
  DROP TABLE order_items;
  DROP TABLE discount;
  DROP TABLE payment;
  `);
};
