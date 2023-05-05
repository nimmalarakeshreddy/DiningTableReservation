var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/demoproject";
const userId = localStorage.getItem("userId");
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    $scope.onload = function () {
        $scope.userData = localStorage.getItem("userData");
        $scope.userData = JSON.parse($scope.userData);
        $("#carouselExampleControls").show();
        $("#viewReserveTableDivId").hide();
        $("#viewUserDetailsDivId").hide();
        $("#feedBackDivId").show();
        $scope.tableBook = {};
        $scope.tableBook['price'] = 0;
        $scope.tableBook['noGaustDate'] = 0;
        $scope.reserveTableData = [];
        $scope.userName = localStorage.getItem("userName");
        $scope.orderDetails = {};
        $scope.getReserveTableData();
    }

    $scope.getCost = function (slot, gaust) {
        $scope.tableBook.price = slot * gaust;
    }
    $scope.logout = function () {
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        localStorage.clear();
        window.location.href = "dininingTableReserveRegLog.html";
    }
    $scope.bookTable = function () {
        $scope.tableBook["request"] = "Pending";
        switch ($scope.tableBook.slot) {
            case 5:
                $scope.tableBook['slotType'] = "Breakfast(5$ / Gaust)";
                break;
            case 10:
                $scope.tableBook['slotType'] = "Lunch (10$/Gaust)";
                break;
            case 15:
                $scope.tableBook['slotType'] = "Dinner (15$/Gaust)";
                break;
        }

        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/reserveTable/" + userId + ".json",
            data: JSON.stringify($scope.tableBook),
            success: function (response) {
                $scope.tableBook = {};
                alert("Data submitted sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getReserveTableData = function () {

        $scope.reserveTableData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/reserveTable/" + userId + ".json",
            success: function (response) {
                for (let i in response) {
                    let tableData = response[i];
                    tableData["bookingID"] = i;
                    tableData["userId"] = userId;
                    $scope.reserveTableData.push(tableData);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }

    $scope.getAdminReserveTableData = function () {
        $scope.reserveTableData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/reserveTable.json",
            success: function (response) {
                for (let data in response) {
                    for (let x in response[data]) {
                        let tableData = response[data][x];
                        tableData["userId"] = data;
                        tableData["bookingID"] = x;
                        $scope.reserveTableData.unshift(tableData);
                    }
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getOrderData = function (data) {
        $("#ammountId").val(data.price);
        $scope.orderDetails = data;
    }

    $scope.payBill = function () {
        if ($("#paymentModeId").val() == "") {
            alert("Please select payment mode");
        } else {
            let requestBody = {
                "request": $("#paymentModeId").val()
            }
            $.ajax({
                type: 'patch',
                contentType: "application/json",
                dataType: 'json',
                cache: false,
                url: URL + "/reserveTable/" + $scope.orderDetails.userId + "/" + $scope.orderDetails.bookingID + ".json",
                data: JSON.stringify(requestBody),
                success: function (response) {
                    $('#processToPayModalId').modal('hide');
                    $scope.userName == 'ADMIN' ? $scope.getAdminReserveTableData() : $scope.getReserveTableData();
                    alert("Payment sucessfully!!!");
                }, error: function (error) {
                    alert("Something went wrong");
                }
            });
        }
    }
    $scope.cancel = function (data) {
        let requestBody = { "request": "Cancel" }
        $.ajax({
            type: 'patch',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/reserveTable/" + data.userId + "/" + data.bookingID + ".json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                $scope.userName == 'ADMIN' ? $scope.getAdminReserveTableData() : $scope.getReserveTableData();
                alert("Booking Canceled!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.getUserDetails = function () {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/tableBookingUserRegister.json",
            success: function (response) {
                $scope.userTableData = [];
                for (let i in response) {
                    let data = response[i];
                    data["userId"] = i;
                    $scope.userTableData.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }

    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $("#carouselExampleControls").hide();
        $("#viewReserveTableDivId").hide();
        $("#viewUserDetailsDivId").hide();
        $("#feedBackDivId").hide();
        if (type == "MENU") {
            $("#carouselExampleControls").show();

        } else if (type == "VIEW_RESERVE_TABLE") {
            $("#viewReserveTableDivId").show();
            $scope.userName == 'ADMIN' ? $scope.getAdminReserveTableData() : $scope.getReserveTableData();

        } else if (type == "USER_DETAILS") {
            $scope.userTableData = [];
            $("#viewUserDetailsDivId").show();

            if ($scope.userName == 'ADMIN') {
                $scope.getUserDetails()
            } else {
                $scope.userTableData.push($scope.userData);

            }
        } else if (type == "FEEDBACK") {
            $("#feedBackDivId").show();
            if ($scope.userName == 'ADMIN') {
                $scope.getFeedbackData();
            }
        }
    }

    $scope.getFeedbackData = function () {
        $scope.feedbackTableData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/feedBack.json",
            success: function (response) {
                for (let i in response) {
                    let data = response[i];
                    data["userId"] = i;
                    $scope.feedbackTableData.push(data);
                }
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }

    $scope.addFeedback = function () {
        let requestBody = {
            "comment": $scope.commentsModel,
            "name": $scope.userData.memberName
        }
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/feedBack.json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                $scope.commentsModel = "";
                alert("Data submitted sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $(document).ready(function () {
        $('.carousel').carousel({
            interval: 1000
        })
    });
});
