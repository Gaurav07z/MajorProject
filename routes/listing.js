const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../model/listing.js");
const { isLoggedIn, isOwner, validatelisting } = require("../middleware.js");

const listingController = require("../controllers/listing.js");

//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post(
  "/",
  isLoggedIn,
  validatelisting,
  wrapAsync(listingController.createListing),
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.rederEditForm),
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validatelisting,
  wrapAsync(listingController.updateListing),
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing),
);

module.exports = router;
