import { sql } from "bun";

import { env } from './env';

const db = new sql({
    url: env.DATABASE_URL,
    hostname: env.DB_HOST,
    port: parseInt(env.DB_PORT),
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    max: 20, // Maximum connections in pool
    idleTimeout: 30, // Close idle connections after 30s
    maxLifetime: 0, // Connection lifetime in seconds (0 = forever)
    connectionTimeout: 30, // Timeout when establishing new connections
    tls: env.NODE_ENV === 'production',
    onconnect: client => {
        console.log("✅ Conectado a la base de datos");
    },
    onclose: client => {
        console.log("❌ Conexión cerrada");
    },
});

export const testConnection = async () => {
    try {
        const result = await sql`SELECT NOW()`;
        console.log('✅ Prueba de conexión exitosa:', result);
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
        return false;
    }
};

export default db;