const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'aman@123'); 
        req.user = decoded; 
        req.userId = decoded.id;
        req.userLocation = {
            lat: decoded.latitude,
            lng: decoded.longitude
          };
        
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  
}

module.exports = verifyToken;
