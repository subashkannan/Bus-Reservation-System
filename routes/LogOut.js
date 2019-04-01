const express = require('express');
var router = express.Router();

var name = "SignIn";

function isLoggedIn(req){
    	var sess = req.session;
    	return sess.user;
}

router.get('/LogOut',(req,res)=>{


  if(isLoggedIn(req))
  {
    var sess = req.session;
    sess.user = undefined;
  }

  res.redirect('/');
});

module.exports = router;
