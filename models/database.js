// /models/database.js
const mysql = require('mysql2');

class Database {
    constructor(config) {
        this.config = config;
        this.pool= mysql.createPool({
            ...config,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    query(sql, args = []) {
        return new Promise((resolve, reject) => {
            this.pool.query(sql, args, (err, results) => {
                if (err) {
                    console.error(`Database query error [${this.config.database}]:`, err);
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
                    console.error(`Database connection close error [${this.config.database}]:`, err);
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

module.exports = Database;