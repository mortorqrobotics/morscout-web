function parseJSON(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return undefined;
    }
}

function getQS(obj) {
    var arr = Object.keys(obj);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = escape(arr[i]) + "=" + escape(obj[arr[i]]);
    }
    return arr.join("&");
}

function testConnection(next) {
    var file = "/favicon.ico";
    jQuery.ajaxSetup({
        async: false
    });
    r = Math.round(Math.random() * 10000);
    $.get(file, {
        subins: r
    }, function(d) {
        next(true);
    }).error(function() {
        next(false);
    });
}

function qs(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

function parseQS(str) {
    var arr = str.split("&");
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        var pair = arr[i].split("=");
        obj[unescape(pair[0])] = unescape(pair[1] || "");
    }
    return obj;
}
Array.prototype.last = function() {
    return this[this.length - 1];
};

function request(type, url, data, responsecb) {
    var xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");;
    xhr.open(type, url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            responsecb(xhr.responseText);
        }
    };
    xhr.send(data);
}

function areNumbers(nums) {
    for (var i = 0; i < nums.length; i++) {
        if (isNaN(nums[i])) {
            return false;
        }
    }
    return true;
}

function standardizeTime(ts) {
    var date = new Date(ts * 1000);
    var Hours = date.getHours();
    var suffix;
    if (parseInt(Hours) > 12) {
        Hours = (parseInt(Hours) - 12).toString();
        suffix = "PM";
    } else if (Hours == "12") {
        suffix = "PM";
    } else {
        suffix = "AM";
    }
    var Minutes = date.getMinutes();
    if (parseInt(Minutes) < 10) {
        Minutes = "0" + Minutes;
    }
    return Hours + ":" + Minutes + " " + suffix;
}



$.post("/validateUser", { //to change logout/login button
    userID: localStorage.userID
}, function(response) {
    if (response != "success") {
        localStorage.clear();
        $("#logoutButton").html("Log in");
        $("#logoutButton").attr("href", "login.html");
        $("#logoutButton").attr("id", "loginButton");
        //location = "login.html";
    } else {
        $("#loginButton").attr("id", "logoutButton");
        $("#logoutButton").attr("href", "#");
        $("#logoutButton").html("Log out");
    }
});

if (localStorage.admin != "true"){//settings are still secure on the server
	$("a[href='settings.html']").hide();
}


$("#logoutButton").on("click", function() {
    localStorage.clear();
    $.post("/logout", {}, function(response) { //don't make get
        if (response == "success") {
            location = "login.html";
        }
    });
});

$.post("/getTeammatesInfo", {}, function(response) {
    localStorage.teammates = JSON.stringify(response);
});


