let student_id;

$(document).ready(function(){
    index();
    $("#form").fadeToggle("slow");
});

function showForm()
{
    $("#form").show("slow");
}
$("#create").click(()=>{
    student_id = null;
    $("#form").fadeToggle("slow");
})

$.ajaxSetup({
    headers: {
        'Authorization': 'Bearer 123456789',
        'X-Requested-With': 'XMLHttpRequest'
    }
});

function index() {
    $("#students").html("");
    return $.ajax({
        url: "http://localhost:8000/api/students",
        method: "GET",
        success: function ({data}) {
            data.map((student,index)=>{
                $("#students").append(`
                <tr>
                    <th scope="row">${index+1}</th>
                    <td>${student.first_name}</td>
                    <td>${student.last_name}</td>
                    <td>${student.age}</td>
                    <td>
                        <button class="btn btn-primary" onClick="edit(${student.id})">Edit</button>
                        <button class="btn btn-danger" onClick="destroy(${student.id})">Delete</button>
                    </td>
                </tr>
                `);
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function create() {
    const first_name = $("#first-name").val();
    const last_name = $("#last-name").val();
    const age = $("#age").val();
    let data = {
        first_name,
        last_name,
        age
    }
    return data;
}

function store() {
    
    let data = create();
    
    return $.ajax({
        url: "http://localhost:8000/api/students",
        data,
        method: "POST",
        success: function () {
            $("#form").hide("slow");
            $("#reset").trigger("click");
        },
        error: function ({responseJSON}) {
            displayErrors(responseJSON.errors);
        }
    });
}

function show(id) {
    $.ajax({
        url: `http://127.0.0.1:8000/api/students/${id}`,
        method: "GET",
        success: function ({data}) {
            console.log(data);
        }
    });
}

function edit(id) {
    $.ajax({
        url: `http://127.0.0.1:8000/api/students/${id}`,
        method: "GET",
        success: function ({data}) {
            $("#first-name").val(data.first_name);
            $("#last-name").val(data.last_name);
            $("#age").val(data.age);
            student_id = data.id;
            showForm();
        }
    });
}

function update(student_id) {
    let id = student_id;
    data = create();
    return $.ajax({
        url: `http://127.0.0.1:8000/api/students/${id}`,
        data,
        method: "PUT",
        success: function () {
            $("#form").hide("slow");
            $("#reset").trigger("click");
        },
        error: function ({responseJSON}) {
            displayErrors(responseJSON.errors);
        }
    });
}

function destroy(id) {
    if (confirm('Are you sure you want to delete it?')) {
        $.ajax({
            url: `http://127.0.0.1:8000/api/students/${id}`,
            method: "DELETE",
            success: function () {
                index();
            }
        });
    }
}

function displayErrors(errors)
{
    if(errors.first_name)
    {
        $("#err-first-name").html(errors.first_name[0]);
    }

    if(errors.last_name)
    {
        $("#err-last-name").html(errors.last_name[0]);
    }

    if(errors.age)
    {
        $("#err-age").html(errors.age[0]);
    }
}

$("#reset").on("click", function(){
    $("#err-first-name").html("");
    $("#err-last-name").html("");
    $("#err-age").html("");
});

$("#form").on("submit", (e)=>{
    e.preventDefault();
    if(student_id)
    {
        $.when(update(student_id)).done(()=>{
            index();
        });
    } else 
    {
        $.when(store()).done(()=>{
            index();
        });
    }
});
