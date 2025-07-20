const editModal = new bootstrap.Modal(document.getElementById("edit-info")) ;
const editToast = new bootstrap.Toast(document.getElementById('editToast'));

let student_id ;
function editstudent(id){
    student_id = id ;   // to use in updateStudent()
    axios({
        method: 'GET',
        url: 'http://localhost:11000/studentPrefill',
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
        url : 'http://localhost:11000/editmyself',
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

function logout() 
{
    axios({
        method:'POST',
        url: 'http://localhost:11000/user-Logout'
    }).then(function(){
        window.open("/", "_parent") ;
    })
}