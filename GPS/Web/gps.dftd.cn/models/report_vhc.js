var db = require('./framework/db_gserver_synth');
var util = require('util');

function report_vhc(model){
	 
};

module.exports = report_vhc


/**
 * 车辆状态
 */
report_vhc.get_vehicle_status = function(car_list, callback){
	var sql = " SELECT t1.VehicleID, t1.carnumber, t3.oil as oil_rest, t2.online, isnull(t4.quality_diff,0) as  quality_diff \
                FROM View_CarList t1 inner join vhcOnline t2 on t1.VehicleID=t2.vhcid  and t2.g_day>=CONVERT (VARCHAR(10), GETDATE(), 112) \
                    inner join vehicle_last t3 on t1.VehicleID=t3.vhcid \
                    left join gserver_data.dbo.rpt_oil_quality t4 on t1.VehicleID = t4.VehicleID and t4.createdate>=CONVERT(varchar(10),GETDATE(),120) \
                WHERE t1.VehicleID in (%s)";
    sql = util.format(sql, car_list)

    console.log('query:'+sql);
  
	db.execSQL(sql, function(err, rows){
		if(err){
			console.log(err);
			throw err
		}
		
		callback(err, rows);
	});
}


//加油对账
report_vhc.get_checksum = function(start_date, end_date, car_list, callback){
	var sql = " SELECT sum(oildv) as total FROM Oil_vhc_dv t1 inner join View_CarList t2 on t1.vhcid=t2.VehicleID "
		    + " WHERE t1.createtime>='" + start_date+ "' and	 t1.createtime<'" + end_date + "' and t1.type =0 ";
	if(car_list && car_list.length>0){
		sql += "and t1.vhcid in ("+ car_list +")";
	}			
    
	db.execSQL(sql, function(err, rows){
		if(err){
			console.log(err);
			throw err
		}
		
		var total = 0;
		if(result.length>0){
			total = result[0].total;
		}

		callback(err, total);
	});
}
