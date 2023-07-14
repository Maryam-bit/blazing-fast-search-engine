const jwt = require("jsonwebtoken");

const config = require('../config/env.config')

const jwtVerify = async (req, res, next) => {
    try {
        // let token = req.headers['authorization'].split(" ")[1];
        let token = req.cookies['jwt'] || req.headers['authorization'].split(" ")[1];
        let decoded = jwt.verify(token,config.secret);
        req.user = decoded;
        next();
    } catch(err){
        res.status(401).json({"msg":"Couldnt Authenticate"});
    }
}

module.exports = jwtVerify;