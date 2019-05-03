import {Module} from "../module";
import $ from "jquery";

/**
 * TODO: Animation on scroll
 *
 * @param options
 * @constructor
 */
 
function AnimationOnScroll(options) {
    let self = this;
	  this.options = options;

    this.predefined_options = {
        class: 'js-animation-item',
	      svg_icons_class: 'js-animated-svg'
    };

    this.track = ['resize', 'content-change'];
    this.cacheRefresh = function () {
        self.cache('animation-item').each(function () {
            let $self = $(this);
            $self.data('bottom', $self.offset().top + 100);
        });

    };

    this.super();

    init();
    // ------------
    // Инициализация
    // ------------
    function init() {
        setVars();
        svgIconsSetup(self.cache('$svg_icons'));
        animatedTitleInit();

        self.cache('animation-item').each(function () {
            let $self = $(this);
            $self.data('bottom', $self.offset().top + 100);

            if ($self.data('duration')) {
                let duration_fractional = $self.data('duration') / 1000;

                if ($self.hasClass('u-animation-text')) {
                    $self.css({
                        'transition-duration' : duration_fractional + 's'
                    });

                } else if ($self.hasClass('js-animated-title')) {
                    $self.find('.c-overlay-animated-title__text').css({
                        'transition-duration' : duration_fractional + 's'
                    });
                } else {
                    $self.css({
                        'transition-duration' : duration_fractional + 's'
                    });
                }
            }

            if ($self.data('delay')) {
                let delay_fractional = $self.data('delay') / 1000;


                if ($self.hasClass('u-animation-text')) {
                    $self.css({
                        'transition-delay': delay_fractional + 's'
                    });

                } else if ($self.hasClass('js-animated-title')) {
                    $self.find('.c-overlay-animated-title__text').css({
                        'transition-delay': delay_fractional + 's'
                    });
                } else {
                    $self.css({
                        'transition-delay': delay_fractional + 's'
                    });
                }
            }
        });

        setEvents();

        animationOnScroll();
    }

    function setVars() {
        self.cache('animation-item', $('.' + self.options.class));
	      self.cache('$svg_icons', $(`.${self.options.svg_icons_class}`));
    }

    function animatedTitleInit() {
        self.cache('animation-item').each(function () {

            if ($(this).hasClass('js-animated-title')) {
	            let $animated_title = $(this),
                  $saved_hint;

                if ($animated_title.hasClass('u-hint')) {
                    $saved_hint = $animated_title.find('.c-hint');
                    $animated_title.find('.c-hint').remove();
                  }

                let $animated_title_text = $animated_title.text(),
                height_animated_title = $animated_title.height() * 2;


		            let overlay_animated_title = $('<span/>');
                overlay_animated_title.addClass('c-overlay-animated-title');

                let inner_span_animated_title = $('<span/>');

                inner_span_animated_title
                    .addClass('c-overlay-animated-title__text')
                    .text($animated_title_text)
                    .css({
                        'transform': 'translateY(' + height_animated_title + 'px) rotate(3deg)',
                        'display': 'block'
                    });

                let arrow_title = $animated_title.find('.js-arrow-title');

                overlay_animated_title.append(inner_span_animated_title);

                $animated_title.html('');

                $($animated_title).append(overlay_animated_title, arrow_title);

                $animated_title.append($saved_hint);
            }
        });
    }

    function setEvents() {
        $(window).on('scroll', animationOnScroll);
    }

    function animationOnScroll(e, top) {
        let to_delete = [];

        self.cache('animation-item').each(function (count) {
            let $animated_item = $(this);
            let window_bottom = window.scrollY + window.innerHeight; 
            let elem_bottom =  $animated_item.data('bottom');
            if (window_bottom > elem_bottom) {

                if ($animated_item.hasClass('u-animation-text')) {
                    $animated_item.addClass('a-t-is-active');

                } else if ($animated_item.hasClass('js-animated-title')) {
                    $animated_item.addClass('u-animate');
                    $animated_item.find('.c-overlay-animated-title__text').css({
                        'transform': 'translateY(0) rotate(0deg)'
                    });
                } else {
                    $animated_item.addClass('u-animate');
                }

                to_delete.push(count);
            }

        });
        svgIconsShow();
        }

    // ------------
    // Методы
    // ------------

	function svgIconsSetup($svg_icons) {
		$svg_icons.each(function (i, icon) {
			let $icon = $(icon);
			$icon.addClass('is-svg-start-position');
			$icon.data('is-animated', false);
		});
	}

	function svgIconsShow() {
		self.cache('$svg_icons').each(function (i, icon) {
			let $icon = $(icon);
			let $icon_title = $icon.parents('.c-why-we__list__item').find('.u-title');

			if ($icon_title.hasClass('u-animate') && !$icon.data('is-animated')) {
			  $icon.addClass('u-animate');
				$icon.find('.path').css({
					'animation': `dash ${$icon.data('path-duration')}ms linear forwards`
				});
				$icon.find('.svg-fade-animation').css({
					'animation': `fade .1s linear forwards ${$icon.data('tip-delay')}ms`
				});
				$icon.find('.svg-first-fade-animation').css({
					'animation': `fade .1s linear forwards`
				});

				setTimeout(function () {
					$icon.parents('.c-why-we__list__item').find('.c-why-we__list__item__info .u-text').addClass('u-animate');
				},600);

				$icon.data('is-animated', true);
			}
		});
	}

}

AnimationOnScroll.prototype = new Module();


export {AnimationOnScroll};
