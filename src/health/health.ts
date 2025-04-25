import { Elysia } from 'elysia';
import { testConnection } from '../config/db';

export const HealthController = new Elysia({ prefix: '/health' })
    .get('/db', async () => {
        const isConnected = await testConnection();
        return {
            status: isConnected ? 'ok' : 'error',
            message: isConnected ? 'Conexión a la base de datos exitosa' : 'Error al conectar con la base de datos',
            timestamp: new Date().toISOString()
        };
    })
    .get('/', () => ({
        status: 'ok',
        message: 'Servicio funcionando correctamente',
        timestamp: new Date().toISOString()
    })); 