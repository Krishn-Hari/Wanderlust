if(process.env.NODE_ENV != "production"){
require("dotenv").config();

}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodoverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAscync =require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const {listingschema,reviewschema} = require("./schema.js");
// const Review = require("./models/review.js");
// const { reverse } = require("dns");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


// let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(params) {
    await mongoose.connect(dbUrl);   
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE ",err)
})

const sessionoption = {
    store,
    secret: process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge :7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
    },
}



app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;//passport ka inbuilt function h
    next();
});



// //demo user
// app.get("/demoUser",async(req,res)=>{
// let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "delta-student"
// });

// let registeredUser = await User.register(fakeUser,"helloworld");
// res.send(registeredUser);
// });

// app.get("/",(req,res)=>{
// res.send("hi i am root");
// });

app.use("/listings", listingRouter);
app.use("/Listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



// 404 handler (must be AFTER all routes)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


//Middleware
app.use((err,req,res,next)=>{
  let{statusCode = 500,message = "something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{err});
// res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("app is listing by port 8080");
})

 