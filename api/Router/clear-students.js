const express = require('express'); 
const Router = express.Router() ;
const { executeQuery } = require('../mySqldb/Query') ;

Router.delete('/', async function(req,res){
    try{
        await executeQuery(`delete from student_details`, []) ;
        res.status(200).send("All student deleted from DB") ;
    }catch(err){
        res.status(500).send({
            message : "All students couldnt delete"
        })
    }
})

module.exports = Router ;