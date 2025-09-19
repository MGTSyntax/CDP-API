// // /config/config.js

// const dotenv = require('dotenv');
// const fs = require('fs');
// const path = require('path');

// dotenv.config();

// const dbFilepath = path.join(__dirname, 'databases.json');
// let databases = [];

// try {
//     const data = fs.readFileSync(dbFilepath, 'utf8');
//     databases = JSON.parse(data).databases;
// } catch (err) {
//     console.error('Error loading databases from databases.json:', err);
// }

// module.exports = {
//     port: process.env.PORT || 3100,
//     dbConfig: {
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD
//     },
//     databases: databases,
//     fileMetadataDb: {
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: "file_metadata"
//     }
// };

// // /config/databases.json
// {
//     "databases": [
//         { "label": "MIB 1", "value": "mib1_taguig" },
//         { "label": "MIB 2", "value": "mib2" },
//         { "label": "MIB 3", "value": "mib3" },
//         { "label": "MIB 4", "value": "mib4" },
//         { "label": "MIB SS", "value": "mibss" },
//         { "label": "MIB STC", "value": "mibstc" }
//     ]
// }

// // /controllers.authController.js
// const authService = require('../services/authService');

// exports.login = async (req, res) => {
//     const { database, username, password } = req.body;

//     if (!database || !username || !password) {
//         return res.status(400).json({ error: 'All fields are required.' });
//     }

//     try {
//         const user = await authService.login(req.db, database, username, password);

//         if (user) {
//             res.json({
//                 success: true,
//                 message: 'Login successful',
//                 empNo: user.cdpempno,
//                 userLevel: user.cdpuserlevel
//             });
//         } else {
//             res.status(401).json({ success: false, message: 'Invalid cerdentials' });
//         }
//     } catch (err) {
//         console.error('Login error:', err);
//         res.status(500).json({ success: false, message: 'Server error during login' });
//     } finally {
//         await req.db.close();
//     }
// };

// // controllers/employeeController.js
// const employeeService = require('../services/employeeService');

// exports.getUserInfo = async (req, res) => {
//     const { db, empNo } = req.query;

//     if (!db || !empNo) {
//         return res.status(400).json({ error: 'Database and employee number are required.' });
//     }

//     try {
//         const userInfo = await employeeService.getUserInfo(req.db, db, empNo);

//         if (userInfo) {
//             res.json(userInfo);
//         } else {
//             res.status(404).json({ error: 'User not found.' });
//         }
//     } catch (err) {
//         console.error('Error in getUserInfo:', err.message);
//         res.status(500).json({ error: err.message });
//     } finally {
//         await req.db.close();
//     }
// };

// exports.getEmployees = async (req, res) => {
//     const dbName = req.query.db;

//     if (!dbName) {
//         return res.status(400).json({ error: 'Database name is required.' });
//     }

//     try {
//         const employees = await employeeService.getEmployees(req.db, dbName);
//         res.json(employees);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     } finally {
//         await req.db.close();
//     }
// };

// // /controllers/profileController.js
// const { getEmployeeProfile } = require('../services/profileService');

// const fetchEmployeeProfile = async (req, res) => {
//     const { db: database, empNo } = req.query;

//     if (!database || !empNo) {
//         return res.status(400).json({ error: 'Database and employee number are required.' });
//     }

//     try {
//         const profile = await getEmployeeProfile(req.db, database, empNo);

//         if (!profile || Object.keys(profile).length === 0) {
//             return res.status(400).json({ error: 'No profile found'});
//         }

//         res.json(profile);
//     } catch (err) {
//         console.error('Error in fetchEmployeeProfile:', err.message);
//         res.status(500).json({ error: 'Failed to fetch employee profile.'});
//     } finally {
//         try {
//             await req.db.close();
//         } catch (closeErr) {
//             console.warn('Failed to close DB connection:', closeErr.message);
//         }
//     }
// };

// module.exports = { fetchEmployeeProfile };

// // /middleware/dbmiddleware.js
// const db = require('../models/database');
// const conf = require('../config/config');

// const dbMiddleware = (req, res, next) => {
//     const dbName = req.body.database || req.query.db || conf.dbConfig.database;
//     if (!dbName && req.path !== '/databases') {
//         return res.status(400).json({ error: 'Database not specified.' });
//     }
//     req.db = new db({
//         host: conf.dbConfig.host,
//         user: conf.dbConfig.user,
//         password: conf.dbConfig.password,
//         database: dbName
//     });

//     next();
// };

// module.exports = dbMiddleware;

// // /middleware/multerConfig.js
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Storage Engine
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const department = req.body.department || "general";
//         const uploadPath = path.join(__dirname, '../uploads', department);

//         // Create department folder if not exists
//         if (!fs.existsSync(uploadPath)) {
//             fs.mkdir(uploadPath, { recursive: true });
//         }
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         const basename = path.basename(file.originalname, ext);
//         cb(null, `${basename}-${uniqueSuffix}${ext}`);
//     }
// });

