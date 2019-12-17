const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Entries endpoint', function() {
  let db

  const {
    testUsers,
    testEntries
  } = helpers.makeEntriesFixtures()  

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  // afterEach('cleanup', () => helpers.cleanTables(db))

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

    context(`Given there are entries in the database`, () => {
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

  describe(`POST /api/entries`, () => {
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
            "id": 9999999,
            "strain": "Strain 2",
            "farm": "Cool Farm 2",
            "rating": 2,
            "note": "note note",
          }
          return supertest(app)
          .post('/api/entries')
          .send(newEntry)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.strain).to.eql(newEntry.strain)
            expect(res.body.farm).to.eql(newEntry.farm)
          })
        })
      })
  })

  describe(`DELETE /api/entries/:entry_id`, () => {
    context('Given there are entries in the database', () => {
    beforeEach(`insert entries`, () => {
      helpers.seedEntriesTables(
        db,
        testUsers,
        testEntries
      )
    })

    it('responds with 204 and removes the entry', () => {
      const idToRemove = 2
      // const expectedEntries = testEntries.filter(entry => entry.id !== idToRemove)
      return supertest(app)
          .delete(`/api/entries/${idToRemove}`)
          .expect(204)
      })
    })
  })

  describe(`PATCH /api/entries/:entry_id`, () => {
    context('Given there are entries in the database', () => {
    beforeEach(`insert entries`, () => {
      helpers.seedEntriesTables(
        db,
        testUsers,
        testEntries
      )
    })

    it('responds with 204 and updates the entry', () => {
      const idToUpdate = 1
      const updateEntry = {
        "strain": "update",
        "farm": "update",
        "rating": 1,
        "note": "update",
      }
      // const expectedEntry = {
      //   ...testEntries[idToUpdate - 1],
      //   ...updateEntry
      // }
      return supertest(app)
          .patch(`/api/entries/${idToUpdate}`)
          .send(updateEntry)
          .expect(204)
      })
    })
  })
})