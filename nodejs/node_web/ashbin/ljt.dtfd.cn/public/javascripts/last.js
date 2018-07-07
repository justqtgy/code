
var app = new Vue({
    el: '#grid',
    data: {
        DataList: [],
    },
    methods: {
        initEasyPieCharts: function() {
            if (!jQuery().easyPieChart) {
                return;
            }

            $('.easy-pie-chart .number.rl').easyPieChart({
                animate: 1000,
                size: 75,                
                scaleColor: false,                
                lineWidth: 5,
                barColor: function(percent){
                    if(percent<97)
                        return 'green'
                    else if(percent>99)
                        return 'red'
                    else
                        return 'orange'
                }
            });

            
            $('.easy-pie-chart .number.dl').easyPieChart({
                animate: 1000,
                size: 75,
                scaleColor: false,
                lineWidth: 5,
                barColor: function(percent){
                    if(percent>50)
                        return 'green'
                    else
                        return 'red'
                }
            });
        },
        init: function() {
            var that = this;
            that.initEasyPieCharts();
        },
    }
});

app.init();