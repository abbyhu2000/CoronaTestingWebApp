const express = require('express');
const router = express.Router();


const catchAsync = require("../utils/catchAsync")
const Testingsite = require("../models/testingsite")
const { isLoggedIn, isAuthor, validateTestingsite } = require("../middleware")


router.get("/", catchAsync(async (req, res) => {
    const testingsites = await Testingsite.find({});
    res.render("testingsites/index", { testingsites })
}))

router.get("/new", isLoggedIn, (req, res) => {
    //const testingsite = await Testingsite.findById(req.params.id);
    res.render("testingsites/new");
})

router.post("/", isLoggedIn, validateTestingsite, catchAsync(async (req, res, next) => {
    //if (!req.body.testingsite) throw new ExpressError('Invalid Testing Site Data', 400);
    const testingsite = new Testingsite(req.body.testingsite);
    testingsite.author = req.user._id;
    await testingsite.save();
    req.flash('success', "Successfully made a new testing site!")
    res.redirect(`/testingsites/${testingsite._id}`)
}))

router.get("/:id", catchAsync(async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    console.log(testingsite)
    if (!testingsite) {
        req.flash('error', 'Cannot find that testing site!')
        return res.redirect('/testingsites')
    }
    res.render("testingsites/show", { testingsite });
}))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    if (!testingsite) {
        req.flash('error', 'Cannot find that testing site!')
        return res.redirect('/testingsites')
    }
    res.render("testingsites/edit", { testingsite });
}))

router.put("/:id", isLoggedIn, validateTestingsite, isAuthor, catchAsync(async (req, res) => {

    const { id } = req.params;
    const testingsite = await Testingsite.findByIdAndUpdate(id, { ...req.body.testingsite });
    req.flash('success', "Successfully update a testing site!")
    res.redirect(`/testingsites/${testingsite._id}`)
}))

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Testingsite.findByIdAndDelete(id);
    req.flash('success', "Successfully delete a testing site!")
    res.redirect(`/testingsites`)
}))

module.exports = router;