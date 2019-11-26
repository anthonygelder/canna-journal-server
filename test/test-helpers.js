const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'test-user-1',
        full_name: 'Test user 1',
        nickname: 'TU1',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 2,
        user_name: 'test-user-2',
        full_name: 'Test user 2',
        nickname: 'TU2',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 3,
        user_name: 'test-user-3',
        full_name: 'Test user 3',
        nickname: 'TU3',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 4,
        user_name: 'test-user-4',
        full_name: 'Test user 4',
        nickname: 'TU4',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
    ]
}

function makeEntriesArray(users) {
    return [
        {
            id: 1,
            strain: 'Cool Strain 1',
            farm: 'Farm 1',
            user_id: users[0].id,
            date_created: '2029-01-22T16:28:32.615Z',
            note: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            rating: 1
        },
        {
            id: 2,
            strain: 'Cool Strain 2',
            farm: 'Farm 2',
            user_id: users[1].id,
            date_created: '2029-01-22T16:28:32.615Z',
            note: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            rating: 1
        },
        {
            id: 3,
            strain: 'Cool Strain 3',
            farm: 'Farm 3',
            user_id: users[2].id,
            date_created: '2029-01-22T16:28:32.615Z',
            note: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            rating: 3
        },
        {
            id: 4,
            strain: 'Cool Strain 4',
            farm: 'Farm 4',
            user_id: users[3].id,
            date_created: '2029-01-22T16:28:32.615Z',
            note: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
            rating: 2
        },
    ]
}

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
        users,
        entries
        RESTART IDENTITY CASCADE`
    )
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
        }))
        return db.into('users').insert(preppedUsers)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(
            `SELECT setval('users_id_seq', ?)`,
            [users[users.length - 1].id],
        )
    )
}

function seedEntriesTables(db, users, entries) {
    // use a transaction to group the queries and auto rollback on any failure
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('entries').insert(entries)
        // update the auto sequence to match the forced id values
        await trx.raw(
            `SELECT setval('thingful_things_id_seq', ?)`,
            [entries[entries.length - 1].id],
        )
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ user_id: user.id }, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return `Bearer ${token}`
}





module.exports = {

}