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

//const user_name= 'saipatel11102';
const password= '59qvguSDzT3XlS0c';
const XLSX = require("xlsx");
const xl = require("excel4node");
const url = `mongodb+srv://202001028:${password}@cluster0.fxivxyw.mongodb.net/?retryWrites=true&w=majority`
//models
const ActiveAttendance = require("./models/activeAttendance");
const AllCourses = require("./models/allCourses");
const AllLectures = require("./models/allLectures");
const StudentEnrollment = require("./models/studentEnrollment");
const User = require("./models/user");
const MarkAttendance = require("./models/markAttendance");
const allCourses = require("./models/allCourses");
const allLectures = require("./models/allLectures");
const studentEnrollment = require("./models/studentEnrollment");
const markAttendance = require("./models/markAttendance");
const user = require("./models/user");
const fs = require("fs");
mongoose.connect(url,{useNewUrlParser:true})
const con = mongoose.connection
con.on('open',()=>{
    console.log('Database connected...')
})


const emailEmail = "aas.auto.attendance.system@gmail.com"
const emailPassword = "gndwetnpeynkwxeb"

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
app.use('/dashboard',express.static(__dirname + '/views/dashboard'));
app.use('/addStudent',express.static(__dirname + '/views/addStudent'));
app.use('/attendanceCredentials',express.static(__dirname + '/views/attendanceCredentials'));
app.use('/createCourse',express.static(__dirname + '/views/createCourse'));
app.use('/lecturePage',express.static(__dirname + '/views/lecturePage'));
app.use('/openAttendance',express.static(__dirname + '/views/openAttendance'));
app.use('/pageNotFound',express.static(__dirname + '/views/pageNotFound'));
app.use('/studentCoursePage',express.static(__dirname + '/views/studentCoursePage'));


// utility function for password checking
isValidPassword = (password)=>{
    // for checking if password length is between 8 and 15
    if (!(password.length >= 8 && password.length <= 15)) {
      return false;
    }
   
    // to check space
    if (password.indexOf(" ") !== -1) {
      return false;
    }
   
    // for digits from 0 to 9
    let count = 0;
    for (let i = 0; i <= 9; i++) {
      if (password.indexOf(i) !== -1) {
        count = 1;
      }
    }
    if (count === 0) {
      return false;
    }
   
    // for special characters
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return false;
    }
   
    // for capital letters
    count = 0;
    for (let i = 65; i <= 90; i++) {
      if (password.indexOf(String.fromCharCode(i)) !== -1) {
        count = 1;
      }
    }
    if (count === 0) {
      return false;
    }
   
    // for small letters
    count = 0;
    for (let i = 97; i <= 122; i++) {
      if (password.indexOf(String.fromCharCode(i)) !== -1) {
        count = 1;
      }
    }
    if (count === 0) {
      return false;
    }
   
    // if all conditions fail
    return true;
  }



// home page
app.get("/",async(req,res)=>{
    if(!req.user) res.render("homePage/homePage");
    else{
        if(req.user.role === "student")res.redirect("/dashboard/student");
        else res.redirect("/dashboard/instructor");
    }
});



// student register
app.post("/register/student",async(req,res)=>{
    if (!req.body.firstName.length || !req.body.lastName.length || !req.body.email.length || !req.body.password.length || !(req.body.role == "student" || req.body.role == "instructor")) {
        res.redirect("/register2/student");
    }
    else{
        const user = await User.findOne({email:req.body.email})
        if(user){
            res.redirect("/register2/student")
        }
        else{
            try{
                if(!isValidPassword(req.body.password)){
                    res.redirect("/register2/student");
                }
                else{
                    const newUser=await User.create(req.body);
                    res.redirect("/login/student")
                }
            }
            catch(err){
                console.log("Error");
                res.redirect("/register2/student");
            }
        }
    }
});
app.get("/register/student",(req,res)=>{
    res.render("register/studentRegister")
})


// student register2
app.post("/register2/student",async(req,res)=>{
    if (!req.body.firstName.length || !req.body.lastName.length || !req.body.email.length || !req.body.password.length || !(req.body.role == "student" || req.body.role == "instructor")) {
        res.redirect("/register2/student");
    }
    else{
        const user = await User.findOne({email:req.body.email})
        if(user){
            res.redirect("/register2/student")
        }
        else{
            try{
                if(!isValidPassword(req.body.password)){
                    res.redirect("/register2/student");
                }
                else{
                    const newUser=await User.create(req.body);
                    res.redirect("/login/student")
                }
            }
            catch(err){
                console.log("Error");
                res.redirect("/register2/student");
            }
        }
    }
});
app.get("/register2/student",(req,res)=>{
    res.render("register/studentRegister2")
})


// student login
app.post("/login/student",passport.authenticate("local",{failureRedirect:"/login2/student",successRedirect:"/dashboard/student"}),(req,res)=>{

})
app.get("/login/student",(req,res)=>{
    res.render("login/studentLogin");
})



// student login2
app.post("/login2/student",passport.authenticate("local",{failureRedirect:"/login2/student",successRedirect:"/dashboard/student"}),(req,res)=>{

})
app.get("/login2/student",(req,res)=>{
    res.render("login/studentLogin2");
})

// instructor login
app.post("/login/instructor",passport.authenticate("local",{failureRedirect:"/login2/instructor",successRedirect:"/dashboard/instructor"}),(req,res)=>{
    
})
app.get("/login/instructor",(req,res)=>{
    res.render("login/instructorLogin");
})

// instructor login2
app.post("/login2/instructor",passport.authenticate("local",{failureRedirect:"/login2/instructor",successRedirect:"/dashboard/instructor"}),(req,res)=>{
    
})
app.get("/login2/instructor",(req,res)=>{
    res.render("login/instructorLogin2");
})


