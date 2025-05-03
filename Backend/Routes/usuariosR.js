import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import axios from 'axios';

const router = express.Router();


//_____________________________________________________________________________________________________________________
//GUARDAR USUARIOS Y REGISTRO
//_____________________________________________________________________________________________________________________

// 🚀 REGISTRO DE USUARIOS
router.post('/register', async (req, res) => {
    const { email, password, nombre_completo } = req.body;

    if (!email || !password || !nombre_completo) {
        return res.json({ registrationStatus: false, Error: "Faltan datos" });
    }

    try {
        con.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, result) => {
            if (err) {
                console.error("Error en la consulta:", err);
                return res.json({ registrationStatus: false, Error: "Error en la base de datos" });
            }
            if (result.length > 0) {
                return res.json({ registrationStatus: false, Error: "El email ya está registrado" });
            }

            // Encriptar la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar usuario con rol 'USER' por defecto
            const sql = "INSERT INTO usuarios (email, password, nombre_completo, rol) VALUES (?, ?, ?, 'USER')";
            con.query(sql, [email, hashedPassword, nombre_completo], (err, result) => {
                if (err) {
                    console.error("Error al insertar usuario:", err);
                    return res.json({ registrationStatus: false, Error: "Error de inserción" });
                }
                console.log("Usuario registrado correctamente");
                return res.json({ registrationStatus: true });
            });
        });

    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ registrationStatus: false, Error: "Error interno" });
    }
});

// 🚀 LOGIN DE USUARIOS
router.post('/userlogin', (req, res) => {
    const { email, password } = req.body;
    
    const sql = "SELECT * FROM usuarios WHERE email = ?";
    con.query(sql, [email], async (err, result) => {
        if (err) {
            console.error("❌ Error en la consulta:", err);
            return res.json({ loginStatus: false, Error: "Error en la base de datos" });
        }
        if (result.length === 0) {
            return res.json({ loginStatus: false, Error: "Usuario no encontrado" });
        }

        try {
            const validPassword = await bcrypt.compare(password, result[0].password);
            if (!validPassword) {
                return res.json({ loginStatus: false, Error: "Contraseña incorrecta" });
            }

            // Crear el token con el rol
            const token = jwt.sign({ role: result[0].rol, email: email }, "jwt_secret_key", { expiresIn: '1d' });
            
            res.cookie('token', token, { httpOnly: true }); // Opción para cookies seguras
            return res.json({ loginStatus: true, role: result[0].rol, token }); // ⬅ Ahora enviamos el token también

        } catch (error) {
            console.error("❌ Error en login:", error);
            return res.json({ loginStatus: false, Error: "Error interno" });
        }
    });
});


//_____________________________________________________________________________________________________________________
//VISTA DE ADMINISTRADOR
//_____________________________________________________________________________________________________________________


// 🚀 OBTENER USUARIOS
router.get('/usuarios', async (req, res) => {
    try {
        const sql = `SELECT id AS usuario_id, email, nombre_completo, direccion, telefono, rol FROM usuarios;`;

        con.query(sql, (err, result) => {
            if (err) {
                console.error("Error al obtener usuarios:", err);
                return res.status(500).json({ Error: "Error en la base de datos" });
            }
            res.json(result);
        });
    } catch (error) {
        console.error("Error en la consulta de usuarios:", error);
        res.status(500).json({ Error: "Error interno" });
    }
});



// 🚀 ACTUALIZAR ROL DE USUARIO
router.put('/usuarios/:id', (req, res) => {
    const { rol } = req.body;
    const { id } = req.params;

    if (!['USER', 'ADMIN', 'AGENC'].includes(rol)) {
        return res.status(400).json({ Error: "Rol no válido" });
    }

    const sql = "UPDATE usuarios SET rol = ? WHERE id = ?";
    con.query(sql, [rol, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar el rol:", err);
            return res.status(500).json({ Error: "Error en la base de datos" });
        }
        res.json({ success: true, message: "Rol actualizado correctamente" });
    });
});

// 🚀 ELIMINAR USUARIO
router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    con.query("SELECT * FROM usuarios WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Error en la consulta:", err);
            return res.status(500).json({ Error: "Error en la base de datos" });
        }
        if (result.length === 0) {
            return res.status(404).json({ Error: "Usuario no encontrado" });
        }

        const sql = "DELETE FROM usuarios WHERE id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                console.error("Error al eliminar usuario:", err);
                return res.status(500).json({ Error: "Error al eliminar usuario" });
            }
            res.json({ success: true, message: "Usuario eliminado correctamente" });
        });
    });
});

