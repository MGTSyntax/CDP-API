// /models/database.js
const mysql = require('mysql2');

class Database {
    constructor(config) {
        this.config = config;
        this.pool= mysql.createPool(config);
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql,args, (err, results) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    close () {
        return new Promise((resolve, reject) => {
            this.pool.end(err => {
                if (err) {
                    console.error('Database connection close error:', err);
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

module.exports = Database;