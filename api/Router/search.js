const express = require("express") ;
const Router = express.Router() ;
const {executeQuery} = require("../mySqldb/Query") ;

Router.get('/', async function(req,res){
    try{
        // student_id == 1, admin ka h isliye ye nhi show krna
        const findBy = req.query.findBy ;
        let student = await executeQuery(`select * from student_details where (username=? OR name=? OR email=? OR student_id=?) AND student_id != 1`, [findBy,findBy,findBy,findBy]) ;
        if(student.length > 0)
            res.status(200).send(student) ;
        else{
            throw{
                message : "student not found"
            }
        }
    }catch(err){
        res.status(500).send({
            message : err ? err.message : "something went wrong"
        })
    }
})

module.exports = {
    searchRouter : Router
}