let accesorios = [];

// Obtener todos los accesorios
const getAccesorios = (req, res) => {
  res.json(accesorios);
};

// Crear un nuevo accesorio
const createAccesorio = (req, res) => {
  const { nombre, precio, stock, id } = req.body;
  
  // Validaciones básicas
  if (!nombre || precio === undefined || stock === undefined) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }
  
  const nuevoAccesorio = {
    id: id || Date.now().toString(),
    nombre,
    precio: parseFloat(precio),
    stock: parseInt(stock)
  };
  
  accesorios.push(nuevoAccesorio);
  res.status(201).json(nuevoAccesorio);
};

// Actualizar un accesorio existente
const updateAccesorio = (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stock } = req.body;
  
  const index = accesorios.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Accesorio no encontrado" });
  }
  
  // Actualizar solo los campos proporcionados
  if (nombre) accesorios[index].nombre = nombre;
  if (precio !== undefined) accesorios[index].precio = parseFloat(precio);
  if (stock !== undefined) accesorios[index].stock = parseInt(stock);
  
  res.json(accesorios[index]);
};

// Eliminar un accesorio
const deleteAccesorio = (req, res) => {
  const { id } = req.params;
  
  const index = accesorios.findIndex(a => a.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Accesorio no encontrado" });
  }
  
  const eliminado = accesorios.splice(index, 1)[0];
  res.json(eliminado);
};

// Obtener un accesorio por ID
const getAccesorioById = (req, res) => {
  const { id } = req.params;
  
  const accesorio = accesorios.find(a => a.id === id);
  if (!accesorio) {
    return res.status(404).json({ error: "Accesorio no encontrado" });
  }
  
  res.json(accesorio);
};

// Añadir algunos productos de ejemplo al iniciar
const iniciarDatosEjemplo = () => {
  if (accesorios.length === 0) {
    accesorios = [
      { id: "1", nombre: "Collar de perlas", precio: 29.99, stock: 15 },
      { id: "2", nombre: "Pulsera de plata", precio: 19.99, stock: 20 },
      { id: "3", nombre: "Anillo ajustable", precio: 12.50, stock: 30 }
    ];
  }
};

// Inicializar datos de ejemplo
iniciarDatosEjemplo();

module.exports = {
  getAccesorios,
  createAccesorio,
  updateAccesorio,
  deleteAccesorio,
  getAccesorioById
};