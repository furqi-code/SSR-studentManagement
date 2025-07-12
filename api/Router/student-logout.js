const express = require('express') ;
const Router = express.Router() ;
const { Auth_student } = require('../middleware') ;

Router.post('/', Auth_student, function(req,res){
    res.clearCookie("student_detail") ;
    res.status(200).send({
        message: "student Logout successfull"
    });
})

module.exports = {
    student_LogoutRouter : Router
}