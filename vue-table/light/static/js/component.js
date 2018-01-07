//添加
var Info=Vue.component('Info',{
    props:['message','iShow'],
    template:`<div class="Info" v-show="iShow==true">{{message}}</div>`
})
//等待
var Wait=Vue.component('Wait',{
    props:['show'],
    template:`<div class="wait" v-show="show==true"></div>`
})
//表格
var Table=Vue.component('Table',{
    props:['TableHeader'],
    template:`<div>
        <table class="custom-table">
         <tr>
           <th v-for="item in TableHeader">{{item}}</th>
           <th>操作</th>
         </tr>
         <tr v-for="item in datas">
           <td>{{item.id}}</td>
           <td>{{item.name}}</td>
           <td>{{item.age}}</td>
           <td>{{item.sex}}</td>
           <td><a @click="del(item.id)" style="cursor:pointer;display: inline-block;font-size: 14px;">删除</a> <a :href="'#/edit/'+item.id" style="display: inline-block;font-size: 14px;">编辑</a></td>  
         </tr>
        </table>
        <Wait :show="show==true"></Wait>
        <Info :iShow="iShow==true" message="删除成功"></Info>
        </div>
    `,//href加上“:”,成了变量，js识别，如果不加，会将href里的当做字符串
    data(){
        return{
            datas:[

            ],
            show:false,
            iShow:false,
        }
    },
    mounted(){
        var that=this;
        this.show=true;
        fetch('/fetch').then(function(e){
            return e.json();
        }).then(function(e){
            that.show=false;
            that.datas=e;
        })
    },
    methods:{
        del(id){
            this.show=true;
            fetch('/del/'+id).then((e)=>{
                return e.text();
            }).then((e)=>{
                if(e=='ok'){
                    this.datas=this.datas.filter(ele=>ele.id!=id);
                    this.show=false;
                    this.iShow=true;
                }
            })
            this.iShow=false;
        }
    }
})

var Index=Vue.component('index',{
    template:`
              <Table :TableHeader="['id','姓名','年龄','性别']"></Table>
            `
})
var Main=Vue.component('Main',{
    template:`<div>
        <nav>
      <h1 style="line-height: 24px;">表格管理
        <router-link to="/" tag="div" class="link" aa exact>[首页]</router-link>
        <router-link to="/add" tag="div" class="link" active-class="bb">[添加]</router-link>
        <a @click="logOut" style="text-decoration:none;color:red;font-size: 14px;display: inline-block">退出</a>
    </h1>  
</nav>
        <router-view></router-view>
     </div>
    `,
    methods:{
        logOut(){
            sessionStorage.removeItem('login');
            this.name="";
            this.$router.push('/login');
        }
    }
})
//添加
var add=Vue.component('add',{
    template:`<div class="add">
                <form active="/addCon">
                  <div class="form-group">
                    <label for="name">name</label>
                    <input type="text" class="form-control" id="name" placeholder="name" v-model="name">
                  </div>
                  <div class="form-group">
                    <label for="age">age</label>
                    <input type="text" class="form-control" id="age" placeholder="age" v-model="age">
                  </div>
                  <div class="form-group">
                    <label for="sex">sex</label>
                    <input type="text" class="form-control" id="sex" placeholder="sex" v-model="sex">
                  </div>
                 
                  <button type="button" class="btn btn-default" @click="insert">添加</button>
                </form>
                <Wait :show="show==true"></Wait>
                <Info :iShow="iShow==true" message="提交成功"></Info>
             </div>`,
    data(){
        return {
            name:'',
            age:'',
            sex:'',
            show:false,
            iShow:false
        }
    },
    methods:{
        insert(){
            this.show=true;
            var dataString='name='+this.name+'&age='+this.age+'&sex='+this.sex;
            fetch('/addCon?'+dataString).then((e)=>{
                return e.text();
            }).then((e)=>{
                if(e=='ok'){
                    this.name='';
                    this.age='';
                    this.sex='';
                    this.iShow=true;
                    this.show=false;
                }
            })
            this.iShow=false;
        }
    }
})

