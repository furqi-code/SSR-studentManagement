const adminLoginModal = new bootstrap.Modal(document.getElementById("admin-loginModal"));
const studloginModal = new bootstrap.Modal(document.getElementById("stud-loginModal"));
const forgotPassModal = new bootstrap.Modal(document.getElementById("forgotPassModal")) ;
const toast = new bootstrap.Toast(document.getElementById('forgotToast'));

const userRegex = /^[a-zA-Z][a-zA-Z0-9]{3,16}$/ ;
const passRegex = /^[a-zA-Z0-9]{3,12}$/ ;

function adminLogin(event)
{
    event.preventDefault() ;
    $("#signinErrorMessage0").html("") ;
    const username = event.target.admin_username.value ;
    const password = event.target.admin_pass.value ;

    // if(!userRegex.test(username)){
    //     $("#signinErrorMessage0").html("Username must start with a letter and length should be 4-17 characters") ;
    //     return ;
    // }
    // if(!passRegex.test(password)){
    //     $("#signinErrorMessage0").html("Password must contain 3-12 characters with letters and digits") ;
    //     return ;
    // }

    axios({
        method : "POST",
        url : "http://localhost:11000/user-signin",
        data : {
            username, 
            password 
        }
    })
    .then(function(response){
        $("#signinSuccessMessage0").html(
                "Login Successful, redirecting you to next page"
            );
        setTimeout(() => {
            adminLoginModal.hide()
            window.open('/adminPage') ;
        }, 400);
    })
    .catch(function(error){
        console.log(`Error occured while signing in ${error}`) ;
        $("#signinErrorMessage0").html("Username/Password is invalid") ;
    })
}

function studlogin(event)
{
    event.preventDefault() ;
    $("#signinErrorMessage1").html("") ;
    const username = event.target.stud_username.value ;
    const password = event.target.stud_pass.value ;

    // if(!userRegex.test(username)){
    //     $("#signinErrorMessage1").html("Username must start with a letter and length should be 4-17 characters") ;
    //     return ;
    // }
    // if(!passRegex.test(password)){
    //     $("#signinErrorMessage1").html("Password must contain 3-12 characters with letters and digits") ;
    //     return ;
    // }

    // pehle hm GET api call k baad .then() me POST req bhej rhe the chaining kr ke (async await use kr skte the) kyuki student_login table tha
    // ab hm extra table nhi bnarhe login_count check krne k liye
    axios({
        method : "POST",
        url : "http://localhost:11000/user-signin",
        data : {
            username, 
            password 
        }
    })
    .then(function(response){
        $("#signinSuccessMessage1").html(
                "Login Successful, redirecting you to next page"
            );
        setTimeout(() => {
            studloginModal.hide() ;
            window.open('/studentPage') ;
        }, 500);
    })
    .catch(function(error){
        console.log(`Error occured while signing in ${error}`) ;
        $("#signinErrorMessage1").html("first time?? change your password. Username/Password is invalid") ;
    })
}

function forgotPass(event) 
{
    event.preventDefault() ; 
    $("#resetPassMessage").html("") ;
    let email = event.target.email.value ;
    let newPassword = event.target.newPassword.value;
    let confirmPassword = event.target.confirmPassword.value;

    if(newPassword !== confirmPassword){
        $("#resetPassMessage").html("Passwords don't match").addClass("text-danger") ;
        return ;
    }
    // if(!emailRegex.test(email)){
    //     $("#resetPassMessage").html("Invalid email format") ;
    //     return ;
    // }
    // if(!passRegex.test(newPassword)){
    //     $("#resetPassMessage").html("Password must contain 3-12 characters with letters and digits") ;
    //     return ;
    // }     

    axios({
        method : "PATCH",
        url : "http://localhost:11000/forgotPassword",
        data : {
            email,
            newPassword,
            confirmPassword
        }
    })
    .then(function(res){
        $("#resetPassMessage").html("Your password changed successfully").addClass("text-success") ;
        toast.show() ;
        setTimeout(function(){
            // location.reload() ;
            forgotPassModal.hide() ;
            studloginModal.show() ;
            toast.hide() ; // automatically bhi hide ho rha lekin after few seconds (maybe cz of hide class)
        }, 2000)
    })
    .catch(function(err){
        console.log(`Error occured while Reset password ${err}`) ;
        $("#resetPassMessage").html("Try Again!!").addClass("text-danger") ; 
    })
}