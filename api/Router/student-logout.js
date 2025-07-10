const express = require('express') ;
const Router = express.Router() ;

Router.post('/', function(req,res){
    res.clearCookie("student_detail") ;
    res.status(200).send({
        message: "student Logout successfull"
    });
})

module.exports = {
    student_LogoutRouter : Router
}