function getQuestions() {
 		$.ajax({
	        url: '/api/questions',
	        dataType: 'json',
	        method: 'get',
	        success: function(data) {
	          	$('.main').html(questionsTemplate(data));  
	          	setInterval(function() {
 					getQuestions(); 
 					}, 3000);
	        	}
    		});
 	}

 	$(document).ready(function() {
 		questionsTemplate = Handlebars.compile($('#questionsTemplate').html());

 		getQuestions();
 		
		$('#questionForm').on('submit', function(evt) {
			//cancel the default action
			evt.preventDefault();
			$.ajax({
				url: '/api/questions',
				dataType: 'json',
				method: 'post',
				contentType: 'application/x-www-form-urlencoded',
				data: $('#questionForm').serialize(),
				success: function(data) {
					$('.main').html(questionsTemplate(data)); 
					$('#questionModal').modal('hide');
					$("#questionForm").get(0).reset();
				}
			});
		});   
 	});