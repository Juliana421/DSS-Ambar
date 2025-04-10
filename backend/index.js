const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/usuarios", require("./routes/usuariosRoutes"));

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor backend en puerto ${PORT}`);
});