function synthesizeForm(dataPoints) {
    $('#form-preview').empty();
    var form = $('#form-preview');
    var colNum = 1;
    var colHolder = $(document.createElement('div'));
    colHolder.addClass('col-md-12');
    form.append(colHolder);
    for (var index = 0; index < dataPoints.length; index++)(function() {
        var i = index;
        var dataPoint = dataPoints[i];
        var dpName = dataPoint.name;
        var dpType = dataPoint.type;
        if (dpType == "radio") {
            var options = dataPoint.options;
            var div = $(document.createElement("div"));
            div.addClass("radio inp");
            div.attr("data-dpName", dpName);
            // if (oneColumn == true) {
            //   div.addClass('col-md-12');
            //   oneColumn = false;
            // }
            // else {
            //   div.addClass('col-md-6');
            // }
            for (var j = 0; j < options.length; j++) {
                var option = options[j];
                var input = $(document.createElement("input"));
                input.attr("type", "radio");

                input.attr("name", dpName);
                input.attr("id", option);
                input.addClass("report-check");
                var label = $(document.createElement("label"));
                label.addClass("report-text report-radio-check");
                label.attr("for", option);
                label.html(option);
                div.append(input);
                div.append(label);
                div.append("<br/>");
            }
            var p = $(document.createElement("p"));
            p.addClass("report-text");
            p.html(dpName);
            colHolder.append(div);

        } else if (dpType == "dropdown") {
            var div = $(document.createElement('div'));
            // if (oneColumn == true) {
            //   div.addClass('col-md-12');
            //   oneColumn = false;
            // }
            // else {
            //   div.addClass('col-md-6');
            // }
            div.addClass("dropdown inp");
            var options = dataPoint.options;
            var select = $(document.createElement("select"));
            select.attr("id", dpName);
            select.addClass("creator-dropdown");
            for (var j = 0; j < options.length; j++) {
                var optionText = options[j];
                var option = $(document.createElement("option"));
                option.html(optionText);
                select.append(option);
            }
            var p = $(document.createElement("p"));
            p.addClass("report-text");
            p.html(dpName + ": ");
            div.append(p);
            div.append(select);
            colHolder.append(div)
        } else if (dpType == "number") {
            var div = $(document.createElement('div'));
            div.addClass("number inp");
            // if (oneColumn == true) {
            //   div.addClass('col-md-12');
            //   oneColumn = false;
            // }
            // else {
            //   div.addClass('col-md-6');
            // }
            var start = dataPoint.start;
            var min = dataPoint.min;
            var max = dataPoint.max;

            var p = $(document.createElement("p"));
            p.addClass("report-text");
            p.html(dpName + ": ");

            var inputBox = $(document.createElement("input"));
            inputBox.attr("type", "number");
            inputBox.addClass("report-box-small inp-val-box");
            inputBox.attr("id", dpName);
            inputBox.attr("min", min);
            inputBox.attr("max", max);
            inputBox.val(start);
            inputBox.keyup(function() {
                if (parseInt($(this).val()) < parseInt($(this).attr("min")) || $(this).val().indexOf(".") > -1) {
                    $(this).val($(this).attr("min"));
                } else if (parseInt($(this).val()) > parseInt($(this).attr("max"))) {
                    $(this).val($(this).attr("max"));
                }
            });

            var inputBoxHandler = $

            var inputSubtract = $(document.createElement("input"));
            inputSubtract.attr("type", "button");
            inputSubtract.addClass("button add-minus-button");
            inputSubtract.attr("id", dpName);
            inputSubtract.val("-");
            inputSubtract.click(function() {
                var inpBox = $(this).parent().find(".inp-val-box").eq(0);
                if (parseInt(inpBox.val()) > parseInt(inpBox.attr("min"))) {
                    inpBox.val(parseInt(inpBox.val()) - 1);
                }
            });

            var inputAdd = $(document.createElement("input"));
            inputAdd.attr("type", "button");
            inputAdd.attr("id", dpName);
            inputAdd.addClass("button add-minus-button");
            inputAdd.val("+");
            inputAdd.click(function() {
                var inpBox = $(this).parent().find(".inp-val-box").eq(0);
                if (parseInt(inpBox.val()) < parseInt(inpBox.attr("max"))) {
                    inpBox.val(parseInt(inpBox.val()) + 1);
                }
            });
            div.append(p);
            div.append(inputSubtract);
            div.append(inputBox);
            div.append(inputAdd);
            colHolder.append(div);
        } else if (dpType == "checkbox") {
            var div = $(document.createElement('div'));
            div.addClass("checkbox inp");
            // if (oneColumn == true) {
            //   div.addClass('col-md-12');
            //   oneColumn = false;
            // }
            // else {
            //   div.addClass('col-md-6');
            // }
            var input = $(document.createElement("input"));
            input.attr("type", "checkbox");
            input.addClass("report-check");
            input.attr("id", dpName);
            var label = $(document.createElement("label"));
            label.attr("for", dpName);
            label.addClass("report-radio-check report-text");
            label.html(dpName);
            div.append(input);
            div.append(label);
            colHolder.append(div);
        } else if (dpType == "label") {
            var div = $(document.createElement('div'));
            div.addClass("label inp");
            colHolder = $(document.createElement('div'));
            colHolder.addClass('col-md-6');
            colNum++;
            form.append(colHolder);
            var h3 = $(document.createElement("h3"));
            h3.addClass("scout-div-title");
            h3.html(dpName);
            div.append(h3);
            colHolder.append(div);
        } else if (dpType == "text") {
            var div = $(document.createElement('div'));
            div.addClass("text inp");
            // if (oneColumn == true) {
            //   div.addClass('col-md-12');
            //   oneColumn = false;
            // }
            // else {
            //   div.addClass('col-md-6');
            // }
            var textarea = $(document.createElement("textarea"));
            textarea.addClass("report-area");
            textarea.attr("placeholder", dpName);
            div.append(textarea);
            colHolder.append(div);
        }
        // $('#form-preview').append("</br></br>");
    })();
}


