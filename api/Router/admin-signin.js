const express = require('express') ;
const Router = express.Router() ;
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const { SECRET } = require('../constants') ;
const { executeQuery } = require('../mySqldb/Query') ;


Router.post('/', async function(req,res){
    try{
        const {username, password} = req.body ;
        let existing_admin = await executeQuery(`select * from student_details where Username = ?`, [username]) ;
        if(existing_admin.length > 0)
        {
            let dbAdmin = existing_admin[0] ;
            let admin_id = dbAdmin.student_id ;
            // let is_admin = dbAdmin.is_admin ;
            let check_pass = await executeQuery(`select * from student_details where Password = ?`, [password]) ;
            if(check_pass.length > 0){
                // await executeQuery(`update student_details set is_admin=?`, [true]) ;
                const token = jwt.sign(
                    {
                        is_admin : true,
                        user_id : admin_id
                    },
                    SECRET
                )
                res.cookie("admin_detail", token, {httpOnly: true}) ;
                res.status(200).send("Admin logged in successfully") ;
            }else{
                throw{
                    message : "Wrong admin Password"
                }
            }
        }else{
            throw{
                message : "Admin not found with this username"
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
    adminSignin : Router
}