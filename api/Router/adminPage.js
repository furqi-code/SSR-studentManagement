const express = require('express') ;
const Router = express.Router() ;
const { Auth_admin } = require('../middleware') ;
const { executeQuery } = require('../mySqldb/Query') ;


Router.get('/', Auth_admin, async function(req,res){
    let show_students = await executeQuery(`select * from student_details`) ;
    if(show_students.length > 0){
        res.render('admin', {arr : show_students}) ;
    }else{
        res.render('admin', {arr : []}) ;
    }
})

module.exports = {
    adminRouter : Router
}