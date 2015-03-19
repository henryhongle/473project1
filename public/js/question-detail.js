	function getQuestion() {
		$.ajax({
	        url: '/api/questions/{{questionID}}',
	        dataType: 'json',
	        method: 'get',
	        success: function(data) {
	        	console.log(data);
    			if (data.visual === 1) {
	          		$('.main').html(replyTemplate(data));
	          		 setInterval(function() {
			 			getQuestion();
			 		}, 3000);
	          	}
	          	else {
	          		//window.location.replace('./');
	          	}       
	        },
	         error: function (request, error) {
		        //console.log(request);
		        //window.location.replace('./');
		        console.log(error);
		    }
	    });
	};


	$(document).ready(function() {
		replyTemplate = Handlebars.compile($('#replyTemplate').html());

		//setInterval(function(){ alert("Hello"); }, 3000)
		getQuestion();

		$('#replyForm').on('submit', function(evt) {
			//cancel the defualt action
			evt.preventDefault();
			$.ajax({
				url:'/api/questions/{{questionID}}',
				dataType: 'json',
				method: 'post',
				contentType: 'application/x-www-form-urlencoded',
				data:$(this).serialize(),
				success: function(data) {
					$('.main').html(replyTemplate(data));  
					$("#replyForm").get(0).reset();
				}
			});
		});
	});