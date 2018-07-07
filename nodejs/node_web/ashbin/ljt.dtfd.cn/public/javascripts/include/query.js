function Query(url, type, form, pageIndex, pageSize) {
    this.url = url;
    this.type = type || "GET";
    this.form = form;
    this.page = pageIndex || 1;
    this.size = pageSize || 20;
}

Query.prototype = {
    init: function(data) {
        var data_format = {};

        if (data) {
            data_format = $.extend(true, {}, data)
        }

        data_format.page = this.page;
        data_format.size = this.size;
        data_format.r = Math.random();
        if(this.form){
            var ctrls = this.form.serializeArray();
            for (var c in ctrls) {
                data_format[ctrls[c].name] = ctrls[c].value;
            }
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
            beforeSend: function() { App.blockUI({ boxed: true, message: '正在处理，请稍等...' }); },
            complete: function() { App.unblockUI(); },
            success: function(json) {
                cb(json);
            }
        });
    },
    showPagination: function(total, func) {
        if (total === 0) {
            $('.pagination').empty();
            return;
        }
        var options = {
            bootstrapMajorVersion: 3,
            currentPage: this.page,
            numberOfPages: 15,
            totalPages: Math.ceil(total / this.size),
            onPageClicked: function(event, originalEvent, type, page) {
                this.page = page;
                func(page);
            }
        };
        $('.pagination').bootstrapPaginator(options);
    }
};