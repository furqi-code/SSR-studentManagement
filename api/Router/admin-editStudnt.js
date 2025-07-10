const express = require('express') ;
const Router = express.Router() ;
const { executeQuery } = require('../mySqldb/Query') ;

Router.patch('/', async function(req,res){
    try{
        const { name, fatherName, email, address, phoneNumber, dob, grade, gender} = req.body ;
        const student_id = req.query.student_id ;
        let existing_student = await executeQuery(`select * from student_details where student_id = ?`, [student_id]) ;
        if(existing_student.length > 0)
        {
            const updated_at = new Date().toISOString().split('Z')[0].replace('T', ' ') ;
            let updated_students = await executeQuery(`update student_details set name=?, fatherName=?, email=?, address=?, contact=?, DOB=?, grade=?, gender=?, updated_at=? where student_id = ?`,
                [name, fatherName, email, address, phoneNumber, dob, grade, gender, updated_at, student_id]) ;
            res.status(200).send("Student Updated") ;
        }else{
            throw{
                message : "information of this student do not exist"
            }
        }
    }catch(err){
        console.log(err) ;
        res.status(500).send({
            message : err.message ? err.message : "Something went wrong"
        })
    }
})

module.exports = {
    studentUpdated : Router
}