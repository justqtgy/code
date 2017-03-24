
module.exports.check_login = function(req, res, next) {
    console.log('check login cookies ...');
    if (req.cookies.member) {
        var member = req.cookies.member;
        req.account = member.account;
        req.isboss = member.isboss;
        next();
    } else {        
        res.redirect('/login');
    }
}