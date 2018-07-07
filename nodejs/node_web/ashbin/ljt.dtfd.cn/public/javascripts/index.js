var displayNumber = 10;

function get_list() {
    $.get('/last/list', function(json) {
        console.log(json)
        app.DataList = json.rows;

        initEasyPieCharts();
    });
}

var initEasyPieCharts =function() {
    if (!jQuery().easyPieChart) {
        return;
    }

    // $('.easy-pie-chart .number.rl').easyPieChart({
    //     animate: 1000,
    //     size: 75,                
    //     scaleColor: false,                
    //     lineWidth: 5,
    //     barColor: function(percent){
    //         if(percent>60)
    //             return 'green'
    //         if(percent<=60 && percent>50)
    //             return 'yello'
    //         if(percent<50)
    //             return 'red'
    //     }
    // });
    console.log('aaaaaaaaaaaaaaaaaaaaaaaa')
    
    $('.easy-pie-chart .number').easyPieChart({
        animate: 1000,
        size: 75,
        scaleColor: false,
        lineWidth: 5,
        barColor: App.getBrandColor('green')
    });
}

var app = new Vue({
    el: '#grid',
    data: {
        DataList: []
    },
    methods: {
        
        init: function() {
            var that = this
            get_list();
        },
        
    }
});

app.init();