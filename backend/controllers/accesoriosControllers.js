const accesorios = [];

exports.getAccesorios = (req, res) => {
  res.json(accesorios);
};

exports.createAccesorio = (req, res) => {
  const nuevo = req.body;
  accesorios.push(nuevo);
  res.status(201).json(nuevo);
};

exports.updateAccesorio = (req, res) => {
  const { id } = req.params;
  const index = accesorios.findIndex(a => a.id === id);
  if (index !== -1) {
    accesorios[index] = { ...accesorios[index], ...req.body };
    res.json(accesorios[index]);
  } else {
    res.status(404).json({ error: "Accesorio no encontrado" });
  }
};

exports.deleteAccesorio = (req, res) => {
  const { id } = req.params;
  const index = accesorios.findIndex(a => a.id === id);
  if (index !== -1) {
    const eliminado = accesorios.splice(index, 1);
    res.json(eliminado);
  } else {
    res.status(404).json({ error: "Accesorio no encontrado" });
  }
};
