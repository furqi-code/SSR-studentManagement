const express = require('express') ;
const Router = express.Router() ;

Router.post('/', function(req,res){
    res.clearCookie("admin_detail") ;
    res.status(200).send({
        message: "Admin Logout successfull"
    });
})

module.exports = {
    admin_LogoutRouter : Router
}