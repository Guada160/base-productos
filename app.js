const express = require("express");
const Database = require("better-sqlite3");

const app = express();
app.use(express.json());

// Crear o conectar base de datos
const db = new Database("productos.db");

// Crear tabla si no existe
db.prepare(`
CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    stock INTEGER,
    precio REAL
)
`).run();

// Verificar si hay productos cargados
const cantidad = db.prepare("SELECT COUNT(*) as total FROM productos").get();

if (cantidad.total === 0) {
    const insertar = db.prepare(`
        INSERT INTO productos (nombre, stock, precio)
        VALUES (?, ?, ?)
    `);

    insertar.run("Teclado", 10, 15000);
    insertar.run("Mouse", 20, 8000);
    insertar.run("Monitor", 5, 120000);

    console.log("Productos iniciales cargados");
}

// ENDPOINT 1
// GET /productos
app.get("/productos", (req, res) => {
    const productos = db.prepare("SELECT * FROM productos").all();
    res.json(productos);
});

// ENDPOINT 2
// GET /productos/:id
app.get("/productos/:id", (req, res) => {
    const id = req.params.id;

    const producto = db
        .prepare("SELECT * FROM productos WHERE id = ?")
        .get(id);

    if (!producto) {
        return res.json({
            mensaje: "Producto no encontrado"
        });
    }

    res.json(producto);
});

// Puerto
const PORT = 3000;

app.listen(PORT, () => {
    console.log("Servidor funcionando en puerto", PORT);
});