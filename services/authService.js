// /services/authService.js
exports.login = async (db, database, username, password) => {
    const query = `
    SELECT * FROM ${database}.cdpusers WHERE cdpempno = ? AND cdppassword = ?
    `;

    const results = await db.query(query, [username, password]);
    return results.length > 0 ? results[0] : null;
};