function getScoutFormValues(context) {
    var form = $("#form-preview");
    var inputs = form.find(".inp");
    var values = [];
    for (var i = 0; i < inputs.length; i++) {
        var inp = $(inputs[i]);
        var dataPoint = {};
        var dpName;
        var value;
        var isLabel = false;
        if (inp.hasClass("number")) {
            dpName = inp.find(".inp-val-box").eq(0).attr("id");
            value = parseInt(inp.find(".inp-val-box").eq(0).val());
            if (!value) value = 0;
        } else if (inp.hasClass("text")) {
            dpName = inp.find(".report-area").eq(0).attr("placeholder");
            value = inp.find(".report-area").eq(0).val();
            if (!value) value = "none";
        } else if (inp.hasClass("label")) {
            dpName = inp.find("h3").eq(0).html();
            isLabel = true;
        } else if (inp.hasClass("checkbox")) {
            dpName = inp.find("input").eq(0).attr("id");
            value = inp.find("input").prop("checked");
        } else if (inp.hasClass("radio")) {
            dpName = inp.attr("data-dpName");
            value = $('.report-check[name="' + dpName + '"]:checked').attr("id"); //eh but works
        } else if (inp.hasClass("dropdown")) {
            dpName = inp.find(".creator-dropdown").eq(0).attr("id");
            value = inp.find(".creator-dropdown").eq(0).val();
        }
        dataPoint.name = dpName;
        if (!isLabel) dataPoint.value = value;
        values.push(dataPoint);
    }
    var send = {};
    var regional = JSON.parse(localStorage.allMatches)[0].key.split("_")[0];
    if (context == "match") {
        send = {
            data: values,
            team: currentTeam,
            context: context,
            match: currentMatch,
            regional: regional
        }
    } else {
        send = {
            data: values,
            team: qs("team"),
            context: context,
            regional: regional
        }
    }
    sendReport(send);
}

function getScoutForm(context){
    testConnection(function(exists){
        if (exists){
            $.post("/getScoutForm", {context: context}, function(response){
                if (response != "fail"){
                    var scoutFormDPS = JSON.parse(response);
                    if (context == "match") localStorage.matchForm = response;
                    else if (context == "pit") localStorage.pitForm = response
                    synthesizeForm(scoutFormDPS);
                }
                else {
                    alert("Failed to retrieve scout form");
                }
            });
        }
        else {
            if (context == "match") synthesizeForm(JSON.parse(localStorage.matchForm));
            else if(context == "pit") synthesizeForm(JSON.parse(localStorage.pitForm));
        }
    });
}

testConnection(function(exists){
    if (exists){
        if (localStorage.pendingReports){
            var pendingReports = JSON.parse(localStorage.pendingReports);
            for (var i = 0; i < pendingReports.length; i++)(function(){
                sendReport(pendingReports[i]);
            })();
            localStorage.pendingReports = "[]";
        }
    }
});