// instructor register
app.post("/register/instructor",async(req,res)=>{
    if (!req.body.firstName.length || !req.body.lastName.length || !req.body.email.length || !req.body.password.length || !(req.body.role == "student" || req.body.role == "instructor")) {
        res.redirect("/register2/instructor");
    }
    else{
        const user = await User.findOne({email:req.body.email})
        if (user){
            res.redirect("/register2/instructor");
        }
        else{
            try{
                if(!isValidPassword(req.body.password)){
                    res.redirect("/register2/instructor");
                }
                else{
                    const newUser=await User.create(req.body);
                    res.redirect("/login/instructor")
                }
            }
            catch(err){
                res.redirect("/register2/instructor");
                console.log("error");
            }
        }
    }
});
app.get("/register/instructor",(req,res)=>{
    res.render("register/instructorRegister")
})

// register instructor2
app.post("/register2/instructor",async(req,res)=>{
    if (!req.body.firstName.length || !req.body.lastName.length || !req.body.email.length || !req.body.password.length || !(req.body.role == "student" || req.body.role == "instructor")) {
        res.redirect("/register2/instructor");
    }
    else{
        const user = await User.findOne({email:req.body.email})
        if (user){
            res.redirect("/register2/instructor");
        }
        else{
            try{
                if(!isValidPassword(req.body.password)){
                    res.redirect("/register2/instructor");
                }
                else{
                    const newUser=await User.create(req.body);
                    res.redirect("/login/instructor")
                }
            }
            catch(err){
                res.redirect("/register2/instructor");
                console.log("error");
            }
        }
    }
});
app.get("/register2/instructor",(req,res)=>{
    res.render("register/instructorRegister2")
})

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
app.get("/addStudent/:courseName/:courseCode/:courseId",(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else if(req.user.role == "student"){
        res.redirect("/dashboard/student");
    }
    else{
        let courseName = req.params.courseName;
        let courseCode = req.params.courseCode;
        res.render("addStudent/addStudent",{courseId:req.params.courseId,courseName:courseName,courseCode:courseCode,instructorEmail:req.user.email});
    }
})

