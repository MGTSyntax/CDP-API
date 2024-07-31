const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    port: process.env.PORT || 3100,
    dbConfig: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
};