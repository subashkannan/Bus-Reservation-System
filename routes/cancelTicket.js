const express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

var name = "SignIn";

function isLoggedIn(req){
     var sess = req.session;
     return sess.user;
}

router.get('/cancelTicket',(req,res)=>{
       //name = isLoggedIn(req);MongoClient.connect('mongodb://localhost:27017/users',(err,db)=>{
       var user = req.session.user;


       if(isLoggedIn(req))
         {
           var sess = req.session;
           name = sess.user.uname;

       MongoClient.connect('mongodb://localhost:27017/',(err,db)=>{
         if(err)
                 {
                   console.log(err);
                   res.render("message.html",{"message":"some internal error. kindly refresh"});
             }
           else {
             var users  = db.db('users');
             var tickets = users.collection('Bookings');
            console.log("\n\nCanceling ticket");
             tickets.find({"userid":user._id}).toArray((err,data)=>{

               console.log(data.length);
              // console.log(req.body.custId);

               if(data.length ==  0)
               {
               console.log("1if");
               res.render("cancellation.html",{message:""});
               return;
               }
               else {
                 console.log("bus");
                   res.render("cancellation.html",{data:data,name:name});
                 }

             });

           }
       });
     }
     else {
       res.render("cancellation.html",{data:undefined,name:name});
     }

});


router.post('/cancelTicket',(req,res)=>{

  MongoClient.connect("mongodb://localhost:27017/",(err,db)=>{

      var users = db.db("users");
      var tickets  = users.collection('Bookings');
      var bus = users.collection('Buses');
      var passenger = users.collection('users');
      var sess = req.session;
      var user = sess.user;
      var pnr  = parseInt(req.body.custId);
      console.log(user);
      console.log(req.body.custId);

      tickets.remove({"userid":user._id,"pnr":pnr},(err,result)=>{
         console.log("len : " + result.length);
         console.log(result);

        // users.({"userid":user._id,"pnr" : pnr});
        //  console.log(user._id +  " " + pnr);
        //  let uname  = user.uname;
        //  // passenger.find({uname:id}).toArray((err,resu)=>{
        //  //      if(err)
        //  //      console.log(err);
        //  //
        //  //      console.log(resu.length);
        //  //    });
         passenger.updateOne({uname:user.uname},
            {
              $pull:{pnr:pnr}},(err,resu)=>{
              if(err)
              console.log(err);
              console.log(resu);

            });

       });
      res.redirect('/cancel');
  });
});

module.exports = router;