var edit=Vue.component('edit',{
    template:`<div class="edit">
                <form>
                  <div class="form-group">
                    <label for="name">name</label>
                    <input type="text" class="form-control" id="name" placeholder="name" v-model="name">
                  </div>
                  <div class="form-group">
                    <label for="age">age</label>
                    <input type="text" class="form-control" id="age" placeholder="age" v-model="age">
                  </div>
                  <div class="form-group">
                    <label for="sex">sex</label>
                    <input type="text" class="form-control" id="sex" placeholder="sex" v-model="sex">
                  </div>
                 
                  <button type="button" class="btn btn-default" @click="update">Submit</button>
                </form>
                <Wait :show="show==true"></Wait>
                <Info :iShow="iShow==true" message="修改成功"></Info>
             </div>`,
    data(){
        return {
            name:'',
            sex:'',
            age:'',
            show:false,
            iShow:false
        }
    },
    methods:{
        update(){
            this.show=true;
            this.iShow=true;
            var dataString='name='+this.name+'&sex='+this.sex+'&age='+this.age+'&id='+this.$route.params.id;  //$route与$router的区别
            fetch('/updateCon?'+dataString).then(function(e){
                return e.text();
            }).then(function(e){
                if(e=='ok'){
                    this.show=false;
                    location.href="#/";
                    this.iShow=false;
                }
            })
        }
    },
    mounted(){
        var id=this.$route.params.id;
        this.show=true;
        fetch('/update/'+id).then((e)=>{
            return e.json();
        }).then((e)=>{
            this.name=e[0].name;
            this.sex=e[0].sex;
            this.age=e[0].age;
            this.show=false;
        })
    }
});
var Login=Vue.component("Login",{
    template:`
<div>
    <h2>欢迎登陆管理系统</h2>
    <form class="login">
    <div class="page">
     <h3 style="margin-top: 30px;font-size: 20px;color:#5bc0de">登录</h3><a href="#/reg" style="color:#222222;font-size: 20px;margin-top: 22px;">注册</a>
</div>
    <div class="tip">{{message}}</div>
    <span>账号:</span><input type="text" v-model="name" placeholder="请输入用户名"><br> 
    <span style="margin-top: 15px;">密码:</span><input type="password"  v-model="pass" placeholder="请输入密码"><br> 
           <input type="button" value="登录" @click="check">
</form>
</div>
    `,
    data(){
        return{
            name:"",
            pass:"",
            message:"",
            flag:false
        }
    },
    methods:{
        check(){
            var search='name='+this.name+'&pass='+this.pass;
            fetch('/check?'+search).then(function(e){
                return e.json();
            }).then((e)=>{
                if(e.state=='ok'){
                    sessionStorage.login=e.code;
                    this.flag=true;
                    this.message="* 登录成功"
                    setTimeout(function(){
                        location.href="/";
                    },1000)
                }else{
                    this.flag=false;
                    this.message="* 登录失败";
                    this.name="";
                    this.pass="";
                    this.$router.push("/login");
                }
            })
        }
    }
});
var Reg=Vue.component("Reg",{
    template:`
    <form class="login" style="height:260px;">
    <div class="page">
    <h3 style="color:#5bc0de;font-size:20px;margin-top: 30px;">注册</h3><a href="#/login" style="font-size: 20px;margin-top: 18px;color: #222222">登录</a>
</div>
    <div class="tip">{{message}}</div>
    <span style="margin-top: 20px">账号:</span><input type="text" v-model="name" placeholder="请输入用户名"  @blur="blur" name="name"><br> 
    
    <span style="margin-top: 5px">密码:</span><input type="password"  v-model="pass" placeholder="请输入密码"><br> 
    <span style="margin-top: 5px">确认:</span><input type="password"  v-model="pass1" placeholder="请再次输入密码"><br> 
    <input type="button" value="注册" @click="submit" style="margin-top: 14px;">
</form>
    `,
    data(){
        return{
            name:"",
            pass:"",
            pass1:"",
            message:"",
            flag:false
        }
    },
    methods:{
        blur(){
            var name=this.name;
            fetch('/ayCheck?name='+name).then(function(e){
                return e.text();
            }).then((e)=>{
                if(e=='ok'){
                    this.flag=true;
                    this.message="";
                }else{
                    this.flag=false;
                    this.message="* 用户已存在";
                }
            })
        },
        submit(){
            fetch('/addUser',{
                method:"post",
                headers:{
                    "content-type":"application/x-www-form-urlencoded"
                },
                body:"name="+this.name+"&pass="+this.pass
            }).then((e)=>{
                return e.text();
            }).then((e)=>{
                if(e=='ok'){
                    this.$router.push('/');
                    this.name="";
                    this.pass="";
                    this.pass1="";

                }
            })
        }
    }
})

