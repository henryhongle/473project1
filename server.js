var express = require('express'),
	bodyParser = require("body-parser"),
    handlebars  = require('express3-handlebars'),
 
    app = express();
 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.use(bodyParser.urlencoded( {extended: false}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname +'/public'));

//FIFO 
var end_iter = 0;
var start_iter = 0;
var data =[];


function doSetTimeout(i) {
	setTimeout(function() {
		data[i].visual = 0;
		start_iter++;
		console.log(data[i]);
	}, 300000); // 300 seconds = 5 minutes
}

//routing

//get static questions page
app.get('/questions', function (req, res) {
	res.render('questions');
});

//get static detail question page
app.get('/questions/:id', function (req, res) {
	if (req.params.id >= start_iter && req.params.id < end_iter) {
		res.render('question-detail', {questionID: req.params.id});
	}
	else {
		res.redirect("/questions");
	}
})

app.get('/about', function (req, res) {
	res.render('about');
});

//populate all questions
app.get('/api/questions', function(req, res) {
	var active_questions = [];
	for (var i = start_iter; i < end_iter; i++) {
		if(data[i].visual === 1) {
			active_questions.push(data[i]);
		}
	}
	res.json(active_questions);
});

//create new question
app.post('/api/questions', function(req, res) {
	var timeStamp = new Date().getTime();
	var new_ques  = { 	
						id: end_iter,
						title: req.body.title, 
						body: req.body.description,
						answer: [],
						num_ans: 0,
						timestamp: timeStamp,
						visual: 1
					};
	data.push(new_ques);
	console.log(new_ques);
	doSetTimeout(end_iter);
	end_iter++;

	var active_questions = [];
	for (var i = start_iter; i < end_iter; i++) {
		if(data[i].visual === 1) {
			active_questions.push(data[i]);
		}
	}
	res.json(active_questions);
});


//populate data for individual question
app.get('/api/questions/:id', function(req,res) {
		res.json(data[req.params.id]);
});

//create a reply on a particular question
app.post('/api/questions/:id',function(req,res) {
	data[req.params.id].answer.push(req.body.replyBody);
	data[req.params.id].num_ans++;
	res.json(data[req.params.id]);

});

//route back to the main page
app.get("*",function(req,res) {
	res.redirect("/questions");
});


app.listen(3000);