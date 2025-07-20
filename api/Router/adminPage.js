const express = require('express') ;
const Router = express.Router() ;
const { Auth_user } = require('../middleware');
const { executeQuery } = require('../mySqldb/Query') ;

Router.use(Auth_user) ;

Router.get('/', async function(req,res){
    let show_students = await executeQuery(`select * from student_details`) ;
    if(req.is_admin === true || req.is_admin === 1)
    {
        if(show_students.length > 0){
            res.render('admin', {arr : show_students}) ;
        }else{
            res.render('admin', {arr : []}) ;
        }
    }else{
        res.send({
            message : "you aren't an admin, cant redirect to admin page"
        })
    }
})

module.exports = {
    adminRouter : Router
}