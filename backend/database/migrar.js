// database/migrar.js
// Ejecuta UNA migración .sql de esta carpeta en la BD configurada en el .env
// (Neon o PostgreSQL local), sin borrar las demás tablas.
//
// Uso:  npm run db:migrar -- migracion_03.sql
const fs = require("fs");
const path = require("path");
const pool = require("../config/db");

const archivo = process.argv[2];

(async () => {
  try {
    if (!archivo) {
      console.error(
        "Indica el archivo. Ejemplo: npm run db:migrar -- migracion_03.sql",
      );
      process.exitCode = 1;
      return;
    }
    const ruta = path.join(__dirname, path.basename(archivo));
    if (!fs.existsSync(ruta)) {
      console.error(`No existe el archivo database/${path.basename(archivo)}`);
      process.exitCode = 1;
      return;
    }
    const destino = pool.usaNeon ? "Neon" : "PostgreSQL local";
    console.log(`Ejecutando ${path.basename(archivo)} en ${destino}...`);
    await pool.query(fs.readFileSync(ruta, "utf8"));
    console.log("¡Migración aplicada correctamente!");
  } catch (error) {
    console.error("Error en la migración:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
