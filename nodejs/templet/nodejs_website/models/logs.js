var db = dbs.pgsql(dbconfigs.pg_db);

function logs(model) {
    
}

module.exports = logs

logs.get_count = async function(args) {
    try {
        let sql = "select count(*) as total from logs";
        let result = await db.exec(sql, null);
        let total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }
        return total;
    } catch (error) {
        throw error
    }
};

logs.get_pages = async function(args) {
    try {
        let pageIndex   = parseInt(args.pageIndex);
        let pageSize    = parseInt(args.pageSize);
        let startIndex  = (pageIndex - 1) * pageSize ;
        //let endID = pageIndex * pageSize;

        let sql = `select * from users limit $1 offset $2`
        let result = await db.exec(sql, [pageSize, startIndex]);
        return result.rows;
    } catch (error) {
        throw error
    }
};

logs.get_single = async function(id) {
    try {
        let sql = `select * from logs where id = ${id}`;
        let result = await db.exec(sql);
        return result.rows;
    } catch (error) {
        throw error
    }
};

logs.add = async function(args, callback) {
    try {
        var sql = `insert into logs(user_id, content, type_id, add_time) 
			   values('${args.user_id}','${args.content}','${args.type_id}', now())`;
        let result = await db.exec(sql);
    } catch (error) {
        throw error
    }
};

logs.update = async function(args, callback) {
    try {
        let sql = `update logs set user_id='${args.user_id}', content='${args.content}', type_id=${args.type_id}, add_time=now() where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

logs.delete = async function(args) {
    try {
        let sql = `delete from logs where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};
