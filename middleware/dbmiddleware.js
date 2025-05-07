const db = require('../models/database');
const conf = require('../config/config');

const dbMiddleware = (req, res, next) => {
    const dbName = req.body.database || req.query.db || conf.dbConfig.database;

    console.log('Connecting to DB:', dbName);

    if (!dbName && req.path !== '/databases'){
        return res.status(400).json({ error: 'Database not specified.' });
    }

    req.db = new db({
        host: conf.dbConfig.host,
        user: conf.dbConfig.user,
        password: conf.dbConfig.password,
        database: dbName
    });
    next();
};

module.exports = dbMiddleware;