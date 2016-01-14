function urlGet(url) {
	var index = url.indexOf("?");
	if(!~index) {
		return {};
	}
	else {
		return parseQS(url.substring(index + 1));
	}
}
$(document).ready(function() {
	
	if(localStorage.hasLoggedIn){
		
		var jsonfile = JSON.parse(localStorage.matches)
		var data = urlGet(String(location));
		
		var r1 = document.createTextNode(jsonfile[data.match].red[0]);
		var r2 = document.createTextNode(jsonfile[data.match].red[1]);
		var r3 = document.createTextNode(jsonfile[data.match].red[2]);
		var b1 = document.createTextNode(jsonfile[data.match].blue[0]);
		var b2 = document.createTextNode(jsonfile[data.match].blue[1]);
		var b3 = document.createTextNode(jsonfile[data.match].blue[2]);
		
		document.getElementById('r1').appendChild(r1);
		document.getElementById('r2').appendChild(r2);
		document.getElementById('r3').appendChild(r3);
		document.getElementById('b1').appendChild(b1);
		document.getElementById('b2').appendChild(b2);
		document.getElementById('b3').appendChild(b3);
		
		$('#report_match_num').html(data.match);
		$('#report_match_time').html(data.time);
 		
	};

});

