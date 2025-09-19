// /models/fileMetadataDb.js
const Database = require('./database');
const { fileMetadataDb } = require('../config/config');

const fileDb = new Database(fileMetadataDb);

module.exports = fileDb;