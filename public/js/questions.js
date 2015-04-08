// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
 	$(document).ready(function() {
 		"use strict";
 		//handlebar compiler
 		var questionsTemplate = Handlebars.compile($("#questionsTemplate").html());

 		//AJAX get function to populate all active question
 		function getQuestions() {
 			var now = (new Date().getTime()) /1000;
	 		$.ajax({
		        url: "/api/questions",
		        dataType: "json",
		        method: "get",
		        success: function(data) {
		        	if (data.length === 0) {
		        		$(".main").html("<h4>There are no new questions yet. Be brave and ask one!</h4>");
		        	}
		        	else {
			        	for (var i =data.length-1; i >=0; i--) {
			        		//display countdown timeer
			        		data[i].timestamp = 300 - Math.round(now - data[i].timestamp);
			        	}
			          	$(".main").html(questionsTemplate(data));  	
		          	}
	    		}
	    	});
	 	}

	 	//Client side form validation for create a question form
	 	function formValidation(){
			var title = document.getElementById("title").value;
			var desc= document.getElementById("description").value;
			var warning, str;

			if (title === ""|| title.length < 5 || desc ==="" || desc.length < 5) {
				str = "*These fields are required with 5 minimum characters";
				warning = document.getElementById("warning");
				warning.firstChild.nodeValue = str;
				return false;
			}
			else {
				str = " ";
				warning = document.getElementById("warning");
				warning.firstChild.nodeValue = str;

			}
			return true;
		}

		//update all active question at every 1 second
 		getQuestions();
 		setInterval(function() {
			getQuestions();
		}, 1000);


 		//Post AJAX when create a question
		$("#questionForm").on("submit", function(evt) {
			//cancel the default action
			evt.preventDefault();
			if (formValidation()) {
				$.ajax({
					url: "/api/questions",
					dataType: "json",
					method: "post",
					contentType: "application/x-www-form-urlencoded",
					data: $("#questionForm").serialize(),
					success: function(data) {
						$(".main").html(questionsTemplate(data)); 
						$("#questionModal").modal("hide");
						$("#questionForm").get(0).reset();
					}
				});
			}
		});   
 	});
