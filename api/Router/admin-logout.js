const express = require('express') ;
const Router = express.Router() ;
const { Auth_admin } = require('../middleware') ;

Router.post('/', Auth_admin, function(req,res){
    res.clearCookie("admin_detail") ;
    res.status(200).send({
        message: "Admin Logout successfull"
    });
})

module.exports = {
    admin_LogoutRouter : Router
}