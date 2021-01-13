const express = require('express');
const router = express.Router({ mergeParams: true });

const Testingsite = require("../models/testingsite")
const Review = require('../models/review')
const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const { reviewSchema } = require('../schemas.js')


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

router.post("/", validateReview, catchAsync(async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    const review = new Review(req.body.review);
    testingsite.reviews.push(review);
    await review.save();
    await testingsite.save();
    req.flash('success', "Successfully made a new review!")
    res.redirect(`/testingsites/${testingsite._id}`);
}))

router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Testingsite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully delete a review!")
    res.redirect(`/testingsites/${id}`);
}))

module.exports = router;