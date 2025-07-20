const jwt = require("jsonwebtoken");
const {SECRET} = require("./constants");

function Auth_user(req,res,next) {
    try {
        let token = req.cookies.user_detail ;
        if(!token){
            res.status(401).send("Login required. Token not found") ;
        }
        const payload = jwt.verify(token, SECRET) ;
        req.user_id = payload.user_id ;
        req.is_admin = payload.is_admin ;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized. Invalid or expired token.");
    }
}

module.exports = {
    Auth_user
}
