function getjwplayer(swf, w, h, id, position){//视频调用 position 表示的是 进度条的位置和是否隐藏 none
    if(!position){
        position = "over"
    }
    var object = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" hidefocus="true" id="mediaplayer" width="' + w + '" height="' + h + '" bgcolor="#000000" name="mediaplayer" tabindex="0"><param name="movie" value="http://v.lz.syyx.com/lz/jwplayer/player.swf"><!--[if !IE]>--><object type="application/x-shockwave-flash" hidefocus="true" data="http://v.lz.syyx.com/lz/jwplayer/player.swf" width="' + w + '" height="' + h + '"><!--<![endif]--><param name="allowfullscreen" value="true"><param name="seamlesstabbing" value="true"><param name="wmode" value="transparent" /><param name="flashvars" value="netstreambasepath='+document.location.href+'&id=mediaplayer&file='+swf+'&controlbar.position='+position+'&volume=41&autostart=true&repeat=SINGLE"><!--[if !IE]>--></object><!--<![endif]--></object>'
    $(id).html(object)
}

$(".flash_btn").click(function(event) {
    $("#pop_flash_dialog").html("<a id='test_b'></a><div id=\"pop_flash\"></div>")
    getjwplayer('http://v.nycs.syyx.com/mlyx/mlyx.flv', 640, 360, "#pop_flash") 
    $("#pop_flash_dialog").dialog({
        width       : 656,
        height      : 415,
        modal       : true,
        resizable   : false,
        dialogClass : "pop_video_detail",
        close       : function() {
            $("#pop_flash_dialog").html("");
        }
    });

    event.preventDefault()
})

function set_news_list() {
    $('#news_category').tabs({ event: "mouseover" }).show()

    $('.news_category_selector a').click(function(event){
        var type = $(this).data('type')
        if (type == 'news_media') {
            type = 'news_news'
        }

        window.open('/news?type=' + type)
        event.preventDefault();
    })
    $('#news_category a.more_news').click(function(event){
        var type = $('.news_category_selector li.ui-tabs-selected a').data('type')

        if (type == 'news_media') {
            type = 'news_news'
        }

        window.open('/news?type=' + type)
        event.preventDefault();
    })
}

function set_picture_news() {
    $('#tabs_picture_news').tabs({ event: "mouseover" })
    $('#tabs_picture_news').tabs('rotate', 4000, true)
}

function init_hotmedia() {
    var n = $('#hotmedia_list .one li').length
    if (n % 4 == 0) {
        return
    }

    var fill_n = (Math.floor(n / 4) + 1) * 4 - n

    var fill_html = ''
    for(var i = 0; i < fill_n; i++) {
        fill_html += '<li></li>'
    }

    $('#hotmedia_list .one').append(fill_html)
    $('#hotmedia_list .two').append(fill_html)
}

function init_hotmedia_scroll() {
    var mt = $('#hotmedia_list ul').height()
    var n = $('#hotmedia_list .one li').length
    var sc = mt / 2 / n * 8
    var top = 0

    $('.hotmedia_down').click(function(e) {
        if ($('#hotmedia_list ul').is(":animated")) {
            return
        }

        top = top + sc
        if (top == mt) {
            $('#hotmedia_list .two').css('top', sc)
            $('#hotmedia_list .one').animate({'top' : -top }, 1000)
            $('#hotmedia_list .two').animate({'top' : 0 }, 1000, function() {
                $('#hotmedia_list .one').css('top', 0)
                $('#hotmedia_list .two').css('top', 9999)
                top = 0
            })
        } else {
            $('#hotmedia_list .one').animate({'top' : -top }, 1000)
        }

        e.preventDefault()
    })

    $('.hotmedia_up').click(function(e) {
        if ($('#hotmedia_list ul').is(":animated")) {
            return
        }

        top = top - sc
        if (top == -sc) {
            $('#hotmedia_list .two').css('top', -mt)
            $('#hotmedia_list .one').animate({'top' : -top }, 1000)
            $('#hotmedia_list .two').animate({'top' : -(mt + top) }, 1000, function() {
                $('#hotmedia_list .one').css('top', -(mt + top))
                $('#hotmedia_list .two').css('top', 9999)
                top = mt - sc
            })
        } else {
            $('#hotmedia_list .one').animate({'top' : -top }, 1000)
        }

        e.preventDefault()
    })
}

function change_valid_pic() {
    var r = Math.random()
    $('#msg_dialog .valid .pic').attr('src', '/captcha?r=' + r)
}

function run_light_box() {
    $('.picture_list a').lightBox();
}

function init_msg() {
    $('#msg_dialog .valid .pic').click(function(event) {
        change_valid_pic()
        event.preventDefault()
    })

    $(".msg").click(function(event) {
        return alert('即将开放，敬请期待！')
        $('#mask').show()
        $('#msg_dialog').show()
        $('#msg_dialog .no').focus()
        event.preventDefault()
    })

    $("#msg_dialog .close, #msg_suc .close").click(function(event) {
        $('#mask').hide()
        $('#msg_dialog').hide()
        $('#msg_suc').hide()
        $('#msg_dialog .no').val('')
        $('#msg_dialog .code').val('')
        event.preventDefault()
    })

    $('#msg_dialog .submit').click(function(event) {
        var mobile_no     = $('#msg_dialog .no').val()
        var valid_code    = $('#msg_dialog .code').val()

        if (mobile_no.length != 11) {
            alert('请输入正确的手机号码!')
            return
        }

        $.ajax({
            type     : 'POST',
            cache    : false,
            url      : '/msg/download',
            data     : {mobile_no : mobile_no, valid_code : valid_code},
            dataType : 'json',
            async: false,
            success  : function(data){
                if (data.ok != 1) {
                    alert(data.msg)
                    change_valid_pic()
                    return
                }

                $('#msg_dialog').hide()
                $('#msg_suc').show()
            }
        })

        event.preventDefault()
    })
}

function resetWidth() {
    if(window.navigator.userAgent.indexOf("Chrome") !== -1){
        if(!$(".container")[0]) return 

        $(".container").css("width", "")
        var w = $(".container")[0].offsetWidth
        setTimeout(function() {
            if(w%2 == 1){
                $(".container").css("width", w-1)
            }
        })
    }
}

function set_media(){
    $('#media').tabs({ event: "mouseover" })
    $('#media').tabs('rotate', 4000, true)
}

$(function(){
    init_msg()
    init_hotmedia()
    set_picture_news()
    set_news_list()
    init_hotmedia_scroll()
    run_light_box()
    set_media()
    resetWidth()
    $(window).on('resize', resetWidth)
})