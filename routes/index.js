var User = require('../modules/user')
var Post = require('../modules/post')
var Comment = require('../modules/comment')
	//加密的模块
var crypto = require('crypto')
var multer = require('multer')
	//multer配置
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './public/upload')
	},
	filename: function(req, file, cb) {
		var name = req.session.user.name
		cb(null, `${name}.jpg`)
	}
})

var upload=multer({
	storage:storage
})


module.exports = function(app) {
	app.post('/arcList', function(req, res) {
		var page = req.body.p || 1
		var limit =req.body.limit || 5
		console.log(req.body)
		page=parseInt(page)
		limit=parseInt(limit)
		console.log(limit)
		Post.getFive(null,limit,page,function(err, posts, total) {
			if(err) {
				posts = [];
			}
			var pageCount = Math.ceil(total / limit)
			var pages = [page]

			function getPage(page, pageCount) {

				var left = page - 1
				var right = page + 1
				while(pages.length <=pageCount && (left > 0 || right <= pageCount)) {

					if(left > 0) pages.unshift(left--);
					if(right <= pageCount) pages.push(right++)

				}
				return pages
			}
			res.json({
                posts: posts,
                page: page,
                pageCount: pageCount,
                total: total,
                pages: getPage(page, pageCount)
             })

		});
		
	});
	//注册
	app.post('/reg', function(req, res) {
			//先获取注册信息
			var name = req.body.name
			var password = req.body.password
			var password_re = req.body.passwordRepeat
			var nickname = req.body.nickname
				//检查一下两次密码
			if(password_re != password) {
				req.flash('error', '两次密码不一样')
				res.json({
					success: false,
					message: req.flash('error').toString()
				})
			}
			//对密码加密处理
			var md5 = crypto.createHash('md5')
			var password = md5.update(req.body.password).digest('hex')
				//整理一下放到对象里面
			var newUser = new User({
					nickname: nickname,
					name: name,
					password: password,
					email: req.body.email
				})
				//检查一下用户名是否存在
			User.get(newUser.name, function(err, user) {
				if(err) {
					req.flash('error', err)

				}
				//用户名被占用
				if(user) {
					req.flash('error', '用户名被占')
					res.json({
						success: false,
						message: req.flash('error').toString()
					})
				}
				//正常可以存入数据
				newUser.save(function(err, user) {
					if(err) {
						req.flash('error', err)
					}
				})
				req.session.user = newUser;
				req.flash('success', '注册成功')

				res.json({
					success: true,
					message: req.flash('success').toString(),
					user:req.session.user
				})
				

			})
		})

		//登录
		app.get('/nav',function(req,res){
			res.json({user:req.session.user})
		})
	app.post('/login', function(req, res) {
			//先生称密码的加密
			var md5 = crypto.createHash('md5')
			var password = md5.update(req.body.password).digest('hex')
			User.get(req.body.name, function(err, user) {
				if(!user) {
					req.flash('error', '用户名不存在');
					res.json({
						success: false,
						message: req.flash('error').toString()
					})
				}
				//检查密码是否一致
				if(user.password != password) {
					req.flash('error', '密码错误');
					res.json({
						success: false,
						message: req.flash('error').toString()
					})
				}
				//都匹配之后，将用户的信息存入session
				req.session.user = user;
				req.flash('success', '登录成功');
				res.json({
					user:req.session.user,
					success: true,
					message: req.flash('success').toString()
				})

			})
		})
		//发布

	app.post('/post', function(req, res) {

			var currentUser = req.session.user;
			var tags = [req.body.tag1, req.body.tag2, req.body.tag3];
			var newPost = new Post(currentUser.name, req.body.title, tags, req.body.post);
			newPost.save(function(err) {
				if(err) {
					req.flash('error', err);

				}
				req.flash('success', '发布成功!');
				
			});
			res.json({
				message:req.flash('success').toString()
				})

		})
		//退出

	app.get('/logout', function(req, res) {
		req.session.user = null;
		res.json({user:req.session.user})
	})
	app.post('/logout', function(req, res) {

		})

	app.post('/upload', upload.single('myh'), function(req, res) {
		req.flash('success', '头像更新成功!');
		res.redirect('/#/reset')
	})
	app.get('/archive', function(req, res) {
		Post.getArchive(function(err, posts) {
			if(err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.json( {
				posts: posts,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});
	app.get('/tags', function(req, res) {
		Post.getTags(function(err, posts) {
			if(err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			res.render('tags', {
				title: '标签',
				posts: posts,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});
	app.get('/tags/:tag', function(req, res) {
		Post.getTag(req.params.tag, function(err, posts) {
			if(err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.session.tagPosts=posts
			res.json( {
				posts: posts,
				user: req.session.user,
			});
		});
	});
	app.get('/tagPosts',function(req,res){
		res.json({posts:req.session.tagPosts})
	})
	app.post('/u/:name', function(req, res) {
		var page = req.body.p || 1;
		var limit=req.body.limit || 5
		page=parseInt(page)
		limit=parseInt(limit)
		console.log(req.body)
		//检查用户是否存在
		User.get(req.params.name, function(err, user) {
			if(!user) {
				req.flash('error', '用户不存在!');
				return res.redirect('/');
			}
			//查询并返回该用户第 page 页的 10 篇文章
			Post.getFive(user.name,limit,page, function(err, posts, total) {
				if(err) {
					req.flash('error', err);
				}
			var pageCount = Math.ceil(total /limit)
			var pages = [page]
			
				function getPage(page, pageCount) {

				var left = page - 1
				var right = page + 1
				while(pages.length <= pageCount && (left > 0 || right <= pageCount)) {

					if(left > 0) pages.unshift(left--);
					if(right <= pageCount) pages.push(right++)

				}
				return pages
				console.log(pages)
			}
			res.json({
                posts: posts,
                page: page,
                pageCount: pageCount,
                total: total,
                pages: getPage(page, pageCount)
             })
			});
		});
	});
	app.post('/search', function(req, res) {
		Post.search(req.body.keyword, function(err, posts) {
			console.log(req.body)
			if(err) {
				req.flash('error', err);
				
			}
			res.json({
				title:req.body.keyword,
				posts: posts
			});
		});
	});
	//查询一篇文章
	app.get('/u/:name/:second/:title', function(req, res) {
		Post.getOne(req.params.name, req.params.second, req.params.title, function(err, post) {
			if(err) {
				req.flash('error', err);
				
			}
			req.session.article={
				name:post.name,
				time:post.time.seconds,
				title:post.title
			}
			req.session.post=post
			res.json({post: post,
				
			});
		});
	})
	//给文章点赞
		app.get('/like/:name/:second/:title', function(req, res) {
		Post.likeOne(req.params.name, req.params.second, req.params.title, function(err, post) {
			if(err) {
				req.flash('error', err);
				
			}
			req.session.article={
				name:post.name,
				time:post.time.seconds,
				title:post.title
			}
			res.json({post: post,
				
			});
		});
	})
	
	app.get('/article',function(req,res){
		res.json({article:req.session.article,
			user:req.session.user,
			post:req.session.post
		})
	})
	app.post('/comment/:name/:minute/:title', function(req, res) {
		var date = new Date(),
			time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
		var comment = {
			name: req.session.user.name,
			time: time,
			content: req.body.content
		};
		var newComment = new Comment(req.params.name, req.params.minute, req.params.title, comment);
		console.log(comment)
		newComment.save(function(err) {
			if(err) {
				req.flash('error', err);
				return res.redirect('back');
			}
			req.flash('success', '留言成功!');
			res.json({message:req.flash('success').toString()})
		});
	})

	app.get('/edit/:name/:second/:title', function(req, res) {
		var currentUser = req.session.user;
		Post.edit(currentUser.name, req.params.second, req.params.title, function(err, post) {
			if(err) {
				req.flash('error', err);
				return res.redirect('back');
			}
			req.session.post=post
			
			res.json({post:post})
		});
	});
    app.get('/edit',function(req,res){
		res.json({post:req.session.post
		
		})
	})
	
	app.post('/edit/:name/:second/:title', function(req, res) {
		var currentUser = req.session.user;
		Post.update(currentUser.name, req.params.second, req.params.title, req.body.post, function(err) {
			//encodeURI可以把字符串作为URI进行编码
			//url是http开头的uri
			var url = encodeURI('/u/' + req.params.name + '/' + req.params.second + '/' + req.params.title);
			if(err) {
				req.flash('error', err);
				return res.redirect(url); //出错！返回文章页
			}
			req.flash('success', '修改成功!');
			res.json({message:404})
		});
	});

	app.get('/remove/:name/:day/:title', function(req, res) {
		var currentUser = req.session.user;
		Post.remove(currentUser.name, req.params.day, req.params.title, function(err) {
			if(err) {
				req.flash('error', err);
				return res.redirect('back');
			}
			req.flash('success', '删除成功!');
			res.json({message:req.flash('success').toString()})
		});
	});

	app.get('/person', function(req, res) {
		var currentUser = req.session.user
		User.edit(currentUser.name, function(err) {
			console.log('get')
			if(err) {
				req.flash('error', err)
				return res.redirect('back')
			}
			res.json({
				title: '个人信息',
				user: req.session.user
               
			})

		})
	})

}