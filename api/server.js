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
const clear_All = require('./Router/clear-students') ;


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
app.use('/clearStudents', clear_All) ;



app.listen(PORT, function () {
  console.log(`Server started on Port ${PORT}`);
});