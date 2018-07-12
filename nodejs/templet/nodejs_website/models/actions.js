var db = dbs.mysql(dbconfigs.mydb);

function actions(model) {

}

module.exports = actions

actions.get_count = async function(args) {
    try {
        let sql = "select count(*) as total from actions";
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

actions.get_list = async function(args, callback) {
    try {
        let pageIndex = parseInt(args.pageIndex);
        let pageSize = parseInt(args.pageSize);
        let beginID = (pageIndex - 1) * pageSize + 1;
        let endID = pageIndex * pageSize;

        let sql = `select * from actions limit ${beginID}, ${endID}`
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

actions.get_single = async function(id) {
    try {
        let sql = `select * from actions where id = ${id}`;
        let rows = await db.exec(sql);
        return rows;
    } catch (error) {
        throw error
    }
};

actions.add = async function(args, callback) {
    try {
        var sql = `insert into actions(actions_name, remark) 
			   values('${args.actions_name}','${args.remark}')`;
        let result = await db.exec(sql);
    } catch (error) {
        throw error
    }
};

actions.update = async function(args, callback) {
    try {
        let sql = `update actions set actions_name='${args.actions_name}', remark='${args.remark}' where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

actions.delete = async function(args) {
    try {
        let sql = `delete from actions where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};