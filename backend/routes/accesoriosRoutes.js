const express = require("express");
const router = express.Router();
const controller = require("../controllers/accesoriosController.js");

router.get("/", controller.getAccesorios);
router.post("/", controller.createAccesorio);
router.put("/:id", controller.updateAccesorio);
router.delete("/:id", controller.deleteAccesorio);

module.exports = router;
