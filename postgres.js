const { Pool } = require('pg')

/**
 * In the real world, these should NOT be published.
 * These should be stored in .env
 */
const PGHOST=process.env.PGHOST
const PGDATABASE=process.env.PGDATABASE
const PGUSER=process.env.PGUSER
const PGPASSWORD=process.env.PGPASSWORD
const ENDPOINT_ID=process.env.ENDPOINT_ID

// Create a new pool with your PostgreSQL connection details
const pool = new Pool({
    user: PGUSER,
    host: PGHOST,
    database: PGDATABASE,
    password: PGPASSWORD,
    port: 5432, // or your PostgreSQL port
    ssl: {
        rejectUnauthorized: false, // You may need to set this to true in production
        // ca: fs.readFileSync('path/to/server-ca.pem').toString(),
        // key: fs.readFileSync('path/to/client-key.pem').toString(),
        // cert: fs.readFileSync('path/to/client-cert.pem').toString(),
      },
});

async function dbQuery(queryString) {
    let client = await pool.connect();
    let result = await client.query(queryString);
    // release the client
    client.release()
    return result.rows
}


module.exports = {
    dbQuery
}