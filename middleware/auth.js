const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){

    //Get the token from the header
    const bearerToken = req.headers.authorization;
    
    //Check if no token
    if(!bearerToken){
        return res.status(401).json({msg: 'No token, authorization denied.'});
    }
    
    const token = bearerToken.split(" ")[1];

    //Verify token
    try{
        const secret = process.env.SECRET || config.get('jwtSecret');
        const decoded = jwt.verify(token, secret);
        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg: 'Token is not valid'});
    }
}