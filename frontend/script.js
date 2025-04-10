document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "/.netlify/functions/usuarios";

    // Mostrar formularios
    document.getElementById("btnIniciar").addEventListener("click", () => {
        document.getElementById("Login").style.display = "block";
        document.getElementById("btnIniciar").style.display = "none";
        document.getElementById("btnRegistro").style.display = "none";
    });

    document.getElementById("btnRegistro").addEventListener("click", () => {
        document.getElementById("formularioRegistro").style.display = "block";
        document.getElementById("btnIniciar").style.display = "none";
        document.getElementById("btnRegistro").style.display = "none";
    });

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
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accion: "registro",
                    usuario,
                    contraseña,
                    rol
                })
            });

            const data = await res.json();
            alert(data.mensaje);

            if (res.ok) {
                document.getElementById("formularioRegistro").style.display = "none";
                document.getElementById("btnIniciar").style.display = "block";
                document.getElementById("btnRegistro").style.display = "block";
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
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    accion: "login",
                    usuario,
                    contraseña
                })
            });

            const data = await res.json();

            if (!res.ok) {
                return alert(data.mensaje);
            }

            alert(`Bienvenido ${usuario}, has iniciado como ${data.rol}`);
            document.getElementById("Login").style.display = "none";

            if (data.rol === "admin") {
                document.getElementById("adminPanel").style.display = "block";
            } else {
                document.getElementById("usuarioPanel").style.display = "block";
                listarProductosUsuario();
            }

        } catch (err) {
            console.error("Error en login:", err);
            alert("Error al iniciar sesión");
        }
    });

    // ⚠ Lógica de productos puede ir más adelante cuando se conecte con base de datos
    let products = [];

    document.getElementById("productosForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("nombreProducto").value;
        const price = document.getElementById("precioProducto").value;
        const stock = document.getElementById("stockProducto").value;

        products.push({ name, price, stock });
        actualizarListaProductos();
        listarProductosUsuario();
        document.getElementById("productosForm").reset();
    });

    function actualizarListaProductos() {
        const lista = document.getElementById("listaProductos");
        lista.innerHTML = "";
        products.forEach((p, i) => {
            const li = document.createElement("li");
            li.innerHTML = `${p.name} - $${p.price} - Stock: ${p.stock}
                <button onclick="editarProducto(${i})">Editar</button>
                <button onclick="eliminarProducto(${i})">Eliminar</button>`;
            lista.appendChild(li);
        });
    }

    function listarProductosUsuario() {
        const lista = document.getElementById("listaUsuarioProductos");
        lista.innerHTML = "";
        products.forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.name} - $${p.price} - Stock: ${p.stock}`;
            lista.appendChild(li);
        });
    }

    window.editarProducto = (i) => {
        const nuevoNombre = prompt("Nuevo nombre:", products[i].name);
        const nuevoPrecio = prompt("Nuevo precio:", products[i].price);
        const nuevoStock = prompt("Nuevo stock:", products[i].stock);

        if (nuevoNombre && nuevoPrecio && nuevoStock) {
            products[i] = { name: nuevoNombre, price: nuevoPrecio, stock: nuevoStock };
            actualizarListaProductos();
            listarProductosUsuario();
        }
    };

    window.eliminarProducto = (i) => {
        products.splice(i, 1);
        actualizarListaProductos();
        listarProductosUsuario();
    };
});
