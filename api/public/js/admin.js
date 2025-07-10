const addModal = new bootstrap.Modal(document.getElementById("information")) ;
const editModal = new bootstrap.Modal(document.getElementById("edit-info")) ;
const addToast = new bootstrap.Toast(document.getElementById('addToast'));
const editToast = new bootstrap.Toast(document.getElementById('editToast'));
const deleteToast = new bootstrap.Toast(document.getElementById('deleteToast'));
const clearToast = new bootstrap.Toast(document.getElementById('clearToast'));
const resetToast = new bootstrap.Toast(document.getElementById('resetToast'));

function addStudent(event)
{
    event.preventDefault() ;
    $("#nameError, #fatherNameError, #emailError, #phoneError, #usernameError, #addressError, #dobError, #gradeError, #genderError").text("") ;
    let name = $("#recipient-name").val() ;
    let fatherName = $("#recipient-fatherName").val() ;
    let email = $("#email").val() ;
    let address = $("#address").val() ;
    let phoneNumber = $("#phoneNumber").val() ;
    let dob = $("#dob").val() ;
    let grade = $("#studentClass").val() ;
    let username = $("#username").val() ;
    let gender = $("input[name='gender']:checked").val() ;

    axios({
        method : 'POST',
        url : 'http://localhost:11000/addstudent',
        data : {
            name, fatherName, email, address, phoneNumber, dob, grade, username, gender
        }
    })
    .then(function(res){
        $("#added").html("Admission completed").addClass("text-success") ;
        addModal.hide() ;
        addToast.show() ;
        setTimeout(function(){
            addToast.hide() ;
            location.reload() ;
        }, 2000) ;
    })
    .catch(function(err){
        console.log(err) ;
        $("#added").html("Admission failed. Try again!!").addClass("text-danger") ;
        location.reload() ;
    })
}

function deleteAll()
{
    axios({
        method: 'DELETE',
        url: 'http://localhost:11000/clearStudents'
    }).then(function(){
        clearToast.show() ;
        setTimeout(function(){
            clearToast.hide() ;
            location.reload() ;
        }, 2000)
    })
}

function logout() 
{
    axios({
        method:'POST',
        url: 'http://localhost:11000/adminLogout'
    }).then(function(){
        window.open("/", "_parent") ;
    })
}