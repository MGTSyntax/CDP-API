exports.login = async (dbConfig, database, username, password) => {
    const query = `
    SELECT * FROM ${database}.cdpusers WHERE cdpempno = ? AND cdppassword = ?
    `;

    const results = await dbConfig.query(query, [username, password]);
    return results.length > 0 ? results[0] : null;
};