var Login = function() {

    var handleLogin = function() {

        $('.login-form').bootstrapValidator({
           message:'该项不能为空',
           /*
           feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },*/
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

        $("#login-btn").click(function(){
            var validator = $(".login-form").data('bootstrapValidator');
            validator.validate();
            if(validator.isValid()){      

                //form validation success, call ajax form submit
                var url = getUrlParam('url');
                var data = {};
                var ctrls = $('.login-form').serializeArray();        
                for(var c in ctrls){
                    data[ctrls[c].name]=ctrls[c].value;
                }
        
                //调用系统接口
                var remote = "http://120.24.68.95:89/gpsonline/GPSAPI";
                
                var data_format = {
                    version:1,
                    method:'loginSystem',
                    name:data.username,
                    pwd:data.password
                }

                $.post(remote, data_format, function(ret){console.log(ret);
                    var result = JSON.parse(ret);                    
                    if(result.uid){
                        result.username = data.username;
                        $.post('/users/loginSystem', result, function(result){
                            console.log(url);
                     
                            if(url){
                                location.href= url;
                            }
                            else{
                                location.href='/';
                            }
                        })                        
                        return;
                    }
                    
                    
                    $.post('/users/login', data, function(result){
                        if(result.ok!=0){
                            $('.alert-danger').find('span').text(result.msg);
                            $('.alert-danger', $('.login-form')).show();
                            return;
                        }
                        /*
                        if(url){
                            location.href= url;
                        }
                        else{
                            location.href='/';
                        }*/
                        location.href='/m_d_index';
                    });
                                          
                });
           }    
        })
    }

    var handleRegister = function() {
        $('.register-form').bootstrapValidator({
           message:'该项不能为空',
           /*
           feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },*/
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
                        },
                        stringLength:{
                            min:4,
                            max:10,
                            message:'输入4-10位密码'
                        }                  
                    }
                },
                rpassword: {
                    validators: {
                        notEmpty: {
                            message: '请输入确认密码'
                        },
                        identical : {
                            field : 'password',
                            message : '两次密码不一致'
                        }                  
                    }
                },
             }
        });

        $('.register-form input').keypress(function(e) {
            if (e.which == 13) {
                if ($('.register-form').validate().form()) {
                    $('.register-form').submit();
                }
                return false;
            }
        });

        $("#register-submit-btn").click(function(){
            var validator = $(".register-form").data('bootstrapValidator');
            validator.validate();
            if(validator.isValid()){  
                //form validation success, call ajax form submit
    
                var data = {};
                var ctrls = $('.register-form').serializeArray();        
                for(var c in ctrls){
                    data[ctrls[c].name]=ctrls[c].value;
                }
          
                $.post('/users/reg', data, function(result){
                    if(result.ok!=0){
                        alert(result.msg)
                        return;
                    }
                    alert('注册成功，进入登录页');
                    location.href= result.url;

                });     
            }       
        });
    }

    jQuery('#register-btn').click(function() {
        jQuery('.login-form').hide();
        jQuery('.register-form').show();
    });

    jQuery('#register-back-btn').click(function() {
        jQuery('.login-form').show();
        jQuery('.register-form').hide();
    });

     

    //获取url中的参数
    var  getUrlParam =  function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]); return null; //返回参数值
        }

    
    
    
    return {
        //main function to initiate the module
        init: function() {
            handleLogin();  
            handleRegister();
        }

    };

}();