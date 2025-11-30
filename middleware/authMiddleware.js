const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const SECRET_KEY = process.env.JWT_SECRET || 'BRUCE_WAYNE';
const LOG_FILE = path.join(__dirname, '../debug_rbac.txt');

function logDebug(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(LOG_FILE, `[${timestamp}] ${message}\n`);
}

function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ msg: 'Token não fornecido.' });
    }

    const bearer = token.split(' ');
    const tokenValue = bearer[1];

    jwt.verify(tokenValue, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: 'Falha na autenticação do token.' });
        }
        req.user = decoded;
        next();
    });
}

function checkRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            logDebug(`Access Denied: No user in request`);
            return res.status(401).json({ msg: 'Usuário não autenticado.' });
        }

        const userRole = Number(req.user.perfil_id);
        const userName = req.user.login || 'Unknown';

        logDebug(`CheckRole - User: ${userName}, Role (Token): ${req.user.perfil_id}, Role (Cast): ${userRole}, Allowed: ${JSON.stringify(allowedRoles)}`);

        if (allowedRoles.includes(userRole)) {
            next();
        } else {
            logDebug(`Access Denied: ${userName} (Role: ${userRole}) not in ${JSON.stringify(allowedRoles)}`);
            return res.status(403).json({ msg: 'Acesso negado: Permissão insuficiente.' });
        }
    };
}

function checkSameUserOrRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ msg: 'Usuário não autenticado.' });
        }

        const userRole = Number(req.user.perfil_id);
        const userIdFromToken = Number(req.user.usuario_id);
        const userIdFromParams = Number(req.params.id);

        // Allow if user has one of the allowed roles (e.g., Admin)
        if (allowedRoles.includes(userRole)) {
            return next();
        }

        // Allow if the user is acting on their own data
        if (userIdFromToken === userIdFromParams) {
            return next();
        }

        return res.status(403).json({ msg: 'Acesso negado.' });
    };
}

module.exports = {
    verifyToken,
    checkRole,
    checkSameUserOrRole
};
