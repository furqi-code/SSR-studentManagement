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

let student_id ;
function editstudent(id){
    student_id = id ;   // to use in updateStudent()
    axios({
        method: 'GET',
        url: 'http://localhost:11000/adminPrefill',
        params : {
            id
        }
    })
    .then(function(res){
        if(res.data.length > 0)
        {
            const student = res.data[0] ;
            $("#recipient-name1").val(student.name);
            $("#recipient-fatherName1").val(student.fatherName);
            $("#email1").val(student.email);
            $("#address1").val(student.address);
            $("#phoneNumber1").val(student.contact);
            $("#dob1").val(new Date(student.DOB).toISOString().split('T')[0]); // isostring me hi arha h from mySql no matter the datatype in DB, dob me one month minus kyu arha h ? timezone ?? 
            $("#studentClass1").val(student.grade);
            if(student.gender === 'Male'){
                $("#male1").prop("checked", true);
            } else if (student.gender === 'Female') {
                $("#female1").prop("checked", true);
            }
        }
    })
    .catch(function(err) {
        console.error("Prefill error:", err);
    });
}
function updateStudent(event)
{
    event.preventDefault() ;
    $("#nameError1, #fatherNameError1, #emailError1, #addressError1, #phoneError1, #dobError1, #gradeError1, #genderError1").text("") ;
    let name = $("#recipient-name1").val() ;
    let fatherName = $("#recipient-fatherName1").val() ;
    let email = $("#email1").val() ;
    let address = $("#address1").val() ;
    let phoneNumber = $("#phoneNumber1").val() ;
    let dob = $("#dob1").val() ;
    let grade = $("#studentClass1").val() ;
    let gender = $("input[name='gender1']:checked").val() ;

    axios({
        method : 'PATCH',
        url : 'http://localhost:11000/editstudent',
        data : {
            name, fatherName, email, address, phoneNumber, dob, grade, gender
        },
        params : {
            student_id
        }
    })
    .then(function(res){
        $("#edited").html("Student updated").addClass("text-success") ;
        editToast.show() ;
        editModal.hide() ;
        setTimeout(function(){
            editToast.hide() ;
            location.reload() ;
        }, 2000) ;
    })
    .catch(function(err){
        console.log(err) ;
        $("#edited").html("this student do not exist").addClass("text-danger") ;
        location.reload() ;
    })
}

function resetPassword(id)
{
    axios({
        method: 'PATCH',
        url: 'http://localhost:11000/resetPassword',
        params : {
            id
        }
    }).then(function(){
        resetToast.show() ;
        setTimeout(function(){
            resetToast.hide() ;
            location.reload() ;
        }, 2000)
    })
}

function removestudent(username)
{
    axios({
        method : "POST",
        url : "http://localhost:11000/softDelete",
        params : {
            username
        }
    })
    .then(function(res){
        deleteToast.show() ;
        setTimeout(function(){
            location.reload() ;
        }, 2000) ;
        // we dont have student_id in the card isliye wo use nhi kiya find krne k liye and after reload <small> message gets dissappear so i used if() in admin.ejs
        // $(".card-body").each(function(){
        //     let text = $(this).find(".username").text();    // "Username : ice"
        //     let deletedUsername = text.replace("Username : ", "");  // "ice"
        //     if(username === deletedUsername){
        //         $(this).find(".studentDeleted").text("this student is soft deleted") ;
        //         deleteToast.show() ;
        //         // $("#deleteToast").toast("show");
        //         return ;
        //     }
        // })
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