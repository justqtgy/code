var db = require('./mysql_helper');

function users(model) {
    
}

module.exports = users;

users.get_count = async function(args) {
    try {
        let sql = "select count(*) as total from users";
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

users.get_pages = async function(args, callback) {
    try {
        let pageIndex = parseInt(args.pageIndex);
        let pageSize = parseInt(args.pageSize);
        let beginID = (pageIndex - 1) * pageSize + 1;
        let endID = pageIndex * pageSize;

        let sql = `select * from users limit ${beginID}, ${endID}`
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

users.get_single = async function(account) {
    try {        
        let sql = `select * from users where account = '${mysql.escape(account)}'`;
        let rows = await db.exec(sql);
        return rows;
    } catch (error) {
        throw error
    }
};

users.add = async function(args, callback) {
    try {

        var sql = `insert into users(account, password, user_name, weixin_id, mobile, add_time, status, is_admin)
			   values('${args.account}','${args.password}','${args.user_name}', '${args.weixin_id}', '${args.mobile}', now(), ${args.status}, ${args.is_admin})`;
        let result = await db.exec(sql);
    } catch (error) {
        throw error
    }
};

users.update = async function(args, callback) {
    try {

        let sql = `update users set user_name='${args.user_name}', weixin_id='${args.weixin_id}', mobile=${args.mobile}, status=${args.status} where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

users.delete = async function(args) {
    try {

        let sql = `delete from users where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

users.change_password = async function(args) {
    try {

        let sql = `update users set password=${args.password} where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};