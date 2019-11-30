


const EntriesService = {
    getAllEntries(db) {
        console.log('DB', db)
        return db
            .from('entries')
            .select('*')
    },

    getById(db, entry_id) {
        return EntriesService.getAllEntries(db)
            .where('thg.id', entry_id)
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
    }
}



module.exports = EntriesService