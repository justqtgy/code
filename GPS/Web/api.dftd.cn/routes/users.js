var express = require('express');
var router = express.Router();

router.requireAuthentication = function(req, res, next) {
    console.log('check login cookies ...', req.cookies.member);
    next();
    /*
        if(req.path.indexOf("/users/login")>=0 ){
          next();
          return;
        }
        if (req.cookies.member) {
            var member = req.cookies.member;
            req.account = member.account;
            req.isboss = member.isboss;
            next();
        } else {        
            req.session.vehicle_group='';

            var from_url = req.originalUrl;
            if(from_url!="")
                res.redirect('/users/login?url='+from_url);
            else
                res.redirect('/users/login');
        }
    */
}


router.get('/login', function(req, res, next) {
    var account = '';
    if (req.cookies.userinfo) {
        account = req.cookies.userinfo;
    }
    res.render('login', { account: account });
});

router.post('/login', function(req, res, next) {
    res.cookie('member', { userid: 100001, account: 'admin' }, { maxAge: 3600000, httpOnly: true, path: '/' });

    res.send({ ok: 1 })
});

router.get('/logout', function(req, res) {
    req.clearCookie("member");
    res.redirect('/login');
});

module.exports = router;