const express = require('express')
const path = require('path')
const EntriesService = require('./entries-service')
const entriesRouter = express.Router()
const jsonBodyParser = express.json()


entriesRouter
    .route('/')
    .get((req, res, next) => {
        EntriesService.getAllEntries(req.app.get('db'))
        .then(entries => {
            res.json(entries)
        })
        .catch(next)
})

entriesRouter
    .route('/:entry_id')
    .all(checkEntryExists)
    .get((req, res, next) => { 
        res.json(res.entry)
    })
    .delete((req, res, next) => {
        EntriesService.deleteEntry(
            req.app.get('db'),
            req.params.entry_id
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { strain, farm, rating, note } = req.body
        const entryToUpdate = { strain, farm, rating, note }
        const numberOfValues = Object.values(entryToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                message: `Request body must contain either 'note_name', 'content'`
                }
            })
        
            EntriesService.updateEntry(
            req.app.get('db'),
            req.params.entry_id,
            entryToUpdate
            )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })

entriesRouter
    .route('/')
    .post(jsonBodyParser, (req, res, next) => {
        const newEntry = req.body

        for (const [key, value] of Object.entries(newEntry))
        if (value == null)
            return res.status(400).json({
                error: `Missing '${key}' in request body`
            })

        EntriesService.insertEntry(
            req.app.get('db'),
            newEntry
        )
        .then(entry => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${entry.id}`))
                .json(entry)
        })
        .catch(next)
    })

async function checkEntryExists(req, res, next) {
    try {
        const entry = await EntriesService.getById(
        req.app.get('db'),
        req.params.entry_id
        )
    
        if (!entry)
        return res.status(404).json({
            error: `Entry doesn't exist`
        })
    
        res.entry = entry
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = entriesRouter