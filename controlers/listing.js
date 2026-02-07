const Listing = require("../models/listing");

module.exports.index = async (req,res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index.ejs",{allListings});
};

module.exports.randerNewForm = (req,res)=>{
  res.render("listings/new.ejs");
};

module.exports.showListings = async (req,res)=>{
    let {id} = req.params;
  const listing = await Listing.findById(id)
  .populate({
    path :"reviews",
    populate:{
      path :"author",
    },
  })
    .populate("owner");
  if(!listing){
    req.flash("error","listing not exist");
    return res.redirect("/Listings");
  }
  console.log(listing);
  res.render("listings/show.ejs",{ listing });
};

module.exports.createListings =  async(req,res,next)=>{
// let{title,discription ,image,price,location,country}=req.body;
let url = req.file.path;
let filename = req.file.filename;

const newlisting = new Listing(req.body.listing);
newlisting.owner = req.user._id;
newlisting.image = {url,filename};
await newlisting.save();
req.flash("success","new listing created");
res.redirect("/Listings");
};

module.exports.renderEditForm = async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","listing not exist");
    return res.redirect("/Listings");
  }
  let orignalImg = listing.image.url;
  orignalImg = orignalImg.replace("/upload","/upload/w_250");
res.render("listings/edit.ejs",{listing,orignalImg});
};

module.exports.updateListing = async (req,res)=>{
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url,filename};
  await listing.save();
  }
  req.flash("success","listing updated");
res.redirect(`/Listings/${id}`);
};

module.exports.deleteListing = async (req,res)=>{
  let {id} = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success"," listing deleted");
res.redirect("/Listings");
};