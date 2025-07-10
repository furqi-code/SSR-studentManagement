const express = require('express') ;
const Router = express.Router() ;
const { executeQuery } = require('../mySqldb/Query') ;

Router.get('/', async function(req,res){
    try{
        const student_id = req.query.id ;
        let existing_student = await executeQuery(`select * from student_details where student_id = ?`, [student_id]) ;
        if(existing_student.length > 0){
            res.status(200).send(existing_student) ;
        }else{
            res.status(200).send() ;
        }
    }catch(err){
        console.log(err) ;
        res.status(500).send({
            message : err.message ? err.message : "Something went wrong"
        })
    }
})

module.exports = {
    studentPrefill : Router
}