app.post("/addStudent/:courseName/:courseCode/:courseId",upload.single("file"),async(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else if(req.user.role == "student"){
        res.redirect("/dashboard/student");
    } 
    else{
        try{
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
                StudentEnrollment.create({
                    courseId: new mongoose.Types.ObjectId(courseId),
                    studentEmail:res.email,
                    courseName: courseName,
                    instructorId:req.user.id,
                    courseCode: courseCode,
                    courseName:courseName,
                    instructorName:req.user.firstName,
                    instructorEmail:req.user.email,
                    studentName:res.name
                })
                // send email to res.email
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    port: 465,
                    auth: {
                        user: `${emailEmail}`,
                        pass: `${emailPassword}`
                    }
                });
                
                // Message object
                let message = {
                    from: `${emailEmail}`,
                    to: `${res.email}`,
                    subject: `Enrollement in course ${courseCode}`,
                    text: `Hello ${res.name}`,
                    // html: `<p><b>If you have not registered please register in <a href = 'http://localhost:3000' target = "__blank">Here</a></b></p>`
                    html:`
                    <!DOCTYPE html>
    
                    <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                    
                    <head>
                        <title></title>
                        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                        <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
                        <link href="https://fonts.googleapis.com/css?family=Noto+Serif" rel="stylesheet" type="text/css" />
                        <link href="https://fonts.googleapis.com/css2?family=Inter&family=Work+Sans:wght@700&display=swap" rel="stylesheet"
                            type="text/css" /><!--<![endif]-->
                        <style>
                            * {
                                box-sizing: border-box;
                            }
                    
                            body {
                                margin: 0;
                                padding: 0;
                            }
                    
                            a[x-apple-data-detectors] {
                                color: inherit !important;
                                text-decoration: inherit !important;
                            }
                    
                            #MessageViewBody a {
                                color: inherit;
                                text-decoration: none;
                            }
                    
                            p {
                                line-height: inherit
                            }
                    
                            .desktop_hide,
                            .desktop_hide table {
                                mso-hide: all;
                                display: none;
                                max-height: 0px;
                                overflow: hidden;
                            }
                    
                            .image_block img+div {
                                display: none;
                            }
                    
                            @media (max-width:720px) {
                                .desktop_hide table.icons-inner {
                                    display: inline-block !important;
                                }
                    
                                .icons-inner {
                                    text-align: center;
                                }
                    
                                .icons-inner td {
                                    margin: 0 auto;
                                }
                    
                                .image_block img.big,
                                .row-content {
                                    width: 100% !important;
                                }
                    
                                .mobile_hide {
                                    display: none;
                                }
                    
                                .stack .column {
                                    width: 100%;
                                    display: block;
                                }
                    
                                .mobile_hide {
                                    min-height: 0;
                                    max-height: 0;
                                    max-width: 0;
                                    overflow: hidden;
                                    font-size: 0px;
                                }
                    
                                .desktop_hide,
                                .desktop_hide table {
                                    display: table !important;
                                    max-height: none !important;
                                }
                    
                                .row-13 .column-1 .block-1.heading_block h1,
                                .row-13 .column-2 .block-1.paragraph_block td.pad>div,
                                .row-14 .column-2 .block-1.paragraph_block td.pad>div,
                                .row-2 .column-2 .block-1.paragraph_block td.pad>div,
                                .row-3 .column-1 .block-4.heading_block h1,
                                .row-6 .column-2 .block-1.heading_block h1,
                                .row-6 .column-2 .block-2.heading_block h1,
                                .row-6 .column-2 .block-3.paragraph_block td.pad>div,
                                .row-7 .column-2 .block-1.heading_block h1,
                                .row-7 .column-2 .block-2.heading_block h1,
                                .row-7 .column-2 .block-3.paragraph_block td.pad>div {
                                    text-align: center !important;
                                }
                    
                                .row-13 .column-2 .block-1.paragraph_block td.pad {
                                    padding: 0 !important;
                                }
                    
                                .row-14 .column-1,
                                .row-2 .column-1,
                                .row-4 .column-1,
                                .row-9 .column-1 {
                                    padding: 20px 10px !important;
                                }
                    
                                .row-2 .column-2 {
                                    padding: 5px 25px 20px !important;
                                }
                    
                                .row-6 .column-1,
                                .row-7 .column-1 {
                                    padding: 15px 25px 0 !important;
                                }
                    
                                .row-6 .column-2,
                                .row-7 .column-2 {
                                    padding: 15px 20px 25px !important;
                                }
                    
                                .row-10 .column-1 {
                                    padding: 40px 20px !important;
                                }
                    
                                .row-12 .column-1 {
                                    padding: 0 20px 40px !important;
                                }
                    
                                .row-13 .column-1 {
                                    padding: 40px 25px 25px !important;
                                }
                    
                                .row-13 .column-2 {
                                    padding: 5px 25px 40px !important;
                                }
                    
                                .row-14 .column-2 {
                                    padding: 5px 30px 20px 25px !important;
                                }
                            }
                        </style>
                    </head>
                    
                    <body style="background-color: #f7f7f7; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                        <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f7f7;" width="100%">
                            <tbody>
                                <tr>
                                    <td>
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                            class="row-content stack" role="presentation"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 700px;"
                                                            width="700">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="column column-1"
                                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                        width="100%">
                                                                        <div class="spacer_block block-1"
                                                                            style="height:15px;line-height:15px;font-size:1px;"> </div>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                            class="row-content stack" role="presentation"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('images/Header-bg.png'); background-repeat: no-repeat; background-size: cover; background-color: #4f5aba; border-radius: 0; color: #000000; width: 700px;"
                                                            width="700">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="column column-1"
                                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-left: 30px; padding-right: 10px; padding-top: 20px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                        width="33.333333333333336%">
                                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                                            class="image_block block-1" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="pad"
                                                                                    style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                    <div align="center" class="alignment"
                                                                                        style="line-height:10px"></div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                            class="row-content stack" role="presentation"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #efeef4; border-bottom: 0 solid #EFEEF4; border-left: 0 solid #EFEEF4; border-right: 0px solid #EFEEF4; border-top: 0 solid #EFEEF4; color: #000000; width: 700px;"
                                                            width="700">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="column column-1"
                                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-left: 25px; padding-right: 25px; padding-top: 35px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                        width="100%">
                                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                                            class="icons_block block-1" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="pad"
                                                                                    style="vertical-align: middle; color: #4f5aba; font-family: 'Noto Serif', Georgia, serif; font-size: 24px; letter-spacing: 0px; padding-bottom: 10px; padding-top: 10px; text-align: center;">
                                                                                    <table align="center" cellpadding="0" cellspacing="0"
                                                                                        class="alignment" role="presentation"
                                                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                        <tr>
                                                                                            <td
                                                                                                style="vertical-align: middle; text-align: center; padding-top: 0px; padding-bottom: 0px; padding-left: 20px; padding-right: 20px;">
                                                                                                <a href=""
                                                                                                    style="text-decoration: none;"
                                                                                                    target="_self"><img align="center"
                                                                                                        alt="AutoAttendance System"
                                                                                                        class="icon" height="128"
                                                                                                        src="https://i.ibb.co/tbMk7Fd/logo.png"
                                                                                                        style="display: block; height: auto; margin: 0 auto; border: 0;"
                                                                                                        width="109" /></a></td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                                            class="heading_block block-2" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="pad"
                                                                                    style="padding-top:10px;text-align:center;width:100%;">
                                                                                    <h1
                                                                                        style="margin: 0; color: #4f5aba; direction: ltr; font-family: 'Noto Serif', Georgia, serif; font-size: 41px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
                                                                                        <span class="tinyMce-placeholder">${courseCode}</span></h1>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                                            class="heading_block block-3" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="pad"
                                                                                    style="padding-bottom:10px;padding-top:10px;text-align:center;width:100%;">
                                                                                    <h2
                                                                                        style="margin: 0; color: #201f42; direction: ltr; font-family: 'Noto Serif', Georgia, serif; font-size: 24px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
                                                                                        ${courseName}</h2>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table border="0" cellpadding="10" cellspacing="0"
                                                                            class="heading_block block-4" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="pad">
                                                                                    <h1
                                                                                        style="margin: 0; color: #201f42; direction: ltr; font-family: Inter, sans-serif; font-size: 18px; font-weight: 400; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0;">
                                                                                        <span class="tinyMce-placeholder">Hello, ${res.name}</span></h1>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                                            class="paragraph_block block-5" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="pad"
                                                                                    style="padding-left:10px;padding-right:10px;">
                                                                                    <div
                                                                                        style="color:#201f42;direction:ltr;font-family:Inter, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:180%;text-align:center;mso-line-height-alt:28.8px;">
                                                                                        <p style="margin: 0;">Congratulations, you have just got enrolled in course ${courseCode} (${courseName}). To view your attendance graph please register if not done.</p>
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                                            class="button_block block-6" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="pad"
                                                                                    style="padding-bottom:15px;padding-top:20px;text-align:center;">
                                                                                    <div align="center" class="alignment">
                                                                                        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.example.com" style="height:43px;width:104px;v-text-anchor:middle;" arcsize="0%" strokeweight="0.75pt" strokecolor="#201F42" fillcolor="#201f42"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Georgia, serif; font-size:16px"><![endif]--><a
                                                                                            href="http://localhost:3000/login/student"
                                                                                            style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#201f42;border-radius:0px;width:auto;border-top:1px solid #201F42;font-weight:400;border-right:1px solid #201F42;border-bottom:1px solid #201F42;border-left:1px solid #201F42;padding-top:5px;padding-bottom:5px;font-family:'Noto Serif', Georgia, serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                                                                            target="_blank"><span
                                                                                                style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span
                                                                                                    dir="ltr"
                                                                                                    style="word-break: break-word; line-height: 32px;">REGISTER/LOGIN</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        
                                        
                                        <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14"
                                            role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;"
                                            width="100%">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                            class="row-content stack" role="presentation"
                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #201f42; border-radius: 0; color: #000000; width: 700px;"
                                                            width="700">
                                                            <tbody>
                                                                <tr>
                                                                    <td class="column column-1"
                                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-left: 30px; padding-right: 10px; padding-top: 20px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                        width="33.333333333333336%">
                                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                                            class="image_block block-1" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="pad"
                                                                                    style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                    <div align="center" class="alignment"
                                                                                        style="line-height:10px"></div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                    <td class="column column-2"
                                                                        style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 25px; padding-right: 30px; padding-top: 5px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                        width="66.66666666666667%">
                                                                        <table border="0" cellpadding="0" cellspacing="0"
                                                                            class="paragraph_block block-1" role="presentation"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                            width="100%">
                                                                            <tr>
                                                                                <td class="pad">
                                                                                    <div
                                                                                        style="color:#ffffff;direction:ltr;font-family:Inter, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:16.8px;">
                                                                                        
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </body>
                    
                    </html>
                    `
                };
            
                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        console.log('Error occurred. ' + err.message);
                        return process.exit(1);
                    }
                })
            
            })
            res.redirect(`/coursePage/${req.params.courseId}`);
        }
        catch(err){
            console.log("Error in adding student");
            res.redirect(`/addStudent/${req.params.courseName}/${req.params.courseCode}/${req.params.courseId}`)
        }
    }
});
//Active attendances
app.get("/markAtt/:studentEmail", async (req, res) => {
    if (!req.user) {
        res.redirect("/");
    } else {
        var result = []
        const actAtt = await ActiveAttendance.find()
        let curr = new Date()
        for (var i = 0; i < actAtt.length; i++) {
            let startTime = actAtt[i].startTime;
            let diff = Math.abs(curr - startTime) / (1000 * 60);
            if (diff < actAtt[i].minutes) {
                let lecture = await AllLectures.findById(actAtt[i].lectureId)
                const enrolled = await StudentEnrollment.find({ courseId: new mongoose.Types.ObjectId(lecture.courseId), studentEmail: req.params.studentEmail })
                let course = await AllCourses.findById(lecture.courseId)
                if (enrolled.length != 0) {

                    result.push({ id: actAtt[i].id, courseCode: course.courseCode });
                }
            }
        }
        const usr = await user.findOne({ email: req.params.studentEmail })
        res.render("attendanceCredentials/activeAttendance", { actAtt: result, studentEmail: req.params.studentEmail, firstName: usr.firstName, lastName: usr.lastName })

    }
})

