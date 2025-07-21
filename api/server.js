const express = require('express') ;
const app = express() ;
const bodyParser = require('body-parser') ;
const cors = require('cors') ;
const cookieParser = require('cookie-parser') ;
const { PORT } =  require('./constants') ;
require('dotenv').config();
// console.log(process.env) ;


// Local Modules
const { homeRouter } = require('./Router/homePage');
const { adminRouter } = require('./Router/adminPage');
const { admission } = require('./Router/admission');
const { studentUpdated } = require('./Router/admin-editStudnt');
const { adminPrefill } = require('./Router/adminPrefill');
const softDelete = require('./Router/admin-softDelete');
const resetPassword = require('./Router/resetPassword') ;
const clear_All = require('./Router/clear-students') ;
const forgetPassword = require("./Router/forgetPassword") ;
const { studentRouter } = require('./Router/studntPage') ;
const { loginRouter } = require('./Router/user-signin');
const { logoutRouter } = require('./Router/user-logout');
const { updateMyself } = require('./Router/studnt-editStudnt');
const { studentPrefill } = require('./Router/studentPrefill');
const { sortRouter } = require('./Router/sorting');
const { searchRouter } = require('./Router/search');
const {googlePassport} = require('./Router/google-passport');
const {githubPassport} = require('./Router/github-passport');


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
app.use('/user-signin', loginRouter) ;
app.use('/user-Logout', logoutRouter) ;
// admin
app.use('/adminPage', adminRouter) ;
app.use('/addstudent', admission) ;
app.use('/editstudent', studentUpdated) ;
app.use('/adminPrefill', adminPrefill) ;
app.use('/resetPassword', resetPassword) ;
app.use('/softDelete', softDelete) ;
app.use('/clearStudents', clear_All) ;
app.use('/sorting', sortRouter) ;
app.use('/search', searchRouter) ;
// student
app.use('/forgotPassword', forgetPassword);
app.use('/studentPage', studentRouter) ;
app.use('/editMyself', updateMyself) ;
app.use('/studentPrefill', studentPrefill) ;
app.use('/login/google', googlePassport) ;
app.use('/login/github', githubPassport) ;


app.listen(PORT, function () {
  console.log(`Server started on Port ${PORT}`);
});