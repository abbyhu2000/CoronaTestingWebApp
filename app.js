const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
const Testingsite = require("./models/testingsite")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const { testingsiteSchema, reviewSchema } = require('./schemas.js')
const Review = require('./models/review')


mongoose.connect("mongodb://localhost:27017/corona", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database Connected!");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);


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

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/testingsites", catchAsync(async (req, res) => {
    const testingsites = await Testingsite.find({});
    res.render("testingsites/index", { testingsites })
}))

app.get("/testingsites/new", (req, res) => {
    //const testingsite = await Testingsite.findById(req.params.id);
    res.render("testingsites/new");
})

app.post("/testingsites", validateTestingsite, catchAsync(async (req, res, next) => {
    //if (!req.body.testingsite) throw new ExpressError('Invalid Testing Site Data', 400);

    const testingsite = new Testingsite(req.body.testingsite);
    await testingsite.save();
    res.redirect(`/testingsites/${testingsite._id}`)
}))

app.get("/testingsites/:id", catchAsync(async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id).populate("reviews");
    //console.log(testingsite)
    res.render("testingsites/show", { testingsite });
}))

app.get("/testingsites/:id/edit", catchAsync(async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    res.render("testingsites/edit", { testingsite });
}))

app.put("/testingsites/:id", validateTestingsite, catchAsync(async (req, res) => {
    const { id } = req.params;
    const testingsite = await Testingsite.findByIdAndUpdate(id, { ...req.body.testingsite });
    res.redirect(`/testingsites/${testingsite._id}`)
}))

app.delete("/testingsites/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Testingsite.findByIdAndDelete(id);
    res.redirect(`/testingsites`)
}))

app.post("/testingsites/:id/reviews", validateReview, catchAsync(async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    const review = new Review(req.body.review);
    testingsite.reviews.push(review);
    await review.save();
    await testingsite.save();
    res.redirect(`/testingsites/${testingsite._id}`);
}))

app.delete("/testingsites/:id/reviews/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Testingsite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/testingsites/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})
