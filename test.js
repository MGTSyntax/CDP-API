// In my API Folder

// // cdp.js
// const express = require('express');
// const cors = require('cors');
// const config = require('./config/config');
// const dbMiddleware = require('./middleware/dbmiddleware');

// const authRoutes = require('./routes/authRoutes');
// const employeeRoutes = require('./routes/employeeRoutes');
// const profileRoutes = require('./routes/profileRoutes');

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
//         this.app.use('/', authRoutes);
//         this.app.use('/', employeeRoutes);
//         this.app.use('/', profileRoutes);

//         // Get databases
//         this.app.get('/databases', (req, res) => {
//             res.json(config.databases);
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

// // profileRoutes.js
// const express = require('express');
// const router = express.Router();
// const { fetchEmployeeProfile } = require('../controllers/profileController');

// router.get('/employee-profile', fetchEmployeeProfile);

// module.exports = router;

// // profileService.js
// async function getEmployeeProfile(db, empNo) {
//     const [basicInfo] = await db.query('SELECT * FROM trans_basicinfo WHERE ji_empNo = ?', [empNo]);
//     const [compensationInfo] = await db.query('SELECT * FROM trans_compensation WHERE ji_empNo = ?', [empNo]);
//     const [disciplinaryInfo] = await db.query('SELECT * FROM trans_disciplinary WHERE da_empno = ?', [empNo]);
//     const [educInfo] = await db.query('SELECT * FROM trans_educ WHERE ji_empNo = ?', [empNo]);
//     const [emailaddInfo] = await db.query('SELECT * FROM trans_emailadd WHERE ji_empno = ?', [empNo]);
//     const [emergencyInfo] = await db.query('SELECT * FROM trans_emergency WHERE ji_empNo = ?', [empNo]);
//     const [familyInfo] = await db.query('SELECT * FROM trans_family WHERE ji_empNo = ?', [empNo]);
//     const [jobInfo] = await db.query('SELECT * FROM trans_jobinfo WHERE ji_empNo = ?', [empNo]);
//     const [pempInfo] = await db.query('SELECT * FROM trans_pemp WHERE ji_empNo = ?', [empNo]);
//     const [persinfoInfo] = await db.query('SELECT * FROM trans_persinfo WHERE ji_empNo = ?', [empNo]);

//     return {
//         basicInfo: basicInfo[0],
//         compensationInfo: compensationInfo[0],
//         disciplinaryInfo: disciplinaryInfo[0],
//         educInfo: educInfo[0],
//         emailaddInfo: emailaddInfo[0],
//         emergencyInfo: emergencyInfo[0],
//         basfamilyInfocInfo: familyInfo[0],
//         jobInfo: jobInfo[0],
//         pempInfo: pempInfo[0],
//         persinfoInfo: persinfoInfo[0]
//     };
// }

// module.exports = { getEmployeeProfile };

// // profileController.js
// const { getEmployeeProfile } = require('../services/profileService');

// const fetchEmployeeProfile = async (req, res) => {
//     const { empNo } = req.query;

//     if (!empNo) {
//         return res.status(400).json({ error: 'Database and employee number are required.' });
//     }

//     try {
//         const profile = await getEmployeeProfile(req.db, empNo);
//         res.json(profile);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     } finally {
//         await req.db.close();
//     }
// };

// module.exports = { fetchEmployeeProfile };

// In my UI Folder
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
//         const response = await fetch(`${API_BASE_URL}/user-info?db=${db}&empNo=${empNo}`);
//         const data = await response.json();
//         if (!response.ok) {
//             throw new Error(data.error || 'Failed to fetch user info');
//         }
//         return data;
//     } catch (error) {
//         console.error('Error fetching user info:', error);
//         return null;
//     }
// }

// // Fetch complete employee profile by employee number
// export async function getEmpProfile(db, empNo) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/employee-profile?db=${db}&empNo=${empNo}`);
//         const empProfdata = await response.json();
//         console.error(`empProfdata: ${empProfdata}`);
//         if (!response.ok) {
//             throw new Error(empProfdata.error || 'Failed to fetch employee profile');
//         }
//         return empProfdata;
//     } catch (error) {
//         console.error('Error fetching employee profile:', error);
//         return null;
//     }
// }

