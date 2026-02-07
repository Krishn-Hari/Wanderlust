const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup = async(req,res)=>{
try{
    let {username , password , email } = req.body;
const newUser = new User({email,username});
const regisUser = await User.register(newUser,password);
// console.log(regisUser);

req.login(regisUser,(err)=>{
    if(err){
        return next(err);
    };
    req.flash("success","welcome to wanderlust");
    res.redirect("/Listings");
});
}catch(e){
req.flash("error", e.message);
res.redirect("/signup");
};
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
        req.flash("success","Welcome back to Wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/Listings";
        res.redirect(redirectUrl);
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next();
        }
        req.flash("success","you are logged out now!");
        res.redirect("/Listings");
    })
};