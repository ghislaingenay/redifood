/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  `CREATE TABLE food_picture (
    id SERIAL PRIMARY KEY,
    item_id INTEGER NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_activated BOOLEAN DEFAULT TRUE,
    `;
};

exports.down = (pgm) => {
  `DROP TABLE food_picture`;
};
