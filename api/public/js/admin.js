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
            // jo bhi datatype date k mySql me h wese hi show hota h lekin get krne me wo "toISOString" format me hi send krta h which is still a string, not a Date
        }
    })
    .catch(function(err) {
        console.log("Prefill error:", err);
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

function search()
{
    let findBy = $("#searchInput").val() ;
    axios({
        method: 'GET',
        url: 'http://localhost:11000/search',
        params : {
            findBy
        }
    }).then(function(res){
        let student = res.data ;
        let html = '' ;
        student.forEach(function(student) {
        html += `
            <tr class="${student.deleted_at ? 'table-danger' : ''}">
                <td class="py-1">
                    <img src="${student.gender === 'Male'
                        ? 'https://img.icons8.com/office/36/000000/guest-male.png'
                        : 'https://img.icons8.com/office/36/000000/person-female.png'}" alt="image">
                </td>
                <td>${student.name}</td>
                <td>${student.fatherName}</td>
                <td>${student.email}</td>
                <td>${student.address}</td>
                <td>${student.contact}</td>
                <td>${student.grade}</td>
                <td>${student.gender}</td>
                <td>${student.username}</td>
                <td>${new Date(student.DOB).toISOString().split("T")[0]}</td>
                <td>${new Date(student.created_at).toISOString().split("T")[0]}</td>
                <td>${student.updated_at ? new Date(student.updated_at).toISOString().split("T")[0] : "N/A"}</td>
                <td>${student.deleted_at ? new Date(student.deleted_at).toISOString().split("T")[0] : "N/A"}</td>
                <td>${student.deleted_at ? "Inactive" : "Active"}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-secondary" onclick="resetPassword(${student.student_id})">Reset</button>
                        <button class="btn btn-sm btn-warning" onclick="editstudent(${student.student_id})" data-bs-toggle="modal" data-bs-target="#edit-info">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="removestudent('${student.username}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
    $("#studentTableBody").empty();
    $("#studentTableBody").append(html);
    // $("#studentTableBody").html(html);
    // jo bhi datatype date k mySql me h wese hi show hota h lekin get krne me wo "toISOString" format me hi send krta h which is still a string, not a Date
    })
    .catch(function(err){
        console.log("Error while Searching :", err);
        let html = `<tr>
                    <td colspan="15" class="text-center text-muted">No student found</td>
                </tr>`
        $("#studentTableBody").html(html) ;
    })
}

function sortedElements(student_array)
{
    let html = '' ;
    student_array.forEach(function(student) {
        html += `
            <tr class="${student.deleted_at ? 'table-danger' : ''}">
                <td class="py-1">
                    <img src="${student.gender === 'Male'
                        ? 'https://img.icons8.com/office/36/000000/guest-male.png'
                        : 'https://img.icons8.com/office/36/000000/person-female.png'}" alt="image">
                </td>
                <td>${student.name}</td>
                <td>${student.fatherName}</td>
                <td>${student.email}</td>
                <td>${student.address}</td>
                <td>${student.contact}</td>
                <td>${student.grade}</td>
                <td>${student.gender}</td>
                <td>${student.username}</td>
                <td>${new Date(student.DOB).toISOString().split("T")[0]}</td>
                <td>${new Date(student.created_at).toISOString().split("T")[0]}</td>
                <td>${student.updated_at ? new Date(student.updated_at).toISOString().split("T")[0] : "N/A"}</td>
                <td>${student.deleted_at ? new Date(student.deleted_at).toISOString().split("T")[0] : "N/A"}</td>
                <td>${student.deleted_at ? "Inactive" : "Active"}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-secondary" onclick="resetPassword(${student.student_id})">Reset</button>
                        <button class="btn btn-sm btn-warning" onclick="editstudent(${student.student_id})" data-bs-toggle="modal" data-bs-target="#edit-info">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="removestudent('${student.username}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
    $("#studentTableBody").empty();
    $("#studentTableBody").append(html);
    // $("#studentTableBody").html(html);
    // jo bhi datatype date k mySql me h wese hi show hota h lekin get krne me wo "toISOString" format me hi send krta h which is still a string, not a Date
}

$("#byName").on("click", function(){
    axios({
        method : "GET",
        url : "http://localhost:11000/sorting"
    })
    .then(function(res){
        let student_array = res.data ;
        student_array.sort(function(a,b){
            return a.name.localeCompare(b.name) ;
        })
        console.log(student_array) ;
        sortedElements(student_array) ;
    })
    .catch(function(err){
        console.log("Error fetching byName sorted list: ", err);
    })
})

$("#byUsername").on("click", function(){
    axios({
        method : "GET",
        url : "http://localhost:11000/sorting"
    })
    .then(function(res){
        let student_array = res.data ;
        student_array.sort(function(a,b){
            return a.username.localeCompare(b.username) ;
        })
        console.log(student_array) ;
        sortedElements(student_array) ;
    })
    .catch(function(err){
        console.log("Error fetching byUsername sorted list: ", err);
    })
})

$("#byGrade").on("click", function(){
    axios({
        method : "GET",
        url : "http://localhost:11000/sorting"
    })
    .then(function(res){
        let student_array = res.data ;
        student_array.sort(function(a,b){
            return a.grade.localeCompare(b.grade) ;
        })
        console.log(student_array) ;
        sortedElements(student_array) ;
    })
    .catch(function(err){
        console.log("Error fetching byGrade sorted list: ", err);
    })
})

$("#byGender").on("click", function(){
    axios({
        method : "GET",
        url : "http://localhost:11000/sorting"
    })
    .then(function(res){
        let student_array = res.data ;
        student_array.sort(function(a,b){
            return a.gender.localeCompare(b.gender) ;
        })
        console.log(student_array) ;
        sortedElements(student_array) ;
    })
    .catch(function(err){
        console.log("Error fetching byGender sorted list: ", err);
    })
})

function logout() 
{
    axios({
        method:'POST',
        url: 'http://localhost:11000/user-Logout'
    }).then(function(){
        window.open("/", "_parent") ;
    })
}