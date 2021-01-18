const express = require('express');
const router = express.Router();
const testingsites = require('../controllers/testingsites')


const catchAsync = require("../utils/catchAsync")
const Testingsite = require("../models/testingsite")
const { isLoggedIn, isAuthor, validateTestingsite } = require("../middleware")

const multer = require('multer')
const { storage } = require("../cloudinary")
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(testingsites.index))
    .post(isLoggedIn, upload.array('image'), validateTestingsite, catchAsync(testingsites.createTestingsite))

router.get("/new", isLoggedIn, testingsites.renderNewForm)

router.route('/:id')
    .get(catchAsync(testingsites.showTestingsite))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateTestingsite, catchAsync(testingsites.updateTestingsite))
    .delete(isLoggedIn, isAuthor, catchAsync(testingsites.delete))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(testingsites.renderEditForm))

module.exports = router;