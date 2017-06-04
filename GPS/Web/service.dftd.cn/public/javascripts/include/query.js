function Query(url, type, pageIndex, pageSize) {
    this.url = url;
    this.type = type || "GET";
    this.pageIndex = pageIndex || 1;
    this.pageSize = pageSize || 20;
}

Query.prototype = {
    init: function(data) {
        var data_format = {};

        if (data) {
            data_format = $.extend(true, {}, data)
        }

        data_format.pageIndex = this.pageIndex;
        data_format.pageSize = this.pageSize;
        data_format.r = Math.random();

        var ctrls = $('#search').serializeArray();
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
            currentPage: this.pageIndex,
            numberOfPages: 15,
            totalPages: Math.ceil(total / this.pageSize),
            onPageClicked: function(event, originalEvent, type, page) {
                this.pageIndex = page;
                func(page);
            }
        };
        $('.pagination').bootstrapPaginator(options);
    }
};