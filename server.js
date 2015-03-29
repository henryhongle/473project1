var express = require('express'),
	bodyParser = require("body-parser"),
    handlebars  = require('express3-handlebars'), 
    app = express();

//using handlebar template 
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.use(bodyParser.urlencoded( {extended: false}));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname +'/public'));

/*
FIFO scheme for data
increment end iter when create a topic
then after 5 minutes increment start iter
*/
var end_iter = 0;
var start_iter = 0;
var data =[];

//this function increments start iter after 5 mins when a topic is created
function doSetTimeout(i) {
	setTimeout(function() {
		++start_iter;
	}, 300000); // 300 seconds = 5 minutes
}

//STATIC ROUTES
//get static questions page
app.get('/questions', function (req, res) {
	res.render('questions');
});

//get static detail question page
app.get('/questions/:id', function (req, res) {

	//only active question
	if (req.params.id >= start_iter && req.params.id < end_iter) {
		res.render('question-detail', {questionID: req.params.id});
	}
	else {
		res.redirect("/questions");
	}
});

//get static about page
app.get('/about', function (req, res) {
	res.render('about');
});

//LOGIC ROUTES
//populate all active questions
app.get('/api/questions', function(req, res) {
	var active_questions = [];
	for (var i = start_iter; i < end_iter; i++) {
		active_questions.push(data[i]);
	}
	res.json(active_questions);
});

//create a new question
app.post('/api/questions', function(req, res) {
	//rudimentary check for empty question title and description
	if (!req.body.title || !req.body.description) {
		res.redirect("/questions");	
	}
	else {
		//get current timestamp in second
		var timeStamp = (new Date().getTime()) /1000;

		//create a new question
		var new_ques  = { 	
							id: end_iter,
							title: req.body.title, 
							body: req.body.description,
							answer: [],
							num_ans: 0,
							timestamp: timeStamp
						};
		//add new question to the list
		data.push(new_ques);

		//increment start iter after 5 mins
		doSetTimeout(end_iter);
		end_iter++;

		//only active questions
		var active_questions = [];
		for (var i = start_iter; i < end_iter; i++) {
			active_questions.push(data[i]);
		}
		res.json(active_questions);
	}
});

//populate data for individual question
app.get('/api/questions/:id', function(req,res) {
	res.json(data[req.params.id]);
});

//create a reply on a particular question
app.post('/api/questions/:id',function(req,res) {

	//rudimentary check for empty reply form
	if (!req.body.replyBody) {
		//res.redirect('/questions');
		res.redirect('/api/questions/'+req.params.id);
	}
	else {
		//add reply to a particular question
		data[req.params.id].answer.push(req.body.replyBody);
		data[req.params.id].num_ans++;
		res.json(data[req.params.id]);
	}
});

//route back to the main page
app.get("*",function(req,res) {
	res.redirect("/questions");
});

app.listen(3000);