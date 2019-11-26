BEGIN;

TRUNCATE
    entries,
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, full_name, password)
VALUES
    ('dunder', 'Dunder Mifflin', 'password'),
    ('b.deboop', 'Bodeep Deboop', 'password'),
    ('c.bloggs', 'Charlie Bloggs', 'password'),
    ('s.smith', 'Sam Smith', 'password'),
    ('lexlor', 'Alex Taylor', 'password'),
    ('wippy', 'Ping Won In', 'password');

INSERT INTO entries (strain, farm, rating, user_id)
VALUES
    ('Strain 1', 'Cool Farm 1', 1, 1),
    ('Strain 2', 'Cool Farm 2', 2, 1),
    ('Strain 3', 'Cool Farm 3', 2, 1),
    ('Strain 4', 'Cool Farm 4', 3, 1),
    ('Strain 5', 'Cool Farm 5', 1, 1),
    ('Strain 6', 'Cool Farm 6', 3, 1),
    ('Strain 7', 'Cool Farm 7', 1, 1),
    ('Strain 8', 'Cool Farm 8', 3, 1),
    ('Strain 9', 'Cool Farm 9', 2, 1),
    ('Strain 10', 'Cool Farm 10', 1, 1);

COMMIT;