var room_ids = {
    '8490': 'Barclay',
    '8491': 'Orientale',
    '8492': 'Louisiane',
    '8493': 'Suite Junior',
    '8494': 'Lodge',
    '8495': 'Pavillon',
    '21546': 'Ty Nid',
    '9059056555': 'Carte cadeau 100€',
    '9053164897': 'Carte cadeau 150€',
};

/**
 * Booking/room search result page dataLayer or event 'view_item'
 */
bookingRoomDataLayer = function() {
    var items = [];
    $('form.room_booked').each(function(i, elt) { 
        var item= {}; 
        item.item_id = ''+$('input#room_booked_room_id', $(elt)).attr('value'); 
        item.item_name = room_ids[$('input#room_booked_room_id', $(elt)).attr('value')]; 
        item.item_category = $('input#room_booked_arrival_date', $(elt)).attr('value')+'-'+$('input#room_booked_departure_date', $(elt)).attr('value')+'/'+
                             $('input#room_booked_total_adult', $(elt)).attr('value')+' adultes-'+$('input#room_booked_total_children', $(elt)).attr('value')+' enfants'; 
        item.price = $('input#room_booked_total_price', $(elt)).attr('value'); 
        item.promotion_id = $('input#room_booked_pricing_type_id', $(elt)).attr('value'); 
        items[i] = item;
    });

    window.dataLayer.push({
        event: "view_item",
        ecommerce: {
            currency: "EUR",
            value:  items[0].price,
            items: items
        }
    });
};

/**
 * Booking/informations page dataLayer for event 'view_cart'
 */
informationsDataLayer = function(evtName) {
    var items = [];
    var dates = $('.informations__header h3').text().replace(/\s+/g, ' ');

    $('.informations__room-info').each(function(i, elt) { 
        var item= {}; 
        item.item_name = $('.informations__room-name h3', $(elt)).text(); 
        item.item_category = dates+'/'+
                            $('select[name="cart_item[total_adult]"]', $(elt)).val()+' adultes-'+
                            $('select[name="cart_item[total_children]"]', $(elt)).val()+' enfants'; 
        item.price = $('.informations__room-info', $(elt)).text().match(/\d+ €/)[0];
        items[i] = item;
    });

    window.dataLayer.push({
        event: evtName,
        ecommerce: {
            currency: "EUR",
            value: $('#total-price-booking-engine').text(),
            items: items
        }
    });
};

/**
 * set dataLayer on forms submit
 */
$( document ).ready(function() {
    // -- add to book forms
	$('form.form_booked').submit(function(e) { 
//		e.preventDefault(); 
        var f = $(e.target[0]).parents('form');
        var evtName = 'add_to_cart';
        var item= { price: 0 }; 

        // room booking
        if (f.attr('action').includes('add-room-to-cart')) {
            item.item_id = ''+$('input#room_booked_room_id', f).attr('value'); 
            item.item_name = room_ids[item.item_id]; 
            item.item_category = $('input#room_booked_arrival_date', f).attr('value')+'-'+$('input#room_booked_departure_date', f).attr('value')+'/'+
                                 $('input#room_booked_total_adult', f).attr('value')+' adultes-'+$('input#room_booked_total_children', f).attr('value')+' enfants'; 
            item.price = $('input#room_booked_total_price', f).attr('value'); 
            item.promotion_id = $('input#room_booked_pricing_type_id', f).attr('value'); 
            item.item_list_id = $('input[name="cart_id"]', f).attr('value'); 
        // else gift card form                
        } else if (f.attr('action').includes('add-gift-card-to-cart')) {
            item.item_id = f.attr('action').match(/\d+/g)[0];
            item.item_name = room_ids[item.item_id]; 
            item.item_category = 'Carte Cadeau';
            item.price = item.item_name.match(/\d+/g)[0];
            item.item_list_id = $('input[name="cart_id"]', f).attr('value'); 
        } else {
            evtName = '';
        }

        if (evtName) {
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
                event: evtName,
                ecommerce: {
                    currency: "EUR",
                    value:  item.price,
                    items: [item]
                }
            })
        }
    }); 
    
    // destroy cart form
    $('form[action*="destroy-cart"]').submit(function(e) { 
		// e.preventDefault(); 
        var f = $(e.target[0]).parents('form');
        var item= { 
            item_name: 'Panier complet',
            item_list_id: $('input[name="cart_id"]', f).val(), 
        }; 

        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
            event: 'remove_from_cart',
            ecommerce: {
                // currency: "EUR",
                // value:  item.price,
                items: [item]
            }
        })
    });
    
    // client info submit -> store lead variables in dataLayer
    $('form#new_cart_customer').submit(function(e) { 
		// e.preventDefault(); 
        var s = '';
        var vars= {}; 
        if ((s = $('input#cart_customer_email').val())) {
            vars.lead_email = s;
            vars.lead_lastname = $('input#cart_customer_last_name').val();
            vars.lead_firstname = $('input#cart_customer_first_name').val();
            vars.lead_tel = $('input#cart_customer_phone').val();
            
            vars.lead_dates = $('.informations__header h3').text().replace(/\s+/g, ' ');
            var rooms= []; 
            $('.informations__room-info').each(function(i, elt) { 
                rooms[i] = $('.informations__room-name h3', $(elt)).text() + '(' +
                                    $('select[name="cart_item[total_adult]"]', $(elt)).val()+' adultes-'+
                                    $('select[name="cart_item[total_children]"]', $(elt)).val()+' enfants)'; 
            });
            vars.lead_rooms = rooms.toString();
            
            window.dataLayer.push(vars);
        }
    });

    // remove from cart click init dataLayer
    $('a[href*="booking/remove-from-cart"').on('click', function(e) {
        e.preventDefault();
        var elt = $(e.target).parents('.informations__room-info');
    
        var item= {
            item_name: $('.informations__room-name h3', elt).text(),
            item_category: $('.informations__header h3').text().replace(/\s+/g, ' ')+'/'+
                            $('select[name="cart_item[total_adult]"]', elt).val()+' adultes-'+
                            $('select[name="cart_item[total_children]"]', elt).val()+' enfants',
            price: $('.informations__room-info').text().match(/\d+ €/)[0]
        }; 

        window.dataLayer.push({ ecommerce: null });
        window.dataLayer.push({
            event: 'remove_from_cart',
            ecommerce: {
                currency: "EUR",
                value: $('#total-price-booking-engine').text(),
                items: [item]
            }
        });
    
    });
});


