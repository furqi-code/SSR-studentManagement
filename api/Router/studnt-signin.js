const express = require('express') ;
const Router = express.Router() ;
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const { SECRET } = require('../constants') ;
const { executeQuery } = require('../mySqldb/Query') ;

Router.post('/', async function(req,res){
    try{
        const {username, password} = req.body ;
        let existing_student = await executeQuery(`select * from student_details where username = ?`, [username]) ;
        if(existing_student.length > 0)
        {
            let dbUser = existing_student[0] ;
            let hashPwrd = dbUser.password ;
            let student_id = dbUser.student_id ;
            let login_count = dbUser.login_count ;
            if(login_count === 0){
                throw{
                    message : "change your default password before logging in" 
                }
            }
            if(bcrypt.compareSync(password,hashPwrd))
            {
                const token = jwt.sign(
                    {
                        user_type : "Student",
                        user_id : student_id
                    },
                    SECRET
                )
                res.cookie("student_detail", token, {httpOnly: true}) ;
                res.status(200).send("Student logged in successfully") ;
            }else{
                throw{
                    message : "Wrong student Password"
                }
            }
        }else{
            throw{
                message : "Student not found with this Username"
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
    studntSignin : Router
}