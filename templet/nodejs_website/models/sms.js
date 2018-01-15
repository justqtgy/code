var db = require('./mysql_helper');

function sms(model) {

}

module.exports = sms

sms.get_count = async function(args) {
    try {
        let sql = "select count(*) as total from sms";
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

sms.get_pages = async function(args, callback) {
    try {
        let pageIndex = parseInt(args.pageIndex);
        let pageSize = parseInt(args.pageSize);
        let beginID = (pageIndex - 1) * pageSize + 1;
        let endID = pageIndex * pageSize;

        let sql = `select * from sms limit ${beginID}, ${endID}`
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

sms.get_single = async function(id) {
    try {
        let sql = `select * from sms where id = ${id}`;
        let rows = await db.exec(sql);
        return rows;
    } catch (error) {
        throw error
    }
};

sms.add = async function(args, callback) {
    try {
        var sql = `insert into sms(mobile, captch, content, type_id, add_time) 
			   values('${args.mobile}','${args.captch}','${args.content}','${args.type_id}', now())`;
        let result = await db.exec(sql);
    } catch (error) {
        throw error
    }
};

sms.update = async function(args, callback) {
    try {
        let sql = `update sms set mobile='${args.mobile}', captch='${args.captch}', content='${args.content}', type_id=${args.type_id}, add_time=now() where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};

sms.delete = async function(args) {
    try {
        let sql = `delete from sms where id = ${args.id}`;
        let result = await db.exec(sql);
        return result;
    } catch (error) {
        throw error
    }
};