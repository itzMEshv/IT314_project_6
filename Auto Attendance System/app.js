const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose")
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
app.use(express.json())
app.use(express.urlencoded({extended:true}))
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

app.post("/login/student",async(req,res)=>{
    const usr = await user.findOne({email:req.body.email,password:req.body.password})
    if(usr){
        if(usr.role == "instructor"){
            res.redirect("/login/student")
        }
        else{
            res.send("Student Dashboard")
        }
    }else{
        res.redirect("/login/student")
    }
})
app.get("/login/student",(req,res)=>{
    res.render("login/studentLogin");
})

app.set("view engine","ejs")

app.get("/",async(req,res)=>{
    res.render("homePage/homePage");
});

app.get("/register/student",(req,res)=>{
    res.render("register/studentRegister")
})

// instructor login
app.post("/login/instructor",async(req,res)=>{
    const user = await User.findOne({email:req.body.email,role:"instructor"});
    if(!user){
        res.redirect("/login/instructor");
    }
    else{
        res.redirect("/dashboard/instructor");
    }
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
app.get("/dashboard/instructor",(req,res)=>{
    res.send("This is instructor dashboard")
})

app.listen(3000,()=>{
    console.log("Listening on port 3000")
});