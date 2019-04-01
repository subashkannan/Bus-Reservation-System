const express = require('express');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();

var name = "SignIn";

function isLoggedIn(req){
     var sess = req.session;
     return sess.user;
}

router.get('/mybookings',(req,res)=>{
 var user = req.session.user;

 if(isLoggedIn(req))
   {
     var sess = req.session;
     name = sess.user.uname;

 console.log("success  " + (req.session.user.uname));
 MongoClient.connect('mongodb://localhost:27017/',(err,db)=>{
   if(err)
           {
             console.log(err);
             res.render("message.html",{"message":"some internal error. kindly refresh"});
       }
     else {
       var users  = db.db('users');
       var tickets = users.collection('Bookings');
       tickets.find({"userid":user._id}).toArray((err,data)=>{
         console.log(data.length);
         if(data.length ==  0)
         {
         console.log("1if");
         res.render("mybookings.html",{message:""});
         return;
         }
         else {
           console.log("bus");
           res.render('mybookings.html',{name:name,data:data});
           }

       });

     }
 });
}
else {
  res.render('mybookings.html',{name:name,data:undefined});
}
});

module.exports = router;
