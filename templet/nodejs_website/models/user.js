var db = require('./mysql_helper');

function user(model){

}

module.exports = user

user.get_count = async function(args){
	try{
		let sql = "select count(*) as total from user";
		let result = await db.execSQL(sql);
		let total = 0;
		if(result.length>0){
			total = result[0].total;
		}
		return total;
	}
	catch(error){
		throw error
	}	
};

user.get_list = async function(args, callback){
	try{
		let pageIndex = parseInt(args.pageIndex);
		let pageSize = parseInt(args.pageSize);
		let beginID = (pageIndex - 1) * pageSize + 1;
		let endID = pageIndex * pageSize;

		let sql = `select * from user limit ${beginID}, ${endID}`
		let result = await db.execSQL(sql);
		return result;
	}
	catch(error){
		throw error
	}
};

user.get_single = async function(id){
	try{
		let sql = `select * from user where id = ${id}`;
		let rows = await db.execSQL(sql);
		return rows;
	}
	catch(error){
		throw error
	}	
};

user.add = async function(args, callback){
	try{
		var sql = `insert into user(account, password, user_name, weixin_id, mobile, add_time, status) 
			   values('${args.account}','${args.password}','${args.user_name}', '${args.weixin_id}', '${args.mobile}', now(), ${args.status})`;
		let result = await db.execSQL(sql);	
	}
	catch(error){
		throw error
	}
};

user.update = async function(args, callback){
	try{
		let sql = `update user set user_name='${args.user_name}', weixin_id='${args.weixin_id}', mobile=${args.mobile}, status=${args.status} where id = ${args.id}`;
		let result = await db.execSQL(sql);
		return result;
	}
	catch(error){
		throw error
	}
};

user.delete = async function(args){
	try{
		let sql = `delete from user where id = ${args.id}`;	 
		let result = await db.execSQL(sql);
		return result;
	}
	catch(error){
		throw error
	}	
};

user.change_password = async function(args){
	try{
		let sql = `update user set password=${args.password} where id = ${args.id}`;	 
		let result = await db.execSQL(sql);
		return result;
	}
	catch(error){
		throw error
	}	
};
