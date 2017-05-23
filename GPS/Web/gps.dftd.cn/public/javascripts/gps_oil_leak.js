$(function() {

    $(".form_datetime").datepicker({ format: 'yyyy-mm-dd' });
    $("#btnSearch").click(function() {
        var data = {}
        var ctrls = $('#search').serializeArray();
        for (var c in ctrls) {
            data[ctrls[c].name] = ctrls[c].value;
        }

        var carlist = $(".multiselect").val();
        if (carlist) {
            carlist = carlist.join(",");
        }
        if (!carlist) {
            alert('请选择车辆');
            return;
        }
        data.carlist = carlist.toString();

        // $.get('/oil_vhc_dv/chart', data, function(result) {
        //     if (result.ok == "0") {
        //         $("#grid tbody").find("tr.newrow").remove();
        //         //显示记录
        //         $.each(result.rows, function(i, item) {
        //             $("<tr class='newrow'></tr>").append(
        //                 "<td>" + (i + 1) + "</td>" +
        //                 "<td>" + item.Car_Number + "</td>" +
        //                 "<td>" + item.sum_oildv.toFixed(0) + "</td>"
        //             ).appendTo($("#grid tbody"));
        //         });
        //     }
        // })

        $.get('/gps_oil/get_leak_list', data, function(result) {
            if (result.ok == "0") {
                $("#grid tbody").find("tr.newrow").remove();
                //显示记录
                $.each(result.rows, function(i, item) {
                    $("<tr class='newrow'></tr>").append(
                        "<td>" + (i + 1) + "</td>" +
                        "<td>" + item.CreateDate + "</td>" +
                        "<td>" + item.VehicleNo + "</td>" +
                        "<td>" + item.OilNumber.toFixed(0) + "</td>"
                    ).appendTo($("#grid tbody"));
                });
            }
        });

    });
});