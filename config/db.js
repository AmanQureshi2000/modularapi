require('dotenv').config(); 
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    max: parseInt(process.env.DB_POOL_MAX),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT),
    ssl: {
        require: true,
        rejectUnauthorized: false // allows connection without the Aiven CA cert
  }
});

const runQuery = async (text, params = []) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        return {
            success: true,
            data: res.rows,            
            rowCount: res.rowCount,    
            command: res.command,      
            duration: `${duration}ms`  
        };
    } catch (err) {
        return {
            success: false,
            error: err.message,
            code: err.code, 
            detail: err.detail
        };
    }
};

module.exports = { runQuery };