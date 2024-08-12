const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const dbMiddleware = require('./middleware/dbmiddleware');

class App {
    constructor() {
        this.app = express();
        this.port = config.port;

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(dbMiddleware);
    }

    routes() {
        this.app.get('/databases', (req, res) => {
            res.json(config.databases);
        });

        this.app.get('/departments', async (req, res) => {
            const dbName = req.query.db;
            if (!dbName) {
                return res.status(400).json({ error: 'Database name is required.' });
            }

            const query = `
            SELECT
                d.dept_code, d.dept_name,
                s.sec_code, s.sec_name
            FROM 
                ${dbName}.fm_dept d
            LEFT JOIN 
                ${dbName}.fm_section s ON d.dept_code = s.dept_code
            WHERE
                d.active=1
            `;

            try {
                const results = await req.db.query(query);
                res.json(results);
            } catch (err) {
                res.status(500).json({ error: err.message });
            } finally {
                await req.db.close();
            }
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}/departments`);
        });
    }
}

const app = new App();
app.start();