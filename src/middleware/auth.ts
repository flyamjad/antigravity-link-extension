import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (token: string) => (req: Request, res: Response, next: NextFunction) => {
    // Allow static assets, main page, and diagnostic routes
    if (req.path === '/' ||
        req.path === '/index.html' ||
        req.path === '/ping' ||
        req.path === '/sys' ||
        req.path.match(/\.(js|css|ico|png|json)$/) ||
        req.path.startsWith('/debug')) {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (authHeader === `Bearer ${token}`) {
        return next();
    }

    // Also check query param for easy testing/some clients
    if (req.query.token === token) {
        return next();
    }

    res.status(401).json({ error: 'Unauthorized' });
};