router.get('/reporte', async (req, res) => {
    try {
        const sql = `
            SELECT reporte.*, usuarios.nombre_completo
            FROM reporte
            JOIN usuarios ON reporte.usuario_id = usuarios.id
        `;
        con.query(sql, (err, results) => {
            if (err) {
                console.error("Error al obtener los reportes:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//_____________________________________________________________________________________________________________________
//VISTA DE LAS AGENCIAS
//_____________________________________________________________________________________________________________________

// 🚀 ELIMINAR MASCOTA
router.delete('/mascotas/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "El ID de la mascota es obligatorio" });
    }

    try {
        const sql = "DELETE FROM mascotas WHERE id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                console.error("Error al eliminar la mascota:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Mascota no encontrada" });
            }
            res.status(200).json({ message: "Mascota eliminada correctamente" });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🚀 EDITAR MASCOTA
router.put('/mascotas/:id', async (req, res) => {
    const { id } = req.params;
    const { nombreM, edad, fotoM, tipoM, descripcion, especie, raza } = req.body;

    if (!nombreM || !edad || !fotoM || !tipoM || !descripcion || !especie || !raza) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const sql = "UPDATE mascotas SET nombreM = ?, edad = ?, fotoM = ?, tipoM = ?, descripcion = ?, especie = ?, raza = ? WHERE id = ?";
        con.query(sql, [nombreM, edad, fotoM, tipoM, descripcion, especie, raza, id], (err, result) => {
            if (err) {
                console.error("Error al actualizar la mascota:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Mascota no encontrada" });
            }
            res.status(200).json({ message: "Mascota actualizada correctamente" });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🚀 GUARDAR MASCOTAS
router.post('/mascotas', async (req, res) => {
    const { usuario_id, nombreM, edad, fotoM, tipoM, descripcion, especie, raza } = req.body;

    if (!usuario_id || !nombreM || !edad || !fotoM || !tipoM || !descripcion || !especie || !raza) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const sql = "INSERT INTO mascotas (usuario_id, nombreM, edad, fotoM, tipoM, descripcion, especie, raza) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        con.query(sql, [usuario_id, nombreM, edad, fotoM, tipoM, descripcion, especie, raza], (err, result) => {
            if (err) {
                console.error("Error al guardar la mascota:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            res.status(201).json({ message: "Mascota guardada correctamente", id: result.insertId });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});



// 🚀 OBTENER MASCOTAS POR USUARIO
router.get('/mascotas', async (req, res) => {
    const { usuario_id } = req.query;

    if (!usuario_id) {
        return res.status(400).json({ error: "El ID de usuario es obligatorio" });
    }

    try {
        const sql = "SELECT * FROM mascotas WHERE usuario_id = ?";
        con.query(sql, [usuario_id], (err, results) => {
            if (err) {
                console.error("Error al obtener las mascotas:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});

// 🚀 OBTENER UN USUARIO POR ID
router.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "El ID del usuario es obligatorio" });
    }

    try {
        const sql = "SELECT id AS usuario_id, nombre_completo FROM usuarios WHERE id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                console.error("Error al obtener el usuario:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.status(200).json(result[0]); // Devuelve solo el usuario encontrado
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});


//_____________________________________________________________________________________________________________________
//VISTA USUARIO COMUN
//_____________________________________________________________________________________________________________________


// 🚀 GUARDAR REPORTE DE MASCOTA PERDIDA
router.post('/reporte', async (req, res) => {
    const { usuario_id, foto, especie, descripcion, direccion } = req.body;

    if (!usuario_id || !foto || !especie || !descripcion || !direccion) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const sql = "INSERT INTO reporte (usuario_id, foto, especie, descripcion, direccion) VALUES (?, ?, ?, ?, ?)";
        con.query(sql, [usuario_id, foto, especie, descripcion, direccion], (err, result) => {
            if (err) {
                console.error("Error al guardar el reporte:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            res.status(201).json({ message: "Reporte guardado correctamente", id: result.insertId });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🚀 OBTENER TODOS LOS REPORTES
router.get('/reporte', async (req, res) => {
    try {
        const sql = "SELECT * FROM reporte";
        con.query(sql, (err, result) => {
            if (err) {
                console.error("Error al obtener reportes:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            res.json(result);
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🚀 GUARDAR REPORTE
router.post('/reporte', async (req, res) => {
    const { usuario_id, foto, especie, descripcion, direccion } = req.body;

    if (!usuario_id || !foto || !especie || !descripcion || !direccion) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        const sql = "INSERT INTO reportes (usuario_id, foto, especie, descripcion, direccion) VALUES (?, ?, ?, ?, ?)";
        con.query(sql, [usuario_id, foto, especie, descripcion, direccion], (err, result) => {
            if (err) {
                console.error("Error al guardar el reporte:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            res.status(201).json({ message: "Reporte guardado correctamente", id: result.insertId });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 🚀 OBTENER REPORTES POR USUARIO 
router.get('/reporte/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = "SELECT * FROM reporte WHERE usuario_id = ?";
        con.query(sql, [id], (err, results) => {
            if (err) {
                console.error("Error al obtener los reportes:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: "No se encontraron reportes para este usuario." });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});
// 🚀 ELIMINA REPORTES POR USUARIO 
router.delete('/reporte/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "El ID de reporte es obligatorio" });
    }

    try {
        const sql = "DELETE FROM reporte WHERE id = ?";
        con.query(sql, [id], (err, result) => {
            if (err) {
                console.error("Error al eliminar la reporte:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Reporte no encontrada" });
            }
            res.status(200).json({ message: "Reporte eliminada correctamente" });
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

router.get('/mascotas/todas', async (req, res) => {
    try {
        const sql = `
            SELECT m.id, m.nombreM, m.raza, m.especie, m.edad, m.descripcion, m.fotoM, 
                   u.id AS usuario_id, u.nombre_completo, u.email, u.direccion, u.telefono
            FROM mascotas m
            JOIN usuarios u ON m.usuario_id = u.id;
        `;

        con.query(sql, (err, results) => {
            if (err) {
                console.error("Error al obtener las mascotas:", err);
                return res.status(500).json({ error: "Error en la base de datos" });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error en el servidor:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
});



export const userRouter = router;
