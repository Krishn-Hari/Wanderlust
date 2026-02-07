const express = require("express");
const router = express.Router();

const wrapAscync =require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedin, isOwner,validateListing} = require("../middleware.js");
const listingControler = require("../controlers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });


//index route //create route
router
.route("/")
.get(wrapAscync(listingControler.index))
.post(
  isLoggedin,
  upload.single('listing[image]'),
  validateListing,
  wrapAscync(listingControler.createListings)
);


//new route
router.get("/new",isLoggedin,listingControler.randerNewForm);

//show route // update route //delete route
router
.route("/:id")
.get(wrapAscync(listingControler.showListings))
.put(isLoggedin,isOwner, upload.single('listing[image]'),validateListing,wrapAscync(listingControler.updateListing))
.delete(isLoggedin,isOwner,wrapAscync(listingControler.deleteListing));



//edit route
router.get("/:id/edit",isLoggedin,isOwner,wrapAscync(listingControler.renderEditForm));

module.exports = router;