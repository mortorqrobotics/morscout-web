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
        async: true
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

function loadStorage(){
    $.post("/getInfo", {}, function(response){
        var user = JSON.parse(response).user;
        var team = JSON.parse(response).team;
        localStorage.firstname = user.firstname;
        localStorage.lastname = user.lastname;
        localStorage.profpicpath = user.profpicpath;
        localStorage.teamCode = user.current_team.id;
        localStorage.teamName = team.name;
        localStorage.teamNumber = team.number;
        localStorage.scoutCaptain = user.current_team.scoutCaptain;
        localStorage.position = user.current_team.position;
        localStorage.username = user.username;
        localStorage.userID = user._id;
        localStorage.hasLoaded = "true";
    });
}
loadStorage();

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



// $.post("/validateUser", { //to change logout/login button
//     userID: localStorage.userID
// }, function(response) {
//     if (response != "success") {
//         localStorage.clear();
//         $("#logoutButton").html("Log in");
//         $("#logoutButton").attr("href", "http://morteam.com/login");
//         $("#logoutButton").attr("id", "loginButton");
//         //location = "login.html";
//     } else {
//         $("#loginButton").attr("id", "logoutButton");
//         $("#logoutButton").attr("href", "http://morteam.com/login");
//         $("#logoutButton").html("Log out");
//     }
// });

if (localStorage.position != "admin" && localStorage.scoutCaptain != "true"){//settings are still secure on the server
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
            div.addClass("checkbox inp orangeBack");
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

function createDropdownInput(textboxHolder, name) {
    var input = $(document.createElement("input"));
    input.attr("type", "text");
    input.attr("placeholder", "Option");
    if (name) input.val(name);
    input.addClass("option-box");
    textboxHolder.append(input);
    var added = false;
    input.keyup(function() {
        if ($.trim(input.val()) != "") {
            if (!added) {
                createDropdownInput(textboxHolder);
                added = true;
            }
        } else if (added) {
            input.remove();
        }
    });
}

function createNewDataPoint(dp) {
    var divWrapper = $(document.createElement("div"));
    divWrapper.addClass("dp-wrapper");
    var wrappers = $("#form-holder").find(".dp-wrapper");
    var dpNum = "1";
    if (wrappers.length != 0) {
        dpNum = parseInt($(wrappers[wrappers.length - 1]).attr("data-id")) + 1 + "";
    }
    divWrapper.attr("data-id", dpNum);
    var select = $(document.createElement("select"));
    select.addClass("creator-dropdown");
    select.attr("required", "true");
    var options = [{
        value: "label",
        name: "Section Title"
    }, {
        value: "text",
        name: "Text Box"
    }, {
        value: "dropdown",
        name: "Dropdown List"
    }, {
        value: "radio",
        name: "Radio Button"
    }, {
        value: "number",
        name: "Number Box"
    }, {
        value: "checkbox",
        name: "Check Box"
    }];
    for (var i = 0; i < options.length; i++) {
        var option = $(document.createElement("option"));
        option.attr("value", options[i].value);
        option.addClass("select-option");
        option.html(options[i].name);
        select.append(option);
    }
    if(dp){
        select.find(".select-option[value='"+dp.type+"']").eq(0).attr("selected", "true");
    }
    var inputMain = $(document.createElement("input"));
    inputMain.attr("type", "text");
    if(dp) inputMain.val(dp.name);
    inputMain.addClass("dp-box data-point-name");
    inputMain.attr("placeholder", "Data Point Name");
    var span = $(document.createElement("span"));
    span.addClass("glyphicon glyphicon-remove remove-dp btn-lg");
    var div = $(document.createElement("div"));
    div.addClass("form-options");
    if (dp && (dp.type == "radio" || dp.type == "dropdown")){
        for (var i = 0; i < dp.options.length; i++){
            createDropdownInput(div, dp.options[i]);
        }
        createDropdownInput(div);
    }
    else if (dp && dp.type == "number"){
        var input = $(document.createElement("input"));
        input.attr("type", "number");
        input.attr("placeholder", "start");
        input.addClass('start-box');
        input.val(dp.start);
        div.append(input);

        var input = $(document.createElement("input"));
        input.attr("type", "number");
        input.attr("placeholder", "min");
        input.addClass('min-box');
        input.val(dp.min);
        div.append(input);

        var input = $(document.createElement("input"));
        input.attr("type", "number");
        input.attr("placeholder", "max");
        input.addClass('max-box');
        input.val(dp.max);
        div.append(input);
    }
    span.attr("data-id", dpNum);
    select.attr("data-id", dpNum);
    inputMain.attr("data-id", dpNum);
    div.attr("data-id", dpNum);
    divWrapper.append(select);
    divWrapper.append(inputMain);
    divWrapper.append(span);
    divWrapper.append(div);
    $("#form-holder").append(divWrapper);
}

function loadCurrentForm(dataPoints){
    for (var i = 0; i < dataPoints.length; i++)(function(){
        var dataPoint = dataPoints[i];
        createNewDataPoint(dataPoint);
    })();
}

function loadCurrentRegional(){
    $.post("/getCurrentRegionalInfo", function(regionalInfo){
        if (!regionalInfo.Errors){
            localStorage.currentRegional = regionalInfo.key;
        }
    });
}
loadCurrentRegional();

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
            if (!value) value = "";
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
    var regional = localStorage.currentRegional;
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

function loadForms(){
    $.post("/getScoutForm", {context: "match"}, function(responseMatch){
        $.post("/getScoutForm", {context: "pit"}, function(responsePit){
            localStorage.matchForm = responseMatch;
            localStorage.pitForm = responsePit;
        });
    });
}
loadForms();

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
                    getAllReports();
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
if (localStorage.userID) getAllReports();


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
        var filteredTeammates = teammates.filter(function(user) {
            return ~(user.firstname.toLowerCase() + " " + user.lastname.toLowerCase() + " " + user.username.toLowerCase()).indexOf(text);
        });
        if (filteredTeammates.length != 0) $(".search-drop").show();
        else $(".search-drop").hide();
        filteredTeammates.forEach(function(user) {
            addUserToDropdown(user.firstname + " " + user.lastname, user._id);
        });
    } else {
        $(".search-drop").hide();
    }
});

