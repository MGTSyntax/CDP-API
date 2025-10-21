// /services/employeeService.js
exports.getUserInfo = async (db, empNo) => {
    const query = `
        SELECT ji_empNo, ji_fname, ji_lname, ji_mname, ji_extname
        FROM trans_basicinfo
        WHERE ji_empNo = ?
    `;

    const results = await db.query(query, [empNo]);

    if (results.length > 0) {
        const user = results[0];
        return {
            empNo: user.ji_empNo,
            firstName: user.ji_fname,
            lastName: user.ji_lname,
            middleName: user.ji_mname,
            extName: user.ji_extname
        };
    } else {
        return null;
    }
};

exports.getEmployees = async (db) => {
    const query = `
        SELECT
            bi.ji_empNo, 
            bi.ji_lname, 
            bi.ji_fname, 
            bi.ji_mname, 
            bi.ji_extname,
            ji.ji_dept AS assignment,
            ji.ji_sec AS detachment
        FROM trans_basicinfo bi
        INNER JOIN trans_jobinfo ji ON bi.ji_empNo = ji.ji_empNo
        ORDER BY bi.ji_lname
    `;

    return await db.query(query);
};