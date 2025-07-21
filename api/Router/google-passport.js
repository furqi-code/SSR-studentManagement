const express = require('express') ;
const Router = express.Router() ;
const jwt = require('jsonwebtoken') ;
const { SECRET } = require('../constants') ;
const passport = require("passport");
const { executeQuery } = require("../mySqldb/Query");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

Router.use(passport.initialize()) ;

// Configure Passport to use Google OAuth
passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENTID ,
    clientSecret : process.env.GOOGLE_CLIENTSECRET ,
    callbackURL : "/login/google/callback"
}, async function(accessToken, refreshToken, profile, cb) {
    try{
        console.log("passport.use() wala callback wala chl rha h") ;
        console.log(profile) ;
        let name = profile.displayName ;
        let username = profile.name.familyName ;
        let provider = profile.provider ;
        let email = profile.emails[0].value ;
        const created_at = new Date().toISOString().split('Z')[0].replace('T', ' ') ; 
        const user = await executeQuery(`select * from student_details where email = ?`, [email]) ;
        if(user.length > 0){
            cb(null, user[0]) ;
        }else{      // sorting doesnt work via third-party login users
            await executeQuery(`insert into student_details(name, Email, username, is_active, is_admin, Provider, created_at) 
                values(?,?,?,?,?,?,?)`, [name, email, username, -1, 0, provider, created_at]) ;
            const newUser  = await executeQuery(`select * from student_details where email = ?`, [email]) ;
            cb(null, newUser[0]) ;
        }
    }catch(error){
        cb(error, false) ;
    }
}))

// path : /login/google
// Sabse pehle ye route chalega → ye Google ki login screen pr redirect karega phir passport config ka verify callback fnc chlega
Router.get('/', passport.authenticate('google',{
    scope : ['profile', 'email'],
    prompt: 'consent select_account' // forces account selection on Google ka login screen + re-consent
}))

// path : /login/google/callback
// Jab Google login complete ho jata hai, to Google yahan redirect karta hai
Router.get('/callback', passport.authenticate('google',{
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

module.exports = {
    googlePassport : Router
}