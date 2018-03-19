//导入mssql模块
var mssql=require("mssql");

var sql={},
    config={} //连接参数配置

sql.sqlserver=mssql;

//sql参数的类型
sql.direction={
    //输入参数
    Input:"input",
    //输出参数
    Output:"output",
    //返回参数
    Return:"return"
};

/**
 * 初始化连接参数
 */
sql.initConfig=function(dbconfig){
    config = dbconfig;
};

/**
 * 执行存储过程
 * @param {string} procedure 存储过程名称
 * @param {JSON} params 存储过程参数
 * params的定义格式如：
    var params={
    //ID是存储过程的第一个参数，要去掉@符号
    ID:{
        //sqlType是该ID参数在sqlserver中的类型
        sqlType:sql.sqlserver.Int,
        //direction是表明ID参数是输入还是输出(output)参数
        direction:sql.direction.Input,
        //该ID参数的值
        inputValue:1
    },
    //Name是存储过程的第二个参数，要去掉@符号
    Name:{
        sqlType:sqlHelper.sqlserver.Int,
        direction:sqlHelper.direction.Output,
        outputValue:null
    }
};
 */
sql.execute=function(spName,params){
    var connection = new mssql.Connection(config, function (error) {
        if(error)
            func(error);
        else {
            var request = new mssql.Request(connection);
            //request.verbose=true;
            if (params != null) {
                for (var index in params) {
                    if (params[index].direction == sql.direction.Output) {
                        request.output(index, params[index].sqlType);
                    }
                    else {
                        request.input(index, params[index].sqlType, params[index].inputValue);
                    }
                }
            }
            request.execute(procedure, function (error, recordsets, returnValue, affected) {
                if (error)
                    func(error);
                else {
                    for (var index in params) {
                        if (params[index].direction == sql.direction.Output) {
                            params[index].outputValue = request.parameters[index].value;
                        }
                    }
                    func(error, recordsets, returnValue, affected);
                }
            });
        }
    });

    connection.on("error", function(err){

    });
};

/**
 * 执行sql文本(带params参数)
 * @param {string} sqltext 执行的sql语句
 * @param {JSON} params sql语句中的参数
 * @param {function} func 回调函数 共有三个参数 error:错误消息 recordsets:查询的结果 affected:影响的行数
 */
sql.query=function(sqltext,params){

        var connection = new mssql.Connection(config, function (err) {
            if(err)
                func(err);
            else {
                var request = new mssql.Request(connection);
                request.multiple=true;

                if(params){
                    for(var index in params){
                        request.input(index,params[index].sqlType,params[index].inputValue);
                    }
                }

                request.query(sqltext, functin(err, result){

                });
            }
        });
        connection.on("error",func);

};

module.exports=sql;