const express = require("express");
const router = express.Router();
const controller = require("../controllers/accesoriosControllers.js");


// Rutas para accesorios
router.get("/", controller.getAccesorios);
router.get("/:id", controller.getAccesorioById);
router.post("/", controller.createAccesorio);
router.put("/:id", controller.updateAccesorio);
router.delete("/:id", controller.deleteAccesorio);

module.exports = router;
