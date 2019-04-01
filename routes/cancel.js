const express = require('express');
var router = express.Router();

var name = "SignIn";

function isLoggedIn(req){
    	var sess = req.session;
    	return sess.user;
}

router.get('/cancel',(req,res)=>{


  if(isLoggedIn(req))
  {
    var sess = req.session;
    name = sess.user.uname;
  }

  res.render('cancelSuccess.html',{name:name});
});

module.exports = router;
