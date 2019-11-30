


const EntriesService = {
    getAllEntries(db) {
        console.log('DB', db)
        return db
            .from('entries')
            .select('*')
    },

    getById(db, entry_id) {
        return EntriesService.getAllEntries(db)
            .where('id', entry_id)
            .first()
    },

    insertEntry(db, newEntry) {
        return db
            .insert(newEntry)
            .into('entries')
            .returning('*')
            .then(([entry]) => entry)
            .then(entry =>
                EntriesService.getById(db, entry.id))
    },

    deleteEntry(db, id) {
        return db('entries')
            .where({ id })
            .delete()
    },

    update(db, id, newEntryFields) {
        return db('entries')
            .where({ id })
            .update(newEntryFields)
    }
}



module.exports = EntriesService