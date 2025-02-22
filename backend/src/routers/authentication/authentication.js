const jwt = require('jsonwebtoken');

// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {

    if(process.env.USE_AUTHENTICATION!="YES"){
      //here check authentication is not ok from .env file then do
     
       next();
    }
    else{
            //if .nenv do ok then do checking
        // Get token from the request header
        const token = req.header('Authorization')?.replace('Bearer ', ''); // Assumes the token is sent in the 'Authorization' header as 'Bearer <token>'
        
        if (!token) {
          return res.status(401).json({ message: "Access denied. No token provided." });
        }

        try {
          // Verify the token and extract user data (userId)
          const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // with our secret key used for signing the token
         
          // req.userId = decoded.userId; // Attach user ID to request object for further use
          next(); // Continue to the next middleware/route handler
        } catch (error) {
          return res.status(401).json({ message: "Invalid token" });
        }
    }

};

module.exports = authenticateToken;
