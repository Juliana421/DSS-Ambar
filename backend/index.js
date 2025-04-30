const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", require("./routes/usuariosRoutes"));
app.use("/api/accesorios", require("./routes/accesoriosRoutes"));

// Ruta de prueba
app.get("/api", (req, res) => {
    res.json({ mensaje: "API de Ámbar Accesorios funcionando correctamente" });
});

// Gestión de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: "Error interno del servidor",
        mensaje: err.message
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor backend en puerto ${PORT}`);
});

module.exports = app; // Para pruebas o uso con serverless