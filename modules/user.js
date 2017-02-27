

//对用户登录和注册的逻辑进行设计

//1.首先引用数据库连接文件
var mongo = require('./db');
//2.创建一个User类，在这里面对登录和注册进行设计
//User类的主要功能就是为了完成新增和查询操作，那么它应该是针对
//用户信息(users集合)进行的.
function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.nickname=user.nickname
}
module.exports = User;

//保存用户信息的save方法,注册
//1.打开数据库
//2.用户信息放到数据库里面，存放起来.
//3.关闭数据库
User.prototype.save = function(callback){
    //接收一下表单的数据，要保存的user对象
    var user = {
        name:this.name,
        nickname:this.nickname,
        password:this.password,
        email:this.email
        
    }
    //使用open方法打开数据库
    mongo.open(function(err,db){
        if(err){
            //如果发生了错误
            return callback(err);
        }
        //读取users集合
        db.collection('users',function(err,collection){
            if(err){
                mongo.close();
                return callback(err);
            }
            //将用户的信息存放到users集合当中去
            collection.insert(user,{safe:true},function(err,user){
                mongo.close();
                if(err){
                    return callback(err);
                }
                return callback(user[0]);//返回注册成功的用户名.
            })
        })
    })
}
//根据名称获取用户信息的get方法,登录
User.get = function(name,callback){
    //1.打开数据库
    mongo.open(function(err,db){
        //发生错误的时候
        if(err){
            return callback(err);
        }
        //2.还是读取users集合
        db.collection('users',function(err,collection){
            if(err){
                mongo.close();
                return callback(err);
            }
            //查询用户名
            collection.findOne({name:name},function(err,user){
                if(err){
                    return callback(err);
                }
                callback(null,user);//成功返回查询的用户信息.
            })
        })
    })
}
User.edit = function(name,callback) {
    //打开数据库
    mongo.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('users', function (err, collection) {
            if (err) {
                mongo.close();
                return callback(err);
            }
            //根据用户名、发表日期及文章名进行查询
            collection.findOne({
                "name": name,
            }, function (err, user) {
                mongo.close();
                if (err) {
                    return callback(err);
                }
                callback(null, user);
            });
        });
    });
 };
User.update=function(name,callback){
 mongo.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        
        db.collection('users', function (err, collection) {
            if (err) {
                mongo.close();
                return callback(err);
            }
            //更新个人信息
            collection.update({
                //查询
                name: name
            }, {
                //真正的更新
                $set: {user:user}
            }, function (err) {
                mongo.close();
                if (err) {
                    return callback(err);
                }
                console.log(err)
                 callback(null);
            });
        });
    });
} 