const express = require('express');
const router = express.Router();
const { testingsiteSchema, reviewSchema } = require('../schemas.js')

const catchAsync = require("../utils/catchAsync")
const ExpressError = require("../utils/ExpressError")
const Testingsite = require("../models/testingsite")


const validateTestingsite = (req, res, next) => {
    const { error } = testingsiteSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

router.get("/", catchAsync(async (req, res) => {
    const testingsites = await Testingsite.find({});
    res.render("testingsites/index", { testingsites })
}))

router.get("/new", (req, res) => {
    //const testingsite = await Testingsite.findById(req.params.id);
    res.render("testingsites/new");
})

router.post("/", validateTestingsite, catchAsync(async (req, res, next) => {
    //if (!req.body.testingsite) throw new ExpressError('Invalid Testing Site Data', 400);
    const testingsite = new Testingsite(req.body.testingsite);
    await testingsite.save();
    req.flash('success', "Successfully made a new testing site!")
    res.redirect(`/testingsites/${testingsite._id}`)
}))

router.get("/:id", catchAsync(async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id).populate("reviews");
    //console.log(testingsite)
    if (!testingsite) {
        req.flash('error', 'Cannot find that testing site!')
        return res.redirect('/testingsites')
    }
    res.render("testingsites/show", { testingsite });
}))

router.get("/:id/edit", catchAsync(async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    if (!testingsite) {
        req.flash('error', 'Cannot find that testing site!')
        return res.redirect('/testingsites')
    }
    res.render("testingsites/edit", { testingsite });
}))

router.put("/:id", validateTestingsite, catchAsync(async (req, res) => {
    const { id } = req.params;
    const testingsite = await Testingsite.findByIdAndUpdate(id, { ...req.body.testingsite });
    req.flash('success', "Successfully update a testing site!")
    res.redirect(`/testingsites/${testingsite._id}`)
}))

router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Testingsite.findByIdAndDelete(id);
    req.flash('success', "Successfully delete a testing site!")
    res.redirect(`/testingsites`)
}))

module.exports = router;