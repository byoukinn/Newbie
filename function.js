$(function(){
	var log = console.log.bind(console);
    // select a
	var $a = $('.post-content a')
	$a.mouseover(function (e) {
	    this.__mouseover = true;
	    this.__t = this.title;
		this.title = '';
		let template = `<div class="tip">${this.__t}</div>`;
		$('body').append(template);
		this.tip = $('.tip')
        this.tip.css({
            'display':'none',
        });
        this.tip.slideDown('fast')
    }).mousemove(function (e) {
        if (!this.__mouseover)
            return;
        let offsetX = 35;
        this.tip.css('top', e.pageY);
        this.tip.css('left', e.pageX + offsetX);
    }).mouseout(function () {
        this.__mouseover = false;
		this.title = this.__t
        this.tip.slideUp('fast', function () {
            this.remove();
        })
    })

    var $img = $('.post-content img')
    $img.mouseover(function (e) {
        this.mouse_in = true;
        this.__a = this.alt
        this.__t = this.title
        this.alt = ''
        this.title = ''
        $(this).css('cursor', 'zoom-in')
        let template = `<div class='tip imgtip'><img id='tipimg' src="${this.src}" witdh='100%' height='100%'></div>`;
        $('body').append(template);
        this.tip = $('.tip')
        this.tip.css('display', 'none');
        $(this).animate({opacity: '0.1'}, 'fast')
        this.tip.fadeIn('fast')

    }).mousemove(function (e) {
        if (!this.mouse_in)
            return;
        var gap = 35
        var isHorizon = this.naturalWidth > window.innerWidth / 3 ;
        let offsetX = isHorizon ?  -this.naturalWidth / 2 : gap ;
        let offsetY = isHorizon ?  gap : -this.naturalHeight / 2;
        this.tip.css({
            'left': e.pageX + offsetX,
            'top': e.pageY + offsetY
        });
        // log(tip_object.css('top'), tip_object.css('left'));
    }).mouseout(function () {
        this.mouse_in = false;
        this.alt = this.__a
        this.title = this.__t
        $(this).animate({opacity: '1'}, 'fast')
        this.tip.fadeOut('fast', function () {
            this.remove();
        })
    })
    


    // blackbox
    // mousedown 有一个参数 event 会传递到他的回调函数 f 去
    // f 拿到了 event ，因为js是一个动态语言，可以随便叫这个event任意名字，所以你可以写成 e
    // e => 一个鼠标事件源元素

    // TODO: 
    // 1. 点击透明黑色区域才关闭
    // 2. 滚轮向上放大图片
    // 3. 滚轮向下缩小图片
    // 4. 按住图片拖动图片大小
    // 5. 导航图
    $img.mousedown(function (e) {
        e.preventDefault()
        if (e.button != 0)
            return 
        var template = `<div class='sharkarstain'><img class='inbox_image' src="${ this.src }"></div>`;

        $('body').append(template);
        var $div = $('.sharkarstain')
        var $image = $('.inbox_image')
        $div.fadeIn('slow').mousedown(function(e) {
            if ($div.__mouseover_img || e.button == 2)
                return
            $(this).fadeOut('slow', function () {
                $(this).remove();
            })
        }).mouseup(function() {
            $image.mouse_in = false
        }).bind('mousewheel', function(e) {
            e.preventDefault()
            var delta = e.originalEvent.deltaY / 100 
            var percent = delta < 0 ? 1.1 : 0.9
            var w = $image.width()
            var h = $image.height()
            $image.width(w * percent)
            $image.height(h * percent)
        })

        $image.mousedown(function(e) {
            e.preventDefault()
            $image.mouse_in = true
            var h2 = $(this).height() / 2
            var w2 = $(this).width() / 2
            this.offsetY =  h2 - e.offsetY
            this.offsetX =  w2 - e.offsetX
        }).mouseover(function() {
            $div.__mouseover_img = true
        }).mouseout(function() {
            $div.__mouseover_img = false
        }).mousemove(function(e) {
            if (!$image.mouse_in)
                return
            $(this).css({
                'top' : e.clientY + this.offsetY, // 要图片的点跟着鼠标拖着的点走
                'left': e.clientX + this.offsetX,
            })
        })
    })
    


    // 屏蔽默认右键菜单
    // fixed:
    // 1. 导航栏菜单
    // 2. 整个目录的显示
    !function replaceContextMenu() {
        var indexmenu = document.getElementsByClassName('index-menu')[0]
        if (!indexmenu) 
            return
        var html = indexmenu.outerHTML;
        var template = `<div class="context-menu"><b>目录</b>${ html }</div>`;
        $('body').append(template);
        var $ctxmenu = $('.context-menu');
        document.oncontextmenu = function(e) {
            e.preventDefault();
            $ctxmenu.css({
                'top': e.pageY,
                'left': e.pageX,
            });
            $ctxmenu.fadeIn('fast');
        }
        window.onclick = function(e) {
            $ctxmenu.fadeOut('fast');
        }
    }()
    

})