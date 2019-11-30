CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_name TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    date_created TIMESTAMP NOT NULL DEFAULT now()
);

ALTER TABLE entries
    ADD COLUMN
        user_id INTEGER REFERENCES users(id)
        ON DELETE SET NULL;