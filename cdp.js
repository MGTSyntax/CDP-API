const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const dbMiddleware = require('./middleware/dbmiddleware');
const res = require('express/lib/response');

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
        // Login API
        this.app.post('/login', async (req, res) => {
            const { database, username, password } = req.body;

            if (!database || !username || !password) {
                return res.status(400).json({ error: 'Database, username, and password are required.'});
            }
            const query = `
            SELECT * FROM ${database}.cdpusers WHERE cdpempno = ? AND cdppassword = ?
            `;

            try {
                const results = await req.db.query(query, [username, password]);

                if (results.length > 0) {
                    
                    res.json({ success: true, message: 'Login successful' });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid cerdentials' });
                }
            } catch (err) {
                res.status(500).json({ error: err.message });
            } finally {
                await req.db.close();
            }
        });

        // Get Databases
        this.app.get('/databases', (req, res) => {
            res.json(config.databases);
        });

        // Get and Display Departments and Detachments
        this.app.get('/departments', async (req, res) => {
            const dbName = req.query.db;
            if (!dbName) {
                return res.status(400).json({ error: 'Database name is required.' });
            }

            const query = `
            SELECT
                d.dept_code, d.dept_name,
                IFNULL(s.sec_code, 'NA') AS sec_code, IFNULL(s.sec_name, 'NA') AS sec_name
            FROM 
                ${dbName}.fm_dept d
            LEFT JOIN 
                ${dbName}.fm_section s ON d.dept_code = s.dept_code
            WHERE
                d.active=1
            ORDER BY d.dept_code, s.sec_code
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

        // Get and Display Employees
        this.app.get('/employees', async (req, res) => {
            const dbName = req.query.db;
            if (!dbName) {
                return res.status(400).json({ error: 'Database name is required.' });
            }
            const query = `
            SELECT
                a.ji_empNo, a.ji_lname, a.ji_fname, a.ji_mname, a.ji_extname,
                b.email_add
            FROM
                ${dbName}.trans_basicinfo a
            INNER JOIN
                ${dbName}.trans_emailadd b ON a.ji_empNo = b.ji_empNo
            ORDER BY a.ji_lname
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

    // Start the app - node cdp.js
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}/`);
        });
    }
}

const app = new App();
app.start();