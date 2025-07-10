const jwt = require("jsonwebtoken");
const {SECRET} = require("./constants");

function admin_AuthMiddleware(req,res,next)
{
    try{
        const token = req.cookies.admin_detail ;
        const payload = jwt.verify(token, SECRET) ;
        req.user_id = payload.user_id ;
        req.user_type = payload.user_type ;
        next() ;
    }catch(err){
        res.status(401).send("cookies not found admin Unauthorized") ;
    }
}

function student_AuthMiddleware(req,res,next)
{
    try{
        const token = req.cookies.student_detail ;
        const payload = jwt.verify(token, SECRET) ;
        req.user_id = payload.user_id ;
        req.user_type = payload.user_type ;
        next() ;
    }catch(err){
        res.status(401).send("cookies not found student Unauthorized") ;
    }
}

module.exports = {
    Auth_admin : admin_AuthMiddleware,
    Auth_student : student_AuthMiddleware
}