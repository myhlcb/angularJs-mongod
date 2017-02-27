//nav控制器
var navcon = angular.module('navcon', [])
navcon.controller('navController', function($scope, $http) {
	function nav() {
		$http({
			method: 'get',
			url: '/nav'
		}).success(function(data) {
			console.log(data)
			$scope.user = data.user
		})
	}
	nav()
	$scope.$on('change', function(data) {
		console.log(data)
		nav()
	})
	$scope.$on('reg', function(data) {
		console.log(data)
		nav()
	})
	$scope.loginout = function() {
		$http({
			method: 'GET',
			url: '/logout'
		}).success(function(data) {
			$scope.user = data.user
		})
	}
})
var search = angular.module('search', [])
search.controller('search', function($scope, $http) {
		$http({
			method: 'GET',
			url: '/search'
		}).success(function(data) {
			console.log(data)
			$scope.lists = data.posts
		})
	})
	//注册
var regList = angular.module('regList', [])
regList.controller('regController', function($scope, $http, $rootScope) {
		$scope.formData = {};

		$scope.reg = function() {
			$scope.formData.action = 'reg';
			$http({
				method: 'POST',
				url: '/reg',
				data: $.param($scope.formData),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(data) {
				console.log(data);
				if(!data.success) {
					$scope.message = data.message
				} else {
					$rootScope.$broadcast('reg')
					window.location.href = '#/index'
				}
			})
		}
	})
	//登录
var loginApp = angular.module('loginApp', []);
loginApp.controller('loginController', function($scope, $http, $rootScope) {

		$scope.formData = {};
		//发送的方法
		$scope.postForm = function() {
			//1.formData添加一个属性,action代表的就是请求的行为
			$scope.formData.action = 'login';
			console.log($.param($scope.formData))
			$http({
				method: "POST",
				url: '/login',
				data: $.param($scope.formData),
				//post请求加上请求头
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function(data) {
				console.log(data);
				if(!data.success) {
					//用户名密码错误
					$scope.message = data.message
				} else {
					//当前登录成功
					$rootScope.$broadcast('change')
					window.location.href = '#/index'
				}
			})
		}
	})
	//首页
var index = angular.module('index', []);
index.controller('arcListCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
				$http({
					method: 'post',
					url: '/arcList'
				}).success(function(data) {
					console.log(data)
					$scope.lists = data.posts
					$scope.pages = data.pages
						//每页多少条
					$scope.itemsPerpage = 5,
						//可以自动更换的每页多少条
						$scope.perPageOptions = [5, 7, 8, 10],
						//共几页
						$scope.total =data.total
						//当前的页数
					$scope.currentPage = 1})

						$scope.find = function(tag) {
							$http({
								method: 'get',
								url: '/tags/' + tag
							}).success(function(data) {
								console.log(data)
								window.location.href = '/#/tag'
							})
						}
					$scope.like = function(list) {
						var name = list.name
						var time = list.time.seconds
						var title = list.title
						var url = '/like/' + name + '/' + time + '/' + title
						$http({
							method: 'GET',
							url: url
						}).success(function(data) {
							console.log(data)
							list.like=data.post.like
						})
					}
					function changePage() {
							$scope.myhdata = {
								p: $scope.currentPage,
								limit: $scope.itemsPerpage
							}
							$http({
								method: 'post',
								url: '/arcList',
								data: $.param($scope.myhdata),
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							}).success(function(data) {
								console.log(data)
								$scope.lists = data.posts
								$scope.pages = data.pages
							})
						}
						$scope.$watch(function(){
                var newValue = $scope.currentPage + ' ' + $scope.itemsPerpage + ' ';
						return newValue},changePage)
					$scope.currentP = function(page) {
						$scope.currentPage = page
						$scope.myhdata = {
							p: $scope.currentPage,
							limit: $scope.itemsPerpage
						}
						console.log($.param($scope.myhdata))
					}
					$scope.prevPage = function() {
						$scope.currentPage = $scope.currentPage - 1
						if($scope.currentPage <= 1) {
							$scope.currentPage = 1
						}
						$scope.myhdata = {
							p: $scope.currentPage,
							limit: $scope.itemsPerpage
						}
						console.log($.param($scope.myhdata))
					}
					$scope.nextPage = function() {
						$scope.currentPage = $scope.currentPage + 1
						total=Math.ceil($scope.total / $scope.itemsPerpage)
						console.log(total)
						if($scope.currentPage >= total) {
							$scope.currentPage = total
						}
						console.log($.param($scope.myhdata))
					}
					$scope.article = function(list) {
						var name = list.name
						var time = list.time.seconds
						var title = list.title
						var url = '/u/' + name + '/' + time + '/' + title
						console.log(url)
						$http({
							method: 'GET',
							url: url
						}).success(function(data) {
							console.log(data)
							$scope.list = data.post
							window.location.href = '#/page'
						})
					}
				}])
			//发现
			var achieve = angular.module('achieve', [])
			achieve.controller('achieveController', function($scope, $http) {
				$http({
					method: 'get',
					url: '/archive'
				}).success(function(data) {
					console.log(data)
					$scope.posts = data.posts
				})

				$scope.article = function(list) {
					var name = list.name
					var time = list.time.seconds
					var title = list.title
					var url = '/u/' + name + '/' + time + '/' + title
					console.log(url)
					$http({
						method: 'GET',
						url: url
					}).success(function(data) {
						console.log(data)
						$scope.list = data.post
						window.location.href = '#/page'
					})
				}
				$scope.formDate = {}
				$scope.formDate.action = 'post'

				$scope.postKey = function() {
					console.log($.param($scope.formDate))
					$http({
						method: 'post',
						url: '/search',
						data: $.param($scope.formDate),
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).success(function(data) {
						console.log(data)
						$scope.posts = data.posts
					})
				}

			})
			//标签
			var tag = angular.module('tag', [])
			tag.controller('tagController', function($scope, $http) {
				$http({
					method: 'get',
					url: '/tagPosts'
				}).success(function(data) {
					console.log(data)
					$scope.posts = data.posts
				})
				$scope.article = function(list) {
					var name = list.name
					var time = list.time.seconds
					var title = list.title
					var url = '/u/' + name + '/' + time + '/' + title
					console.log(url)
					$http({
						method: 'GET',
						url: url
					}).success(function(data) {
						console.log(data)
						$scope.list = data.post
						window.location.href = '#/page'
					})
				}
			})
			//我的主页
			var personal = angular.module('personal', [])
			personal.controller('personCtrl', function($scope, $http) {
				$http({
					method: 'get',
					url: '/nav'
				}).success(function(data) {
					console.log(data)
					$scope.user = data.user
					var name = $scope.user.name
					$http({
						method: 'post',
						url: '/u/' + name
					}).success(function(data) {
						console.log(data)
						$scope.lists = data.posts
						$scope.pages = data.pages
						$scope.delete = function(list) {
							var name = list.name
							var time = list.time.seconds
							var title = list.title
							var url = '/remove/' + name + '/' + time + '/' + title
							$http({
								method: 'get',
								url: url
							}).success(function(data) {
								console.log(data)
								$scope.message = data.message
								window.location.reload()
							})
						}
						$scope.edit = function(list) {
							var name = list.name
							var time = list.time.seconds
							var title = list.title
							var url = '/edit/' + name + '/' + time + '/' + title
							$http({
								method: 'get',
								url: url
							}).success(function(data) {
								console.log(data)
								window.location.href = '#/edit'
							})
						}
					})
					$scope.currentP = function(page) {
						$scope.currentPage = page
						$scope.myhdata = {
							p: $scope.currentPage
						}
						console.log($.param($scope.myhdata))
						$http({
							method: 'post',
							url: '/u/' + name,
							data: $.param($scope.myhdata),
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).success(function(data) {
							console.log(data)
							$scope.lists = data.posts
							$scope.pages = data.pages
						})
					}
				})
			})
			//个人信息
			var reset = angular.module('reset', [])
			reset.controller('resetController', function($scope, $http) {
				$http({
					method: 'GET',
					url: '/person'
				}).success(function(data) {
					console.log(data)
					$scope.user = data.user
				})
			})
			//写日记
			var addcon = angular.module('addcon', [])
			addcon.controller('addCount', function($scope, $http) {
				$scope.post = {}
				$scope.postArt = function() {
					$scope.post.action = 'post'
					console.log($.param($scope.post))
					$http({
						method: 'POST',
						url: '/post',
						data: $.param($scope.post),

						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).success(function(data) {
						$scope.message = data.message
						console.log(data)
						window.location.href = '#/index'
					})
				}
			})
			var editcon = angular.module('editcon', [])
			editcon.controller('editCount', function($scope, $http) {
				$http({
					method: 'get',
					url: '/edit'
				}).success(function(data) {
					console.log(data)
					$scope.post = data.post
					var name = data.post.name
					var title = data.post.title
					var time = data.post.time.seconds
					var url2 = '/edit/' + name + '/' + time + '/' + title
					console.log(url2)
					console.log($.param($scope.post))
					$scope.postArt = function(post) {
						$scope.post.action = 'post'
						console.log($.param($scope.post))
						$http({
							method: 'POST',
							url: url2,
							data: $.param($scope.post),

							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).success(function(data) {
							$scope.message = data.message
							console.log(data)
							window.location.href = '#/person'
						})
					}
				})
			})
			var pageCont = angular.module('pageCont', [])
			pageCont.controller('pageContCtrl', function($scope, $http) {
				$http({
					method: 'GET',
					url: '/article'
				}).success(function(data) {
					console.log(data)
					$scope.user = data.user
					var name = data.article.name
					var time = data.article.time
					var title = data.article.title
						$scope.list = data.post
							//存储comment,先收集数据
						$scope.comment = {}
						var url2 = '/comment/' + name + '/' + time + '/' + title
						$scope.submitComt = function() {
							$scope.comment.action = 'comment';
							console.log('ssss')
							console.log($.param($scope.comment))
							console.log(url2)
							$http({
								method: 'POST',
								url: url2,
								data: $.param($scope.comment),
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							}).success(function(data) {
								console.log(data)
								window.location.reload()
							})
						}
					
				})
			})