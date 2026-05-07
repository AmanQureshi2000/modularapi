const axios = require('axios');

const runApi = async ({ url, method = 'GET', data = null, params = null, headers = {} }) => {
    const start = Date.now();
    try {
        const response = await axios({
            url,
            method: method.toUpperCase(),
            data,
            params,
            headers,
            timeout: 10000 
        });
        return {
            success: true,
            status: response.status,
            data: response.data,
            duration: `${Date.now() - start}ms`
        };
    } catch (err) {
        console.error(`API Error [${method}] ${url}:`, err.message);
        return {
            success: false,
            status: err.response?.status || 500,
            error: err.response?.data || err.message,
            code: err.code || 'API_CALL_ERROR'
        };
    }
};

module.exports = { runApi };