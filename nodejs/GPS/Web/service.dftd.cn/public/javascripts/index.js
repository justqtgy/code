var displayNumber = 10;

function get_list() {
    $.get('/gps_oil_leak/mylist', function(json) {
        app.DataList = json.rows;
    });
}


var app = new Vue({
    el: '#grid',
    data: {
        DataList: []
    },
    methods: {
        init: function() {
            get_list();
        }
    }
});

app.init();