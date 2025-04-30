document.addEventListener("DOMContentLoaded", function () {
    // Base URL para las API calls - ajustar según entorno
    const API_URL = "/.netlify/functions/api";
    
    // Array de productos para almacenamiento local
    let products = [];
    let usuarioActual = null;

    // Mostrar formularios
    document.getElementById("btnIniciar").addEventListener("click", () => {
        document.getElementById("Login").style.display = "block";
        document.getElementById("botonesInicio").style.display = "none";
    });

    document.getElementById("btnRegistro").addEventListener("click", () => {
        document.getElementById("formularioRegistro").style.display = "block";
        document.getElementById("botonesInicio").style.display = "none";
    });

    // Botones para volver
    document.getElementById("volverDesdeLogin").addEventListener("click", volverAInicio);
    document.getElementById("volverDesdeRegistro").addEventListener("click", volverAInicio);
    document.getElementById("cerrarSesionAdmin").addEventListener("click", cerrarSesion);
    document.getElementById("cerrarSesionUsuario").addEventListener("click", cerrarSesion);

    function volverAInicio() {
        document.getElementById("Login").style.display = "none";
        document.getElementById("formularioRegistro").style.display = "none";
        document.getElementById("botonesInicio").style.display = "block";
    }

    function cerrarSesion() {
        document.getElementById("adminPanel").style.display = "none";
        document.getElementById("usuarioPanel").style.display = "none";
        document.getElementById("botonesInicio").style.display = "block";
        usuarioActual = null;
    }

    // Registro de usuario
    document.getElementById("registroForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const usuario = document.getElementById("registroUsuario").value;
        const contraseña = document.getElementById("registroContraseña").value;
        const confirmacion = document.getElementById("confirmarContraseña").value;
        const rol = document.getElementById("registroRol").value;

        if (contraseña !== confirmacion) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/usuarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario,
                    contraseña,
                    rol
                })
            });

            const data = await res.json();
            
            if (res.ok) {
                alert("Usuario registrado exitosamente");
                document.getElementById("formularioRegistro").style.display = "none";
                document.getElementById("botonesInicio").style.display = "block";
                document.getElementById("registroForm").reset();
            } else {
                alert(data.mensaje || "Error en el registro");
            }
        } catch (err) {
            console.error("Error en el registro:", err);
            alert("Hubo un error en el registro");
        }
    });

    // Login
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const usuario = document.getElementById("loginUsuario").value;
        const contraseña = document.getElementById("loginContraseña").value;

        try {
            const res = await fetch(`${API_URL}/usuarios/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario,
                    contraseña
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.mensaje || "Credenciales incorrectas");
                return;
            }

            usuarioActual = {
                nombre: usuario,
                rol: data.rol
            };

            alert(`Bienvenido ${usuario}, has iniciado como ${data.rol}`);
            document.getElementById("Login").style.display = "none";
            document.getElementById("loginForm").reset();

            // Cargar productos
            await cargarProductos();

            if (data.rol === "admin") {
                document.getElementById("adminPanel").style.display = "block";
            } else {
                document.getElementById("usuarioPanel").style.display = "block";
            }

        } catch (err) {
            console.error("Error en login:", err);
            alert("Error al iniciar sesión");
        }
    });

    // Cargar productos
    async function cargarProductos() {
        try {
            const res = await fetch(`${API_URL}/accesorios`);
            if (res.ok) {
                products = await res.json();
                actualizarListaProductos();
                listarProductosUsuario();
            }
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }

    // Gestión de productos
    document.getElementById("productosForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const nombre = document.getElementById("nombreProducto").value;
        const precio = parseFloat(document.getElementById("precioProducto").value);
        const stock = parseInt(document.getElementById("stockProducto").value);

        try {
            const res = await fetch(`${API_URL}/accesorios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    precio,
                    stock,
                    id: Date.now().toString() // Generamos un ID simple
                })
            });

            if (res.ok) {
                const nuevoProducto = await res.json();
                products.push(nuevoProducto);
                actualizarListaProductos();
                listarProductosUsuario();
                document.getElementById("productosForm").reset();
            }
        } catch (error) {
            console.error("Error al agregar producto:", error);
            alert("Error al agregar el producto");
        }
    });

    function actualizarListaProductos() {
        const lista = document.getElementById("listaProductos");
        lista.innerHTML = "";
        
        products.forEach((p, i) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <strong>${p.nombre || p.name}</strong> - 
                    $${p.precio || p.price} - 
                    Stock: ${p.stock}
                    <button onclick="editarProducto(${i})">Editar</button>
                    <button onclick="eliminarProducto(${i})">Eliminar</button>
                </div>
            `;
            lista.appendChild(li);
        });
    }

    function listarProductosUsuario() {
        const lista = document.getElementById("listaUsuarioProductos");
        lista.innerHTML = "";
        
        products.forEach(p => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div>
                    <strong>${p.nombre || p.name}</strong> - 
                    $${p.precio || p.price} - 
                    Stock: ${p.stock}
                </div>
            `;
            lista.appendChild(li);
        });
    }

    // Funciones globales para los botones
    window.editarProducto = async (i) => {
        const producto = products[i];
        const nuevoNombre = prompt("Nuevo nombre:", producto.nombre || producto.name);
        const nuevoPrecio = prompt("Nuevo precio:", producto.precio || producto.price);
        const nuevoStock = prompt("Nuevo stock:", producto.stock);

        if (nuevoNombre && nuevoPrecio && nuevoStock) {
            try {
                const id = producto.id;
                const res = await fetch(`${API_URL}/accesorios/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre: nuevoNombre,
                        precio: parseFloat(nuevoPrecio),
                        stock: parseInt(nuevoStock)
                    })
                });

                if (res.ok) {
                    const actualizado = await res.json();
                    // Actualizar el producto en el array local
                    products[i] = actualizado;
                    actualizarListaProductos();
                    listarProductosUsuario();
                }
            } catch (error) {
                console.error("Error al actualizar producto:", error);
                alert("Error al actualizar el producto");
            }
        }
    };

    window.eliminarProducto = async (i) => {
        const confirmar = confirm("¿Está seguro que desea eliminar este producto?");
        if (!confirmar) return;

        try {
            const id = products[i].id;
            const res = await fetch(`${API_URL}/accesorios/${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                products.splice(i, 1);
                actualizarListaProductos();
                listarProductosUsuario();
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("Error al eliminar el producto");
        }
    };
});