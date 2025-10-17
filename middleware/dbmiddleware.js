// /middleware/dbmiddleware.js
const Database = require('../models/database');
const config = require('../config/config');

const poolCache = {};

function getOrCreatePool(dbConfig) {
    const key = dbConfig.database || 'file_metadata';
    if (!poolCache[key]) {
        poolCache[key] = new Database(dbConfig);
    }
    return poolCache[key];
}

const dbMiddleware = (req, res, next) => {
    // always connect to file_metadata
    req.mainDb = getOrCreatePool(config.fileMetadataDb);

    // optional: detect branch DB (if passed in query/body)
    const branchDbName =
        req.query.db ||
        req.query.dbName ||
        req.body.db ||
        req.body.dbName ||
        req.body.database;

    // attach branch DB pool if specified
    if (branchDbName) {
        req.branchDb = getOrCreatePool(config.getBranchConfig(branchDbName));
    } else {
        req.branchDb = null;
    }

    next();
};

module.exports = dbMiddleware;