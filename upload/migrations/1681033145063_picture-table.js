/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`CREATE TABLE food_picture (
    id SERIAL PRIMARY KEY,
    item_id INTEGER DEFAULT NULL,
    photo_url VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_activated BOOLEAN DEFAULT FALSE
    )`);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE food_picture`);
};
