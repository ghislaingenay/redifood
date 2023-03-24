/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
  CREATE TABLE food_section (
    id SERIAL PRIMARY KEY,
    section_order SMALLINT NOT NULL,
    section_name VARCHAR(30) NOT NULL,
    section_description VARCHAR(50) DEFAULT ''
  );

  CREATE TABLE food_extra (
    id SERIAL PRIMARY KEY,
    extra_name VARCHAR NOT NULL,
    extra_order SMALLINT NOT NULL,
    extra_description VARCHAR(50) DEFAULT '',
    section_id INTEGER REFERENCES food_section(id)
  );

  CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(20) NOT NULL,
    item_description VARCHAR(50) DEFAULT '',
    item_price NUMERIC NOT NULL CHECK (item_price > 0),
    item_picture VARCHAR NOT NULL,
    item_created_at DATE DEFAULT NOW(),
    section_id INTEGER REFERENCES food_section(id),
    extra_id INTEGER REFERENCES food_extra(id)
  )`);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE foods;
  DROP TABLE food_section;
  DROP TABLE food_extra;`);
};
