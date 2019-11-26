CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    strain TEXT NOT NULL,
    farm TEXT NOT NULL,
    rating INTEGER NOT NULL,
    note TEXT,
    date_created TIMESTAMP NOT NULL DEFAULT now()
);