// create course for instructor
app.post("/createCourse",async(req,res)=>{
    if (!req.body.courseCode.length || !req.body.courseName) {
        res.render("/");
    }
    else{
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
// mark attendance for student
app.get("/markAttendance/:attendanceId/:studentEmail",async(req,res)=>{
    const attendance = await ActiveAttendance.findById(new mongoose.Types.ObjectId(req.params.attendanceId));
    if(!attendance){
        res.render("attendanceCredentials/noAttendance");
    }
    else{
        try{

            let minu = new Date(attendance.startTime);
            const lecture = await AllLectures.findById(attendance.lectureId);
            if(!lecture){
                res.render("attendanceCredentials/invalidLecture");
            }
            else{
                const student = await StudentEnrollment.find({courseId:lecture.courseId,studentEmail:req.params.studentEmail});
                if(!student.length){
                    res.render("attendanceCredentials/invalidStudent",{studentEmail:req.params.studentEmail});
                }
                else{
                    const mark1 = await MarkAttendance.find({
                        lectureId:lecture.id,
                        lectureName:lecture.lectureName,
                        studentEmail:req.params.studentEmail,
                        courseId:lecture.courseId
                    });
                    // console.log(mark1);
                    if(!mark1.length){
                        let curr = new Date();
                        let diff = Math.abs(minu - curr)/(1000*60);
                        if(diff <= attendance.minutes){
                            const mark = await MarkAttendance.create({
                                lectureId:lecture.id,
                                lectureName:lecture.lectureName,
                                studentEmail:req.params.studentEmail,
                                courseId:lecture.courseId
                            });
                            const course = await AllCourses.findById(lecture.courseId);
                            res.render("attendanceCredentials/successAttendance",{courseCode:course.courseCode,studentEmail:req.params.studentEmail});
                        }
                        else{
                            res.render("attendanceCredentials/lateAttendance");
                        }
                    }
                    else{
                        res.render("attendanceCredentials/alreadyMarked");
                    }
                }
            }
        }
        catch(err){
            console.log("Error");
            res.redirect("/");
        }
    }
});


// course Page
app.get("/coursePage/:courseId",async(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else{
        if(req.user.role == "student"){
            res.redirect("/dashboard/student");
        }
        else{
            try{

                const course = await allCourses.findById(new mongoose.Types.ObjectId(req.params.courseId));
                if(!course){
                    res.redirect("/");
                }
                else{
                    const number = await studentEnrollment.find({
                        courseId: new mongoose.Types.ObjectId(req.params.courseId)
                    });
                    const lectures = await allLectures.find({
                        courseId:new mongoose.Types.ObjectId(req.params.courseId)
                    })
                    const actualNumber = await markAttendance.find({
                        courseId: new mongoose.Types.ObjectId(req.params.courseId)
                    })
                    // console.log(actualNumber)
                    let averageAttendance = (actualNumber.length/(lectures.length*number.length))*100;
                    if(isNaN(averageAttendance)){
                        averageAttendance = 0;
                    }
                    allStudentDetails = [];
                    for(let i = 0;i<number.length;++i){
                        allStudentDetails.push({email:number[i].studentEmail,studentName:number[i].studentName});
                    }
                    let allLecturePage = [];
                    let lectureData = {};
                    let allLectureNames = [];
                    for(let i = 0;i<lectures.length;++i){
                        allLecturePage.push({
                            id:lectures[i].id,
                            lectureName:lectures[i].lectureName
                        })
                        lectureData[lectures[i].lectureName] = 0;
                    }
                    for(let i = 0;i<actualNumber.length;i++){
                        lectureData[actualNumber[i].lectureName] += 1;
                    }
                    allLectureCount = [];
                    Object.keys(lectureData).forEach(function(key) {
                        allLectureNames.push(key);
                        allLectureCount.push(lectureData[key]);
                      })
        
                    res.render("coursePage/index",{
                        courseId:req.params.courseId,
                        courseCode:course.courseCode,
                        courseName: course.courseName,
                        numberOfStudentEnrolled: number.length,
                        numberOfLectures:lectures.length,
                        averageAttendance:averageAttendance,
                        instructorEmail:req.user.email,
                        studentDetails:allStudentDetails,
                        allLectures:allLecturePage,
                        allLectureNames:allLectureNames,
                        allLectureCount:allLectureCount
                    });
                }
            }
            catch(err){
                console.log("Error");
                res.redirect("/");
            }
        }
    }
})

// student Course Page
app.get("/studentCoursePage/:courseId",async(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else{
        if(req.user.role == "instructor"){
            res.redirect("/dashboard/instructor");
        }
        else{
            try{

                // console.log(req.params.courseId)
                const course = await allCourses.findById(new mongoose.Types.ObjectId(req.params.courseId));
                const allLectureMade = await allLectures.find({
                    courseId:new mongoose.Types.ObjectId(req.params.courseId)
                });
                const markedAttendance = await MarkAttendance.find({
                    courseId:new mongoose.Types.ObjectId(req.params.courseId),
                    studentEmail:req.user.email
                });
                if(!course){
                    res.redirect("/dashboard/student");
                }
                else{
                    allLectureId = {};
                    allLectureName = {};
                    for(let i = 0;i<allLectureMade.length;++i){
                        allLectureId[allLectureMade[i].id] = 0;
                        allLectureName[allLectureMade[i].id] = allLectureMade[i].lectureName;
                    }
                    for(let i = 0;i<markedAttendance.length;++i){
                        allLectureId[markedAttendance[i].lectureId] = 1;
                    }
                    actualLectureName = [];
                    actualLectureStatus = [];
                    Object.keys(allLectureId).forEach(function(key) {
                        actualLectureName.push(allLectureName[key]);
                        actualLectureStatus.push(allLectureId[key]);
                      });
                      let avg = (markedAttendance.length/allLectureMade.length)*100;
                      if(isNaN(avg)){
                          avg = 0;
                        }
                        res.render("studentCoursePage/studentCoursePage",{
                        courseCode:course.courseCode,
                        courseName:course.courseName,
                        studentEmail:req.user.email,
                        firstName:req.user.firstName,
                        lastName:req.user.lastName,
                        totalLectureCreated:allLectureMade.length,
                        markedAttendance:markedAttendance.length,
                        averageAttendance:avg,
                        courseId:course.id,
                        actualLectureName:actualLectureName,
                        actualLectureStatus:actualLectureStatus
                    });
                }
            }
            catch(err){
                console.log("Error");
                res.redirect("/");
            }
        }
    }
});


//lecture Page
app.get("/lecturePage/:lectureId/:courseId",async(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else{
        try{

            if(req.user.role == "student"){
                res.redirect("/dashboard/student");
            }
            else{
                const allStudent = await studentEnrollment.find({
                    courseId:new mongoose.Types.ObjectId(req.params.courseId) 
                });
                const course = await allCourses.findById(new mongoose.Types.ObjectId(req.params.courseId));
                // console.log(course)
                // console.log(allStudent)
                if(!course){
                    res.redirect("/");
                }
                else if(!allStudent.length){
                    res.redirect("/");
                }
                else{
                    // console.log("Here")
                    allStudentData = {};
                    studentName = {};
                    for(let i = 0;i<allStudent.length;++i){
                        allStudentData[allStudent[i].studentEmail] = 0;
                        studentName[allStudent[i].studentEmail] = allStudent[i].studentName;
                    }
                    const marked = await markAttendance.find({
                        lectureId:new mongoose.Types.ObjectId(req.params.lectureId)
                    });
                    const lec = await allLectures.findById(new mongoose.Types.ObjectId(req.params.lectureId));
                    const allLec = await allLectures.find({
                        courseId:new mongoose.Types.ObjectId(req.params.courseId)
                    });
                    
                    if(!allLec.length || !lec){
                        res.redirect("/");
                    }
                    else{
                        for(let i = 0;i<marked.length;++i){
                            allStudentData[marked[i].studentEmail] = 1;
                        }
                        allStudents = [];
                        Object.keys(allStudentData).forEach(function(key) {
                            allStudents.push({email:key,count:allStudentData[key],studentName:studentName[key]});
                        });
                        res.render("lecturePage/index",{
                            allStudentData:allStudents,
                            courseCode:course.courseCode,
                            courseName:course.courseName,
                            courseId:req.params.courseId,
                            allLectures:allLec,
                            instructorEmail:req.user.email,
                            lectureName: lec.lectureName,
                        });
                    }
                }
            }
        }
        catch(err){
            console.log("Error");
            res.redirect("/");
        }
    }
}) 


// open attendance for a particular course
app.get("/openAttendance/:courseId",async(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else if(req.user.role == "student"){
        res.redirect("/dashboard/student");
    }
    else{
        try{

            const course = await AllCourses.findById(new mongoose.Types.ObjectId(req.params.courseId));
            if(!course){
                res.redirect("/");
            }
            else{
                res.render("openAttendance/openAttendance",{courseId:req.params.courseId,
                    courseCode:course.courseCode,
                    courseName:course.courseName,
                    instructorEmail:req.user.email,
                });
            }
        }
        catch(err){
            console.log("Error in opening attendance");
            res.redirect(`/openAttendance/${req.params.courseId}`);
        }
    }
})

app.post("/openAttendance/:courseId",async(req,res)=>{
    if(!req.body.lectureName.length || (req.body.minutes < 5 || req.body.minutes > 75)){
        res.redirect("/");
    }
    else{

        if(!req.user){
            res.redirect("/");
        }
        else if(req.user.role == "student"){
            res.redirect("/dashboard/student");
        }
        else{
            try{
    
                courseId = req.params.courseId;
                const w = await AllLectures.create({
                    courseId:new mongoose.Types.ObjectId(courseId),
                    lectureName:req.body.lectureName
                });
                const listOfStudents = await StudentEnrollment.find({courseId:new mongoose.Types.ObjectId(courseId)});
                s = [];
                for(let i=0;i<listOfStudents.length;++i){
                    s.push(listOfStudents[i].studentEmail);
                }
                // start new attendance
                
                
                const t = await ActiveAttendance.create({
                    lectureId:w.id,
                    startTime: new Date(),
                    minutes:req.body.minutes
                });
                
                
                // send email to /t.id/studentEmail
                for(let i = 0;i<s.length;++i){
                    // send email to res.email
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        port: 465,
                        auth: {
                            user: `${emailEmail}`,
                            pass: `${emailPassword}`
                        }
                    });
                
                    // Message object
                    let message = {
                        from:  `${emailEmail}`,
                        to: `${s[i]}`,
                        subject: `Attendance in course ${listOfStudents[i].courseCode}`,
                        text: `Hello ${s[i]}`,
                        // html: `<p><h2>Attendance started for ${listOfStudents[i].courseCode} <a target = "__blank" href = "http://localhost:3000/markAttendance/${t.id}/${s[i]}">Here</a></h2><br><b>If you have not registered please register in <a target = "__blank" href = 'http://localhost:3000'>Here</a></b></p>`
                        html:`
                        <!DOCTYPE html>
        
                        <html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
                        
                        <head>
                            <title></title>
                            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
                            <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
                            <link href="https://fonts.googleapis.com/css?family=Noto+Serif" rel="stylesheet" type="text/css" />
                            <link href="https://fonts.googleapis.com/css2?family=Inter&family=Work+Sans:wght@700&display=swap" rel="stylesheet"
                                type="text/css" /><!--<![endif]-->
                            <style>
                                * {
                                    box-sizing: border-box;
                                }
                        
                                body {
                                    margin: 0;
                                    padding: 0;
                                }
                        
                                a[x-apple-data-detectors] {
                                    color: inherit !important;
                                    text-decoration: inherit !important;
                                }
                        
                                #MessageViewBody a {
                                    color: inherit;
                                    text-decoration: none;
                                }
                        
                                p {
                                    line-height: inherit
                                }
                        
                                .desktop_hide,
                                .desktop_hide table {
                                    mso-hide: all;
                                    display: none;
                                    max-height: 0px;
                                    overflow: hidden;
                                }
                        
                                .image_block img+div {
                                    display: none;
                                }
                        
                                @media (max-width:720px) {
                                    .desktop_hide table.icons-inner {
                                        display: inline-block !important;
                                    }
                        
                                    .icons-inner {
                                        text-align: center;
                                    }
                        
                                    .icons-inner td {
                                        margin: 0 auto;
                                    }
                        
                                    .image_block img.big,
                                    .row-content {
                                        width: 100% !important;
                                    }
                        
                                    .mobile_hide {
                                        display: none;
                                    }
                        
                                    .stack .column {
                                        width: 100%;
                                        display: block;
                                    }
                        
                                    .mobile_hide {
                                        min-height: 0;
                                        max-height: 0;
                                        max-width: 0;
                                        overflow: hidden;
                                        font-size: 0px;
                                    }
                        
                                    .desktop_hide,
                                    .desktop_hide table {
                                        display: table !important;
                                        max-height: none !important;
                                    }
                        
                                    .row-13 .column-1 .block-1.heading_block h1,
                                    .row-13 .column-2 .block-1.paragraph_block td.pad>div,
                                    .row-14 .column-2 .block-1.paragraph_block td.pad>div,
                                    .row-2 .column-2 .block-1.paragraph_block td.pad>div,
                                    .row-3 .column-1 .block-4.heading_block h1,
                                    .row-6 .column-2 .block-1.heading_block h1,
                                    .row-6 .column-2 .block-2.heading_block h1,
                                    .row-6 .column-2 .block-3.paragraph_block td.pad>div,
                                    .row-7 .column-2 .block-1.heading_block h1,
                                    .row-7 .column-2 .block-2.heading_block h1,
                                    .row-7 .column-2 .block-3.paragraph_block td.pad>div {
                                        text-align: center !important;
                                    }
                        
                                    .row-13 .column-2 .block-1.paragraph_block td.pad {
                                        padding: 0 !important;
                                    }
                        
                                    .row-14 .column-1,
                                    .row-2 .column-1,
                                    .row-4 .column-1,
                                    .row-9 .column-1 {
                                        padding: 20px 10px !important;
                                    }
                        
                                    .row-2 .column-2 {
                                        padding: 5px 25px 20px !important;
                                    }
                        
                                    .row-6 .column-1,
                                    .row-7 .column-1 {
                                        padding: 15px 25px 0 !important;
                                    }
                        
                                    .row-6 .column-2,
                                    .row-7 .column-2 {
                                        padding: 15px 20px 25px !important;
                                    }
                        
                                    .row-10 .column-1 {
                                        padding: 40px 20px !important;
                                    }
                        
                                    .row-12 .column-1 {
                                        padding: 0 20px 40px !important;
                                    }
                        
                                    .row-13 .column-1 {
                                        padding: 40px 25px 25px !important;
                                    }
                        
                                    .row-13 .column-2 {
                                        padding: 5px 25px 40px !important;
                                    }
                        
                                    .row-14 .column-2 {
                                        padding: 5px 30px 20px 25px !important;
                                    }
                                }
                            </style>
                        </head>
                        
                        <body style="background-color: #f7f7f7; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
                            <table border="0" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f7f7f7;" width="100%">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-1"
                                                role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                class="row-content stack" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-radius: 0; color: #000000; width: 700px;"
                                                                width="700">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                            width="100%">
                                                                            <div class="spacer_block block-1"
                                                                                style="height:15px;line-height:15px;font-size:1px;"> </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-2"
                                                role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                class="row-content stack" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-image: url('images/Header-bg.png'); background-repeat: no-repeat; background-size: cover; background-color: #4f5aba; border-radius: 0; color: #000000; width: 700px;"
                                                                width="700">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-left: 30px; padding-right: 10px; padding-top: 20px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                            width="33.333333333333336%">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="image_block block-1" role="presentation"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                width="100%">
                                                                                <tr>
                                                                                    <td class="pad"
                                                                                        style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                        <div align="center" class="alignment"
                                                                                            style="line-height:10px"></div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3"
                                                role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                class="row-content stack" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #efeef4; border-bottom: 0 solid #EFEEF4; border-left: 0 solid #EFEEF4; border-right: 0px solid #EFEEF4; border-top: 0 solid #EFEEF4; color: #000000; width: 700px;"
                                                                width="700">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 25px; padding-left: 25px; padding-right: 25px; padding-top: 35px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                            width="100%">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="icons_block block-1" role="presentation"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                width="100%">
                                                                                <tr>
                                                                                    <td class="pad"
                                                                                        style="vertical-align: middle; color: #4f5aba; font-family: 'Noto Serif', Georgia, serif; font-size: 24px; letter-spacing: 0px; padding-bottom: 10px; padding-top: 10px; text-align: center;">
                                                                                        <table align="center" cellpadding="0" cellspacing="0"
                                                                                            class="alignment" role="presentation"
                                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                            <tr>
                                                                                                <td
                                                                                                    style="vertical-align: middle; text-align: center; padding-top: 0px; padding-bottom: 0px; padding-left: 20px; padding-right: 20px;">
                                                                                                    <a href=""
                                                                                                        style="text-decoration: none;"
                                                                                                        target="_self"><img align="center"
                                                                                                            alt="AutoAttendance System"
                                                                                                            class="icon" height="128"
                                                                                                            src="https://i.ibb.co/tbMk7Fd/logo.png"
                                                                                                            style="display: block; height: auto; margin: 0 auto; border: 0;"
                                                                                                            width="109" /></a></td>
                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="heading_block block-2" role="presentation"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                width="100%">
                                                                                <tr>
                                                                                    <td class="pad"
                                                                                        style="padding-top:10px;text-align:center;width:100%;">
                                                                                        <h1
                                                                                            style="margin: 0; color: #4f5aba; direction: ltr; font-family: 'Noto Serif', Georgia, serif; font-size: 41px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;">
                                                                                            <span class="tinyMce-placeholder">${listOfStudents[i].courseCode}</span></h1>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="heading_block block-3" role="presentation"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                width="100%">
                                                                                <tr>
                                                                                    <td class="pad"
                                                                                        style="padding-bottom:10px;padding-top:10px;text-align:center;width:100%;">
                                                                                        
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <table border="0" cellpadding="10" cellspacing="0"
                                                                                class="heading_block block-4" role="presentation"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                width="100%">
                                                                                <tr>
                                                                                    <td class="pad">
                                                                                        <h1
                                                                                            style="margin: 0; color: #201f42; direction: ltr; font-family: Inter, sans-serif; font-size: 18px; font-weight: 400; letter-spacing: normal; line-height: 150%; text-align: center; margin-top: 0; margin-bottom: 0;">
                                                                                            <span class="tinyMce-placeholder">Hello, ${s[i]}</span></h1>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="paragraph_block block-5" role="presentation"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                                width="100%">
                                                                                <tr>
                                                                                    <td class="pad"
                                                                                        style="padding-left:10px;padding-right:10px;">
                                                                                        <div
                                                                                            style="color:#201f42;direction:ltr;font-family:Inter, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:180%;text-align:center;mso-line-height-alt:28.8px;">
                                                                                            <p style="margin: 0;">Attendance started for course ${listOfStudents[i].courseCode}, the link will only be valid for ${req.body.minutes} minutes</p>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="button_block block-6" role="presentation"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                width="100%">
                                                                                <tr>
                                                                                    <td class="pad"
                                                                                        style="padding-bottom:15px;padding-top:20px;text-align:center;">
                                                                                        <div align="center" class="alignment">
                                                                                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.example.com" style="height:43px;width:104px;v-text-anchor:middle;" arcsize="0%" strokeweight="0.75pt" strokecolor="#201F42" fillcolor="#201f42"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Georgia, serif; font-size:16px"><![endif]--><a
                                                                                                href="http://localhost:3000/markAttendance/${t.id}/${s[i]}"
                                                                                                style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#201f42;border-radius:0px;width:auto;border-top:1px solid #201F42;font-weight:400;border-right:1px solid #201F42;border-bottom:1px solid #201F42;border-left:1px solid #201F42;padding-top:5px;padding-bottom:5px;font-family:'Noto Serif', Georgia, serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"
                                                                                                target="_blank"><span
                                                                                                    style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span
                                                                                                        dir="ltr"
                                                                                                        style="word-break: break-word; line-height: 32px;">MARK ATTENDANCE</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            
                                            
                                            <table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-14"
                                                role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto;"
                                                width="100%">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <table align="center" border="0" cellpadding="0" cellspacing="0"
                                                                class="row-content stack" role="presentation"
                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-size: auto; background-color: #201f42; border-radius: 0; color: #000000; width: 700px;"
                                                                width="700">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="column column-1"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 20px; padding-left: 30px; padding-right: 10px; padding-top: 20px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                            width="33.333333333333336%">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="image_block block-1" role="presentation"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                                width="100%">
                                                                                <tr>
                                                                                    <td class="pad"
                                                                                        style="width:100%;padding-right:0px;padding-left:0px;">
                                                                                        <div align="center" class="alignment"
                                                                                            style="line-height:10px"></div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                        <td class="column column-2"
                                                                            style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-left: 25px; padding-right: 30px; padding-top: 5px; vertical-align: middle; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;"
                                                                            width="66.66666666666667%">
                                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                                class="paragraph_block block-1" role="presentation"
                                                                                style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;"
                                                                                width="100%">
                                                                                <tr>
                                                                                    <td class="pad">
                                                                                        <div
                                                                                            style="color:#ffffff;direction:ltr;font-family:Inter, sans-serif;font-size:14px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:right;mso-line-height-alt:16.8px;">
                                                                                            
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </body>
                        
                        </html>
                        `
                    };
                
                    transporter.sendMail(message, (err, info) => {
                        if (err) {
                            console.log('Error occurred. ' + err.message);
                            return process.exit(1);
                        }
                    })
                }
                res.redirect(`/coursePage/${req.params.courseId}`);
            }
            catch(err){
                console.log("Error in opening attendance");
                res.redirect(`/openAttendance/${req.params.courseId}`);
            }
        }
    }
});

// delete course for instructor
app.get("/deleteCourse/:courseId",async(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else if(req.user.role == "student"){
        res.redirect("/dashboard/student");
    }
    else{
        try{

            const a = await AllCourses.deleteMany({
                "_id": new mongoose.Types.ObjectId(req.params.courseId)
            });
            const c = await allLectures.find({
                "courseId":new mongoose.Types.ObjectId(req.params.courseId)
            });
            await allLectures.deleteMany({
                "courseId":new mongoose.Types.ObjectId(req.params.courseId)
            });
            for(let i = 0;i<c.length;++i){
                await ActiveAttendance.deleteMany({
                    "lectureId":c[i].id
                });
            }
            for(let i = 0;i<c.length;++i){
                await MarkAttendance.deleteMany({
                    "lectureId":c[i].id
                });
            }
            await StudentEnrollment.deleteMany({
                "courseId":new mongoose.Types.ObjectId(req.params.courseId)
            });
            res.redirect("/dashboard/instructor");
        }
        catch(err){
            console.log("Error in deleting course");
            res.redirect("/dashboard/instructor");
        }
    }
})
// download report
app.get("/downloadReport/:courseId",async(req,res)=>{
    if(!req.user){
        res.redirect("/");
    }
    else{
        if(req.user.role == "student"){
            res.redirect("/dashboard/student");
        }
        else{
            try{

                const course = await allCourses.findById(new mongoose.Types.ObjectId(req.params.courseId));
                if(!course){
                    res.redirect("/");
                }
                else{
                    const allLec = await allLectures.find({
                        courseId:new mongoose.Types.ObjectId(req.params.courseId)
                    });
                    headerName = ["Student Email"];
                    lectureData = {};
                    for(let i = 0;i<allLec.length;++i){
                        headerName.push(allLec[i].lectureName);
                    }
                    const allStudent = await StudentEnrollment.find({
                        courseId:new mongoose.Types.ObjectId(req.params.courseId)
                    });
                    for(let i = 0;i<allStudent.length;++i){
                        lectureData[allStudent[i].studentEmail] = {};
                        for(let j = 1;j<headerName.length;++j){
                            lectureData[allStudent[i].studentEmail][headerName[j]] = "0";
                        }
                    }
                    const mark = await markAttendance.find({
                        courseId:new mongoose.Types.ObjectId(req.params.courseId)
                    });
                    for(let i = 0;i<mark.length;++i){
                        lectureData[mark[i].studentEmail][mark[i].lectureName] = "1";
                    }
    
                    const wb = await new xl.Workbook();
                    const ws = await wb.addWorksheet(`${course.courseCode}-${course.courseName}`);
                    colIndex = 1;
                    headerName.forEach(async(item)=>{
                        ws.cell(1,colIndex++).string(item);
                    });
                    let rowIndex = 2;
                    Object.keys(lectureData).forEach(async(key)=>{
                        colIndex = 1;
                        ws.cell(rowIndex,colIndex++).string(key);
                        Object.keys(lectureData[key]).forEach(async(lec)=>{
                           ws.cell(rowIndex,colIndex++).string(lectureData[key][lec]);
                        })
                        rowIndex++;
                    });
                    var today  = new Date();
                    const n = `downloadReport/${course.courseCode}-${course.courseName}-${today.getHours().toString()}-${today.getMinutes().toString()}-${today.getFullYear().toString()}-${today.getMonth().toString()}-${today.getDay().toString()}.xlsx`; 
                    wb.write(n);
                    if(fs.existsSync(n)){
                        res.download(n,(err)=>{
                            
                        });
                    }
                    else{
                        res.redirect(`/downloadReport/${req.params.courseId}`);
                    }
                }
            }
            catch(err){
                console.log("");
                res.redirect(`/`)
            }
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

app.use((req, res, next) => {
    res.status(404).render("pageNotFound/pageNotFound");
})

app.listen(3000,()=>{
    console.log("Listening on port 3000")
});