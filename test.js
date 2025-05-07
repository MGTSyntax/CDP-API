// // CDP-API Folder
// // cdp.js
// const express = require('express');
// const cors = require('cors');
// const config = require('./config/config');
// const dbMiddleware = require('./middleware/dbmiddleware');
// const res = require('express/lib/response');

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
//         this.app.use(dbMiddleware);
//     }

//     routes() {

//         // Get Databases
//         this.app.get('/databases', (req, res) => {
//             res.json(config.databases);
//         });

//         // Login API
//         this.app.post('/login', async (req, res) => {
//             const { database, username, password } = req.body;

//             if (!database || !username || !password) {
//                 return res.status(400).json({ error: 'Database, username, and password are required.' });
//             }
//             const query = `
//             SELECT * FROM ${database}.cdpusers WHERE cdpempno = ? AND cdppassword = ?
//             `;

//             try {
//                 const results = await req.db.query(query, [username, password]);

//                 if (results.length > 0) {
//                     const user = results[0];
//                     res.json({ success: true, message: 'Login successful', empNo: user.cdpempno });
//                 } else {
//                     res.status(401).json({ success: false, message: 'Invalid cerdentials' });
//                 }
//             } catch (err) {
//                 res.status(500).json({ error: err.message });
//             } finally {
//                 await req.db.close();
//             }
//         });

//         this.app.get('/user-info', async (req, res) => {
//             const { db, empNo } = req.query;

//             // 👇 Log what the backend is receiving
//             console.log("Received in /user-info:", req.query);

//             if (!db || !empNo) {
//                 return res.status(400).json({ error: 'Database and employee number are required.' });
//             }

//             console.log("Fetching user info for:", { db, empNo });

//             const query = `
//             SELECT 
//                 ji_empNo, ji_fname, ji_lname, ji_mname, ji_extname
//             FROM 
//                 \`${db}\`.trans_basicinfo
//             WHERE
//                 ji_empNo = ?
//             `;

//             try {
//                 const results = await req.db.query(query, [empNo]);

//                 if (results.length > 0) {
//                     const user = results[0];
//                     res.json({
//                         empNo: user.ji_empNo,
//                         firstName: user.ji_fname,
//                         lastName: user.ji_lname,
//                         middleName: user.ji_mname,
//                         extName: user.ji_extname
//                     });
//                 } else {
//                     res.status(404).json({ error: 'User not found.' });
//                 }
//             } catch (error) {
//                 res.status(500).json({ error: error.message });
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


// // CDP-UI Folder
// // api.js
// // Centralized API Handling
// const API_BASE_URL = 'http://localhost:3100';

// // Fetch Databases
// export async function getDatabases() {
//     try {
//         const response = await fetch(`${API_BASE_URL}/databases`);
//         if (!response.ok) throw new Error('Failed to fetch databases');
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching databases:', error);
//         return [];
//     }
// }

// // Perform Login Request
// export async function loginUser(database, username, password) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/login`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ database, username, password }),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.message || 'Login failed');
//         }
//         return await response.json(); // Token or success response
//     } catch (error) {
//         console.error('Error during login:', error);
//         throw error;
//     }
// }

// // Get User Info by Employee No.
// export async function getUserInfo(db, empNo) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/user-info?database=${db}&empNo=${empNo}`);
//         console.log("Fetching user info from:", response);
//         if (!response.ok) throw new Error('Failed to fetch user info');
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching user info:', error);
//         return null;
//     }
// }

// // Logout API (if needed in the future)
// export async function logout() {
//     try {
//         await fetch(`${API_BASE_URL}/logout`, {
//             method: 'POST',
//         });
//         console.log('Logout successfully');
//     } catch (error) {
//         console.error('Logout failed:', error);
//     }
// }

// // CDP-UI Folder
// // auth.js - Handles login form logic
// import { getDatabases, loginUser, getUserInfo } from './api.js';

// document.addEventListener('DOMContentLoaded', async () => {
//     const loginForm = document.querySelector("#loginForm");
//     const dbSelect = document.querySelector("#database");

//     // Populate databases into the select dropdown
//     async function populateDatabases() {
//         const databases = await getDatabases();
//         if (dbSelect) {
//             databases.forEach(db => {
//                 const option = new Option(db.label, db.value);
//                 dbSelect.appendChild(option);
//             });
//         }
//     }
//     // Call populateDatabases when the page loads
//     await populateDatabases();

//     // Handle login form submission
//     loginForm.addEventListener("submit", async (e) => {
//         e.preventDefault();

//         const database = dbSelect.value;
//         const username = document.querySelector("#username").value.trim();
//         const password = document.querySelector("#password").value.trim();

//         if (!database || !username || !password) {
//             alert('All fields are required.');
//             return;
//         }

//         try {
//             // Call API to Login User
//             const result = await loginUser(database, username, password);
//             console.log("Login result:", result);

//             if (result.success) {
//                 console.log("Calling getUserInfo with:", database, result.empNo);
//                 const userInfo = await getUserInfo(database, result.empNo);
//                 if (userInfo) {
//                     localStorage.setItem('userInfo', JSON.stringify({
//                         database,
//                         empNo: userInfo.empNo,
//                         firstName: userInfo.firstName,
//                         lastName: userInfo.lastName,
//                     }));

//                     alert('Login successful.');
//                     window.location.href = '/pages/profile.html';
//                 } else {
//                     alert('Oh no!');
//                 }
//             } else {
//                 alert('Invalid credentials. Please try again.');
//             }
//         } catch (error) {
//             alert('Login failed: ' + error.message);
//         }
//     });
// });

