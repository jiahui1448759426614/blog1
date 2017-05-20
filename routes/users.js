var express = require('express');
var router = express.Router();

var mongodb = require('mongodb').MongoClient;
var db_str = 'mongodb://localhost:27017/message';

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

//注册
router.post('/form', function(req, res, next) {
	//获取表单数据

	var user = req.body['user']
	var pass = req.body['pass']
	var email = req.body['email']

	//插入函数

	var insertdata = function(db, callback) {
		//插入的集合
		var coll = db.collection('message');
		//插入集合的文档数据
		var data = [{ user: user, pass: pass, email: email }]
		coll.insert(data, function(err, result) {
			if(err) {
				console.log(err)
			} else {
				callback(result)
			}
		})
	}

	//连接数据库

	mongodb.connect(db_str,function(err,db){
			if(err){
				console.log(err)
			}else{
				console.log('链接成功')
				//调用插入函数
				insertdata(db,function(result){
					console.log(result)
				})
				res.send('恭喜你，注册成功')
				//关闭数据库
				db.close()
			}	
		})	

})

//登录
router.post('/hoom', function(req, res, next) {

	var user = req.body['user']
	var pass = req.body['pass']

	var findData = function(db, callback) {

		var coll1 = db.collection('message');

		var data = { user: user, pass: pass }

		coll1.find(data).toArray(function(err, result) {
			callback(result)
		})

	}

	//连接数据库

	mongodb.connect(db_str, function(err, db) {
		if(err) {
			console.log(err)
		} else {
			console.log('成功')

			findData(db, function(result) {
				//					console.log(result)
				if(result.length > 0) {
					//							res.send('登录成功')

					req.session.user = result[0].user
					res.redirect('/')
					db.close()
				} else {
					res.send('账号错误')
				}
			})

		}
	})
})

//留言

router.post('/list',function(req,res,next){
//	console.log("sdasdsadsa")
	var user=req.session.user;
	if(user){
		//留言数据插入到xinxi集合中
		
		//获取留言板表单数据
		var biaoti=req.body['biaoti']
		var con=req.body['con']
		//插入函数
		var insertdata=function(db,callback){
			//找到要插入的集合
			var coll2=db.collection('xinxi')
			//设置需要插入集合的文档数据
			var data=[{biaoti:biaoti,con:con}]
			coll2.insert(data,function(err,result){
				if(err){
					console.log(err)
				}else{
					callback(result)
				}
			})
		}
		
		//链接数据库 
		mongodb.connect(db_str,function(err,db){
			if(err){
				console.log(err)
			}else{
				console.log('链接成功')
				//调用插入函数
				insertdata(db,function(result){
					console.log(result)
//					res.send('发布成功')
					res.redirect('/users/showlist')
					//关闭数据库
					db.close()
				})
			}	
		})	
		
	}else{
		res.send('session过期了')
	}
})

//显示留言数据
router.get('/showlist',function(req,res,next){
	
	var findData = function(db, callback) {

		var coll3 = db.collection('xinxi');

		coll3.find({}).toArray(function(err, result) {
			callback(result)
		})
	}

	//连接数据库

	mongodb.connect(db_str, function(err, db) {
		if(err) {
			console.log(err)
		} else {
			console.log('成功')
			
			findData(db,function(result){
				res.render('showlist',{shuju:result})
//					console.log(result)
			})
		}
	})
})

module.exports = router;