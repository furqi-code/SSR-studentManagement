const express = require("express") ;
const Router = express.Router() ;
const bcrypt = require("bcrypt") ;
const {SALTROUNDS} = require("../constants") ;
const {executeQuery} = require("../mySqldb/Query") ;


Router.get("/test", function(req, res){
    res.send("Test route working!") ;
});

Router.patch("/", async function(req,res){
    try{
        const {email, newPassword, confirmPassword} = req.body ; 
        let existing_student = await executeQuery(`select * from student_details where email = ?`, [email]) ;
        console.log(existing_student) ;
        if(existing_student.length > 0)
        {
            let dbUser = existing_student[0] ;
            let username = dbUser.username ;
            let student_id = dbUser.student_id ;
            let is_active = dbUser.is_active ;
            if(is_active !== -1)    // not a local provider
            {
                const updated_at = new Date().toISOString().split('Z')[0].replace('T', ' ') ;
                let update_pass = await executeQuery(`update student_details set password = ?, is_active = ?, updated_at=? where student_id = ?`,
                [bcrypt.hashSync(newPassword, SALTROUNDS), true, updated_at, student_id]) ;
                console.log(update_pass) ;
                // Update is_active to 1 or true in student_login table
                // await executeQuery(`update student_login set is_active = ? where Username = ?`, [1, username]) ;
                res.status(200).send({
                    message : "Reset Password successfully"
                })
            }else{
                res.status(403).send({
                    message: "Password change is not available for third-party login users"
                    // message: "Password change is not available for " + dbUser.provider + " login users"
                })
            }
            // if(update_pass.affectedRows > 0){
            // }else{
            //     res.status(404).send("Password cant be Reset") ;
            // }
        }else{
            throw {
                message : "Email/student not found in DB"
            }
        }
    }catch(error){
        res.status(500).send({
            message : error.message ? error.message : "Something went wrong" 
        })
    }
})

module.exports = Router ;