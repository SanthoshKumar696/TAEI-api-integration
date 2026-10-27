import { Request, Response, NextFunction } from "express";

interface Permission {
    page: string;
    access: "read" | "write";
}

export const authorize = (page: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !user.permissions) {
            return res.status(403).json({ message: "Access denied. No permissions found." });
        }

        const permissions: Permission[] = user.permissions;
        const pagePermission = permissions.find(p => p.page === page);

        if (!pagePermission) {
            return res.status(403).json({ message: "Access denied. No permission for this page." });
        }

        // Map HTTP method → required access
        const method = req.method.toUpperCase();
        const requiredAccess = ["GET"].includes(method) ? "read" : "write";

        // If user has write → allow both read + write
        if (pagePermission.access === "write") {
            return next();
        }

        // If user has read → allow only read
        if (pagePermission.access === "read" && requiredAccess === "read") {
            return next();
        }

        // Otherwise block
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    };
};
