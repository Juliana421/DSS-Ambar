document.addEventListener("DOMContentLoaded", function () {
    let products = [];
    let users = [];

    // Mostrar formulario de inicio de sesión
    document.getElementById("btnIniciar").addEventListener("click", function () {
        document.getElementById("Login").style.display = "block";
        document.getElementById("btnIniciar").style.display = "none";
        document.getElementById("btnRegistro").style.display = "none";
    });

    // Mostrar formulario de registro
    document.getElementById("btnRegistro").addEventListener("click", function () {
        document.getElementById("formularioRegistro").style.display = "block";
        document.getElementById("btnIniciar").style.display = "none";
        document.getElementById("btnRegistro").style.display = "none";
    });

    // Manejar el registro de usuario
    document.getElementById("registroForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let usuario = document.getElementById("registroUsuario").value;
        let contraseña = document.getElementById("registroContraseña").value;
        let confirmacion = document.getElementById("confirmarContraseña").value;
        let rol = document.getElementById("registroRol").value;

        if (contraseña !== confirmacion) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        users.push({ usuario, contraseña, rol });
        alert("Registro exitoso. Ahora inicia sesión.");
        document.getElementById("formularioRegistro").style.display = "none";
        document.getElementById("btnIniciar").style.display = "block";
        document.getElementById("btnRegistro").style.display = "block";
    });

    // Manejar inicio de sesión
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let usuario = document.getElementById("loginUsuario").value;
        let contraseña = document.getElementById("loginContraseña").value;
        let rol = document.getElementById("loginRol").value;

        let userFound = users.find(user => user.usuario === usuario);

        if (!userFound) {
            users.push({ usuario, contraseña, rol });
            alert(`Usuario ${usuario} no registrado. Se ha creado una cuenta automáticamente.`);
        }

        alert(`Bienvenido, ${usuario}. Has ingresado como ${rol}.`);
        document.getElementById("Login").style.display = "none";

        if (rol === "admin") {
            document.getElementById("adminPanel").style.display = "block";
        } else {
            document.getElementById("usuarioPanel").style.display = "block";
            listarProductosUsuario();
        }
    });

    // Agregar un producto (solo admin)
    document.getElementById("productosForm").addEventListener("submit", function (event) {
        event.preventDefault();
        let name = document.getElementById("nombreProducto").value;
        let price = document.getElementById("precioProducto").value;
        let stock = document.getElementById("stockProducto").value;

        let product = { name, price, stock };
        products.push(product);
        actualizarListaProductos();
        listarProductosUsuario();

        document.getElementById("productosForm").reset();
    });

    function actualizarListaProductos() {
        let productList = document.getElementById("listaProductos");
        productList.innerHTML = "";

        products.forEach((product, index) => {
            let li = document.createElement("li");
            li.innerHTML = `${product.name} - $${product.price} - Stock: ${product.stock}
                <button onclick="editarProducto(${index})">Editar</button>
                <button onclick="eliminarProducto(${index})">Eliminar</button>`;
            productList.appendChild(li);
        });
    }

    function listarProductosUsuario() {
        let userProductList = document.getElementById("listaUsuarioProductos");
        userProductList.innerHTML = "";

        products.forEach((product) => {
            let li = document.createElement("li");
            li.innerHTML = `${product.name} - $${product.price} - Stock: ${product.stock}`;
            userProductList.appendChild(li);
        });
    }

    window.editarProducto = function (index) {
        let nuevoNombre = prompt("Nuevo nombre:", products[index].name);
        let nuevoPrecio = prompt("Nuevo precio:", products[index].price);
        let nuevoStock = prompt("Nuevo stock:", products[index].stock);

        if (nuevoNombre && nuevoPrecio && nuevoStock) {
            products[index] = { name: nuevoNombre, price: nuevoPrecio, stock: nuevoStock };
            actualizarListaProductos();
            listarProductosUsuario();
        }
    };

    window.eliminarProducto = function (index) {
        products.splice(index, 1);
        actualizarListaProductos();
        listarProductosUsuario();
    };
});

