const dotenv = require('dotenv');
const fs = require('fs');
const path  = require('path');

dotenv.config();

const dbFilepath = path.join(__dirname,'databases.json');
let databases = [];

try {
    const data = fs.readFileSync(dbFilepath, 'utf8');
    databases = JSON.parse(data).databases;
} catch (err) {
    console.error('Error loading databases from databases.json:', err);
}

module.exports = {
    port: process.env.PORT || 3100,
    dbConfig: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    databases: databases
};