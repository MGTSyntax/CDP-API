const db = require('../models/database');

async function getEmployeeProfile(empNo) {
    const [basicInfo] = await db.query('SELECT * FROM trans_basicinfo WHERE ji_empNo = ?', [empNo]);
    const [compensationInfo] = await db.query('SELECT * FROM trans_compensation WHERE ji_empNo = ?', [empNo]);
    const [disciplinaryInfo] = await db.query('SELECT * FROM trans_disciplinary WHERE da_empno = ?', [empNo]);
    const [educInfo] = await db.query('SELECT * FROM trans_educ WHERE ji_empNo = ?', [empNo]);
    const [emailaddInfo] = await db.query('SELECT * FROM trans_emailadd WHERE ji_empno = ?', [empNo]);
    const [emergencyInfo] = await db.query('SELECT * FROM trans_emergency WHERE ji_empNo = ?', [empNo]);
    const [familyInfo] = await db.query('SELECT * FROM trans_family WHERE ji_empNo = ?', [empNo]);
    const [jobInfo] = await db.query('SELECT * FROM trans_jobinfo WHERE ji_empNo = ?', [empNo]);
    const [pempInfo] = await db.query('SELECT * FROM trans_pemp WHERE ji_empNo = ?', [empNo]);
    const [persinfoInfo] = await db.query('SELECT * FROM trans_persinfo WHERE ji_empNo = ?', [empNo]);

    return {
        basicInfo: basicInfo[0],
        compensationInfo: compensationInfo[0],
        disciplinaryInfo: disciplinaryInfo[0],
        educInfo: educInfo[0],
        emailaddInfo: emailaddInfo[0],
        emergencyInfo: emergencyInfo[0],
        basfamilyInfocInfo: familyInfo[0],
        jobInfo: jobInfo[0],
        pempInfo: pempInfo[0],
        persinfoInfo: persinfoInfo[0]
    };
}

module.exports = { getEmployeeProfile };