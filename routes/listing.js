const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../model/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");



//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

//New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing is doesn't exist !");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }),
);

//Create Route
router.post(
  "/",
  isLoggedIn,
  validatelisting,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    console.log("req.user");
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing Created !");
    res.redirect("/listings");
  }),
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing is doesn't exist !");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }),
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validatelisting,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing is Updated !");
    res.redirect(`/listings/${id}`);
  }),
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings");
  }),
);

module.exports = router;
