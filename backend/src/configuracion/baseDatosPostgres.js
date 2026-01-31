const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mi_base_de_datos_usuarios',
    password: 'admin',
    port: 5432,
});

// Este bloque es opcional para verificar la conexión al iniciar
const testConnection = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Conexión a PostgreSQL OK");
  } catch (error) {
    console.error("Error PostgreSQL:", error.message);
  }
};

(async () => {
  await testConnection();
})();

module.exports = pool;