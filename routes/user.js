const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");

// use router.route method means keep same path route in one place
// so keep same login and also signup route in one place
router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync (userController.signup));


// router.get("/signup",userController.renderSignupForm);

// router.post("/signup",wrapAsync (userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post(savedRedirectUrl,
 passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
userController.login );


// router.get("/login",userController.renderLoginForm);

// router.post("/login",savedRedirectUrl,
// passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),
// userController.login )



router.get("/logout",userController.logout);

module.exports=router;