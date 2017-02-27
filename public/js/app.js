//1.创建routerApp模块，引入ui.router路由
var routerApp = angular.module('routerApp',['ui.router','navcon','index','search','achieve','tag','personal','editcon','regList','loginApp','pageCont','reset','addcon']);
//2.调用run方法,对项目进行一些初始化的操作.
routerApp.run(function($rootScope,$state,$stateParams){
    //当前url地址信息
    //$stateParams 当前地址信息中的数据
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
})
//3.调用config方法，对服务进行配置或者是对路由进行设置
routerApp.config(function($stateProvider,$urlRouterProvider){
    //ui.router服务
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state('index',{
            url:'/index',
            views:{
            	 '':{
            	 	templateUrl:'view/myh.html'
            	 },
            	 'main@index':{
            	 	templateUrl:'view/grid.html'
            	 }
            }
       })
        .state('achieve',{
        	url:'/achieve',
        	templateUrl:'view/achieve.html'
        	
        })
        .state('tag',{
        	url:'/tag',
        	templateUrl:'view/tag.html'
        })
         .state('reg',{
            //正则
            url:'/reg',
           templateUrl:'view/reg.html'
          
        })
        .state('login',{
            url:'/login ',
            templateUrl:'view/login.html'
            
        })
        .state('person',{
        	url:'/person',
        	templateUrl:'view/person.html'
        	
        })
        .state('reset',{
            url:'/reset ',
            templateUrl:'view/reset.html'
          
        })
        .state('write',{
        	url:'/write',
        	templateUrl:'view/write.html'
        
        })
        .state('edit',{
        	url:'/edit',
        	templateUrl:'view/edit.html'
        
        })
        .state('upload',{
        	url:'/upload',
        	templateUrl:'view/upload.html'
        	
        })
        .state('page',{
        	url:'/page',
        	templateUrl:'view/page.html'

        })

})