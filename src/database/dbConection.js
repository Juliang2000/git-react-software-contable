const { Pool } = require('pg');


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    password: 'posgrest123',
    database: 'factura',
    port: '5432'
});

module.exports = pool;