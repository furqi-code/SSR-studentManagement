const express = require('express') ;
const Router = express.Router() ;
const bcrypt = require('bcrypt') ;
const { SALTROUNDS } = require('../constants') ;
const { executeQuery } = require('../mySqldb/Query') ;


Router.post('/', async function(req,res){
    try{
        const { name, fatherName, email, address, phoneNumber, dob, grade, username, gender} = req.body ;
        let passDob = new Date(dob).toISOString().split('T')[0].replace('-','').replace('-','') ;
        const password = name + '@' + passDob ; // mySql me jo datatype h usme hi show krta h to password bhi isi format me dalna students but without hyphens
        const encrypted = bcrypt.hashSync(password, SALTROUNDS) ;
        const created_at = new Date().toISOString().split('Z')[0].replace('T', ' ') ;   
        const login_count = 0 ;
        const existing_username = await executeQuery(`select * from student_details where username = ?`, [username]) ;
        if(existing_username.length > 0){
            res.status(400).send({ message: "student with this Username already exists" }) ;
        }
        // insert student information here
        let inserted_students = await executeQuery(`insert into student_details(name, fatherName, email, address, contact, dob, grade, username, password, gender, login_count, created_at)
            values(?,?,?,?,?,?,?,?,?,?,?,?)`, [name, fatherName, email, address, phoneNumber, dob, grade, username, encrypted, gender, login_count, created_at]) ;
        if(inserted_students.insertId > 0){   
            // const studentId = inserted_students.insertId ;
            // inserted_loginCnt = await executeQuery(`insert into student_login(student_id, username, login_count) values(?,?,?)`, [studentId, username, login_count]) ;
            res.status(200).send("Admission completed, inserted in DB") ;
        }else{
            throw{
                message : "Admission failed"
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
    admission : Router
}