function sendReport(send){
    testConnection(function(exists){
        if (exists){
            $.post("/submitReport", send, function(response) {
                if (response == "success") {
                    $('#submit-match-report').html('Done!');
                    $('#submit-match-report').prop('disabled', true);
                    $('#submit-match-report').removeClass('button-hovered');
                    $('#submit-match-report').removeClass('button');
                    $('#submit-match-report').addClass('button-disabled');
                    $('#submit-match-report').css({
                        "background-color": "#e9e9e9",
                        "color": "black"
                    });
                    setTimeout(function() {
                        $('#submit-match-report').html('Submit');
                        $('#submit-match-report').prop('disabled', false);
                        $('#submit-match-report').css({
                            "background-color": "orange",
                            "color": "black"
                        });
                        $('#submit-match-report').addClass('button');
                        $('#submit-match-report').removeClass('button-disabled');
                    }, 2500);
                    getAllMatchReports();
                } else {
                    alert("Invalid input. Failed to send form");
                }
            });
        }
        else {
            $('#submit-match-report').html('Done!');
            $('#submit-match-report').prop('disabled', true);
            $('#submit-match-report').removeClass('button-hovered');
            $('#submit-match-report').removeClass('button');
            $('#submit-match-report').addClass('button-disabled');
            $('#submit-match-report').css({
                "background-color": "#e9e9e9",
                "color": "black"
            });
            setTimeout(function() {
                $('#submit-match-report').html('Submit');
                $('#submit-match-report').prop('disabled', false);
                $('#submit-match-report').css({
                    "background-color": "orange",
                    "color": "black"
                });
                $('#submit-match-report').addClass('button');
                $('#submit-match-report').removeClass('button-disabled');
            }, 2500);
            var pendingReports = [];
            if (localStorage.pendingReports){
                pendingReports = JSON.parse(localStorage.pendingReports);
            }
            pendingReports.push(send);
            localStorage.pendingReports = JSON.stringify(pendingReports);
        }
    });
}

function getAllReports(){
    testConnection(function(exists){
        if (exists){
            $.post("/getAllReports", {}, function(response){
                if (response != "fail"){
                    localStorage.allReports = response;
                    //cb(JSON.parse(response));
                }
                else {
                    alert("Unable to get all reports");
                }
            });
        }
        else {
            //cb(localStorage.allReports);
        }
    });
}
getAllReports();


function addUserToDropdown(name, id) {
    var search = $('.nav-tbox');
    var li = $(document.createElement('li'));
	li.attr("data-id", id);
    li.addClass('search-drop-list-item');
    li.text(name);
    $('.search-drop-items').append(li);
}


$(document).on("click", ".search-drop-list-item", function(){
	location = "/profile.html?id=" + $(this).attr("data-id");
});

$('.nav-tbox').keyup(function() {
    var search = $('.nav-tbox');
    $('.search-drop-items').empty();
    if ($.trim(search.val()) != "") {
        var text = $(this).val().toLowerCase();
        var teammates = JSON.parse(JSON.parse(localStorage.teammates)); //fix server
		console.log(teammates)
        var filteredTeammates = teammates.filter(function(user) {
            return ~(user.firstName.toLowerCase() + " " + user.lastName.toLowerCase() + " " + user.username.toLowerCase()).indexOf(text);
        });
        if (filteredTeammates.length != 0) $(".search-drop").show();
        else $(".search-drop").hide();
        filteredTeammates.forEach(function(user) {
            addUserToDropdown(user.firstName + " " + user.lastName, user._id);
        });
    } else {
        $(".search-drop").hide();
    }
});

