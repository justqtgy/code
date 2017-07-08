function change_password() {
    var q = new Query('/member/password', 'POST', $("#pswd-form"));
    var params = q.init();
    q.request(params, function(json) {
        if (!json.ok) {
            alert(json.msg);
            return;
        }

        alert('密码修改成功');
        location.href = '/';
    });
}

$(function() {
    $("#btnChange").click(function() { change_password(); });
});