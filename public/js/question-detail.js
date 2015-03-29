// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, strict: true, undef: true, unused: true */
 
//client side form validation for reply form
function formValidation(){
	"use strict";
	var reply = document.getElementById("answer").value;
	var warning, str = " ";
	if (reply === ""|| reply.length < 5) {
		str = "*This field is required with minimum 5 characters";
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