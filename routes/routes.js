const express = require('express');
const router = express.Router();
const dataEntryController = require("../controller/dataEntryController.js");
const readDataEntryController = require("../controller/eventListener.js");

router.post("/", dataEntryController.storeValue);
router.get("/", readDataEntryController.readData);
module.exports = router;