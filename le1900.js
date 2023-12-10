$( document ).ready(function() {
	$("#block_112785 a.style__button").clone().appendTo(".mobile__header-model-1 #header .calendar")
	/* --- copy the menu language in mobile site header --- */
	$('<div class="col-xs-1"></div>').append($('li.site__navbar-language--dropbtn').clone()).insertAfter('nav.mobile__header-model-1 div.u-text-center')
	$(".mobile__header-model-1 #header .col-xs-3:last-child").addClass("col-xs-2").removeClass("col-xs-3");
	$('.j-fit-text-title-112785').removeClass('j-fit-text-title-112785');
	/* --- copy the menu language in mobile site header --- */

	if ($(".room-model-2__desc .see_more").length) {
		// hide short descriptions 'see more' link
	    $(".room-model-2__desc .j-block-text>p, .room-model-2__desc .see_more").hide()
	    // move full description in visible area
    	$(".room-model-2__desc .modal-body>div>div").insertBefore(".room-model-2__desc .j-block-text:first-child");
	}

	if ($(".room__amenities--list .see_more").length) {
		// hide short amenities list and 'see more' link
	    $(".room-model-2__amenities>.room__amenities--list, .room__amenities--list .see_more").hide()
	    // move full amenities list in visible area
	    $(".room__amenities--list .modal-body .room__amenities--list").insertBefore(".room-model-2__amenities>.room__amenities--list");
	}

	// change the search button to be book
	/* 
  $("#check-avail-button").text($('.site__navbar--actions .j-block-button').text()).removeClass('hidden-xs')
	$('#site-date-selector__button .visible-xs').remove()
  */
  
	// add booking cta
	$('.site__navbar--side-div a').clone().addClass('hidden-md').appendTo('.room-model-2__desc, .room-model-2__amenities')

	// grandes marées table hover and click to booking page
	$('.pricing_table_block td').on("mouseenter", function(e) {
		$(this).addClass('highlight');
		var t = $(this).parents('table');
		$('td[row-coordinate="'+$(this).attr('row-coordinate')+'"][column-coordinate="1"]', t).addClass('highlight');
		$('td[column-coordinate="'+($(this).attr('column-coordinate') - $(this).attr('column-coordinate')%2)+'"][row-coordinate="1"]', t).addClass('highlight');
		$('td[column-coordinate="'+$(this).attr('column-coordinate')+'"][row-coordinate="2"]', t).addClass('highlight');
	}).on("mouseleave", function(e) {
		$(this).removeClass('highlight');
		var t = $(this).parents('table');
		$('td[row-coordinate="'+$(this).attr('row-coordinate')+'"][column-coordinate="1"]', t).removeClass('highlight');
		$('td[column-coordinate="'+($(this).attr('column-coordinate') - $(this).attr('column-coordinate')%2)+'"][row-coordinate="1"]', t).removeClass('highlight');
		$('td[column-coordinate="'+$(this).attr('column-coordinate')+'"][row-coordinate="2"]', t).removeClass('highlight');
	});

	$('.pricing_table_block td').on("click", function(e) {
		// if not on grades marees, return
		if ($('#block_548444').length == 0) {
			return;
		}
		// get day in 1st col
		var d = $('td[row-coordinate="'+Math.max($(this).attr('row-coordinate'), 3)+'"][column-coordinate="1"]', $(this).parents('table')).text();
		// get month in title above table
		var m = $('h2', $(this).parents('.pricing_table_wrapper').parent()).text();

		var dt = new Date(dt+' '+m);
		// get language
		var m = window.location.pathname.match(/\/[a-z]{2}\//);

		// make url to booking page for selected date
		var url = window.location.origin + (m ? m[0] : '/') + 'booking/room?info[arrival_date]='+dt.toLocaleDateString("fr");
		dt.setDate((dt.getDate()+1));
		url += '&info[departure_date]='+dt.toLocaleDateString("fr")+'&info[total_adult]=2';

		// open url
		window.open(url, '_blank');
	});
});