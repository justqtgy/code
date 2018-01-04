var db = require('./mysql_helper');

function role(model) {

}

module.exports = role;

role.get_count = async function(args) {
    try {
        let sql = "select count(*) as total from role";
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

role.get_list = async function(args, callback) {
    try {
        let pageIndex = parseInt(args.pageIndex);
        let pageSize = parseInt(args.pageSize);
        let beginID = (pageIndex - 1) * pageSize + 1;
        let endID = pageIndex * pageSize;

        let sql = `select * from role limit ${beginID}, ${endID}`
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

role.get_single = async function(id) {
    try {
        let sql = `select * from role where id = ${id}`;
        let rows = await db.exec(sql);
        return rows;
    } catch (error) {
        throw error
    }
};

role.add = async function(args, callback) {
    try {
        var sql = `insert into role(role_name, remark) 
			   values('${args.role_name}','${args.remark}')`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

role.update = async function(args, callback) {
    try {
        let sql = `update role set role_name='${args.role_name}', remark='${args.remark}' where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

role.delete = async function(args) {
    try {
        let sql = `delete from role where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};