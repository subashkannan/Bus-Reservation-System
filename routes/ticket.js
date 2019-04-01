const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var name = "SignIn";

function rand(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}


router.post('/ticket',(req,res)=>{
  MongoClient.connect("mongodb://localhost:27017/",(err,db)=>{
      var users = db.db("users");
      var tickets  = users.collection('Bookings');
      var bus = users.collection('Buses');
      var passenger = users.collection('users');
      var sess = req.session;
      var user = sess.user;
      var pnr = rand(1,100000);
      console.log(user);
      console.log(req.body.custId);

      bus.find({"id":parseInt(req.body.custId)}).toArray((err,result)=>{
         console.log(result.length);
        tickets.insertOne({"userid":user._id,"bus":result[0],"pnr" : pnr});
         console.log(user._id +  " " + pnr);
         let uname  = user.uname;
         // passenger.find({uname:id}).toArray((err,resu)=>{
         //      if(err)
         //      console.log(err);
         //
         //      console.log(resu.length);
         //    });
         passenger.updateOne({uname:uname},
            {$push:{pnr:pnr}},(err,resu)=>{
              if(err)
              console.log(err);
              //console.log(resu);
            });

       });
      res.redirect('/payments');
  });
});

module.exports = router;
