$(function () {
    // 移动端不执行以下代码
    if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) 
        return 


    // 提高检测效率用的小工具
    var log = console.log.bind(console);


    /**
     * 实现移动到<a><标签的时候把描述以气泡形式显示出来
     * 思路： 
     * <a>标签的描述是以他的属性title存起来的
     * 把他取出来放到一个新的容器插入到文档最后面，
     * 在鼠标位置浮动起来就能实现
     */
    !function popupLinks() {
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
    }()


    /**
     * 实现移动到<img><标签的时候把描述以气泡形式显示出来
     * 思路： 同上
     */
    !function popupImages() {
        var $img = $('.post-content img');
        $img.mouseover(function (e) {
            // 初始化数据，显示出图片型的额外提示，会有过渡效果
            this.__mousedown = true;
            this.__a = this.alt;
            this.__t = this.title;
            this.alt = '';
            this.title = '';
            $(this).css('cursor', 'zoom-in');
            let template = `<div class='tip imgtip'><img id='tipimg' src="${this.src}" witdh='100%' height='100%'></div>`;
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
            var gap = 35
            var isHorizon = this.naturalWidth > window.innerWidth / 3;
            let offsetX = isHorizon ? -this.naturalWidth / 2 : gap;
            let offsetY = isHorizon ? gap : -this.naturalHeight / 2;
            this.tip.css({
                'left': e.pageX + offsetX,
                'top': e.pageY + offsetY
            });
        }).mouseout(function (e) {
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
    }()


    /**
     * 初始化图片展示模式使用说明
     */
    function sharkarstain_manual() {
        var manualHTML = `<div class='sharkarstain_manual'></div>`
        $('body').append(manualHTML);
        var $div = $('.sharkarstain_manual')
        $div.mousedown(function() {
        	showManual(false)
        })
        var items = {
            title : {
                tag: 'h2',
                text: '图片展示模式',
            },
            line1 : {
                label: '鼠标点击透明背景区域',
                text : '退出图片展示模式',
            },
            line2 : {
                label: '滚轮向上/向下',
                text : '放大/缩小图片',
            },
            line3 : {
                label: '鼠标拖动图片',
                text : '移动图片',
            },
            line4 : {
            	text: '点此关闭提示'
            }
        }   
        function itemHTML(item) {
            var tag = item.tag ? item.tag : 'p'
            var label = item.label ? item.label : ''
            var labelHTML = label ? `<span>${label}<span> - ` : ''
            var html = `<${tag}>${labelHTML}${item.text}</${tag}>`
            return html
        }
        var keys = []
        for (var k in items) 
            keys.push(k)
        for (let i = 0; i < keys.length; i++) {
            var key = keys[i];
            var item = items[key];
            $div.append(itemHTML(item));
        }
        return $div
    } 

    /**
     * 显示图片展示模式下的使用说明书
     * @param {boolean} enable true时为显示，false时为消失
     */
    function showManual(enable, second) {
        if (document.$skrstn_manual == null)
            document.$skrstn_manual = sharkarstain_manual()
        o = document.$skrstn_manual
        second = second ? second : 5
        enable ? o.fadeIn('slow', function() {
            setTimeout(function () {
                showManual(false)
            }, second * 1000)
        }) : o.fadeOut('slow')
    }

    /**
     * sharkarstain 
     * 图片展示模式 黑灯箱 
     * 功能：
     * 1. 点击透明黑色区域才关闭
     * 2. 滚轮向上放大图片
     * 3. 滚轮向下缩小图片
     * 4. 按住图片拖动图片大小
     * 5. 导航图
     */
    !function sharkarstain() {
        var $img = $('.post-content img');
        var maxScale = 4.0;
        var minScale = 0.2; 
        var scale = 1;
        $img.mousedown(function (e) {
            // 鼠标点中了图片，进入图片展示模式
            e.stopPropagation();
            e.preventDefault();
            if (e.button != 0)
                return;
        
            var template = `<div class='sharkarstain'><img class='inbox_image' src="${ this.src }"></div>`;
            $('body').append(template);
            var $div = $('.sharkarstain');
            var $image = $('.inbox_image');

            // 具有过渡效果的显示和消失，只有鼠标左键了背景才消失
            showManual(true);
            $div.fadeIn('slow').mousedown(function (e) {
                showManual(false);
                $(this).fadeOut('slow', function () {
                    $(this).remove();
                })
            }).mouseup(function () {
                $image.__mousedown = false
            }).bind('mousewheel', function (e) {
                // 带有过渡效果的鼠标滚轮缩小放大
                e.preventDefault();
                wheelEvent(e)
            })
            $div[0].addEventListener("DOMMouseScroll", function(e) {
                wheelEvent(e) // 兼容火狐浏览器
            }, true);
    
            $image.mousedown(function (e) {
                e.stopPropagation();
                e.preventDefault();
                $image.addClass('grapping');
                $image.__mousedown = true;
                var h2 = $(this).height() / 2;
                var w2 = $(this).width() / 2;
                this.offsetY = h2 - e.offsetY;
                this.offsetX = w2 - e.offsetX
            }).mouseup(function() {
            	$image.removeClass('grapping');
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


            /**
             * 吐槽一下火狐浏览器，搞得这个函数得提出来
             * @param {mouseScollEvent} event 
             */
            function wheelEvent(event) {
                var delta = event.originalEvent.deltaY / 100;
                var percent = delta < 0 ? 1.4 : 0.6;
                scale *= percent;
                if (scale > maxScale) 
                    scale = maxScale;
                else if (scale < minScale)
                    scale = minScale;
                var img = $image[0]
                var w = img.naturalWidth * scale;
                var h = img.naturalHeight * scale;
                log($image)
                $image.stop();
                $image.animate({
                    width: w,
                    height: h,
                }, "fast")
            }
    
        });
    }()

    /**
     * 浮动字体
     * 在body任意地方鼠标左键后漂浮自定义文字
     * 实例化方式: FloatingText.getInstance()
     */
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

    /**
     * 替换默认右键菜单
     * 功能:
     * 1. 屏蔽右键菜单
     * 2. 在鼠标位置显示文章目录
     */
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