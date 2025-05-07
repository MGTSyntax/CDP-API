exports.getUserInfo = async (db, database, empNo) => {
    const query = `
            SELECT ji_empNo, ji_fname, ji_lname, ji_mname, ji_extname
            FROM \`${database}\`.trans_basicinfo
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

exports.getEmployees = async (db, database) => {
    const query = `
            SELECT
                a.ji_empNo, a.ji_lname, a.ji_fname, a.ji_mname, a.ji_extname,
                b.email_add
            FROM
                \`${database}\`.trans_basicinfo a
            INNER JOIN
                \`${database}\`.trans_emailadd b ON a.ji_empNo = b.ji_empNo
            ORDER BY a.ji_lname
            `;

    const [results] = await db.query(query);
    return results;
};