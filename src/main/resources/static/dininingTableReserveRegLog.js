var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/demoproject";
function checkIsNull(value) {
    return value === "" || value === undefined || value === null ? true : false;
}
let adminUser = "12345678";
let adminPassword = "Admin@1234";

function loginUser() {
    let requestBody = {
        "phoneNumId": $("#phoneNumId").val(),
        "password": $("#pwdId").val()
    }
    if (checkIsNull($("#phoneNumId").val()) || checkIsNull($("#pwdId").val())) {
        alert("Please fill Required Data");

    } else if (requestBody.phoneNumId.trim() === adminUser && requestBody.password === adminPassword) {
        localStorage.setItem("userName", "ADMIN");
        localStorage.setItem("userId", "1234567");
        window.location.href = "tableBookingOnline.html";

    } else {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/tableBookingUserRegister.json",
            //data: JSON.stringify(requestBody),
            success: function (response) {
                let loginUserList = [];
                for (let i in response) {
                    let data = response[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                let isValid = false;
                for (let i = 0; i < loginUserList.length; i++) {
                    if (loginUserList[i].contactNum == $("#phoneNumId").val() && loginUserList[i].password == $("#pwdId").val()) {
                        isValid = true;
                        localStorage.setItem("userId", loginUserList[i].userId);
                        localStorage.setItem("userData", JSON.stringify(loginUserList[i]));
                        $("#phoneNumId").val('');
                        window.location.href = "tableBookingOnline.html";

                    }
                }
                if (!isValid) {
                    alert("User not found");
                }

            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}
function registerUser() {

    if (checkIsNull($("#memberNameId").val()) || checkIsNull($("#userEmailId").val())
        || checkIsNull($("#passwordId").val()) || checkIsNull($("#contactId").val())) {
        alert("Please fill all the required data");
    } else {
        let requestBody = {
            "memberName": $("#memberNameId").val(),
            "emailId": $("#userEmailId").val(),
            "password": $("#passwordId").val(),
            "contactNum": $("#contactId").val()
        }
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/tableBookingUserRegister.json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                $('#regModelId').modal('hide');
                alert("Registerd sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}
$(document).ready(function () {
    $('#regModelId').on('hidden.bs.modal', function (e) {
        $("#memberNameId").val("");
        $("#userEmailId").val("");
        $("#passwordId").val("");
        $("#contactId").val("");
    })
})

