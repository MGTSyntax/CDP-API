// /services/authService.js
exports.login = async (mainDb, username, password) => {
    const query = `
        SELECT loginid, username, password, role_id, empno, company_id
        FROM file_metadata.cp_users
        WHERE BINARY username = ? AND BINARY password = ?
        LIMIT 1
    `;

    const results = await mainDb.query(query, [username, password]);
    return results.length > 0 ? results[0] : null;
};