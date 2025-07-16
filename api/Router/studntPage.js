const express = require('express') ;
const Router = express.Router() ;
const { Auth_student } = require('../middleware') ;
const { executeQuery } = require('../mySqldb/Query') ;


Router.get('/', Auth_student, async function(req,res){
    let student_id = req.user_id ;
    let show_students = await executeQuery(`select * from student_details where student_id = ?`, [student_id]) ;
    // if(req.is_admin === false || req.is_admin === 0 || req.is_admin === null)
    // {
        if(show_students.length > 0){
            res.render('student', {arr : show_students}) ;
        }else{
            res.render('student', {arr : []}) ;
        }
    // }else{
    //     res.send({
    //         message : "you aren't an student, cant redirect to student page"
    //     })
    // }
})

module.exports = {
    studentRouter : Router
}