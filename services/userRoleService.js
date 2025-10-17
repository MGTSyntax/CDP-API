// /services/userRoleService.js

/**
 * Fetch role name and permissions for a specific user.
 * Requires cp_users, cp_user_roles, and cp_role_permissions tables.
 */

exports.getUserRoleAndPermissions = async (db, username) => {
    if (!db) throw new Error('Database connection not provided.');
    if (!username) throw new Error('Username is required.');

    const query = `
        SELECT 
            ur.role_name AS roleName,
            ur.description AS roleDescription,
            rp.module AS module,
            rp.viewing,
            rp.adding,
            rp.editing,
            rp.deleting,
            rp.uploading
        FROM cp_users u
        JOIN cp_user_roles ur ON u.role_id = ur.roleid
        LEFT JOIN cp_role_permissions rp ON ur.roleid = rp.role_id
        WHERE u.username = ?
    `;

    try {
        const rows = await db.query(query, [username]);
        if (rows.length === 0) return null;

        const { roleName, roleDescription } = rows[0];

        const permissions = rows.map(r => ({
            module: r.module,
            viewing: r.viewing,
            adding: !!r.adding,
            editing: !!r.editing,
            deleting: !!r.deleting,
            uploading: !!r.uploading,
        }));

        return {
            role: roleName,
            description: roleDescription,
            permissions,
        };
    } catch (err) {
        console.error('Error in getUserRoleAndPermissions:', err.message);
        throw new Error('Failed to fetch user role and permissions.');
    }
};