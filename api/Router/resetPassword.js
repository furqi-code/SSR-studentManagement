const express = require("express") ;
const Router = express.Router() ;
const bcrypt = require("bcrypt") ;
const {SALTROUNDS} = require("../constants") ;
const {executeQuery} = require("../mySqldb/Query") ;
const { Auth_user } = require('../middleware') ;

Router.use(Auth_user) ;

Router.get("/test", function(req, res){
    res.send("Test route working!") ;
});

Router.patch("/", async function(req,res){
    try{
        let student_id = req.query.id ; 
        let existing_student = await executeQuery(`select * from student_details where student_id = ?`, [student_id]) ;
        console.log(existing_student) ;
        if(existing_student.length > 0)
        {
            let dbUser = existing_student[0] ;
            let name = dbUser.name ;
            let dob = dbUser.DOB ;
            let created_at = dbUser.created_at ;
            let is_active = dbUser.is_active ;
            if(!req.is_admin) {
                return res.status(403).send("Only admins can reset passwords.");
            }
            if(is_active === -1)    // not a local provider
            {
                res.status(403).send({
                    message: "Password change is not available for third-party login users"
                    // message: "Password change is not available for " + dbUser.provider + " login users"
                })   
            }
            console.log("dob from mySql: ", dob) ;    
            console.log("admission date from mySql: ", created_at) ;  
            // dob me one month minus kyu arha h ? timezone ?? isliye resetPassword krne pe actuall dob use nhi horha
            // isostring me hi arha h from mySql same as dob no matter the datatype in DB
            let passDob = new Date(dob).toISOString().split('T')[0].replace('-','').replace('-','') ;
            console.log(passDob) ;
            const password = name + '@' + passDob ;         
            // mySql me jo datatype h usme hi show krta h to password bhi isi format me dalna students but without hyphens
            console.log(password) ;
            const updated_at = new Date().toISOString().split('Z')[0].replace('T', ' ') ;
            let update_pass = await executeQuery(`update student_details set password = ?, updated_at=? where student_id = ?`,
                [bcrypt.hashSync(password, SALTROUNDS), updated_at, student_id]) ;
                console.log(update_pass) ;
                res.status(200).send({
                    message : "Reset Password successfully"
                })
            // if(update_pass.affectedRows > 0){
            // }else{
            //     res.status(404).send("Password cant be Reset") ;
            // }
        }else{
            throw {
                message : "Student not found in DB"
            }
        }
    }catch(error){
        res.status(500).send({
            message : error.message ? error.message : "Something went wrong" 
        })
    }
})

module.exports = Router ;