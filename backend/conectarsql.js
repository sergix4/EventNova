//este archivo conecta postgress para crear las tablas
const fs = require('fs');
const path = require('path');
const pool = require('./config/db'); 

const ejecutarSql = async () => {
    try {
        // Lee tu archivo develop.sql
        const rutaSql = path.join(__dirname, 'database', 'develop.sql');
        const scriptSql = fs.readFileSync(rutaSql, 'utf8');

        console.log('Conectando a PostgreSQL y ejecutando script...');
        
        // Ejecuta todo el script en la base de datos
        await pool.query(scriptSql);
        
        console.log('¡Las tablas se crearon correctamente!');
    } catch (error) {
        console.error('Error al ejecutar el script:', error);
    } finally {
        pool.end(); // Cierra la conexión
    }
};

ejecutarSql();