function parseJSON(str) {
	try {
		return JSON.parse(str);
	}
	catch(e) {
		return undefined;
	}
}
function getQS(obj) {
	var arr = Object.keys(obj);
	for(var i = 0; i < arr.length; i++) {
		arr[i] = escape(arr[i]) + "=" + escape(obj[arr[i]]);
	}
	return arr.join("&");
}
function parseQS(str) {
	var arr = str.split("&");
	var obj = {};
	for(var i = 0; i < arr.length; i++) {
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



$.post("/validateUser", {//to change logout/login button
	userID: localStorage.userID
}, function(response){
	if (response != "success"){
		localStorage.clear();
		$("#logoutButton").html("Log in");
		$("#logoutButton").attr("href", "login.html");
		$("#logoutButton").attr("id", "loginButton");
		//location = "login.html";
	}
	else {
		$("#loginButton").attr("id", "logoutButton");
		$("#logoutButton").attr("href", "#");
		$("#logoutButton").html("Log out");
	}
});


$("#logoutButton").on("click", function(){
	localStorage.clear();
	$.post("/logout", {}, function(response){//don't make get
		if (response == "success"){
			location = "login.html";
		}
	});
});
