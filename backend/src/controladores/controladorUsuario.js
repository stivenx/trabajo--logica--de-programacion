const pool  = require('../configuracion/baseDatosPostgres');  // Asegúrate de importar 'pool' correctamente
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.registrarUsuario = async (req, res) => {
  const { nombre, correo, password, direccion, telefono, rol } = req.body;
 
  console.log(nombre, correo, password, direccion, telefono, rol);
  // 🔐 Validación básica
  if (!nombre || !correo || !password) {
    return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
  }

  try {
    // 🔎 Verificar si el correo ya existe
    const existe = await pool.query(
      "SELECT id FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    // 🔑 Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🧾 Insertar usuario
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password, direccion, telefono, rol)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [nombre, correo, hashedPassword, direccion, telefono, rol || "cliente"]
    );

    // 🎫 Crear token
    const token = jwt.sign(
      { id: resultado.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ mensaje: "Usuario registrado", token });
  } catch (error) {
    console.error("Error registro:", error);
    res.status(500).json({
      mensaje: "Error al crear el usuario",
      error: error.message,
    });
  }
};


// Iniciar sesión
exports.iniciarSesion = async (req, res) => {
    const { correo, password } = req.body;
    try {
        const resultado = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
        const usuario = resultado.rows[0];

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ mensaje: 'Inicio de sesión exitoso', token });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
    }
};

// Obtener perfil de usuario
exports.obtenerPerfilUsuario = async (req, res) => {
    const userId = req.user.id;
    try {
        const resultado = await pool.query('SELECT id, nombre, correo, direccion, telefono, rol, fecha_creacion FROM usuarios WHERE id = $1', [userId]);
        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        return res.status(200).json({ usuario: resultado.rows[0] });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener el perfil del usuario', error: error.message });
    }
};

// Actualizar perfil de usuario
exports.actualizarPerfilUsuario = async (req, res) => {
    const userId = req.user.id;
    const { nombre, correo, direccion, telefono, rol } = req.body;
    try {
        const resultado = await pool.query(
            'UPDATE usuarios SET nombre = $1, correo = $2, direccion = $3, telefono = $4, rol = $5 WHERE id = $6 RETURNING *',
            [nombre, correo, direccion, telefono, rol, userId]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        return res.status(200).json({ mensaje: 'Perfil actualizado', usuario: resultado.rows[0] });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al actualizar el perfil', error: error.message });
    }
};


exports.obtenerTodosLosUsuarios = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios');
        return res.status(200).json({ usuarios: resultado.rows });
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los usuarios', error: error.message });
    }
};

exports.obtenerUsuariosDeterminados = async (req, res) => {
    const {users} = req.query;
    try {
        const GetUsers = users.split(',').map(user => (user));
        const resultado = await pool.query(`SELECT * FROM usuarios WHERE id = ANY($1) order by id desc`, [GetUsers]);
        return res.status(200).json(resultado.rows );
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener los usuarios', error: error.message });
    }
}
 /*const placeholders = GetUsers.map((_, i) => `$${i + 1}`).join(',');*/