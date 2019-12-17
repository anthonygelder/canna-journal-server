const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'test-user-1',
        full_name: 'Test user 1',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 2,
        user_name: 'test-user-2',
        full_name: 'Test user 2',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 3,
        user_name: 'test-user-3',
        full_name: 'Test user 3',
        password: 'password',
        date_created: '2029-01-22T16:28:32.615Z',
      },
      {
        id: 4,
        user_name: 'test-user-4',
        full_name: 'Test user 4',
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
            date_created: new Date('2029-01-22T16:28:32.615Z'),
            note: 'Molestiae, libero esse hic adipisci autem neque ?',
            likes: 2,
            rating: 1
        },
        {
            id: 2,
            strain: 'Cool Strain 2',
            farm: 'Farm 2',
            user_id: users[1].id,
            date_created: new Date('2029-01-22T16:28:32.615Z'),
            note: 'Molestiae, libero esse hic adipisci autem neque ?',
            likes: 2,
            rating: 1
        },
        {
            id: 3,
            strain: 'Cool Strain 3',
            farm: 'Farm 3',
            user_id: users[2].id,
            date_created: new Date('2029-01-22T16:28:32.615Z'),
            note: 'Molestiae, libero esse hic adipisci autem neque ?',
            likes: 2,
            rating: 3
        },
        {
            id: 4,
            strain: 'Cool Strain 4',
            farm: 'Farm 4',
            user_id: users[3].id,
            date_created: new Date('2029-01-22T16:28:32.615Z'),
            note: 'Molestiae, libero esse hic adipisci autem neque ?',
            likes: 2,
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

function makeExpectedEntry(users, entry) {
    return {
        id: entry.id,
        strain: entry.strain,
        farm: entry.farm,
        rating: entry.rating,
        note: entry.note,
        date_created: '2029-01-22T16:28:32.615Z',
        likes: entry.likes,
        user_id: entry.user_id
    }
}

function makeEntriesFixtures() {
    const testUsers = makeUsersArray()
    const testEntries = makeEntriesArray(testUsers)
    return { testUsers, testEntries }
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
    makeUsersArray,
    makeEntriesArray,
    cleanTables,
    makeExpectedEntry,
    makeEntriesFixtures,
    seedUsers,
    seedEntriesTables,
    
}