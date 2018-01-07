var light=require("ueklight");
var router=light.Router();
var mysql=require("./mysql");
var md5=require("./md5");
router.get("/",function(req,res){
    res.render("index.html",{name:"light"});
});
router.get('/fetch',function(req,res){
    setTimeout(function(){
        mysql.query(`select * from demo`,function(err,data){
            if(err){
                res.end('err');
            }else{
                res.send(JSON.stringify(data));
            }
        })
    },2000)
})
router.get('/addCon',function(req,res){
    var name=req.query.name;
    var sex=req.query.sex;
    var age=req.query.age;
    setTimeout(function(){
        mysql.query(`insert into demo (name,sex,age) values ('${name}','${sex}','${age}')`,function(err,data){
            if(err){
                res.end('err');
            }else{
                res.send('ok');
            }
        })
    },2000)
})
router.get('/del/:id',function(req,res){
    var id=req.params.id;
    setTimeout(function(){
        mysql.query("delete from demo where id="+id,function(err,data){
            if(err){
                res.end('err');
            }else{
                res.end('ok');
            }
        })
    },2000)
})
router.get('/update/:id',function(req,res){
    var id=req.params.id;
    mysql.query('select * from demo where id='+id,function (err, data){
        if(err){
            res.end('err');
        }else{
            res.send(JSON.stringify(data));
        }
    })
})
router.get('/updateCon',function(req,res){
    var name=req.query.name;
    var sex=req.query.sex;
    var age=req.query.age;
    var id=req.query.id;
    setTimeout(function(){
        mysql.query(`update demo set name='${name}',sex='${sex}',age='${age}' where id=`+id,function(err,data){
            if(err){
                res.end('err');
            }else{
                res.send('ok');
            }
        })
    },2000)
});
router.get('/check',function(req,res){
    var name=req.query.name;
    var pass=md5(req.query.pass);
    var sql=`select * from admin where user='${name}' and pass='${pass}'`;
    mysql.query(sql,function(err,result){
        if(err){
            res.end('err');
        }else{
            if(result.length>0){
                var obj={code:md5(name),state:"ok"};
                console.log(JSON.stringify(obj));
                res.send(JSON.stringify(obj));
            }else{
                var obj={code:"",state:"err"};
                res.send(JSON.stringify(obj));
            }
        }
    })
});
router.get("/ayCheck",function(req,res){
    var name=req.query.name;
    mysql.query(`select * from admin where user='${name}'`,function(err,result){
        if(err){
            res.send('err');
        }else{
            if(result.length>0){
                res.send('err');
            }else{
                res.send('ok')
            }
        }
    })
});
router.post("/addUser",function(req,res){
    var name=req.body.name;
    var pass=md5(req.body.pass);
    mysql.query(`insert into admin (user,pass) values ('${name}','${pass}')`,function(err,result){
        if(err){
            res.end('err');
        }else{
            if(result.affectedRows>0){
                res.send('ok');
            }else{
                res.send('err');
            }
        }
    })
})