// // CDP-UI Folder
// // profile.js - Loads user info and shows in the navbar

// document.addEventListener('DOMContentLoaded', () => {
//     const welcomeMessage = document.querySelector('#welcomeMessage');

//     const userInfo = JSON.parse(localStorage.getItem('userInfo'));

//     if (!userInfo) {
//         console.error("No user data found in local storage.");
//         return;
//     }

//     console.log("Stored user data:", userInfo);

//     if (userInfo && userInfo.firstName) {
//         welcomeMessage.textContent = `Hi ${userInfo.firstName}!`;
//     } else {
//         welcomeMessage.textContent = 'Dashboard';
//     }
// });

// // Logout Functionality
// document.querySelector('#logoutBtn').addEventListener('click', () => {
//     localStorage.removeItem('userInfo');
//     window.location.href = '/pages/login.html';
// });

// // CDP-UI Folder
// // login.html
// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>CDP - Login</title>
//     <link rel="stylesheet" href="/assets/css/styles.css">
// </head>

// <body>
//     <div class="login-container">
//         <h2>Login</h2>
//         <form id="loginForm">
//             <label for="database">Select Company:</label>
//             <select id="database" name="database" required></select>

//             <label for="username">Employee No.:</label>
//             <input type="text" id="username" name="username" placeholder="Enter Employee No." required>

//             <label for="password">Password</label>
//             <input type="password" id="password" name="password" placeholder="Enter Password" required>

//             <button type="submit" id="loginBtn">Login</button>
//         </form>
//     </div>

//     <script type="module" src="/assets/js/api.js"></script>
//     <script type="module" src="/assets/js/auth.js"></script>
//     <script src="/assets/js/footer.js"></script>
// </body>

// </html>

// // CDP-UI Folder
// // profile.html
// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>CDP - Dashboard</title>
//     <link rel="stylesheet" href="/assets/css/styles.css">
// </head>

// <body>
//     <header>
//         <h1 id="welcomeMessage"></h1>
//     </header>

//     <div class="navmenu">
//         <a href="/pages/employees.html">Employees</a>
//         <a href="/pages/detachments.html">Detachments</a>
//         <button id="logoutBtn">Logout</button>
//     </div>
//     <main></main>

//     <footer id="footer"></footer>

//     <script type="module" src="/assets/js/profile.js"></script>
//     <script src="/assets/js/footer.js"></script>

// </body>

// </html>

        // Login API
        // this.app.post('/login', async (req, res) => {
        //     const { database, username, password } = req.body;

        //     if (!database || !username || !password) {
        //         return res.status(400).json({ error: 'Database, username, and password are required.' });
        //     }
        //     const query = `
        //     SELECT * FROM ${database}.cdpusers WHERE cdpempno = ? AND cdppassword = ?
        //     `;

        //     try {
        //         const results = await req.db.query(query, [username, password]);

        //         if (results.length > 0) {
        //             const user = results[0];
        //             res.json({ 
        //                 success: true, 
        //                 message: 'Login successful', 
        //                 empNo: user.cdpempno, 
        //                 view: user.cdpuserlevel === 'user' ? 'profile' : 'dashboard'
        //             });
        //         } else {
        //             res.status(401).json({ success: false, message: 'Invalid cerdentials' });
        //         }
        //     } catch (err) {
        //         res.status(500).json({ error: err.message });
        //     } finally {
        //         await req.db.close();
        //     }
        // });

        
        // this.app.get('/user-info', async (req, res) => {
        //     const { db, empNo } = req.query;

        //     if (!db || !empNo) {
        //         return res.status(400).json({ error: 'Database and employee number are required.' });
        //     }

        //     const query = `
        //     SELECT 
        //         ji_empNo, ji_fname, ji_lname, ji_mname, ji_extname
        //     FROM 
        //         \`${db}\`.trans_basicinfo
        //     WHERE
        //         ji_empNo = ?
        //     `;

        //     try {
        //         const results = await req.db.query(query, [empNo]);

        //         if (results.length > 0) {
        //             const user = results[0];
        //             res.json({
        //                 empNo: user.ji_empNo,
        //                 firstName: user.ji_fname,
        //                 lastName: user.ji_lname,
        //                 middleName: user.ji_mname,
        //                 extName: user.ji_extname
        //             });
        //         } else {
        //             res.status(404).json({ error: 'User not found.' });
        //         }
        //     } catch (error) {
        //         res.status(500).json({ error: error.message });
        //     } finally {
        //         await req.db.close();
        //     }
        // });

        // // Get and Display Employees
        // this.app.get('/employees', async (req, res) => {
        //     const dbName = req.query.db;
        //     if (!dbName) {
        //         return res.status(400).json({ error: 'Database name is required.' });
        //     }
        //     const query = `
        //     SELECT
        //         a.ji_empNo, a.ji_lname, a.ji_fname, a.ji_mname, a.ji_extname,
        //         b.email_add
        //     FROM
        //         ${dbName}.trans_basicinfo a
        //     INNER JOIN
        //         ${dbName}.trans_emailadd b ON a.ji_empNo = b.ji_empNo
        //     ORDER BY a.ji_lname
        //     `;

        //     try {
        //         const results = await req.db.query(query);
        //         res.json(results);
        //     } catch (err) {
        //         res.status(500).json({ error: err.message });
        //     } finally {
        //         await req.db.close();
        //     }
        // });