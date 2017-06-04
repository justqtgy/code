var Login = function() {
    var handleLogin = function() {
        $('.login-form').bootstrapValidator({
            message: '该项不能为空',
            // feedbackIcons: {
            //      valid: 'glyphicon glyphicon-ok',
            //      invalid: 'glyphicon glyphicon-remove',
            //      validating: 'glyphicon glyphicon-refresh'
            //  },
            fields: {
                username: {
                    validators: {
                        notEmpty: {
                            message: '请输入账号'
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: '请输入密码'
                        }
                    }
                },
            }
        });

        $('.login-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.login-form').validate().form()) {
                    $('.login-form').submit(); //form validation success, call ajax form submit
                }
                return false;
            }
        });

        $("#login-btn").click(function() {
            var validator = $(".login-form").data('bootstrapValidator');
            validator.validate();
            if (validator.isValid()) {

                //form validation success, call ajax form submit
                var url = getUrlParam('url');
                var data = {};
                var ctrls = $('.login-form').serializeArray();
                for (var c in ctrls) {
                    data[ctrls[c].name] = ctrls[c].value;
                }

                $.post('/users/login', data, function(result) {
                    if (result.ok != 1) {
                        $('.alert-danger').find('span').text(result.msg);
                        $('.alert-danger', $('.login-form')).show();
                        return;
                    }

                    if (url) {
                        location.href = url;
                    } else {
                        location.href = '/';
                    }
                });

            }
        })
    }

    //获取url中的参数
    var getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    return {
        //main function to initiate the module
        init: function() {
            handleLogin();
            //handleRegister();
        }
    };
}();