// middleware/checkPermission.js
const permissions = {
    ANL: [1, 3],
    FINANCE: [1, 5],
    HR: [1, 7],
    IT: [1, 9],
    LEGAL: [1, 11],
    OPERATIONS: [1, 13]
};

function checkPermission(action) {
    return async (req, res, next) => {
        const department = (req.body.department || req.params.department || req.query.department)?.toUpperCase();
        const userRole = Number(req.user?.userLevel || req.body.userLevel);
        const empNo = req.user?.empNo || req.body.uploadedBy;

        if (!department || !userRole) {
            return res.status(400).json({ error: "Invalid request: missing department or user" });
        }

        if (!permissions[department]) {
            return res.status(400).json({ error: `Unknown department: ${department}` });
        }

        if (userRole === 1) return next();

        const allowedRoles = permissions[department].map(Number);

        if (action === "upload") {
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ error: `You do not have permission to upload in this ${department}` });
            }
            return next();
        }
        
        if (action === "delete") {
            try {
                const { filename } = req.params;
                const [file] = await req.mainDb.query(
                    `SELECT uploaded_by FROM uploaded_files
                    WHERE filename = ? AND department = ? LIMIT 1`,
                    [filename, department]
                );

                if (!file) {
                    return res.status(404).json({ error: "File not found" });
                }

                if (
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