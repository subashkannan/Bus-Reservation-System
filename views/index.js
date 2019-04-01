var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var swig = require('swig');
var MongoClient = require('mongodb').MongoClient;
var url="mongodb://localhost:27017/users";
var helmet = require('helmet');
var port = 3000;
var cancel = require('./routes/cancel');
var payments = require('./routes/payments');
var cancelTicket= require('./routes/cancelTicket');
var ticket= require('./routes/ticket');


const app = express();

var name="SignIn",link = "/signin";

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());
app.use(express.static(__dirname+"/views"));
app.use(session({secret: 'Avengers',name: 'EndgameSession', secure: true,
    httpOnly: true,resave: true,
    saveUninitialized: true}));
app.use('/',cancel);
app.use('/',payments);
app.use('/',cancelTicket);
app.use('/',ticket);


function isLoggedIn(req){
    	var sess = req.session;
    	return sess.user;
}


app.get('/',(req,res)=>{
console.log("got it");
  res.render('index.html');
});


app.get('/home',(req,res)=>{
  console.log("got it bro");

  if(isLoggedIn(req))
  {
    var sess = req.session;
    name = sess.user.uname;
    link = "/users?name=" + name;
  }
  console.log(name + " " + link );
  res.render('home.html',{"name":name,"link":link});

});

app.get('/book',(req,res)=>{
  if(isLoggedIn(req))
  {
    var sess = req.session;
    var name = sess.user.uname;
  }
  res.render('book.html',{name:name});
});

app.post('/buslist',(req,res)=>{
  console.log("its test");
    MongoClient.connect('mongodb://localhost:27017/users',(err,db)=>{
      if(err)
              {
                console.log(err);
                res.render("message.html",{"message":"some internal error. kindly refresh"});
          }
        else {
          var users  = db.db('users');
          var Buses = users.collection('Buses');
          Buses.find({"from":req.body.fromLoc,"to":req.body.toLoc}).toArray((err,data)=>{
            console.log(data.length);
            if(data.length ==  0)
            {
            console.log("1if");
            res.render("busli.html",{message:""});
            return;
            }
            else {
              console.log("bus");
                res.render("busli.html",{data:data,Source:req.body.fromLoc,Destination:req.body.toLoc,i:0});
              }

          });

        }
    });
});

app.get('/signup',function(req,res){

		res.render("signup.html");

});

app.post('/signup',function(req,res){
 	var uname = req.body.username;
		var password = req.body.password;
		//var hashpass = Hash(password);
		var email = req.body.email;
    MongoClient.connect(url,function(err,db){
		if(err)
						{
              console.log(err);res.render("message.html",{"message":"some internal error. kindly refresh"});
        }

   else {
     console.log("signup... ");
     var dbo = db.db("users");
     var users = dbo.collection("users");

     users.find({"uname":uname}).toArray(function(err,result){
			if(err)
							{console.log(err);res.render("message.html",{"message":"some internal error. kindly refresh"});}
			else
			{
			if(result.length == 0)
			{
        console.log(password);
				users.insertOne({"uname":uname,"password":password,"email":email
      });
				res.redirect("/");
			}
			else
				res.render("signup.html",{message:"user already registered"});

}		});

   }
  });
});



 app.post('/',(req,res)=>{
  console.log("got request");
  MongoClient.connect(url,function(err,db){
      if(err)
  				{
                console.log(err);res.render("message.html",{"message":"some internal error. kindly refresh"});
          }
      else {

        var dbo = db.db('users');
        var users = dbo.collection("users");
        var email = req.body.username;
        var password = req.body.password;
console.log("lol");
    if(!(email && password))
    {
      console.log("sal");
      res.redirect("/");return;
    }
   else
   {
     console.log(email);
   users.find({"email":email}).toArray(function(err,result){
        console.log(result.length);
        if(result.length ==  0)
				{
        console.log("1if");
				res.render("index.html",{message:"invalid username"});
				return;
				}

				if(password===result[0].password)
					{
            console.log("2if");

            console.log("password matched");
						sess = req.session;
						sess.user = result[0];
						res.redirect('/home',);
					}
				else
					res.render("index.html",{message:"wrong password"});

      });
    }
   }
 });

  });



app.listen(port);
