import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const router = express.Router();

//_____________________________________________________________________________________________________
// 🚀 REGISTRO
//_____________________________________________________________________________________________________
router.post('/register', async (req, res) => {
  const { email, password, nombre_completo, rol } = req.body;

  if (!email || !password || !nombre_completo || !rol) {
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

          // Insertar usuario con el rol seleccionado
          const sql = "INSERT INTO usuarios (email, password, nombre_completo, rol) VALUES (?, ?, ?, ?)";
          con.query(sql, [email, hashedPassword, nombre_completo, direccion || null, telefono || null, rol], (err, result) => {
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

//_____________________________________________________________________________________________________
// 🚀 LOGIN
//_____________________________________________________________________________________________________

router.post('/userlogin', (req, res) => {
    const { email, password } = req.body;

    con.query("CALL login_usuario(?, ?)", [email, password], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ loginStatus: false, Error: err.sqlMessage });
        }

        const user = result[0][0];

        // Crear token con JWT
        const token = jwt.sign({ id: user.id, email: user.email, role: user.rol }, "mi_clave_secreta", { expiresIn: '1h' });

        return res.json({ 
            loginStatus: true, 
            token: token, 
            role: user.rol,
            id: user.id   // 👉 Añadimos el ID aquí
        });
    });
});


//_____________________________________________________________________________________________________
// 🚀 LISTAR USUARIOS
//_____________________________________________________________________________________________________
router.get('/usuarios', (req, res) => {
    con.query("SELECT * FROM vista_usuarios", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Error: "Error al obtener usuarios" });
        }
        res.json(result);
    });
});

//_____________________________________________________________________________________________________
// 🚀 ACTUALIZAR ROL
//_____________________________________________________________________________________________________
router.put('/usuarios/:id', (req, res) => {
    const { rol } = req.body;
    const { id } = req.params;

    con.query("CALL actualizar_rol(?, ?)", [id, rol], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Error: "Error al actualizar rol" });
        }
        res.json({ success: true, message: "Rol actualizado correctamente" });
    });
});

//_____________________________________________________________________________________________________
// 🚀 ELIMINAR USUARIO
//_____________________________________________________________________________________________________
router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    con.query("CALL eliminar_usuario(?)", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ Error: "Error al eliminar usuario" });
        }
        res.json({ success: true, message: "Usuario eliminado correctamente" });
    });
});



//_____________________________________________________________________________________________________
// 🚀 Actualizar Ingreso
//_____________________________________________________________________________________________________
router.put('/usuarios/:id/ingreso', (req, res) => {
    const userId = req.params.id;
    const { ingreso } = req.body;
  
    if (ingreso == null) {
      return res.status(400).json({ mensaje: 'El ingreso es obligatorio' });
    }
  
    const query = 'CALL actualizarIngresoUsuario(?, ?)';
  
    con.query(query, [userId, ingreso], (error, results) => {
      if (error) {
        console.error('Error al actualizar ingreso con procedimiento:', error);
        return res.status(500).json({ mensaje: 'Error al actualizar ingreso' });
      }
      res.json({ mensaje: 'Ingreso actualizado correctamente' });
    });
});

//_____________________________________________________________________________________________________
// 🚀 Obtener un usuario por ID
//_____________________________________________________________________________________________________
router.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    con.query('SELECT ingreso FROM usuarios WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al obtener usuario:', err);
            return res.status(500).json({ Error: 'Error al obtener usuario' });
        }
        if (result.length === 0) {
            return res.status(404).json({ Error: 'Usuario no encontrado' });
        }
        res.json(result[0]); 
    });
});


//_____________________________________________________________________________________________________
// 🚀 AGREGAR SUSCRIPCIÓN
//_____________________________________________________________________________________________________
router.post('/suscripciones', (req, res) => {
    const { nombresus, monto, diasSus, fechaVencimiento, categoria, usuario_id } = req.body;

    con.query(
        "CALL InsertarSuscripcion(?, ?, ?, ?, ?, ?)",
        [nombresus, monto, diasSus, fechaVencimiento, categoria, usuario_id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ Error: "Error al agregar suscripción" });
            }
            res.json({ success: true, message: "Suscripción agregada correctamente" });
        }
    );
});

//_____________________________________________________________________________________________________
// 🚀 ACTUALIZAR SUSCRIPCIÓN
//_____________________________________________________________________________________________________
router.put('/suscripciones/:idsusc', (req, res) => {
    const { idsusc } = req.params;
    const { nombresus, monto, diasSus, fechaVencimiento, categoria } = req.body;

    con.query(
        "CALL EditarSuscripcion(?, ?, ?, ?, ?, ?)",
        [idsusc, nombresus, monto, diasSus, fechaVencimiento, categoria],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ Error: "Error al actualizar suscripción" });
            }
            res.json({ success: true, message: "Suscripción actualizada correctamente" });
        }
    );
});

//_____________________________________________________________________________________________________
// 🚀 ELIMINAR SUSCRIPCIÓN
//_____________________________________________________________________________________________________
router.delete('/suscripciones/:idsusc', (req, res) => {
    const { idsusc } = req.params;

    con.query(
        "CALL EliminarSuscripcion(?)",
        [idsusc],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ Error: "Error al eliminar suscripción" });
            }
            res.json({ success: true, message: "Suscripción eliminada correctamente" });
        }
    );
});


//_____________________________________________________________________________________________________
// 🚀 Obtener Suscripciones x usuario
//_____________________________________________________________________________________________________
router.get('/suscripciones/usuario/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
  
    con.query(
      "SELECT * FROM vistasuscripcionesporusuario WHERE usuario_id = ?",
      [usuario_id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ Error: "Error al consultar suscripciones" });
        }
        res.json(result);
      }
    );
  });
  
//_____________________________________________________________________________________________________
// 🚀 Obtener el total de gastos
//_____________________________________________________________________________________________________
  router.get('/total-gastos/usuario/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
  
    con.query(
      "SELECT * FROM vista_total_gastos_usuario WHERE usuario_id = ?",
      [usuario_id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ Error: "Error al consultar el total de gastos" });
        }
        res.json(result);
      }
    );
  });

//_____________________________________________________________________________________________________
// 🚀 Obtener balance x usuario
//_____________________________________________________________________________________________________
  router.get('/balance/usuario/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
  
    con.query(
      "SELECT * FROM vista_balance_usuario WHERE usuario_id = ?",
      [usuario_id],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ Error: "Error al consultar el balance disponible" });
        }
        res.json(result);
      }
    );
  });
  
export const userRouter = router;

