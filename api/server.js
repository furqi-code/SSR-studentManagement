const express = require('express') ;
const app = express() ;
const bodyParser = require('body-parser') ;
const cors = require('cors') ;
const cookieParser = require('cookie-parser') ;
const { PORT } =  require('./constants') ;


// Local Modules
const { homeRouter } = require('./Router/homePage');
const { adminRouter } = require('./Router/adminPage');
const { adminSignin } = require('./Router/admin-signin');
const { admin_LogoutRouter } = require('./Router/admin-logout');
const { admission } = require('./Router/admission');
const { studentUpdated } = require('./Router/admin-editStudnt');
const { adminPrefill } = require('./Router/adminPrefill');
const softDelete = require('./Router/admin-softDelete');
const resetPassword = require('./Router/resetPassword') ;
const clear_All = require('./Router/clear-students') ;
const forgetPassword = require("./Router/forgetPassword") ;
const { studentRouter } = require('./Router/studntPage') ;
const { studntSignin } = require('./Router/studnt-signin');
const { student_LogoutRouter } = require('./Router/student-logout');
const { updateMyself } = require('./Router/studnt-editStudnt');
const { studentPrefill } = require('./Router/studentPrefill');


// Middlewares
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({extended : true})) ;
app.use(express.static(__dirname + "/public")) ;
app.use(cookieParser()) ;
app.use(
    cors({
    origin : "*" 
}))


// Route handler / middleware
app.use('/', homeRouter) ;
// admin
app.use('/admin-signin', adminSignin) ;
app.use('/adminLogout', admin_LogoutRouter) ;
app.use('/adminPage', adminRouter) ;
app.use('/addstudent', admission) ;
app.use('/editstudent', studentUpdated) ;
app.use('/adminPrefill', adminPrefill) ;
app.use('/resetPassword', resetPassword) ;
app.use('/softDelete', softDelete) ;
app.use('/clearStudents', clear_All) ;
// student
app.use("/forgotPassword", forgetPassword);
app.use('/studentPage', studentRouter) ;
app.use('/student-signin', studntSignin) ;
app.use('/studntLogout', student_LogoutRouter) ;
app.use('/editMyself', updateMyself) ;
app.use('/studentPrefill', studentPrefill) ;


app.listen(PORT, function () {
  console.log(`Server started on Port ${PORT}`);
});