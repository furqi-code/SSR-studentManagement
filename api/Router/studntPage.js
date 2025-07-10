const express = require('express') ;
const Router = express.Router() ;
const { Auth_student } = require('../middleware') ;
const { executeQuery } = require('../mySqldb/Query') ;


Router.get('/', Auth_student, async function(req,res){
    let student_id = req.user_id ;
    let show_students = await executeQuery(`select * from student_details where student_id = ?`, [student_id]) ;
    if(show_students.length > 0){
        res.render('student', {arr : show_students}) ;
    }else{
        res.render('student', {arr : []}) ;
    }
})

module.exports = {
    studentRouter : Router
}