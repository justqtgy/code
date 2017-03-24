$(function() {
    var index = 0
    var loop  = 0
    
    $('.sc_left').click(function(e) {
        sc_left()
        e.preventDefault()
    })

    $('.sc_right').click(function(e) {
        sc_right()
        e.preventDefault()
    })

    function sc_left(num) {
        if (index == 0) {
            return
        }

        if ($('.fullpage .section').is(":animated")) {
            return
        }

        num         = num || 1
        var p_index = index - num
        var w       = $(window).width()
        var now     = $('.fullpage .section').eq(index)
        var pre     = $('.fullpage .section').eq(p_index)
        index       = p_index

        pre.css('left', -w)
        now.animate({left : w + 'px'}, 1000)
        pre.animate({left : '0px'}, 1000, function() {
            if (index == 0) {
                $('.fullpage .sc_left').hide()
            }
            $('.fullpage .sc_right').show()
        })

        hl_nav()
    }

    function sc_right(num) {
        if (index == 4) {
            return
        }
        
        if ($('.fullpage .section').is(":animated")) {
            return
        }

        num         = num || 1
        var p_index = index + num
        var w       = $(window).width()
        var now     = $('.fullpage .section').eq(index)
        var next    = $('.fullpage .section').eq(p_index)
        index       = p_index

        next.css('left', w)
        now.animate({left : -w + 'px'}, 1000)
        next.animate({left : '0px'}, 1000, function() {
            if (index == 4) {
                $('.fullpage .sc_right').hide()
            }
            $('.fullpage .sc_left').show()
        })

        hl_nav()
    }

    function hl_nav() {
        $('.nav a').removeClass('active')
        $('.nav a').eq(index).addClass('active')
    }
    
    init_nav()
    function init_nav() {
        $('.nav a').click(function(event) {
            var next_index = $('.nav a').index(this)
            
            if (index == next_index) {
                return
            }

            loop = Math.abs(next_index - index)

            fn = next_index > index ? sc_right : sc_left
            fn(loop)

            event.preventDefault()
        })
    }

    function resetWidth() {
        if(window.navigator.userAgent.indexOf("Chrome") !== -1){
            if(!$(".container")[0]) return 

            $(".container").css("width", "")
            $(".fullpage").css("width", "")
            var w = $(".container")[0].offsetWidth
            setTimeout(function() {
                if(w%2 == 1){
                    $(".container").css("width", w-1)
                    $(".fullpage").css("width", w-1)
                }
            },10)
        }
    }
    resetWidth()
    $(window).on('resize', resetWidth)

    $("a").attr("hidefocus", "true")
})