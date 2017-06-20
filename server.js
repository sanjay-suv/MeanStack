var express = require('express');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var app = express();
app.use(bodyParser.json());

app.use(express.static('public'));  // public is a folder 

mongoose.connect('mongodb://localhost:27017/mittens');  // mittens is database


var jwt = require('jwt-simple');
var JWT_SECRET='catsmeow';

app.put('/users/signin', function(req, res, next){

  User.findOne({username:req.body.username}, function(err, user){
    bcrypt.compare(req.body.password, user.password, function(err, result){
      if(result){
        var token = jwt.encode(user, JWT_SECRET);
        return res.json({token:token});
      }
      else{
        return res.status(400).send();
      }
    });
  });
});


var bcrypt = require('bcryptjs');

app.post('/users', function(req, res, next){	
	bcrypt.genSalt(10, function(err,salt){
		bcrypt.hash(req.body.password,salt,function(err,hash){
			var newUser= new User({
				username: req.body.username,
				password: hash
			});
			newUser.save( function(err){
			return res.send();
	});
		});
	}) ;
});


// Here Meow is a schema. It is like view and will bind to field which is under collection.
var Meow=mongoose.model('Meow',{
  text: String
});

var User=mongoose.model('User', { 
 username: String, password: String  
});

app.post('/users', function(req, res, next){		
			var newUser= new User({
				username: req.body.username,
				password: req.body.password
			});
			newUser.save( function(err){
			return res.send();
	  });		
	}) ;

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
app.put('/meows123', function(req, res, next){
var meowId=req.body.meow._id;		
		Meow.remove({_id: meowId}, function(err){
			return res.send("Deleted Successfully");
	});
});

// Listen on port 3001
app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
});

