const express = require('express') ;
const Router = express.Router() ;
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const { SECRET } = require('../constants') ;
const { executeQuery } = require('../mySqldb/Query');

Router.post('/', async function(req, res) {
    try {
        const { username, password } = req.body;
        let users = await executeQuery(`SELECT * FROM student_details WHERE username = ?`, [username]);
        if(users.length > 0) 
        {
            let dbUser = users[0];
            let is_admin = dbUser.is_admin ;
            let student_id = dbUser.student_id ;
            let hashPwrd = dbUser.password ;
            let is_active = dbUser.is_active ;

            // Admin login (no bcrypt / hash)
            if(is_admin == 1) 
            {
                if(password == hashPwrd) 
                {
                    const token = jwt.sign({
                        user_id: student_id,
                        is_admin: true
                    }, SECRET);
                    res.cookie("user_detail", token, { httpOnly: true }) ;
                    res.status(200).send("Admin logged in successfully") ; 
                }else{
                    throw {
                        message: "Incorrect admin password"
                    }
                }

                // Student login (with bcrypt / hash)
            }else if(is_admin == 0) 
            {
                if(is_active == 0) {
                    throw {
                        message: "Please change your default password before logging in"
                    }
                }
                if(bcrypt.compareSync(password, hashPwrd)) 
                {
                    const token = jwt.sign({
                        user_id: student_id,
                        is_admin: false
                    }, SECRET);
                    res.cookie("user_detail", token, { httpOnly: true }) ;
                    res.status(200).send("Student logged in successfully") ;
                }else {
                    throw {
                        message: "Incorrect student password"
                    }
                }
            }
        }else {
            throw {
                message: "Admin/student not found with this username"
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: err.message ? err.message : "Something went wrong"
        })
    }
})

module.exports = {
    loginRouter: Router
}
