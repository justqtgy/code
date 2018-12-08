var db = dbs.pgsql(dbconfigs.pg_db);

function user(model) {
    
}

module.exports = user;

user.get_count = async function(args) {
    try {
        let sql = "select count(*) as total from user";
        let result = await db.exec(sql);
        let total = 0;
        if (result.length > 0) {
            total = result[0].total;
        }
        return total;
    } catch (error) {
        throw error
    }
};

user.get_pages = async function(args, callback) {
    try {
        let pageIndex   = parseInt(args.pageIndex);
        let pageSize    = parseInt(args.pageSize);
        let startIndex  = (pageIndex - 1) * pageSize ;

        let sql = `select * from user limit ${pageSize} offset ${startIndex}`
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

user.get_single = async function(account) {
    try {        
        let sql = `select * from user where account = '${account}'`;
        let rows = await db.exec(sql);
        return rows;
    } catch (error) {
        throw error
    }
};

user.add = async function(args, callback) {
    try {

        var sql = `insert into user(account, password, user_name, weixin_id, mobile, add_time, status, is_admin)
			   values('${args.account}','${args.password}','${args.user_name}', '${args.weixin_id}', '${args.mobile}', now(), ${args.status}, ${args.is_admin})`;
        let result = await db.exec(sql);
    } catch (error) {
        throw error
    }
};

user.update = async function(args, callback) {
    try {

        let sql = `update user set user_name='${args.user_name}', weixin_id='${args.weixin_id}', mobile=${args.mobile}, status=${args.status} where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

user.delete = async function(args) {
    try {

        let sql = `delete from user where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

user.change_password = async function(args) {
    try {
        let sql = `update user set password=${args.password} where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};