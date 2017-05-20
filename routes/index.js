var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express',user:req.session.user});
});


//注册
router.get('/register',function(req,res,next){
	res.render('register',{})
})
//登录
router.get('/ring',function(req,res,next){
	res.render('ring',{})
})

router.get('/yan',function(req,res,next){
	res.render('yan',{})
})

//退出
router.get('/relong',function(req,res,next){
	req.session.destroy(function(err){
		if(err){
			console.log(err)
		}else{
			res.redirect('/')
		}
	})
})

//留言
router.get('/shou',function(req,res,next){
	res.render('shou',{})
})

module.exports = router;
