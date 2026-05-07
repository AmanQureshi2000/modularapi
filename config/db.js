require('dotenv').config(); 
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    max: parseInt(process.env.DB_POOL_MAX) || 20, 
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000, 
    connectionTimeoutMillis: 5000, 
    maxUses: 7500, 
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err.message);
});

const runQuery = async (text, params = []) => {
    const start = Date.now();
    try {
        
        const res = await pool.query(text, params);
        return {
            success: true,
            data: res.rows,            
            rowCount: res.rowCount,    
            duration: `${Date.now() - start}ms`  
        };
    } catch (err) {
        console.error('Database Query Error:', { text, message: err.message });
        return {
            success: false,
            error: err.message,
            code: err.code
        };
    }
};

process.on('SIGTERM', async () => {
    console.log('Closing database pool...');
    await pool.end();
    process.exit(0);
});

module.exports = { runQuery };