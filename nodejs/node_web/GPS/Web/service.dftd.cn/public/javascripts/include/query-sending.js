function Query(url, type,form, GPSID, reply) {
    this.url = url;
    this.type = type || "GET";
    this.form = form || "selector";
    this.GPSID = GPSID;
    this.reply = reply;
}

Query.prototype = {
    init: function() {
        var data_format = {};
        data_format.GPSID = this.GPSID;
        data_format.reply = this.reply;
        data_format.r = Math.random();

        var ctrls = this.form.serializeArray();

        for (var c in ctrls) {
            data_format[ctrls[c].name] = ctrls[c].value;
        }

        return data_format;
    },
    request: function(data, cb) {
        var self = this;
        $.ajax({
            url: self.url,
            type: self.type,
            dataType: "json",
            data: data,
            beforeSend: function() { App.blockUI({ boxed: true, message: '正在查询，请稍等...' }); },
            complete: function() { App.unblockUI(); },
            success: function(json) {
                cb(json);
            }
        });
    }
};