$(function() {

    $("#btnAdd").click(function() {
        event.preventDefault();
        var data = {};
        var ctrls = $('#fuel-form').serializeArray();
        for (var c in ctrls) {
            data[ctrls[c].name] = ctrls[c].value;
        }

        if (!data.vehicleID) {
            return alert('请选择车辆');
        }
        data.vehicleNo = $('#vehicleID').find('option:selected').text();

        if (!data.fueltime) {
            return alert('请填写日期');
        }
        if (!data.amount) {
            return alert('请填写总金额');
        }
        if (!data.price) {
            return alert('请填写单价');
        }
        if (!data.number) {
            return alert('请填写加油升数');
        }


        $.post('/gps_oil_ticket/add', data, function(result) {
            if (result.ok == 1); {
                alert('加油记账成功');
                location.href = '/';
            }
        });
    });


    // $("#btnBack").click(function() {

    //     $("#defaultForm").show();
    //     $("#okForm").hide();

    // });

    // $("#btnOK").click(function() {

    //     $.post('/oil_ticket/add', data, function(result) {
    //         if (result.ok == 1); {
    //             alert('加油记账成功');
    //             location.href = "/m_d_index";
    //         }
    //     })

    // });

});

function calc_price(number) {
    event.preventDefault();
    if (!number || number == 0) {
        $(":input[name='price']").val(0);
        return;
    }
    var amount = $(":input[name='amount']").val();
    var price = amount / number;
    $(":input[name='price']").val(price.toFixed(2));
}