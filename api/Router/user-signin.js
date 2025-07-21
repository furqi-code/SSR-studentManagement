const express = require('express') ;
const Router = express.Router() ;
const bcrypt = require('bcrypt') ;
const jwt = require('jsonwebtoken') ;
const { SECRET } = require('../constants') ;
const { executeQuery } = require('../mySqldb/Query');
const passport = require("../passport-config") ;

// locally handling user Login in our DB
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

// OAuth login via Google and GitHub using passport.js

// path : /login/google
// Sabse pehle ye route chalega → ye Google ki login screen pr redirect karega phir passport config ka verify callback fnc chlega
Router.get('/google', passport.authenticate('google',{
    scope : ['profile', 'email'],
    prompt: 'consent select_account' // forces account selection on Google ka login screen + re-consent
}))

// path : /login/google/callback
// Jab Google login complete ho jata hai, to Google yahan redirect karta hai
Router.get('/google/callback', passport.authenticate('google',{
    session : false
}), function(req,res,next) {
    const user = req.user ; // contains your user from your DB
    console.log(user) ;
    if(user.is_admin === false || user.is_admin === 0 || user.is_admin === null){
        const token = jwt.sign(
            {
                is_admin : false,
                user_id : user.student_id
            },SECRET, {expiresIn: '1h'})
        res.cookie("user_detail", token, {httpOnly : true}) ;
    }
    res.redirect('/studentPage') ;
})


// path : /login/github
// Sabse pehle ye route chalega → ye Github ki login screen pr redirect karega phir passport config ka verify callback fnc chlega
Router.get('/github', passport.authenticate('github',{
    // scope : ['profile']
    // OR
    scope: ['user:email']
    // only FB & google gives you account selection ka login screen
}))

// path : /login/github/callback
// Jab Github login complete ho jata hai, to Github yahan redirect karta hai
Router.get('/github/callback', passport.authenticate('github',{
    session : false
}), function(req,res,next) {
    const user = req.user ; 
    console.log(user) ;
    if(user.is_admin === false || user.is_admin === 0 || user.is_admin === null){
        const token = jwt.sign(
            {
                is_admin : false,
                user_id : user.student_id
            },SECRET, {expiresIn: '1h'})
        res.cookie("user_detail", token, {httpOnly : true}) ;
    }
    res.redirect('/studentPage') ;
})


module.exports = {
    loginRouter: Router
}
