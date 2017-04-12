var displayNumber = 10;

function get_list() {
    $.get('/vehicle/vhc_group', function(result) {
        var carlist = result.group;
        $.get('/oil_vhc_dv/detail?carlist=' + carlist, function(result) {
            app.DataList = result.rows;
        });
    })
}


var app = new Vue({
    el: '#grid',
    data: {
        DataList: []
    },
    methods: {
        init: function() {
            get_list(1);
        }
    }
});

app.init();