$(document).on("click", ".remove-report", function(){
    var id = $(this).attr("data-id");
    if (window.confirm("Are you sure?")){
        $.post("/deleteReport", {id: id}, function(response){
            if (response == "success"){
                $("#view-tab").trigger("click");
            }
            else {
                alert("Failed to delete report");
            }
        });
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

        var span = $(document.createElement("span"));
        span.addClass("glyphicon glyphicon-remove remove-report btn-sm");
        span.attr("data-id", yourTeam[i]._id);
        if (localStorage.position == "admin" || localStorage.scoutCaptain == "true") reportIDDiv.append(span);

        viewFormDiv.append(reportIDDiv);
        $(".yourReportsView").append(viewFormDiv);


        var currentTable;
        var labelAdded = false;
        for (var j = 0; j < yourReport.length; j++) {
            var dp = yourReport[j];
            var isLabel = !(dp.value || dp.value == "");
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
                if (dp.value == "") dp.value = "N/A";
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
            var isLabel = !(dp.value || dp.value == "");
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

function loadAllMatchesTable(team){
    $.post("/getTeamReports", {teamNumber: team, reportContext: "match"}, function(response){
        var reports = JSON.parse(response).yourTeam;
        var allDataPoints = [];
        var table = $("#match-table");
        table.empty();
        var tr = $(document.createElement("tr"));
        tr.attr("id", "first-matches-row");
        var th = $(document.createElement("th"));
        //th.html("Data Points");
        tr.append(th);
        table.append(tr);
        $("#first-matches-row").append(th);
        var allReports = [];
        reports.sort(function(a, b) {
            return a.match - b.match;
        });
        for (var i = 0; i < reports.length; i++){
            var reportObj = {};
            reportObj.match = reports[i].match;
            reportObj.data = reports[i].data;
            allReports.push(reportObj);
            var th = $(document.createElement("th"));
            th.html("Match " + reports[i].match);
            $("#first-matches-row").append(th);
            var isOdd = true;
            for (var j = 0; j < reports[i].data.length; j++){
                if (reports[i].data[j].value && allDataPoints.indexOf(reports[i].data[j].name) < 0){
                    allDataPoints.push(reports[i].data[j].name);
                    var tr = $(document.createElement("tr"));
                    //tr.addClass(reports[i].data[j].name);
                    tr.attr("data-name", reports[i].data[j].name);
                    if (isOdd) {
                        tr.addClass("odd-row");
                        isOdd = false;
                    }
                    else {
                        isOdd = true;
                    }
                    var td = $(document.createElement("td"));
                    td.html(reports[i].data[j].name);
                    tr.append(td);
                    table.append(tr);
                }
            }
        }
        for (var i = 0; i < allDataPoints.length; i++){
            for (var j = 0; j < allReports.length; j++){
                var td = $(document.createElement("td"));
                for (var k = 0; k < allReports[j].data.length; k++){
                    var found = false;
                    if (allReports[j].data[k].name == allDataPoints[i]){
                        if (allReports[j].data[k].value == " ") allReports[j].data[k].value = "N/A";
                        td.html(allReports[j].data[k].value);
                        $("tr[data-name='" + allReports[j].data[k].name + "']").append(td);
                        found = true;
                        break;
                    }
                }
                if (!found){
                    td.html("--");
                }
                $("tr[data-name='" + allDataPoints[i] + "']").append(td);
            }
        }
    });

}
