const express = require('express') ;
const Router = express.Router() ;
const jwt = require('jsonwebtoken') ;
const { SECRET } = require('../constants') ;
const passport = require("passport");
const { executeQuery } = require("../mySqldb/Query");
var GitHubStrategy = require("passport-github").Strategy;


Router.use(passport.initialize()) ;

// Configure Passport to use Github OAuth
passport.use(new GitHubStrategy({
    clientID : process.env.GITHUB_CLIENTID ,
    clientSecret : process.env.GITHUB_CLIENTSECRET ,
    callbackURL : "/login/github/callback"
}, async function(accessToken, refreshToken, profile, cb) {
    try{
        console.log("passport.use() wala callback wala chl rha h") ;
        console.log("GitHub Profile:", profile);
        let name = profile.displayName ;
        let username = profile.username ;
        let provider = profile.provider ;
        let profileUrl = profile.profileUrl; //  Email k column me ye daal rhe
        const created_at = new Date().toISOString().split('Z')[0].replace('T', ' ') ; 
        const user = await executeQuery(`select * from student_details where provider = ?`, [provider]) ;
        if(user.length > 0){
            cb(null, user[0]) ;
        }else{      // sorting doesnt work via third-party login users
            await executeQuery(`insert into student_details(name, Email, username, is_active, is_admin, Provider, created_at) 
                values(?,?,?,?,?,?,?)`, [name, profileUrl, username, -1, 0, provider, created_at]) ;
            const newUser  = await executeQuery(`select * from student_details where provider = ?`, [provider]) ;
            cb(null, newUser[0]) ;
        }
    }catch(error){
        cb(error, false) ;
    }
}))

// path : /login/github
// Sabse pehle ye route chalega → ye Github ki login screen pr redirect karega phir passport config ka verify callback fnc chlega
Router.get('/', passport.authenticate('github',{
    scope : ['profile']
    // OR
    // scope: ['user:email']
    // only FB & google gives you account selection ka login screen
}))

// path : /login/github/callback
// Jab Github login complete ho jata hai, to Github yahan redirect karta hai
Router.get('/callback', passport.authenticate('github',{
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
    githubPassport : Router
}