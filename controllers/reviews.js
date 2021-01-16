const Testingsite = require("../models/testingsite")
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    const review = new Review(req.body.review);
    testingsite.reviews.push(review);
    review.author = req.user._id;
    await review.save();
    await testingsite.save();
    req.flash('success', "Successfully made a new review!")
    res.redirect(`/testingsites/${testingsite._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Testingsite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully delete a review!")
    res.redirect(`/testingsites/${id}`);
}