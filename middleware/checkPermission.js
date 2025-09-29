// middleware/checkPermission.js
const permissions = {
    ANL: ["anlmanager", "superadmin"],
    FINANCE: ["finmanager", "superadmin"],
    HR: ["hrmanager", "superadmin"],
    IT: ["itmanager", "superadmin"],
    LEGAL: ["legmanager", "superadmin"],
    OPERATIONS: ["opsmanager", "superadmin"]
};

function checkPermission(action, fileDb) {
    return async (req, res, next) => {
        const department = (req.body.department || req.params.department)?.toUpperCase();
        const userRole = req.user?.userLevel?.toLowerCase();
        const empNo = req.user?.empNo;

        if (!department || !userRole) {
            return res.status(400).json({ error: "Invalid request: missing department or user" });
        }

        const allowedRoles = (permissions[department] || []).map(r => r.toLowerCase());

        // Upload: simple role check
        if (action === "upload") {
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ error: `You do not have permission to upload in this ${department}` });
            }
            return next();
        }
        
        // Delete: need extra validation
        if (action === "delete") {
            try {
                const { filename } = req.params;
                const [file] = await fileDb.query(
                    `SELECT uploaded_by FROM file_metadata.uploaded_files
                    WHERE filename = ? AND department = ? LIMIT 1`,
                    [filename, department]
                );

                if (!file) {
                    return res.status(404).json({ error: "File not found" });
                }

                if (
                    userRole === "superadmin" || 
                    file.uploaded_by === empNo || 
                    allowedRoles.includes(userRole)
                ) {
                    return next();
                }
            } catch (err) {
                console.error("Delete permission check failed:", err);
                return res.status(500).json({ error: "Permission check failed" });
            }
        }

        next();
    };
}

module.exports = { checkPermission };