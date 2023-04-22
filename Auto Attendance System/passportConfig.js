const LocalStrategy = require("passport-local").Strategy
const User = require("./models/user");
const bcyrpt = require("bcrypt");
exports.initializingPassport = (passport)=>{

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },async(req,username,password,done)=>{
        try{
            const user = await User.findOne({email:username});
            if (!user)return done(null,false);
            let b = await bcyrpt.compare(password,user.password)
            if(!b || req.body.role !== user.role)return done(null,false);
            else return done(null,user);
        }
        catch(err){
            return done(err,false);
        }
    }))

    passport.serializeUser((user,done)=>{
        done(null,user.id);
    });

    passport.deserializeUser(async(id,done)=>{
        try{
            const user = await User.findById(id);
            done(null,user);
        }
        catch(err){
            done(err,false);
        }
    });

};
exports.isAuthenticated = (req,res,next)=>{
    if(req.user)return next();
    res.redirect("/");
}