const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) { 
    const token = req.header('auth-token');
    if (!token) return res.send('Acceso denegado');

    try {
        const verify = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = verify;
        next();
    } catch{ 
        res.send('Token invalido')
    }

}