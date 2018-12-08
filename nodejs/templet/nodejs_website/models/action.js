var db = dbs.mysql(dbconfigs.mydb);

function action(model) {

}

module.exports = action

action.get_count = async function(args) {
    try {
        let sql = "select count(*) as total from action";
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

action.get_list = async function(args, callback) {
    try {
        let pageIndex   = parseInt(args.pageIndex);
        let pageSize    = parseInt(args.pageSize);
        let startIndex  = (pageIndex - 1) * pageSize ;

        let sql = `select * from action limit ${pageSize} offset ${startIndex}`
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

action.get_single = async function(id) {
    try {
        let sql = `select * from action where id = ${id}`;
        let rows = await db.exec(sql);
        return rows;
    } catch (error) {
        throw error
    }
};

action.add = async function(args, callback) {
    try {
        var sql = `insert into action(action_name, remark) 
			   values('${args.action_name}','${args.remark}')`;
        let result = await db.exec(sql);
    } catch (error) {
        throw error
    }
};

action.update = async function(args, callback) {
    try {
        let sql = `update action set action_name='${args.action_name}', remark='${args.remark}' where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

action.delete = async function(args) {
    try {
        let sql = `delete from action where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};