/**
 * no availability handling: propose other date
 */
checkNearDates = function () {
    if ($('.be__no-room-available').length) {
        var search = new URLSearchParams(window.location.search);
        var arr = new Date(search.get('info[arrival_date]').replace(/(\d{2})\/(\d{2})\/(\d{4})/g, '$3/$2/$1'));
        var dep = new Date(search.get('info[departure_date]').replace(/(\d{2})\/(\d{2})\/(\d{4})/g, '$3/$2/$1'));
        var today = new Date();
        
        $('.be__no-room-available').prepend('<div class="row" id="near_avail" style="margin: 1.5em 0"></div>');
        $('#near_avail').append(
            $('<h4></h4>')
            .text(( window.location.pathname.includes('/fr/') 
                ? 
                'Autres disponibilités à cette période pour '+ search.get('info[total_adult]') +' adultes '+
                  (search.get('info[total_children]')>0 ? search.get('info[total_children]') +' enfants' : '')
                :
                'Other availabilities at this period for '+ search.get('info[total_adult]') +' adults '+
                    (search.get('info[total_children]')>0 ? search.get('info[total_children]') +' children' : '')
               ) + ':')
        );
        
        for (let i = 1; i < 3; i++) {
            arr.setDate(arr.getDate()+1);
            if (arr < dep) {
                checkAddNearAvail(search, arr, dep);
            }
            
            dep.setDate(dep.getDate()+1);
            checkAddNearAvail(search, arr, dep);
        }
        arr.setDate(arr.getDate()-2); 
        dep.setDate(dep.getDate()-2); 
        for (i = 1; i < 3; i++) {
            dep.setDate(dep.getDate()-1);
            if (arr < dep && arr > today) {
                checkAddNearAvail(search, arr, dep);
            }
            arr.setDate(arr.getDate()-1);
            if (arr < dep && arr > today) {
                checkAddNearAvail(search, arr, dep);
            }
        }
    }
}

checkAddNearAvail = function(search, arr, dep) {
    let s = ( window.location.pathname.includes('/fr/')
            ? 'Du ' + arr.toLocaleDateString(navigator.language, { dateStyle: "medium" }) + ' au ' 
                + dep.toLocaleDateString(navigator.language, { dateStyle: "medium" })
            : 'From ' + arr.toLocaleDateString(navigator.language, { dateStyle: "medium" }) + ' to ' 
                + dep.toLocaleDateString(navigator.language, { dateStyle: "medium" })
    );
    
    search.set('info[arrival_date]', arr.toLocaleDateString('fr'));
    search.set('info[departure_date]', dep.toLocaleDateString('fr'));
    let url = window.location.origin + window.location.pathname + '?' + search.toString();
    $.ajax({
        url: window.location.origin + window.location.pathname + '?' + search.toString(),
        beforeSend: function(xhr) {
             //xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
        }, success: function(data){
            // console.log(data.includes('id="no_rooms_available"'));
            $('#near_avail').append(
                $('<div></div>').addClass('col-xs-6 col-md-4')
                    .append(
                        ( data.includes('class="be__no-room-available"')
                        ?
                        $('<span style="text-decoration: line-through"></span').text(s)
                        :
                        $('<a href="' +url+ '"></a>').text(s)
                        )
                        )
            );
        }
    });
}