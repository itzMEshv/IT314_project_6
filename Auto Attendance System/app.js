const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose")
const passport = require("passport");
const {initializingPassport,isAuthenticated} = require("./passportConfig");
const expressSession = require("express-session")
const path = require("path")
const User = require("./models/user");
const user_name= 'saipatel11102';
const password= 'bzPkbThz4UbHrfYt';
const url = `mongodb+srv://saipatel11102:${password}@cluster0.kqrufux.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url,{useNewUrlParser:true})
const con = mongoose.connection
con.on('open',()=>{
    console.log('Database connected...')
})

initializingPassport(passport);
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(expressSession({secret:"secret",resave:false,
saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine","ejs")

//static files
app.use('/homePage',express.static(__dirname + '/views/homePage'));
app.use('/login',express.static(__dirname + '/views/login'));
app.use('/register',express.static(__dirname + '/views/register'));


// home page
app.get("/",async(req,res)=>{
    if(!req.user) res.render("homePage/homePage");
    else{
        if(req.user.role === "student")res.redirect("/dashboard/student");
        else res.redirect("/dashboard/instructor");
    }
});



// register student
app.get("/register/student",(req,res)=>{
    res.render("register/studentRegister")
})
app.post("/register/student",async(req,res)=>{
    const user = await User.findOne({email:req.body.email})
    if(user){
        res.redirect("/register/student")
    }
    else{
        const newUser=await User.create(req.body);
        res.redirect("/login/student")
    }
});


// login student
app.post("/login/student",passport.authenticate("local",{failureRedirect:"/login/student",successRedirect:"/dashboard/student"}),(req,res)=>{

})
app.get("/login/student",(req,res)=>{
    res.render("login/studentLogin");
})


// instructor login
app.post("/login/instructor",passport.authenticate("local",{failureRedirect:"/login/instructor",successRedirect:"/dashboard/instructor"}),(req,res)=>{
    
})
app.get("/login/instructor",(req,res)=>{
    res.render("login/instructorLogin");
})



// register new instructor
app.get("/register/instructor",(req,res)=>{
    res.render("register/instructorRegister");
})
app.post("/register/instructor",async(req,res)=>{
    const user = await User.findOne({email:req.body.email})
    if (user){
        res.redirect("/register/instructor");
    }
    else{
        const newUser=await User.create(req.body);
        res.redirect("/login/instructor")
    }
})



// instructor dashboard
app.get("/dashboard/instructor",async(req,res)=>{
    if(!req.user)res.redirect("/");
    else{
        if(req.user.role == "student"){
            res.redirect("/dashboard/student");
        }
        else{
            res.render("dashboard/instructorDashboard");
        }
    }
})


// student dashboard
app.get("/dashboard/student",async(req,res)=>{
    if(!req.user)res.redirect("/");
    else{
        if(req.user.role == "instructor"){
            res.redirect("/dashboard/instructor");
        }
        else{
            res.render("dashboard/studentDashboard");
        }
    }
})

// logout
app.get("/logout",(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

app.listen(3000,()=>{
    console.log("Listening on port 3000")
});