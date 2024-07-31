const express = require('express');
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
        this.app.use(express.json());
        this.app.use(dbMiddleware);
    }

    routes() {
        this.app.get('/departments', async (req, res) => {
            const query = `
            SELECT
                d.dept_code AS 'Client Code', d.dept_name AS 'Client Name', if(d.active=1, 'Active', 'Inactive') AS 'Status',
                s.sec_code AS 'Detachment Code', s.sec_name AS 'Detachment Name'
            FROM 
                fm_dept d
            LEFT JOIN 
                fm_section s ON d.dept_code = s.dept_code
            `;

            try {
                const results = await req.db.query(query);
                res.json(results);
            } catch (err) {
                res.status(500).json({ error: err.message });
            } finally {

            }
        });
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

const app = new App();
app.start();