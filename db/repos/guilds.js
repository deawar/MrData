/**
 * @Author: BanderDragon
 * @Date:   2019-05-06T08:09:56+01:00
 * @Email:  noscere1978@gmail.com
 * @Project: MrData
 * @Filename: guilds.js
 * @Last modified by:   BanderDragon
 * @Last modified time: 2019-05-06T20:54:27+01:00
 */

'use strict';

const sql = require('../sql').guilds;

const cs = {}; // Reusable ColumnSet objects.

/*
 This repository mixes hard-coded and dynamic SQL, primarily to show a diverse example of using both.
 */

class GuildsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;

        // set-up all ColumnSet objects, if needed:
        createColumnsets(pgp);
    }

    // Creates the table
    create() {
        return this.db.none(sql.create);
    }

    exists() {
        return this.db.result(sql.exists, []);
    }

    // Drops the table;
    drop() {
        return this.db.none(sql.drop);
    }

    // Removes all records from the table;
    empty() {
        return this.db.none(sql.empty);
    }

    // Adds a new guild, and returns the new object, and finds it if it exists;
    addOrFind(guildId) {
        return this.add(guildId)
          .then (guild => {
            if (guild == null) {
              return this.findGuildById(guildId);
            }
        })
    }

    // Adds a new guild, and returns the new object or null if it exists
    add(guildId) {
        return this.db.oneOrNone(sql.add, guildId);
    }

    // Tries to delete a user by id, and returns the number of records deleted;
    remove(guildId) {
        return this.db.result('DELETE FROM guilds WHERE guild_id = $1', +guildId, r => r.rowCount);
    }

    // Tries to find a guild from their discord guild id;
    findGuildById(guildId) {
        return this.db.oneOrNone('SELECT * FROM guilds WHERE guild_id = $1', guildId);
    }

    // Returns all user records;
    all() {
        return this.db.any('SELECT * FROM guilds');
    }

    // Returns the total number of guilds;
    total() {
        return this.db.one('SELECT count(*) FROM guilds', [], a => +a.count);
    }
}

//////////////////////////////////////////////////////////
// Example of statically initializing ColumnSet objects:

function createColumnsets(pgp) {
    // create all ColumnSet objects only once:
    if (!cs.insert) {
        // Type TableName is useful when schema isn't default "public" ,
        // otherwise you can just pass in a string for the table name.
        const table = new pgp.helpers.TableName({table: 'guilds', schema: 'public'});

        cs.insert = new pgp.helpers.ColumnSet(['guild_id'], {table});
        cs.update = cs.insert.extend(['?id']);
    }
    return cs;
}

module.exports = GuildsRepository;
