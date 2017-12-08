module.exports.dbconfig = {
    user: 'sa',
    password: 'DSERVER@123',
    server: '120.24.68.95', // You can use 'localhost\\instance' to connect to named instance
    database: 'gserver_data',
    options: {
        encrypt: false // Use this if you're on Windows Azure
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};