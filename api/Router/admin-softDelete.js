const express = require('express') ;
const Router = express.Router() ;
const { executeQuery } = require('../mySqldb/Query') ;
const { Auth_admin } = require('../middleware') ;

Router.post('/', Auth_admin, async function(req,res){
    try{
        const username = req.query.username ;
        let existing_student = await executeQuery(`select * from student_details where username = ?`, [username]) ;
        if(existing_student.length > 0){
            let deleted_at = new Date().toISOString().split('Z')[0].replace('T',' ') ;
            await executeQuery(`update student_details set deleted_at = ? where username = ?`, [deleted_at, username]) ;
            res.status(200).send("this particular student Soft deleted") ;
        }else{
            throw{
                message : "information of this student do not exist"
            }
        }
    }catch(err){
        res.status(500).send("Something went wrong") ;
    }
})

module.exports = Router ;