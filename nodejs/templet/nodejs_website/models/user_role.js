var db = dbs.mysql(dbconfigs.mydb);

class user_role {
    constructor() {

    }

    async get_count(args) {
        try {
            let sql = "select count(*) as total from user_role";
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
    
            let sql = `select * from user_role limit ${pageSize} offset ${startIndex}`
            let result = await db.exec(sql);
            return result;
        } catch (error) {
            throw error
        }
    }

    async get_single(id) {
        try {
            let sql = `select * from user_role where id = ${id}`;
            let rows = await db.exec(sql);
            return rows;
        } catch (error) {
            throw error
        }    
    }

    async add(args) {
        try {
            var sql = `insert into user_role(user_id, role_id) 
                   values('${args.user_id}','${args.role_id}')`;
            let result = await db.exec(sql);
            return result;
        } catch (error) {
            throw error
        }
    }

    async update(args) {
        try {
            let sql = `update user_role set role_id='${args.role_id}', user_id='${args.user_id}' where id = ${args.id}`;
            let result = await db.exec(sql);
            return result;
        } catch (error) {
            throw error
        }
    }

    async delete(args) {
        try {
            let sql = `delete from user_role where id = ${args.id}`;
            let result = await db.exec(sql);
            return result;
        } catch (error) {
            throw error
        }
    };
}

module.exports = user_role;
