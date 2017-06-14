var express = require('express');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var app = express();
app.use(bodyParser.json());

app.use(express.static('public'));  // public is a folder 

mongoose.connect('mongodb://localhost:27017/mittens');  // mittens is database

// Here Meow is a schema. It is like view and will bind to field which is under collection.
var Meow=mongoose.model('Meow',{
  text: String
})

// Get the data from meows table/ collection if exits the records.
app.get('/meows', function(req, res, next){
  Meow.find({}, function(err, meows){
    return res.json(meows);
  });
});

// We can ingest the data into meows collection / table through view Meow.
app.post('/meows', function(req, res, next){
  var newMeow = new Meow({
     text: req.body.newMeow
  });
  newMeow.save(function(err){
    return res.send("Added Successfully");
  });
});

// Here we can delete the records
app.put('/meows/remove', function(req, res, next){
var meowId=req.body.meow._id;		
		Meow.remove({_id: meowId}, function(err){
			return res.send("Deleted Successfully");
	});
});

// Listen on port 3001
app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
});

