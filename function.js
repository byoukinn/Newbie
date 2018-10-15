$(function(){

	var log = console.log.bind(console);
	var selector = $('.postcontent a')
	if (selector.title != undefined) 
	selector.mouseover(function (e) {
	    this.__mouseover = true;
	    this.__title = this.title;
		this.title = '';
		let $template = `<div class="tip">${this.__title}</div>`;
		$('body').append($template);
		this.tip = $('.tip')
        this.tip.css('display', 'none');
        this.tip.slideDown(500)
    }).mousemove(function (e) {
        if (!this.__mouseover)
            return;
        let offsetX = 35;
        this.tip.css('top', e.pageY);
        this.tip.css('left', e.pageX + offsetX);
    }).mouseout(function () {
        this.__mouseover = false;
        this.tip.slideUp(function () {
            this.remove();
        })
		this.title = this.__title
    })

})