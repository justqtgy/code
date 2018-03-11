module.exports = {
	mydb:{
		host : '127.0.0.1',
		user:'root',
		password:'123456',
		database:'mydb',
		port:3306
	},
	shijie:{
		user: 'sa',
		password: 'DSERVER@123',
		server: '120.24.68.95', // You can use 'localhost\\instance' to connect to named instance
		database: 'ShiJie',
		options: {
			encrypt: false // Use this if you're on Windows Azure
		},
		pool: {
			max: 10,
			min: 0,
			idleTimeoutMillis: 30000
		}
	}
};
