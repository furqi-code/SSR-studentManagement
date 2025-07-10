const express = require('express') ;
const Router = express.Router() ;
const { executeQuery } = require('../mySqldb/Query') ;


Router.get('/', async function(req,res){
    try{
        const username = req.query.username ;
        let existing_student = await executeQuery(`select * from student_login where Username = ?`, [username]) ;
        if(existing_student.length > 0)
        {
            let dbUser = existing_student[0] ;
            let student_id = dbUser.student_id ;
            let login_count = dbUser.login_count ;
            if(login_count > 0){
                res.status(200).send("you have changed your default password, please continue!!") ;
            }else{
                throw{
                    message : "change your default password then try to Login"
                }
            }
        }else{
            throw{
                message : "student not found with this username"
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
    login_count : Router
}