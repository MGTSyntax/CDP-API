// middleware/checkPermission.js
const permissions = {
    ANL: ["anlmanager", "superadmin"],
    FINANCE: ["finmanager", "superadmin"],
    HR: ["hrmanager", "superadmin"],
    IT: ["itmanager", "superadmin"],
    LEGAL: ["legmanager", "superadmin"],
    OPERATIONS: ["opsmanager", "superadmin"]
};

function checkPermission(action) {
    return async (req, res, next) => {
        const department = (req.body.department || req.params.department || req.query.department)?.toUpperCase();
        const userRole = req.user?.userLevel?.toLowerCase() || req.body.userLevel?.toLowerCase();
        const empNo = req.user?.empNo || req.body.uploadedBy;

        if (!department || !userRole) {
            return res.status(400).json({ error: "Invalid request: missing department or user" });
        }

        const allowedRoles = (permissions[department] || []).map(r => r.toLowerCase());

        if (action === "upload") {
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ error: `You do not have permission to upload in this ${department}` });
            }
            return next();
        }
        
        if (action === "delete") {
            try {
                const { filename } = req.params;
                const [file] = await req.db.query(
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

                return res.status(403).json({ error: "You do not have permission to delete this file" });
            } catch (err) {
                console.error("Delete permission check failed:", err);
                return res.status(500).json({ error: "Permission check failed" });
            }
        }

        next();
    };
}

module.exports = { checkPermission };