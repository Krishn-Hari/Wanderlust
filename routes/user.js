const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAscync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userControler = require("../controlers/users.js");

//sign up route
router
.route("/signup")
.get(userControler.renderSignupForm)
.post(wrapAscync(userControler.signup));

//login routes
router.
route("/login")
.get(userControler.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",
    { failureRedirect: '/login' ,
    failureFlash :true
    }),
    userControler.login
    );


router.get("/logout",userControler.logout);


module.exports = router;