function hintMessage(hintobj, type, message) {
    /*$("#" + hintobj + "").empty();
    var obj_css = "tip-info";
    if (type == "error") {
        obj_css = "tip-error";
    }

    $("<span class='" + obj_css + "'>&nbsp</span><span class='tip-text'>" + message + "</span>").appendTo("#" + hintobj + "");
    */
    var obj_css = "has-success";   
    var ctl = $("#" + hintobj + "");
    ctl.parent(".form-group").removeClass("has-success").removeClass("has-error");
    if (type == "error") {
        obj_css = "has-error";
        ctl.val('');
        ctl.attr("placeholder", message);
    }
    console.log(obj_css);
    ctl.parent(".form-group").addClass(obj_css); 
}

function check_answer(value) {
    if (value == "") {
        hintMessage("txtAnswer", "error", "答案不能为空");
        return false;
    }
    
    hintMessage("txtAnswer", "info", "");
    return true;
}

function check_email(value) {
    if (value == "") {
        hintMessage("txtEmail", "error", "邮箱不能为空");
        return false;
    }
    if (!isEmail(value)) {
        hintMessage("txtEmail", "error", "邮箱格式不正确");
        return false;
    }
    hintMessage("txtEmail", "info", "");
    return true;
}


function check_username(value) {
    if (value == "") {
        hintMessage("txtLoginName", "error", "账号不能为空");
        return false;
    }
    //if (!isUserNameLen(value)) {
    //    hintMessage("txtLoginName", "error", "长度6-16位");
    //    return false;
    //}
    //if (!isNumberOrLetter(value)) {
    //    hintMessage("txtLoginName", "error", "账号格式不正确");
    //    return false;
    //}
    hintMessage("txtLoginName", "info", "");
    return true;
}

function check_confirmuser(obj1, obj2) {
    if (obj1 == "") {
        hintMessage("txtConfirm", "error", "确认账号不能为空");
        return false;
    }
    //if (!isUserNameLen(obj1)) {
    //    hintMessage("txtConfirm", "error", "长度6-16位");
    //    return false;
    //}
    //if (!isNumberOrLetter(obj1)) {
    //    hintMessage("txtConfirm", "error", "确认账号格式不正确");
    //    return false;
    //}

    if (!isSame(obj1, obj2)) {
        hintMessage("txtConfirm", "error", "确认账号不一致");
        return false;
    }

    hintMessage("txtConfirm", "info", "");
    return true;
}

function check_password(value) {
    if (value == "") {
        hintMessage("txtPassword", "error", "密码不能为空");
        return false;
    }
    if (!isPasswordLen(value)){
        hintMessage("txtPassword", "error", "长度6-16位");
        return false;
    }
    if (!isPassword(value)) {
        hintMessage("txtPassword", "error", "密码格式不正确");
        return false;
    }
    hintMessage("txtPassword", "info", "");
    return true;
}

function check_newpassword(value) {
    if (value == "") {
        hintMessage("txtNewPswd", "error", "新密码不能为空");
        return false;
    }
    if (!isPasswordLen(value)) {
        hintMessage("txtNewPswd", "error", "长度6-16位");
        return false;
    }
    if (!isPassword(value)) {
        hintMessage("txtNewPswd", "error", "新密码格式不正确");
        return false;
    }

    hintMessage("txtNewPswd", "info", "");
    return true;
}

function check_confirmpassword(obj1, obj2) {
    if (obj1 == "") {
        hintMessage("txtConfirm", "error", "确认密码不能为空");
        return false;
    }
    if (!isPasswordLen(obj1)) {
        hintMessage("txtConfirm", "error", "长度6-16位");
        return false;
    }
    if (!isPassword(obj1)) {
        hintMessage("txtConfirm", "error", "确认密码格式不正确");
        return false;
    }

    if (!isSame(obj1, obj2)) {
        hintMessage("txtConfirm", "error", "确认密码不一致");
        return false;
    }

    hintMessage("txtConfirm", "info", "");
    return true;
}

function check_qq(value) {
    if (value == "") {
        hintMessage("txtQQ", "error", "QQ不能为空");
        return false;
    }
    
    if (!isNumber(value)) {
        hintMessage("txtQQ", "error", "QQ格式不正确");
        return false;
    }
    hintMessage("txtQQ", "info", "");
    return true;
}


function check_idcard(value) {
    if (value == "") {
        hintMessage("txtIDCard", "error", "身份证不能为空");
        return false;
    }

    if (!isIDCard(value)) {
        hintMessage("txtIDCard", "error", "身份证格式不正确");
        return false;
    }
    hintMessage("txtIDCard", "info", "");
    return true;
}

function check_truename(value) {
    if (value == "") {
        hintMessage("txtTrueName", "error", "真实姓名不能为空");
        return false;
    }

    if (!isChinese(value)) {
        hintMessage("txtTrueName", "error", "真实姓名格式不正确");
        return false;
    }
    hintMessage("txtTrueName", "info", "");
    return true;
}

function check_mobile(value) {
    if (value == "") {
        hintMessage("txtMobile", "error", "手机号不能为空");
        return false;
    }

    if (!isMobile(value)) {
        hintMessage("txtMobile", "error", "手机号码格式不正确");
        return false;
    }
    hintMessage("txtMobile", "info", "");
    return true;
}

function check_number(value, min, max) {
    if (value == "") {
        hintMessage("txtNumber", "error", "数量不能为空");
        return false;
    }

    if (!isInteger(value)) {
        hintMessage("txtNumber", "error", "数量格式不正确");
        return false;
    }

    if (value < min || value > max) {
        hintMessage("txtNumber", "error", "超过数值范围");
        return false;
    }

    hintMessage("txtNumber", "info", "");
    return true;
}

function check_validate(value, cb) {
    if (value == "") {
        hintMessage("txtValidate", "error", "验证码不能为空");
        cb(false);
    }

    $.getJSON("/check_validate/", { code: value, r: Math.random() }, function (json) {
        if (json.ret == -1) {
            hintMessage("txtValidate", "error", "验证码错误");
            cb(false);
        }
        else {
            hintMessage("txtValidate", "info", "");
            cb(true);
        }
    })
    
}

function check_cardno(value) {
    if (value == "") {
        hintMessage("txtCardNo", "error", "充值卡号不能为空");
        return false;
    }

    hintMessage("txtCardNo", "info", "");
    return true;
}

function check_cardpassword(value) {
    if (value == "") {
        hintMessage("txtCardPassword", "error", "充值卡密码不能为空");
        return false;
    }

    hintMessage("txtCardPassword", "info", "");
    return true;
}