CREATE TABLE entries (
    id SERIAL PRIMARY KEY,
    strain TEXT NOT NULL,
    farm TEXT NOT NULL,
    rating INTEGER NOT NULL,
    note TEXT,
    likes INTEGER,
    date_created TIMESTAMP NOT NULL DEFAULT now()
);