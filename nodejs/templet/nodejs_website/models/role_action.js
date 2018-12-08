var db = dbs.mysql(dbconfigs.mydb);

class role_action {
    constructor() {

    }

    async get_count(args) {
        try {
            let sql = "select count(*) as total from role_action";
            let result = await db.exec(sql);
            let total = 0;
            if (result.length > 0) {
                total = result[0].total;
            }
            return total;
        } catch (error) {
            throw error
        }    
    }

    async get_pages(args) {
        try {
            let pageIndex   = parseInt(args.pageIndex);
            let pageSize    = parseInt(args.pageSize);
            let startIndex  = (pageIndex - 1) * pageSize ;
    
            let sql = `select * from role_action limit ${pageSize} offset ${startIndex}`
            let result = await db.exec(sql);
            return result;
        } catch (error) {
            throw error
        }
    }

    async get_single(id) {
        try {
            let sql = `select * from role_action where id = ${id}`;
            let rows = await db.exec(sql);
            return rows;
        } catch (error) {
            throw error
        }    
    }

    async add(args) {
        try {
            var sql = `insert into role_action(role_id, action_id) 
                   values('${args.role_id}','${args.action_id}')`;
            let result = await db.exec(sql);
            return result;
        } catch (error) {
            throw error
        }
    }

    async update(args) {
        try {
            let sql = `update role_action set role_id='${args.role_id}', action_id='${args.action_id}' where id = ${args.id}`;
            let result = await db.exec(sql);
            return result;
        } catch (error) {
            throw error
        }
    }

    async delete(args) {
        try {
            let sql = `delete from role_action where id = ${args.id}`;
            let result = await db.exec(sql);
            return result;
        } catch (error) {
            throw error
        }
    };
}

module.exports = role_action;
