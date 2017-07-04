var Login = function() {
    var handleLogin = function() {
        $("#login-btn").click(function() {
            event.preventDefault();
            var data = {};
            var ctrls = $('.login-form').serializeArray();
            for (var c in ctrls) {
                data[ctrls[c].name] = ctrls[c].value;
            }

            $.post('/users/login', data, function(result) {

                if (result.ok != 1) {
                    $('#error').text(result.msg);
                    $("#error").show();
                    return;
                }

                location.href = '/';
            });
        });
    };

    return {
        //main function to initiate the module
        init: function() {
            handleLogin();
        }
    };

}();

jQuery(document).ready(function() {
    Login.init();
});