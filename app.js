if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const User=require("./models/user.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// mongo atlas url 
const dbUrl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to database successfully");
}).catch((err)=>console.log(err)); 

async function main(){ 
    await mongoose.connect(dbUrl);
};

const store=MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions={
    store,
 secret: process.env.SECRET,
 resave:true,
 saveUninitialized:true,
 cookie:{
    expires:Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
},

};


app.use(session(sessionOptions));
app.use(flash());

// for authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));       
//store user information in session called serialize and remove info called deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for sucess flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.success);
    next();
});



// use required listings routes also called parent route
app.get("/", (req, res) => res.redirect("/listings"));
app.use("/",userRouter);
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);


// 
// app.post("/post",async (req,res)=>{
//     const{title}=req.body;
//     console.log(title);
//     res.redirect("/listings");

// })
//   
//invalid url error handling
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}`));



