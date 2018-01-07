var router=new VueRouter({
    linkActiveClass:"aa",
    routes:[
        {path:'/',
            component:Main,
            children:[
                {path:'/', component:Index},
                {path:'/add', component:add},
                {path:'/edit/:id',component:edit}
            ]
        },
        {path:'/login',component:Login},
        {path:'/reg',component:Reg},
    ]
})
router.beforeEach(function(to,from,next){
    if(to.path=='/login'||to.path=='/reg'){
        next();
    }else{
        if(!sessionStorage.login){
            router.push('/login');
        }else{
            next();
        }
    }
})