// /cdp.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const dbMiddleware = require('./middleware/dbmiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const fileRoutes = require('./routes/fileRoutes');
const departmentFolderRoutes= require('./routes/departmentFolderRoutes');

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
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        this.app.use(dbMiddleware);
    }

    routes() {
        this.app.use('/', authRoutes);
        this.app.use('/', userRoutes);
        this.app.use('/', employeeRoutes);
        this.app.use('/', profileRoutes);
        this.app.use('/', fileRoutes);
        this.app.use('/', departmentFolderRoutes);

        // Get databases
        this.app.get('/databases', (req, res) => {
            res.json(config.databases);
        });

        // Get and Display Departments and Detachments
        this.app.get('/departments', async (req, res) => {
            const dbName = req.query.db;

            if (!dbName) return res.status(400).json({ error: 'Database name is required.' });
            if (!req.branchDb) return res.status(400).json({ error: `No branch database connection for ${dbName}` });

            const query = `
            SELECT
                d.dept_code, d.dept_name,
                IFNULL(s.sec_code, 'NA') AS sec_code, IFNULL(s.sec_name, 'NA') AS sec_name
            FROM  fm_dept d
            LEFT JOIN  fm_section s ON d.dept_code = s.dept_code
            WHERE d.active=1
            ORDER BY d.dept_code, s.sec_code
            `;

            try {
                const results = await req.branchDb.query(query);
                res.json(results);
            } catch (err) {
                res.status(500).json({ error: err.message });
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