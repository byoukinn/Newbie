$(function () {
    // 提高检测效率用的小工具
    var log = console.log.bind(console);

    /**
     * 额外的超链接提示
     * @type {jQuery|HTMLElement}
     */
    var $a = $('.post-content a');
    $a.mouseover(function (e) {
        // 初始化数据，然后显示额外的提示
        this.__mouseover = true;
        this.__t = this.title;
        this.title = '';
        let template = `<div class="tip">${this.__t}</div>`;
        $('body').append(template);
        this.tip = $('.tip');
        this.tip.css({
            'display': 'none',
        });
        this.tip.slideDown('fast')
    }).mousemove(function (e) {
        // 鼠标移动的时候跟着走
        if (!this.__mouseover)
            return;
        let offsetX = 35;
        this.tip.css('top', e.pageY);
        this.tip.css('left', e.pageX + offsetX);
    }).mouseout(function () {
        // 鼠标退出了，把额外的提示给去掉
        this.__mouseover = false;
        this.title = this.__t;
        this.tip.slideUp('fast', function () {
            this.remove();
        })
    })

    /**
     * 额外的图片提示
     * @type {jQuery|HTMLElement}
     */
    var $img = $('.post-content img');
    $img.mouseover(function (e) {
        // 初始化数据，显示出图片型的额外提示，会有过渡效果
        this.__mousedown = true;
        this.__a = this.alt;
        this.__t = this.title;
        this.alt = '';
        this.title = '';
        $(this).css('cursor', 'zoom-in');
        let template = `<div class='tip imgtip'><img id='tipimg' src="${this.src}" width='100%' height='100%'></div>`;
        $('body').append(template);
        this.tip = $('.tip');
        this.tip.css('display', 'none');
        $(this).stop();
        $(this).animate({opacity: '0.1'}, 'fast');
        this.tip.fadeIn('fast')

    }).mousemove(function (e) {
        // 鼠标移动时，图片型额外提示跟着鼠标走
        if (!this.__mousedown)
            return;
        var gap = 35;
        var isHorizon = this.naturalWidth > window.innerWidth / 3;
        let offsetX = isHorizon ? -this.naturalWidth / 2 : gap;
        let offsetY = isHorizon ? gap : -this.naturalHeight / 2;
        this.tip.css({
            'left': e.pageX + offsetX,
            'top': e.pageY + offsetY
        });
    }).mouseout(function () {
        // 鼠标离开了，结束事件，去掉额外提示
        this.__mousedown = false;
        this.alt = this.__a;
        this.title = this.__t;
        $(this).stop();
        $(this).animate({opacity: '1'}, 'fast');
        this.tip.fadeOut('fast', function () {
            this.remove();
        })
    })

    /**
     * sharkarstain manual
     * 生成展示模式的说明书的html代码
     * @returns {string}
     */
    function manual() {
        /**
         *         TODO: 对这个展示模式做简介
         *         还没完成
         *         他不变，所以他每次都是从被隐藏的现存代码中显示出来而已
         */
        var ret = '';
        var manual = `<div class='sharkarstain-manual'><h1>展示模式-使用说明</h1></div>`;
        var manual_items = {
            'scroll' : {
                tl: '鼠标滚轮向上/向下',
                cm: '图片放大/缩小',
            },
            'img_mousedown' : {
                tl: '鼠标拖动图片',
                cm: '拖拽图片',
            },
            'div_mousedown' : {
                tl: '鼠标点击透明背景',
                cm: '退出展示模式',
            },
        };
        var keys = manual_items.keys();
        for (var k of keys) {
            var o = manual_items[k];
            ret.append(`<b>${o.title}</b> ${o.comment}</br>`);
        }
        return ret;
    }

    /**
     *      sharkarstain 图片展示模式
     *      功能：
     *      1. 点击透明黑色区域才关闭
     *      2. 滚轮向上放大图片
     *      3. 滚轮向下缩小图片
     *      4. 按住图片拖动图片大小
     *      5. 导航图
     */
    $img.mousedown(function (e) {
        // 鼠标点中了图片，进入图片展示模式
        e.stopPropagation();
        e.preventDefault();
        if (e.button != 0)
            return;
        var template = `<div class='sharkarstain'><img class='inbox_image' src="${ this.src }"></div>`;
        $('body').append(template).append(manual());
        var $div = $('.sharkarstain');
        var $image = $('.inbox_image');
        // 具有过渡效果的显示和消失，只有在鼠标右键整个画布，鼠标左键了背景才起作用
        $div.fadeIn('slow').mousedown(function (e) {
            $(this).fadeOut('slow', function () {
                $(this).remove();
            })
        }).mouseup(function () {
            $image.__mousedown = false
        }).bind('mousewheel', function (e) {
            // 带有过渡效果的鼠标滚轮缩小放大
            e.preventDefault();
            var delta = e.originalEvent.deltaY / 100;
            var percent = delta < 0 ? 1.4 : 0.6;
            var w = $image.width();
            var h = $image.height();
            $image.stop();
            $image.animate({
                width: w * percent,
                height: h * percent,
            }, "fast")
        });

        $image.mousedown(function (e) {
            e.stopPropagation();
            e.preventDefault();
            $image.__mousedown = true;
            var h2 = $(this).height() / 2;
            var w2 = $(this).width() / 2;
            this.offsetY = h2 - e.offsetY;
            this.offsetX = w2 - e.offsetX
        }).mouseover(function () {
            $image.__mouseover = true
        }).mouseout(function () {
            $image.__mouseover = false
        }).mousemove(function (e) {
            if (!$image.__mousedown)
                return;
            $(this).css({
                'top': e.clientY + this.offsetY, // 要图片的点跟着鼠标拖着的点走
                'left': e.clientX + this.offsetX,
            })
        })
    });

    // 鼠标左键后漂浮字体
    class FloatingText {
        constructor() {
            this.el = ['富强民主', '文明和谐', '自由平等', '公正法制', '爱国敬业', '诚信友善',];
            this.current = 0;
            this.count = 0;
            this.offset = 120;
            this.$container = null;
            FloatingText.__instance = null;
            this.initial()
        }

        static getInstance() {
            if (FloatingText.__instance == null)
                FloatingText.__instance = new FloatingText();
            return FloatingText.__instance;
        }

        initial() {
            if (FloatingText.__instance != null)
                return;
            this.$container = $('body');
        }

        getNextItem() {
            var ret = this.el[this.current];
            this.current = (this.current + 1) % this.el.length;
            return ret;
        }

        showText(event) {
            this.count += 1;
            var id = `floating_text${this.count}`;
            var template = `<p id="${id}" class="floating_text">${this.getNextItem()}</p>`;
            this.$container.append(template);
            var self = this;
            $('#'+id).css({
                'top': event.pageY - self.offset / 2,
                'left': event.pageX, // 样式表中定义他已经居中
            }).animate({
                'top': event.pageY - self.offset,
                'opacity': 0,
            }, 1000, function () {
                this.remove()
            })
        }
    }

    // 屏蔽默认右键菜单
    // fixed:
    // 1. 导航栏菜单
    // 2. 整个目录的显示
    !function replaceContextMenu() {
        var indexmenu = document.getElementsByClassName('index-menu')[0];
        if (!indexmenu)
            return
        var html = indexmenu.outerHTML;
        var template = `<div class="context-menu"><b>目录</b>${ html }</div>`;
        $('body').append(template);
        var $ctxmenu = $('.context-menu');
        document.oncontextmenu = function (e) {
            e.preventDefault();
        };
        // 加入了浮动文字
        var floatingText = FloatingText.getInstance();
        $(window).mousedown(function (e) {
            if (e.button == 2) {
                $ctxmenu.css({
                    'top': e.pageY,
                    'left': e.pageX,
                });
                $ctxmenu.fadeIn('fast');
                $ctxmenu.__exist = true;
            } else if (e.button == 0) {
                $ctxmenu.fadeOut('fast');
                if ($ctxmenu.__exist) {
                    $ctxmenu.__exist = false;
                    return;
                }
                floatingText.showText(e);

            }
        });

    }();


});