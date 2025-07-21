const passport = require("passport");
const { executeQuery } = require("./mySqldb/Query");
var GitHubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;


// Configure Passport to use Google OAuth
passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENTID ,
    clientSecret : process.env.GOOGLE_CLIENTSECRET ,
    callbackURL : "/login/google/callback"
}, async function(accessToken, refreshToken, profile, cb) {
    try{
        console.log("passport.use() wala callback wala chl rha h") ;
        console.log("Google Profile:", profile);
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

module.exports = passport ;