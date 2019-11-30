const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Entries endpoint', function() {
  let db

  const {
    testUsers,
    testEntries
  } = helpers.makeEntriesFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/entries`, () => {
    context(`Given no entries`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/entries')
          expect(200, [])
      })
    })

    context(`Given there are entries in the database`, () => {
      beforeEach(`insert entries`, () => {
        helpers.seedEntriesTables(
          db,
          testUsers,
          testEntries
        )
      })

      it(`responds with 200 and all entries`, () => {
        const expectedEntries = testEntries.map(entry =>
          helpers.makeExpectedEntry(
            testUsers,
            entry
          ))
          return supertest(app)
            .get('/api/entries')
            .expect(200, expectedEntries)
      })
    })
  })

  describe(`GET /api/entries/:entry_id`, () => {
    context(`Given no entries`, () => {
      it(`responds with 404`, () => {
        const entryId = 12345
        return supertest(app)
          .get(`/api/entries/${entryId}`)
          .expect(404, { error: `Entry doesn't exist` })
      })
    })

    context('Given there are entries in the database', () => {
      beforeEach(`insert entries`, () => {
        helpers.seedEntriesTables(
          db,
          testUsers,
          testEntries
        )
      })

      it(`responds with 200 and the specified entry`, () => {
        const entryId = 2
        const expectedEntry = helpers.makeExpectedEntry(
          testUsers,
          testEntries[entryId - 1]
        )

        return supertest(app)
          .get(`/api/entries/${entryId}`)
          .expect(200, expectedEntry)
      })
    })
  })

  describe.only(`POST /api/entries`, () => {
    context('insert new entry into db', () => {

      beforeEach(`insert entries`, () => {
        helpers.seedEntriesTables(
          db,
          testUsers,
          testEntries
          )
        })
        
        it(`creates an entry, responds with 201 and the new entry`, function() {
          const newEntry = {
            strain: "Strain 2",
            farm: "Cool Farm 2",
            rating: 2,
            note: "note note",
          }
          return supertest(app)
          .post('/api/entries')
          .send(newEntry)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.strain).to.eql(newComment.strain)
            expect(res.body.farm).to.eql(newComment.farm)
          })
        })
      })
    })
})