function loadDataViewer(selector, reports) {
    var yourTeam = reports.yourTeam;
    var otherTeams = reports.otherTeams;
    $(selector).empty();
    var div = $(document.createElement('div'));
    div.addClass("yourReportsView");
    var h3 = $(document.createElement("h3"));
    h3.addClass("scout-div-title");
    h3.html("Your Team");
    div.append(h3);
    $(selector).append(div);

    var div = $(document.createElement('div'));
    div.addClass("otherReportsView");
    var h3 = $(document.createElement("h3"));
    h3.addClass("scout-div-title");
    h3.html("Other Teams");
    div.append(h3);
    $(selector).append(div);

    for (var i = 0; i < yourTeam.length; i++) {
        var yourReport = yourTeam[i].data;

        var viewFormDiv = $(document.createElement('div'));
        viewFormDiv.addClass("row view_form");

        var reportIDDiv = $(document.createElement('div'));
        reportIDDiv.addClass("reportID");
        reportIDDiv.html("Report #" + (i + 1));

        viewFormDiv.append(reportIDDiv);
        $(".yourReportsView").append(viewFormDiv);


        var currentTable;
        var labelAdded = false;
        for (var j = 0; j < yourReport.length; j++) {
            var dp = yourReport[j];
            var isLabel = !dp.value;
            if (isLabel || j == 0) {
                var colDiv = $(document.createElement('div'));
                if (labelAdded) {
                    colDiv.addClass("col-md-5 col-sm-6 col-xs-12");
                    currentTable.parent().parent().addClass("col-md-5 col-sm-6 col-xs-12");
                }
                labelAdded = true;

                var newSectionDiv = $(document.createElement('div'));
                newSectionDiv.addClass("scout-div auto-view");

                var h3 = $(document.createElement("h3"));
                if (isLabel) h3.html(dp.name);
                h3.addClass("scout-div-title view-title");

                var table = $(document.createElement("table"));
                table.attr("id", "view-table");
                table.css("width: auto;");
                currentTable = table;

                newSectionDiv.append(h3);
                newSectionDiv.append(table);
                colDiv.append(newSectionDiv)
                viewFormDiv.append(colDiv);
            }
            if (!isLabel) { //NOT else if
                var tr = $(document.createElement("tr"));
                var key = $(document.createElement("td"));
                key.html(dp.name);
                var value = $(document.createElement("td"));
                value.html(dp.value);
                tr.append(key);
                tr.append(value);
                currentTable.append(tr);
            }
        }
    }
    for (var i = 0; i < otherTeams.length; i++) {
        var otherReport = otherTeams[i].data;

        var viewFormDiv = $(document.createElement('div'));
        viewFormDiv.addClass("row view_form");

        var reportIDDiv = $(document.createElement('div'));
        reportIDDiv.addClass("reportID");
        reportIDDiv.html("Report #" + (i + 1));

        viewFormDiv.append(reportIDDiv);
        $(".otherReportsView").append(viewFormDiv);


        var currentTable;
        var labelAdded = false;
        for (var j = 0; j < otherReport.length; j++) {
            var dp = otherReport[j];
            var isLabel = !dp.value;
            if (isLabel) {
                var colDiv = $(document.createElement('div'));
                if (labelAdded) {
                    colDiv.addClass("col-md-5 col-sm-6 col-xs-12");
                    currentTable.parent().parent().addClass("col-md-5 col-sm-6 col-xs-12");
                }
                labelAdded = true;

                var newSectionDiv = $(document.createElement('div'));
                newSectionDiv.addClass("scout-div auto-view");

                var h3 = $(document.createElement("h3"));
                if (isLabel) h3.html(dp.name);
                h3.addClass("scout-div-title view-title");

                var table = $(document.createElement("table"));
                table.attr("id", "view-table");
                currentTable = table;

                newSectionDiv.append(h3);
                newSectionDiv.append(table);
                colDiv.append(newSectionDiv)
                viewFormDiv.append(colDiv);
            } else {
                var tr = $(document.createElement("tr"));
                var key = $(document.createElement("td"));
                key.html(dp.name);
                var value = $(document.createElement("td"));
                value.html(dp.value);
                tr.append(key);
                tr.append(value);
                currentTable.append(tr);
            }
        }

    }
}
