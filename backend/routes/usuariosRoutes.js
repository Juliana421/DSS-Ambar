const express = require("express");
const router = express.Router();
const controller = require("../controllers/usuariosControllers.js");

// Rutas para usuarios
router.get("/", controller.getUsuarios);
router.post("/", controller.createUsuario); // Registro
router.post("/login", controller.loginUsuario); // Login
router.put("/:id", controller.updateUsuario);
router.delete("/:id", controller.deleteUsuario);

module.exports = router;