// // File filter
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg'];
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (allowedTypes.includes(ext)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type'), false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 30 * 1024 * 1024 }
// });

// module.exports = upload;

// // /models/database.js
// const mysql = require('mysql2');

// class Database {
//     constructor(config) {
//         this.config = config;
//         this.pool= mysql.createPool(config);
//     }

//     query(sql, args) {
//         return new Promise((resolve, reject) => {
//             this.pool.query(sql,args, (err, results) => {
//                 if (err) {
//                     console.error('Database query error:', err);
//                     return reject(err);
//                 }
//                 resolve(results);
//             });
//         });
//     }

//     close () {
//         return new Promise((resolve, reject) => {
//             this.pool.end(err => {
//                 if (err) {
//                     console.error('Database connection close error:', err);
//                     return reject(err);
//                 }
//                 resolve();
//             });
//         });
//     }
// }

// module.exports = Database;

// // /models/fileMetadataDb.js
// const Database = require('./database');
// const { fileMetadataDb } = require('../config/config');

// const fileDb = new Database(fileMetadataDb);

// module.exports = fileDb;

// // /routes/authRoutes.js
// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// router.post('/login', authController.login);

// module.exports = router;

// // /routes/employeeRoutes.js
// const express = require('express');
// const router = express.Router();
// const employeeController = require('../controllers/employeeController');

// router.get('/user-info', employeeController.getUserInfo);
// router.get('/employees', employeeController.getEmployees);

// module.exports = router;

// // /routes/fileRoutes.js
// const express = require('express');
// const router = express.Router();
// const upload = require('../middleware/multerConfig');
// const path = require('path');
// const fs = require("fs");
// const fileDb = require('../models/fileMetadataDb');

// // POST /upload
// router.post('/upload', (req, res) => {
//     upload.single('document')(req, res, async (err) => {
//         if (err) {
//             console.error('Multer error:', err);
//             return res.status(400).json({ error: err.message || 'Upload error' });
//         }

//         const file = req.file;
//         const department = req.body.department || 'general';
//         // const databaseName = req.user?.database || "unknown";
//         const uploadedBy = req.user?.username || "system";

//         if (!file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }

//         // Insert metadata to centralized DB
//         try {
//             await fileDb.query(
//                 `
//                 INSERT INTO uploaded_files (filename, path, department, uploaded_by, database_name)
//                 VALUES (?, ?, ?, ?, ?)
//                 `,
//                 [file.filename, `/uploads/${department}/${file.filename}`, department, uploadedBy, "file_metadata"]
//             );

//             res.status(200).json({
//                 message: 'File uploaded successfully',
//                 filename: file.filename,
//                 path: `/uploads/${department}/${file.filename}`
//             });
//         } catch (dbErr) {
//             console.error("DB insert error:", dbErr);
//             res.status(500).json({ error: "Failed to save metadata" });
//         }
//     });
// });

// // GET /documents/:department
// router.get("/documents/:department", async (req, res) => {
//     const { department } = req.params;

//     try {
//         const results = await fileDb.query(
//             "SELECT id, filename, path, department, uploaded_by, database_name, upload_date FROM uploaded_files WHERE department = ? ORDER BY upload_date DESC",
//             [department]
//         );

//         res.json(results);
//     } catch(err) {
//         console.error("DB fetch error:", err);
//         res.status(500).json({ error: "Failed to fetch documents" });
//     }
// });

// // DELETE /uploads/:department/:filename
// router.delete("/uploads/:department/:filename", async (req, res) => {
//     const { department, filename } = req.params;
//     const filePath = path.join(__dirname, "../uploads", department, filename);

//     try {
//         fs.unlinkSync(filePath);

//         await fileDb.query(
//             `DELETE FROM uploaded_files WHERE filename = ? AND department = ?`,
//             [filename, department]
//         );

//         res.json({ message: "File deleted successfully" });
//     } catch (err) {
//         console.error("Delete error:", err);
//         res.status(500).json({ error: "Failed to delete file" });
//     }
// });

// module.exports = router;

// // /routes/profileRoutes.js
// const express = require('express');
// const router = express.Router();
// const { fetchEmployeeProfile } = require('../controllers/profileController');

// router.get('/employee-profile', fetchEmployeeProfile);

// module.exports = router;

// // /services/authService.js
// exports.login = async (dbConfig, database, username, password) => {
//     const query = `
//     SELECT * FROM ${database}.cdpusers WHERE cdpempno = ? AND cdppassword = ?
//     `;

//     const results = await dbConfig.query(query, [username, password]);
//     return results.length > 0 ? results[0] : null;
// };

// // /services/employeeService.js
// exports.getUserInfo = async (db, database, empNo) => {
//     const query = `
//             SELECT ji_empNo, ji_fname, ji_lname, ji_mname, ji_extname
//             FROM \`${database}\`.trans_basicinfo
//             WHERE ji_empNo = ?
//             `;

//     const results = await db.query(query, [empNo]);

//     if (results.length > 0) {
//         const user = results[0];
//         return {
//             empNo: user.ji_empNo,
//             firstName: user.ji_fname,
//             lastName: user.ji_lname,
//             middleName: user.ji_mname,
//             extName: user.ji_extname
//         };
//     } else {
//         return null;
//     }
// };

// exports.getEmployees = async (db, database) => {
//     const query = `
//             SELECT
//                 a.ji_empNo, a.ji_lname, a.ji_fname, a.ji_mname, a.ji_extname,
//                 b.email_add
//             FROM
//                 \`${database}\`.trans_basicinfo a
//             INNER JOIN
//                 \`${database}\`.trans_emailadd b ON a.ji_empNo = b.ji_empNo
//             ORDER BY a.ji_lname
//             `;

//     const [results] = await db.query(query);
//     return results;
// };

// // /services/profileService.js
// async function getEmployeeProfile(db, database, empNo) {
//     const queries = [
//         ['basicInfo', `SELECT * FROM \`${database}\`.trans_basicinfo WHERE ji_empNo = ?`],
//         ['personalInfo', `SELECT * FROM \`${database}\`.trans_persinfo WHERE ji_empNo = ?`],
//         ['educInfo', `SELECT * FROM \`${database}\`.trans_educ WHERE ji_empNo = ?`],
//         ['jobInfo', `SELECT * FROM \`${database}\`.trans_jobinfo WHERE ji_empNo = ?`],
//         ['emailaddInfo', `SELECT * FROM \`${database}\`.trans_emailadd WHERE ji_empno = ?`],
//         ['emergencyInfo', `SELECT * FROM \`${database}\`.trans_emergency WHERE ji_empNo = ?`],
//         ['familyInfo', `SELECT * FROM \`${database}\`.trans_family WHERE ji_empNo = ?`],
//         ['pempInfo', `SELECT * FROM \`${database}\`.trans_pemp WHERE ji_empNo = ?`],
//         ['disciplinaryInfo', `SELECT * FROM \`${database}\`.trans_disciplinary WHERE da_empno = ?`],
//         ['compensationInfo', `SELECT * FROM \`${database}\`.trans_compensation WHERE ji_empNo = ?`],
//     ];

//     const result = {};

//     for (const [key, sql] of queries) {
//         try {
//             const rows = await db.query(sql, [empNo]);
//             result[key] = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
//         } catch (error) {
//             console.error(`Error fetching ${key}:`. error.message);
//             result[key] = null;
//         }
//     }

//     return result;
// }

// module.exports = { getEmployeeProfile };

// // /uploads/AnL
// // /uploads/Finance
// // /uploads/HR
// // /uploads/IT
// // /uploads/Legal
// // /uploads/Operations

// // /.env
// PORT=3100
// DB_HOST=localhost
// DB_USER=root
// DB_PASSWORD=M1B@DMIN2015!

// // /cdp.js
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const config = require('./config/config');
// const dbMiddleware = require('./middleware/dbmiddleware');

// const authRoutes = require('./routes/authRoutes');
// const employeeRoutes = require('./routes/employeeRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const fileRoutes = require('./routes/fileRoutes');

// class App {
//     constructor() {
//         this.app = express();
//         this.port = config.port;

//         this.middlewares();
//         this.routes();
//     }

//     middlewares() {
//         this.app.use(cors());
//         this.app.use(express.json());
//         this.app.use(express.urlencoded({ extended: true }));
//         this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//         this.app.use(dbMiddleware);
//     }

//     routes() {
//         this.app.use('/', authRoutes);
//         this.app.use('/', employeeRoutes);
//         this.app.use('/', profileRoutes);
//         this.app.use('/', fileRoutes);

//         // Get databases
//         this.app.get('/databases', (req, res) => {
//             res.json(config.databases);
//         });

//         // Get and Display Departments and Detachments
//         this.app.get('/departments', async (req, res) => {
//             const dbName = req.query.db;

//             if (!dbName) {
//                 return res.status(400).json({ error: 'Database name is required.' });
//             }

//             const query = `
//             SELECT
//                 d.dept_code, d.dept_name,
//                 IFNULL(s.sec_code, 'NA') AS sec_code, IFNULL(s.sec_name, 'NA') AS sec_name
//             FROM 
//                 ${dbName}.fm_dept d
//             LEFT JOIN 
//                 ${dbName}.fm_section s ON d.dept_code = s.dept_code
//             WHERE
//                 d.active=1
//             ORDER BY d.dept_code, s.sec_code
//             `;

//             try {
//                 const results = await req.db.query(query);
//                 res.json(results);
//             } catch (err) {
//                 res.status(500).json({ error: err.message });
//             } finally {
//                 await req.db.close();
//             }
//         });
//     }

//     // Start the app - node cdp.js
//     start() {
//         this.app.listen(this.port, () => {
//             console.log(`Server is running on http://localhost:${this.port}/`);
//         });
//     }
// }

// const app = new App();
// app.start();