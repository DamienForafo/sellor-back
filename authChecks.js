const jwt = require('jsonwebtoken');


// Verify auth-token and put user, teams and roles in req
function verifyToken(req, res, next) {
    const token = req.header('auth-token');
    if (!token) return res.status(401).send('Access denied : no token');
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; // req.user now contains the user's ID (which was extracted from the token)
        next();
    }
    catch(err) {
        res.status(400).send('Invalid token');
    }
};




module.exports = {'verifyToken': verifyToken};