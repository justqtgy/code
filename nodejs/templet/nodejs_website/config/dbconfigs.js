module.exports = {
	mydb:{
		host : '127.0.0.1',
		user:'root',
		password:'123456',
		database:'core',
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
	},
	pg_db:{
		host: '127.0.0.1',
		user:"postgres",
		database:"ashbin_data",
		password:"123456",
		port:5432,		
		// 扩展属性
		max:20, // 连接池最大连接数
		idleTimeoutMillis:3000, // 连接最大空闲时间 3s
	}
};
