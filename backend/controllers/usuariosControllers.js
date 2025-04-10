let usuarios = [];

const registrarUsuario = (req, res) => {
    const { usuario, contraseña, rol } = req.body;

    const existente = usuarios.find(u => u.usuario === usuario);
    if (existente) {
        return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    usuarios.push({ usuario, contraseña, rol });
    res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
};

const loginUsuario = (req, res) => {
    const { usuario, contraseña } = req.body;

    const user = usuarios.find(u => u.usuario === usuario && u.contraseña === contraseña);
    if (!user) {
        return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    res.status(200).json({ mensaje: "Inicio de sesión exitoso", rol: user.rol });
};

module.exports = {
    registrarUsuario,
    loginUsuario,
};
