var db = dbs.mysql(dbconfigs.mydb);

function roles(model) {

}

module.exports = roles;

roles.get_count = async function(args) {
    try {
        let sql = "select count(*) as total from roles";
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

roles.get_pages = async function(args, callback) {
    try {
        let pageIndex = parseInt(args.pageIndex);
        let pageSize = parseInt(args.pageSize);
        let beginID = (pageIndex - 1) * pageSize + 1;
        let endID = pageIndex * pageSize;

        let sql = `select * from roles limit ${beginID}, ${endID}`
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

roles.get_single = async function(id) {
    try {
        let sql = `select * from roles where id = ${id}`;
        let rows = await db.exec(sql);
        return rows;
    } catch (error) {
        throw error
    }
};

roles.add = async function(args, callback) {
    try {
        var sql = `insert into roles(roles_name, remark) 
			   values('${args.roles_name}','${args.remark}')`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

roles.update = async function(args, callback) {
    try {
        let sql = `update roles set roles_name='${args.roles_name}', remark='${args.remark}' where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

roles.delete = async function(args) {
    try {
        let sql = `delete from roles where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};