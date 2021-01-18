const Testingsite = require("../models/testingsite")

module.exports.index = async (req, res) => {
    const testingsites = await Testingsite.find({});
    res.render("testingsites/index", { testingsites })
}

module.exports.renderNewForm = (req, res) => {
    //const testingsite = await Testingsite.findById(req.params.id);
    res.render("testingsites/new");
}

module.exports.createTestingsite = async (req, res, next) => {
    //if (!req.body.testingsite) throw new ExpressError('Invalid Testing Site Data', 400);
    const testingsite = new Testingsite(req.body.testingsite);
    testingsite.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    testingsite.author = req.user._id;
    await testingsite.save();
    console.log(testingsite)
    req.flash('success', "Successfully made a new testing site!")
    res.redirect(`/testingsites/${testingsite._id}`)
}

module.exports.showTestingsite = async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    //console.log(testingsite)
    if (!testingsite) {
        req.flash('error', 'Cannot find that testing site!')
        return res.redirect('/testingsites')
    }
    res.render("testingsites/show", { testingsite });
}

module.exports.renderEditForm = async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    if (!testingsite) {
        req.flash('error', 'Cannot find that testing site!')
        return res.redirect('/testingsites')
    }
    res.render("testingsites/edit", { testingsite });
}

module.exports.updateTestingsite = async (req, res) => {

    const { id } = req.params;
    console.log(req.body)
    const testingsite = await Testingsite.findByIdAndUpdate(id, { ...req.body.testingsite });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    testingsite.images.push(...imgs)
    await testingsite.save()
    req.flash('success', "Successfully update a testing site!")
    res.redirect(`/testingsites/${testingsite._id}`)
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Testingsite.findByIdAndDelete(id);
    req.flash('success', "Successfully delete a testing site!")
    res.redirect(`/testingsites`)
}