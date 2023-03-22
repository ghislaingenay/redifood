/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE foods (
      id SERIAL PRIMARY KEY,
      item_name VARCHAR(20) NOT NULL,
      item_description VARCHAR(50) DEFAULT '',
      item_price INTEGER NOT NULL CHECK (price > 0),
      item_picture VARCHAR NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      section_id INTEGER REFERENCES food_section(id),
      extra_id INTEGER REFERENCES food_extra(id)
    )

    CREATE TABLE food_section (
      id SERIAL PRIMARY KEY,
      section_order INTEGER DEFAULT 0,
      section_name VARCHAR(20) NOT NULL,
      section_description VARCHAR(50) DEFAULT ''
      )

    CREATE TABLE food_extra (
      id SERIAL PRIMARY KEY,
      extra_name VARCHAR(20) NOT NULL,
      extra_order INTEGER DEFAULT 0,
      extra_description VARCHAR(50) DEFAULT ''
    )
    
    `);
};

exports.down = (pgm) => {
  pgm.sql(`
  DROP TABLE foods;
  DROP TABLE food_section;
  DROP TABLE food_extra;`);
};
