var db = require('../models/mssql_helper');
var util = require('util');

function drivers(model) {

}

module.exports = drivers;

drivers.add = function(args, callback) {
    var params = [
        { name: "VehicleNo", value: args.account },
        { name: "Password", value: args.password },
        { name: "Mobile", value: args.mobile }
    ];

    db.execSP("dbo.cp_Drivers_Add", params, function(err, result) {
        if (err) {
            return callback(err);
        }
        callback(err, result);
    });
};