const express = require("express") ;
const Router = express.Router() ;
const { Auth_user } = require('../middleware');
const {executeQuery} = require("../mySqldb/Query") ;

Router.use(Auth_user) ;

// sorting aren't working via third-party login users
Router.get('/', async function(req,res){
    try{
        let students = await executeQuery(`select * from student_details where username != 'admin' && password != 'admin123' && is_admin != 1`) ;
        if(students.length > 0)
            res.status(200).send(students) ;
        else{
            throw{
                message : "students not found"
            }
        }
    }catch(err){
        res.status(500).send({
            message : err ? err.message : "something went wrong"
        })
    }
})

module.exports = {
    sortRouter : Router
}