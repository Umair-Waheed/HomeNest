// create separate file for listing routes

const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
// require contoller folder
const listingController=require("../controllers/listings.js");
// for parsing mutipart data like upload files
const multer  = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({ storage });

// use router.route method means keep same path route in one place
// so keep same route in one place

//index and create route
router
.route("/")
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));

// .post( upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file );
// });

    // <========== New And Create Route =============>
// New Route 
router.get("/new",isLoggedIn, listingController.renderNewForm);

//show and update and delete route
router
.route("/:id")
.get(wrapAsync(listingController.showListing))

.put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing))

.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing) );



// <========== index Route =============>
    // call back is shifted to controller folder
// router.get("/", wrapAsync(listingController.index));


// <========== Show Route =============>
// router.get("/:id",wrapAsync(listingController.showListing));

//create Route
// router.post("/",isLoggedIn,validateListing,wrapAsync(listingController.createListing));
 
// <========== Edit & Update Route =============>S
//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// update Route
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

// <========== Delete Route =============>
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing) );

module.exports=router;