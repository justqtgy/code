var db = require('./mysql_helper');

function logs(model){

}

module.exports = logs

logs.get_count = async function(args){
	try{
		let sql = "select count(*) as total from logs";
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

logs.get_list = async function(args, callback){
	try{
		let pageIndex = parseInt(args.pageIndex);
		let pageSize = parseInt(args.pageSize);
		let beginID = (pageIndex - 1) * pageSize + 1;
		let endID = pageIndex * pageSize;

		let sql = `select * from logs limit ${beginID}, ${endID}`
		let result = await db.execSQL(sql);
		return result;
	}
	catch(error){
		throw error
	}
};

logs.get_single = async function(id){
	try{
		let sql = `select * from logs where id = ${id}`;
		let rows = await db.execSQL(sql);
		return rows;
	}
	catch(error){
		throw error
	}	
};

logs.add = async function(args, callback){
	try{
		var sql = `insert into logs(user_id, content, type_id, add_time) 
			   values('${args.user_id}','${args.content}','${args.type_id}', now())`;
		let result = await db.execSQL(sql);	
	}
	catch(error){
		throw error
	}
};

logs.update = async function(args, callback){
	try{
		let sql = `update logs set user_id='${args.user_id}', content='${args.content}', type_id=${args.type_id}, add_time=now() where id = ${args.id}`;
		let result = await db.execSQL(sql);
		return result;
	}
	catch(error){
		throw error
	}
};

logs.delete = async function(args){
	try{
		let sql = `delete from logs where id = ${args.id}`;	 
		let result = await db.execSQL(sql);
		return result;
	}
	catch(error){
		throw error
	}	
};
