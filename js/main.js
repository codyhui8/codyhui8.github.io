jQuery(document).ready(function($){
	var mainHeader = $('.cd-auto-hide-header'),
		secondaryNavigation = $('.cd-secondary-nav'),
		//this applies only if secondary nav is below intro section
		belowNavHeroContent = $('.sub-nav-hero'),
		headerHeight = mainHeader.height();
		currentSection = $(".cd-secondary-nav .active");
	
	//set scrolling variables
	var scrolling = false,
		previousTop = 0,
		currentTop = 0,
		scrollDelta = 10,
		scrollOffset = 150,
		isHidden = false;

	$(document).ready(function() {
		$(this).scrollTop(0);
		$(".headers").on("click", function( e ) {
			e.preventDefault();
			var distance = 0
			if ($(this).offset().top - $( $(this).attr('href') ).offset().top < 0) {
				distance = ($(this).offset().top - $( $(this).attr('href') ).offset().top) + 70;
			} else {
				distance = ($(this).offset().top - $( $(this).attr('href') ).offset().top) - 70;
			}
			offsetDistance = 0; 
			if((distance < 300 && isHidden && distance > 0) 
				|| (distance < -300)|| (distance > -300 && isHidden && distance < 0)) {
				offsetDistance = 100;
			} else {
				offsetDistance = 150;
			}
			console.log(isHidden);
			console.log(distance);
			console.log(offsetDistance);
			$("body, html").stop(true, true).animate({ 
				scrollTop: $( $(this).attr('href') ).offset().top - offsetDistance
			}, 1000);
			currentSection = $(this);
		});
	});

	$(window).on('scroll', function(){
		var position = $(this).scrollTop() + 170;

		$('.section').each(function() {
	        var target = $(this).offset().top;
	        var id = $(this).attr('id');

	        if (position >= target) {
	        	currentSection = $('.cd-secondary-nav > ul > li > a[href="#' + id + '"]');
	            $('.cd-secondary-nav > ul > li > a').removeClass('active');
            	$('.cd-secondary-nav > ul > li > a[href="#' + id + '"]').addClass('active');
	        }
    	});

		if( !scrolling ) {
			scrolling = true;
			(!window.requestAnimationFrame)
				? setTimeout(autoHideHeader, 500)
				: requestAnimationFrame(autoHideHeader);
		}
	});

	mainHeader.on('click', '.nav-trigger', function(event){
		// open primary navigation on mobile
		event.preventDefault();
		mainHeader.toggleClass('nav-open');
	});

	$(window).on('resize', function(){
		headerHeight = mainHeader.height();
	});

	function autoHideHeader() {
		var currentTop = $(window).scrollTop();

		( belowNavHeroContent.length > 0 ) 
			? checkStickyNavigation(currentTop) // secondary navigation below intro
			: checkSimpleNavigation(currentTop);

	   	previousTop = currentTop;
		scrolling = false;
	}

	function checkSimpleNavigation(currentTop) {
		//there's no secondary nav or secondary nav is below primary nav
	    if (previousTop - currentTop > scrollDelta) {
	    	//if scrolling up...
	    	mainHeader.removeClass('is-hidden');
	    	isHidden = false;
	    } else if( currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
	    	//if scrolling down...
	    	mainHeader.addClass('is-hidden');
	    	isHidden = true;
	    }
	}

	function checkStickyNavigation(currentTop) {
		//secondary nav below intro section - sticky secondary nav
		var secondaryNavOffsetTop = belowNavHeroContent.offset().top - secondaryNavigation.height() - mainHeader.height();
		
		if (previousTop >= currentTop ) {
	    	//if scrolling up... 
	    	if( currentTop < secondaryNavOffsetTop) {
	    		//secondary nav is not fixed
	    		mainHeader.removeClass('is-hidden');
	    		secondaryNavigation.removeClass('fixed slide-up');
	    		belowNavHeroContent.removeClass('secondary-nav-fixed');
	    		isHidden = false;
	    	} else if( previousTop - currentTop > scrollDelta) {
	    		//secondary nav is fixed
	    		mainHeader.removeClass('is-hidden');
	    		secondaryNavigation.removeClass('slide-up').addClass('fixed'); 
	    		belowNavHeroContent.addClass('secondary-nav-fixed');
	    		isHidden = false;
	    	}
	    	
	    } else {
	    	//if scrolling down...	
	 	  	if( currentTop > secondaryNavOffsetTop + scrollOffset) {
	 	  		//hide primary nav
	    		mainHeader.addClass('is-hidden');
	    		secondaryNavigation.addClass('fixed slide-up');
	    		belowNavHeroContent.addClass('secondary-nav-fixed');
	    		isHidden = true;
	    	} else if( currentTop > secondaryNavOffsetTop) {
	    		//once the secondary nav is fixed, do not hide primary nav if you haven't scrolled more than scrollOffset 
	    		mainHeader.removeClass('is-hidden');
	    		secondaryNavigation.addClass('fixed').removeClass('slide-up');
	    		belowNavHeroContent.addClass('secondary-nav-fixed');
	    		isHidden = true;
	    	}
	    }
	}

	function hasClass(element, cls) {
	    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
	}
});