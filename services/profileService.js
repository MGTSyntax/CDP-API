// /services/profileService.js
async function getEmployeeProfile(db, empNo) {
    const queries = [
        ['basicInfo', `SELECT * FROM trans_basicinfo WHERE ji_empNo = ?`],
        ['personalInfo', `SELECT * FROM trans_persinfo WHERE ji_empNo = ?`],
        ['educInfo', `SELECT * FROM trans_educ WHERE ji_empNo = ?`],
        ['jobInfo', `SELECT * FROM trans_jobinfo WHERE ji_empNo = ?`],
        ['emailaddInfo', `SELECT * FROM trans_emailadd WHERE ji_empno = ?`],
        ['emergencyInfo', `SELECT * FROM trans_emergency WHERE ji_empNo = ?`],
        ['familyInfo', `SELECT * FROM trans_family WHERE ji_empNo = ?`],
        ['pempInfo', `SELECT * FROM trans_pemp WHERE ji_empNo = ?`],
        ['disciplinaryInfo', `SELECT * FROM trans_disciplinary WHERE da_empno = ?`],
        ['compensationInfo', `SELECT * FROM trans_compensation WHERE ji_empNo = ?`],
    ];

    const result = {};

    for (const [key, sql] of queries) {
        try {
            const rows = await db.query(sql, [empNo]);
            result[key] = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error(`Error fetching ${key}:`, error.message);
            result[key] = null;
        }
    }

    return result;
}

module.exports = { getEmployeeProfile };