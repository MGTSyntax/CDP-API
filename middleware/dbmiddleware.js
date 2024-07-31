const db = require('../database');
const conf = require('../config/config');

const dbMiddleware = (req, res, next) => {
    const dbName = req.query.db || conf.dbConfig.database;
    req.db = new db({
        host: conf.dbConfig.host,
        user: conf.dbConfig.user,
        password: conf.dbConfig.password,
        database: dbName
    });
    next();
};

module.exports = dbMiddleware;