// // Fetch Employees
// export async function getEmployees(selectedDb) {
//     try {
//         const response = await fetch(`${API_BASE_URL}/employees?db=${selectedDb}`);
//         if (!response.ok) throw new Error('Failed to fetch employees');
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching departments:', error);
//         return [];
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

// // profile.js - Loads user info and shows in the navbar
// import { getEmpProfile } from "./api";

// async function loadProfile() {
//     const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//     if (!userInfo) return;

//     const profile = await getEmpProfile(userInfo.database, userInfo.empNo);

//     if (!profile || !profile.basicInfo) {
//         console.error('Failed to load profile data.');
//         return;
//     }

//     document.getElementById("empNo").textContent = profile.basicInfo?.ji_empNo || '';
//     document.getElementById("lastName").textContent = profile.basicInfo?.ji_lname || '';
//     document.getElementById("extName").textContent = profile.basicInfo?.ji_extname || '';
//     document.getElementById("firstName").textContent = profile.basicInfo?.ji_fname || '';
//     document.getElementById("middleName").textContent = profile.basicInfo?.ji_mname || '';
// }

// document.addEventListener('DOMContentLoaded', () => {
//     const welcomeMessage = document.querySelector('#welcomeMessage');
//     const navMenu = document.getElementById('navMenu');
//     const userInfo = JSON.parse(localStorage.getItem('userInfo'));

//     if (!userInfo) {
//         console.error("No user data found in local storage.");
//         window.location.href = '/pages/login.html'; // redirect if not logged in
//         return;
//     }

//     // Set welcome message
//     welcomeMessage.textContent = `Hi ${userInfo.firstName}!`;

//     // Generate role-based nav
//     if (navMenu) {
//         let navHTML = `
//         <a href="/pages/profile.html">Profile</a>
//         <a href="/pages/employees.html">Employees</a>
//         <a href="/pages/detachments.html">Detachments</a>
//     `;

//     if (userInfo.userLevel === 'admin') {
//         navHTML = `<a href="/pages/dashboard.html">Dashboard</a>` + navHTML;
//     }

//     navHTML += `<button id="logoutBtn">Logout</button>`;
//     navMenu.innerHTML = navHTML;

//     // Attach logout handler after nav built
//     const logoutBtn = document.getElementById('logoutBtn');
//     logoutBtn?.addEventListener('click', () => {
//         localStorage.removeItem('userInfo');
//         window.location.href = '/pages/login.html';
//     });
//     }

//     loadProfile();
// });

// //profile.html
// <!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>CDP - Profile</title>
//     <link rel="stylesheet" href="/assets/css/styles.css">
// </head>

// <body>
//     <header>
//         <h1 id="welcomeMessage">Your Profile</h1>
//     </header>

//     <div class="layout-container">
//         <div class="navmenu" id="navMenu">
//             <a href="/pages/profile.html">Profile</a>
//             <a href="/pages/employees.html">Employees</a>
//             <a href="/pages/detachments.html">Detachments</a>
//             <button id="logoutBtn">Logout</button>
//         </div>

//         <main>
//             <section class="profile-card">
//                 <h2>Basic Information</h2>
//                 <p><strong>Employee No:</strong> <span id="empNo"></span></p>
//                 <p><strong>Last Name:</strong> <span id="lastName"></span></p>
//                 <p><strong>Name Ext.:</strong> <span id="extName"></span></p>
//                 <p><strong>First Name:</strong> <span id="firstName"></span></p>
//                 <p><strong>Middle Name:</strong> <span id="middleName"></span></p>
//             </section>
//             <section class="profile-card">
//                 <h2>Personal Information</h2>
//                 <p><strong>Employee No:</strong> <span id=""></span></p>
//                 <p><strong>Last Name:</strong> <span id=""></span></p>
//                 <p><strong>First Name:</strong> <span id=""></span></p>
//                 <p><strong>Middle Name:</strong> <span id=""></span></p>
//             </section>
//             <section class="profile-card">
//                 <h2>Job Information</h2>
//                 <p><strong>Employee No:</strong> <span id=""></span></p>
//                 <p><strong>Last Name:</strong> <span id=""></span></p>
//                 <p><strong>First Name:</strong> <span id=""></span></p>
//                 <p><strong>Middle Name:</strong> <span id=""></span></p>
//             </section>
//         </main>
//     </div>

//     <footer id="footer"></footer>

//     <script type="module" src="/assets/js/profile.js"></script>
//     <script src="/assets/js/footer.js"></script>
// </body>

// </html>