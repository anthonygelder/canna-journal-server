BEGIN;

TRUNCATE
    entries,
    users
    RESTART IDENTITY CASCADE;

INSERT INTO users (user_name, full_name, password)
VALUES
    ('dunder', 'Dunder Mifflin', '$2a$12$HYdQZ7.h.I2NNOsvOlK2EeRVeIgCeqYNYZK.jh3R4YhnUbvkp8rqG'),
    ('b.deboop', 'Bodeep Deboop', '$2a$12$4Km.6gaMo7slBdw7m2Tf/exSy0KgtosAVEd7rEXTuwWK09mPyww9y'),
    ('c.bloggs', 'Charlie Bloggs', '$2a$12$E37PVZ1yoZVbb6Qlmc3Lc.5UPcRKkUwBSFGrhRS68j2CoGk75io9C'),
    ('s.smith', 'Sam Smith', '$2a$12$bVYimdw4HHGWF7O7GTRUEOtcg5e45MKYNnuuVNopg4vgBSi8IHQ3e'),
    ('lexlor', 'Alex Taylor', '$2a$12$YgkIqB4IjmcjyWQa.ETetuV88R9JYop89k5kbXg2O/4dIP6R6Lo.W'),
    ('wippy', 'Ping Won In', '$2a$12$n4UKL.1cqepQcFunBk0vdeF061TkVmSiOSix7jCYHITI49dq6t2eO');

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