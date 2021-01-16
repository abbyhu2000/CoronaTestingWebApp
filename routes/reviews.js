const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')

const Testingsite = require("../models/testingsite")
const Review = require('../models/review')
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")


router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    const review = new Review(req.body.review);
    testingsite.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await testingsite.save();
    req.flash('success', "Successfully made a new review!")
    res.redirect(`/testingsites/${testingsite._id}`);
}))

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Testingsite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully delete a review!")
    res.redirect(`/testingsites/${id}`);
}))

module.exports = router;