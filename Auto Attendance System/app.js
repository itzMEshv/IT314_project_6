const express = require("express");
const app = express();
const ejs = require("ejs");
const nodemailer = require('nodemailer');
const mongoose = require("mongoose")
const passport = require("passport");
const {initializingPassport,isAuthenticated} = require("./passportConfig");
const expressSession = require("express-session")
const path = require("path")
const multer = require("multer");

const user_name= 'saipatel11102';
const password= 'bzPkbThz4UbHrfYt';
const XLSX = require("xlsx");
const url = `mongodb+srv://saipatel11102:${password}@cluster0.kqrufux.mongodb.net/?retryWrites=true&w=majority`
//models
const User = require("./models/user");
const StudentEnrollment = require("./models/studentEnrollment");
const AllCourses = require("./models/allCourses")


mongoose.connect(url,{useNewUrlParser:true})
const con = mongoose.connection
con.on('open',()=>{
    console.log('Database connected...')
})


const emailName = "Regan Barrows";
const emailEmail = "regan.barrows@ethereal.email";
const emailPassword = "p8CcUksSMNfayHAXNA";

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./uploads");
    },
    filename: (req,file,callback)=>{
        callback(null,file.fieldname + '-' + Date.now() + path.extname(
            file.originalname
        ))
    } 
});

const upload = multer({storage:storage});

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
app.use('/coursePage',express.static(__dirname + '/views/coursePage'));


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
        try{
            const n = await User.find({
                email:req.body.email
            });
            if(n.length){
                res.redirect("/register/student");
            }
            else{
                const newUser=await User.create(req.body);
                res.redirect("/login/student")
            }
        }
        catch(err){
            console.log("Error");
            res.redirect("/register/student");
        }
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
        try{
            const newUser=await User.create(req.body);
            res.redirect("/login/instructor")
        }
        catch(err){
            res.redirect("/register/instructor");
            console.log("error");
        }
    }
});



// instructor dashboard
app.get("/dashboard/instructor",async(req,res)=>{
    if(!req.user)res.redirect("/");
    else{
        if(req.user.role == "student"){
            res.redirect("/dashboard/student");
        }
        else{
            try{
                // console.log(req.user.id.toString())
                const all = await AllCourses.find({instructorId:req.user.id});
                res.render("dashboard/instructorDashboard",{data:all,instructorEmail:req.user.email,firstName:req.user.firstName,lastName:req.user.lastName});
            }
            catch(err){
                console.log("Error");
                res.redirect("/dashboard/instructor");
            }
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
            try{
                const all = await StudentEnrollment.find({studentEmail:req.user.email});
                res.render("dashboard/studentDashboard",{data:all,studentEmail:req.user.email,firstName:req.user.firstName,lastName:req.user.lastName});
            }
            catch(err){
                console.log("Error");
                res.redirect("/dashboard/student");
            }
        }
    }
})

// add student for instructor
app.get("/addStudent/courseName/courseCode/courseId",(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else if(req.user.role == "student"){
        res.redirect("/dashboard/student");
    }
    else{
        let courseName = req.params.courseName;
        let courseCode = req.params.courseCode;
        res.render("addStudent/addStudent",{courseName:courseName,courseCode:courseCode});
        
    }
})

app.post("/addStudent/courseName/courseCode/courseId",upload.single("file"),async(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else if(req.user.role == "student"){
        res.redirect("/dashboard/student");
    } 
    else{
        const file = XLSX.readFile(req.file.path);
        const courseId = req.params.courseId;
        const courseName = req.params.courseName;
        const courseCode = req.params.courseCode;
        const sheets = file.SheetNames
        data = [];
        for (let i = 0;i<sheets.length;++i){
            const temp = XLSX.utils.sheet_to_json(
                file.Sheets[file.SheetNames[i]]
            );
            temp.forEach((res)=>{
                data.push(res);
            })
        }
        data.forEach(res=>{
            // send email to res.email
            const transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: `${emailEmail}`,
                    pass: `${emailPassword}`
                }
            });
        
            // Message object
            let message = {
                from: `${emailName} ${emailEmail}`,
                to: `${res.email}`,
                subject: `Enrollement in course ${courseCode}`,
                text: `Hello ${res.email}`,
                html: `<p><b>If you have not registered please register in <a href = 'http://localhost:3000' target = "__blank">Here</a></b></p>`
            };
        
            transporter.sendMail(message, (err, info) => {
                if (err) {
                    console.log('Error occurred. ' + err.message);
                    return process.exit(1);
                }
            })
        
        })
        res.redirect("/dashboard/instructor");
    }
});

// create course for instructor
app.post("/createCourse",async(req,res)=>{
    if(! req.user){
        res.redirect("/");
    }
    else if(req.user.role == "student"){
        res.redirect("/dashboard/student")
    }
    else{
        try{
            course = await AllCourses.create({
                courseCode: req.body.courseCode,
                instructorId: req.user.id,
                courseName:req.body.courseName
            });
            res.redirect("/dashboard/instructor");
        }
        catch(err){
            console.log("Error in creating course");
            res.redirect("/dashboard/instructor");
        }
    }
})
app.get("/createCourse",(req,res)=>{
    if(! req.user){
        res.redirect("/");
    }
    else if(req.user.role == "student"){
        res.redirect("/dashboard/student");
    }
    else{
        res.render("createCourse/createCourse")
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