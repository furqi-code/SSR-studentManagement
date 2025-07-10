const express = require('express') ;
const Router = express.Router() ;

Router.get('/', function(req,res){
    try{
        res.render('home') ;
    }catch(err){
        console.log(err) ;
        res.status(500).send({
            message : err.message ? err.message : "Something went wrong"
        })
    }
})

module.exports = {
    homeRouter : Router
}