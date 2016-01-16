/*
$(document).ready(function() {
	if(localStorage.hasSynced == "true"){

		var jsonfile = JSON.parse(localStorage.teams);

		var table = document.createElement('table');

		var header_row = document.createElement('tr');

		var th1 = document.createElement('th');
		var th2 = document.createElement('th');

		var th_text1 = document.createTextNode("Team");
		var th_text2 = document.createTextNode("Name");

		th1.appendChild(th_text1);
		th2.appendChild(th_text2);

		header_row.appendChild(th1);
		header_row.appendChild(th2);

		table.appendChild(header_row);

		for (match_number = 0 ; match_number < Object.keys(jsonfile).length  ; match_number++) {

			var real_match_number = Object.keys(jsonfile)[match_number];
			var tr = document.createElement('tr');

			var td1 = document.createElement('td');
			var td2 = document.createElement('td');

			var text1 = document.createTextNode(real_match_number);
			var text2 = document.createTextNode(jsonfile[real_match_number]);

		    var data = JSON.parse(localStorage.data);
            var pitScouted = data[real_match_number] && data[real_match_number]["pit"];
            if(pitScouted){
              $(tr).addClass('pitScouted')
            }

			td1.appendChild(text1);
			td2.appendChild(text2);

			tr.appendChild(td1);
			tr.appendChild(td2);

			table.appendChild(tr);

		};

		document.body.appendChild(table);

		$('#loading').hide();
		$("tr:odd").addClass("odd_row");
		$("tr:first").addClass("first_row");
		$(table).addClass('teams_table');

		$('tr').not(".first_row").mouseenter(function(){
		    $(this).addClass('table_hover');
		});

		$('tr').not(".first_row").mouseleave(function(){
		    $(this).removeClass('table_hover');
		});

		$('tr').not(".first_row").click( function(){
			localStorage.pitTeam = $(this).children(":first").text();
			location = "reportTeam.html?" + getQS({"team" : $(this).children(":first").text(), "name" : $(this).children(":first").next().text()});
		});

		var $rows = $('.teams_table tr');
		$('#search').keyup(function() {
			$('tr').removeClass('odd_row');
		    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
		    if(val==""){
		    	$("tr:odd").addClass("odd_row");
		    }

		    $rows.show().filter(function() {
		        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
		        return !~text.indexOf(val);
		    }).hide();
		});

	} else {
		$('#search').hide();
		$('#loading').html('Log in first!');
			setTimeout(function(){
			location = "login.html";
		}, 1000)
	}
	$('#num_of_teams').html("("+Object.keys(JSON.parse(localStorage.teams)).length+")");
});
*/
