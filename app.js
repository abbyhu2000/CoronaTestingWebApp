const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const app = express();
const path = require("path");
const Testingsite = require("./models/testingsite")


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

app.get("/", (req, res) => {
    res.render("home")
})

app.get("/testingsites", async (req, res) => {
    const testingsites = await Testingsite.find({});
    res.render("testingsites/index", { testingsites })
})

app.get("/testingsites/new", (req, res) => {
    //const testingsite = await Testingsite.findById(req.params.id);
    res.render("testingsites/new");
})

app.post("/testingsites", async (req, res) => {
    // res.send(req.body);
    const testingsite = new Testingsite(req.body.testingsite);
    await testingsite.save();
    res.redirect(`/testingsites/${testingsite._id}`)
})

app.get("/testingsites/:id", async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    res.render("testingsites/show", { testingsite });
})

app.get("/testingsites/:id/edit", async (req, res) => {
    const testingsite = await Testingsite.findById(req.params.id);
    res.render("testingsites/edit", { testingsite });
})

app.put("/testingsites/:id", async (req, res) => {
    const { id } = req.params;
    const testingsite = await Testingsite.findByIdAndUpdate(id, { ...req.body.testingsite });
    res.redirect(`/testingsites/${testingsite._id}`)
})

app.delete("/testingsites/:id", async (req, res) => {
    const { id } = req.params;
    await Testingsite.findByIdAndDelete(id);
    res.redirect(`/testingsites`)
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})
