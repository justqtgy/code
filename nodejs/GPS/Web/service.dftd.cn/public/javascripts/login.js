var Login = function() {

    var handleLogin = function() {
        $('.login-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                username: {
                    required: true
                },
                password: {
                    required: true
                },
                remember: {
                    required: false
                }
            },

            messages: {
                username: {
                    required: "请填写账号."
                },
                password: {
                    required: "请填写密码."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('.alert-danger', $('.login-form')).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
            },

            success: function(label) {
                label.closest('.form-group').removeClass('has-error');
                label.remove();
            },

            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('.input-icon'));
            },

            submitHandler: function(form) {
                form.submit();
                event.preventDefault();
            }
        });

        // $('.login-form input').keypress(function(e) {
        //     if (e.which == 13) {
        //         if ($('.login-form').validate().form()) {
        //             $('.login-form').submit();
        //         }
        //         return false;
        //     }
        // });

        $("#login-btn").click(function() {
            //var validator = $(".login-form").data('bootstrapValidator');
            //validator.validate();
            //if (validator.isValid()) {
            if ($('.login-form').validate().form()) {
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
            // init background slide images
            $.backstretch([
                "../images/media/bg/1.jpg",
                "../images/media/bg/2.jpg",
                "../images/media/bg/3.jpg",
                "../images/media/bg/4.jpg"
            ], {
                fade: 1000,
                duration: 8000
            });
        }
    };

}();

jQuery(document).ready(function() {
    Login.init();
});