const express = require('express');
var router = express.Router();

var name = "SignIn";

function isLoggedIn(req){
     var sess = req.session;
     return sess.user;
}

router.get('/payments',(req,res)=>{

  if(isLoggedIn(req))
    {
      var sess = req.session;
      name = sess.user.uname;
    }

  res.render('transaction.html',{name:name});
  //console.log("success  " + (req.session.user.uname));
});

router.post('/payments',(req,res)=>{
  if(isLoggedIn(req))
    {
      var sess = req.session;
      name = sess.user.uname;
    }
  res.render('successful.html',{name:name});
});

module.exports = router;
