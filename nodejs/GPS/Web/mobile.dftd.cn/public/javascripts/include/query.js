function Query(url, type, form, pageIndex, pageSize) {
    this.url = url;
    this.type = type || "GET";
    this.form = form || "search";
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
            beforeSend: function() { $("#loading").show(); },
            complete: function() { $("#loading").hide(); },
            success: function(json) {
                cb(json);
            }
        });
    },
    showPagination: function(_totalNumber, _pageIndex) {
        var result = { totalPages : 0, pageIndex : 0 };
        if (_totalNumber === 0) {
            return result;
        }
        
        var totalPages = Math.ceil(_totalNumber / this.pageSize);
        result.totalPages = totalPages;

        var currentPage = Number(_pageIndex) + 1;
        if(currentPage>totalPages){
            result.pageIndex = -1;
            return result;
        }

        this.pageIndex = currentPage;
        result.pageIndex = currentPage;
        
        return result;
    }
};