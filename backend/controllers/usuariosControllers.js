let usuarios = [];

// Obtener todos los usuarios
const getUsuarios = (req, res) => {
    // Por seguridad, devolvemos usuarios sin contraseñas
    const usuariosSeguros = usuarios.map(({ usuario, rol }) => ({ usuario, rol }));
    res.json(usuariosSeguros);
};

// Crear un nuevo usuario (registro)
const createUsuario = (req, res) => {
    const { usuario, contraseña, rol } = req.body;

    // Validaciones básicas
    if (!usuario || !contraseña) {
        return res.status(400).json({ mensaje: "Usuario y contraseña son requeridos" });
    }

    // Verificar si el usuario ya existe
    const existente = usuarios.find(u => u.usuario === usuario);
    if (existente) {
        return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Crear nuevo usuario con ID único
    const nuevoUsuario = { 
        id: Date.now().toString(),
        usuario, 
        contraseña, 
        rol: rol || "usuario" // Default a usuario normal si no se especifica
    };
    
    usuarios.push(nuevoUsuario);
    
    // Devolvemos usuario sin contraseña
    const { contraseña: _, ...usuarioSeguro } = nuevoUsuario;
    res.status(201).json({ 
        mensaje: "Usuario registrado exitosamente",
        usuario: usuarioSeguro
    });
};

// Login de usuario
const loginUsuario = (req, res) => {
    const { usuario, contraseña } = req.body;
    
    // Validaciones básicas
    if (!usuario || !contraseña) {
        return res.status(400).json({ mensaje: "Usuario y contraseña son requeridos" });
    }

    // Buscar usuario
    const user = usuarios.find(u => u.usuario === usuario && u.contraseña === contraseña);
    if (!user) {
        return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    res.status(200).json({ 
        mensaje: "Inicio de sesión exitoso", 
        rol: user.rol,
        id: user.id,
        usuario: user.usuario
    });
};

// Actualizar usuario
const updateUsuario = (req, res) => {
    const { id } = req.params;
    const { usuario, contraseña, rol } = req.body;
    
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    
    // Actualizar los campos proporcionados
    if (usuario) usuarios[index].usuario = usuario;
    if (contraseña) usuarios[index].contraseña = contraseña;
    if (rol) usuarios[index].rol = rol;
    
    // Devolver usuario actualizado sin contraseña
    const { contraseña: _, ...usuarioActualizado } = usuarios[index];
    res.json({ 
        mensaje: "Usuario actualizado exitosamente",
        usuario: usuarioActualizado
    });
};

// Eliminar usuario
const deleteUsuario = (req, res) => {
    const { id } = req.params;
    
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    
    const eliminado = usuarios.splice(index, 1)[0];
    const { contraseña: _, ...usuarioEliminado } = eliminado;
    
    res.json({ 
        mensaje: "Usuario eliminado exitosamente",
        usuario: usuarioEliminado
    });
};

module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loginUsuario
};