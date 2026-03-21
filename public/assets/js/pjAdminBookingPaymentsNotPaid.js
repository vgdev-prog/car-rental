var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {
		var $frmCreate = $("#frmCreate"),
			$frmUpdate = $("#frmUpdate"),
			$dialogUpdateCar = $("#dialogUpdateCar"),
			$dialogDeletePayment = $("#dialogDeletePayment"),
			$dialogReminderEmail = $("#dialogReminderEmail"),
			$dialogReminderSms = $("#dialogReminderSms"),
			validate = ($.fn.validate !== undefined),
			datepicker = ($.fn.datepicker !== undefined),
			tipsy = ($.fn.tipsy !== undefined),
			$content = $("#content"),
			datagrid = ($.fn.datagrid !== undefined),
			dialog = ($.fn.dialog !== undefined),
			tabs = ($.fn.tabs !== undefined),
			chosen = ($.fn.chosen !== undefined),
			$tabs = $("#tabs"),
			rental_days = 0,
			number_of_extras = 0,
			keyPressTimeout,
			tOpt = {
				select: function (event, ui) {
					$(":input[name='tab_id']").val(ui.panel.id);
				}
			};
		
		if ($tabs.length > 0 && tabs) {
			$tabs.tabs(tOpt);
		}
		$(".digits").spinner({
			min: 0
		});
	    
		$content.delegate("#opExtraAdd", "click", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			var $this = $(this);
			$.get("index.php?controller=pjAdminBookings&action=pjActionGetExtras", {
				type_id: $("#type_id").val()
			}).done(function (data) {
				var $tr,
				$tbody = $("#boxExtras tbody");
				$tbody.append(data);
				number_of_extras++;
				checkExtras();
			});
			return false;
		}).delegate(".opExtraDel", "click", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			$(this).parent().parent().remove();
			number_of_extras--;
			checkExtras();
			if($frmUpdate.length > 0){
				getPrices($frmUpdate);
			}
			if($frmCreate.length > 0){
				getPrices($frmCreate);
			}
			return false;
		});
		
		if ($dialogUpdateCar.length > 0 && dialog) {
			$dialogUpdateCar.dialog({
				modal: true,
				autoOpen: false,
				resizable: false,
				draggable: false,
				buttons: {
					"Ok": function () {
						var $this = $(this);
							car_id = $("#car_id").val();
							mileage= $('#end').val();
							
						$.post("index.php?controller=pjAdminBookings&action=pjActionUpdateCarMileague", {
							car_id: car_id,
							mileage: mileage
						}).done(function () {
							$this.dialog("close");
						});
					},
					"Cancel": function () {
						$(this).dialog("close");
					}
				}
			});
		}
		
		if ($dialogDeletePayment.length > 0 && dialog) {
			$dialogDeletePayment.dialog({
				modal: true,
				autoOpen: false,
				resizable: false,
				draggable: false,
				buttons: {
					"Delete": function () {
						var $this = $(this),
							$link = $this.data("link"),
							$tr = $link.closest("tr");
						$.post("index.php?controller=pjAdminBookings&action=pjActionDeletePayment", {
							id: $link.data("id")
						}).done(function () {https://eubiq.ca:10000/
							$tr.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
								$tr.remove();
								$this.dialog("close");
							});
						});
					},
					"Cancel": function () {
						$(this).dialog("close");
					}
				}
			});
		}
		if ($dialogReminderEmail.length > 0 && dialog) {
			$dialogReminderEmail.dialog({
				modal: true,
				resizable: false,
				draggable: false,
				autoOpen: false,
				width: 660,
				open: function () {
					$dialogReminderEmail.html("");
					$.get("index.php?controller=pjAdminBookings&action=pjActionReminderEmail", {
						"id": $dialogReminderEmail.data("id")
					}).done(function (data) {
						$dialogReminderEmail.html(data);
						validator = $dialogReminderEmail.find("form").validate({
							errorPlacement: function (error, element) {
								error.insertAfter(element.parent());
							},
							errorClass: "error_clean"
						});
						$dialogReminderEmail.dialog("option", "position", "center");
					});
				},
				close: function () {
					crApp.enableButtons.call(null, $dialogReminderEmail);
				},
				buttons: (function () {
					var buttons = {};
					buttons[crApp.locale.button.send] = function () {
						if (validator.form()) {
							crApp.disableButtons.call(null, $dialogReminderEmail);
							$.post("index.php?controller=pjAdminBookings&action=pjActionReminderEmail", $dialogReminderEmail.find("form").serialize()).done(function (data) {
								if (data.status == "OK") {
									$dialogReminderEmail.dialog("close");
									noty({text: data.text, type: "success"});
								} else {
									noty({text: data.text, type: "error"});
									crApp.enableButtons.call(null, $dialogReminderEmail);
								}
							});
						}
					};
					buttons[crApp.locale.button.cancel] = function () {
						$dialogReminderEmail.dialog("close");
					};
					
					return buttons;
				})()
			});
		}
		
		if ($dialogReminderSms.length > 0 && dialog) {
			$dialogReminderSms.dialog({
				modal: true,
				resizable: false,
				draggable: false,
				autoOpen: false,
				width: 660,
				open: function () {
					$dialogReminderSms.html("");
					$.get("index.php?controller=pjAdminBookings&action=pjActionReminderSms", {
						"id": $dialogReminderSms.data("id")
					}).done(function (data) {
						$dialogReminderSms.html(data);
						validator = $dialogReminderSms.find("form").validate({
							errorPlacement: function (error, element) {
								error.insertAfter(element.parent());
							},
							errorClass: "error_clean"
						});
						$dialogReminderSms.dialog("option", "position", "center");
					});
				},
				close: function () {
					crApp.enableButtons.call(null, $dialogReminderSms);
				},
				buttons: (function () {
					var buttons = {};
					buttons[crApp.locale.button.send] = function () {
						if($('#client_phone').val() != '')
						{
							if (validator.form()) {
								crApp.disableButtons.call(null, $dialogReminderSms);
								$.post("index.php?controller=pjAdminBookings&action=pjActionReminderSms", $dialogReminderSms.find("form").serialize()).done(function (data) {
									if (data.status == "OK") {
										$dialogReminderSms.dialog("close");
										noty({text: data.text, type: "success"});
									} else {
										noty({text: data.text, type: "error"});
										crApp.enableButtons.call(null, $dialogReminderSms);
									}
								});
							}
						}else{
							noty({text: myLabel.phone_not_available, type: "error"});
						}
					};
					buttons[crApp.locale.button.cancel] = function () {
						$dialogReminderSms.dialog("close");
					};
					
					return buttons;
				})()
			});
		}
		
		if (tipsy) {
			$(".listing-tip").tipsy({
				offset: 1,
				opacity: 1,
				html: true,
				gravity: "nw",
				className: "tipsy-listing"
			});
		}
		
		if ($frmUpdate.length > 0) {
			number_of_extras = myLabel.numberOfExtras;
			checkExtras();
		}
		
		if ($frmCreate.length > 0 || $frmUpdate.length > 0) {
			$("#setStartValue").bind("click", function (e) {
				$('#start').val($("#setStartValue").attr("rel"));
			});	
			$("#updateCar").bind("click", function (e) {
				if ($dialogUpdateCar.length > 0 && dialog) {
					
					car_id = $("#car_id").val();
					if(car_id){
						$.get("index.php?controller=pjAdminBookings&action=pjActionGetCarMileageMsg", {car_id: car_id, mileage: $('#end').val()}, function (data) {
							$("#dialogUpdateCar").html(data);
							$dialogUpdateCar.data('link', $(this)).dialog("open");
						});
					}
					
				}
			});
			
			$("#content").on("change", "#car_id", function (e) {
				var $this = $(this),
					car_id = $this.find("option:selected").val(),
					car_label = $this.find("option:selected").text();
				if(car_id){
					$.get("index.php?controller=pjAdminBookings&action=pjActionGetCarMileage", {car_id: car_id}, function (data) {
						if ($frmUpdate.length > 0) {
							$('#collect_car_id').find("option[value=" + car_id + "]").attr("selected", "selected");
							$('#collect_current_mileage').html(data + ' ' + myLabel.mileage_unit);
							$('#cr_set_as_current').attr('rev', data);
							checkAvailability($frmUpdate);
							$('.cr-car-info').html(car_label);
							$('.cr-car-info').attr('href', "index.php?controller=pjAdminCars&action=pjActionUpdate&id=" + car_id);
						}
						if ($frmCreate.length > 0) {
							checkAvailability($frmCreate);
							$('.cr-car-info').html(car_label);
							$('.cr-car-info').attr('href', "index.php?controller=pjAdminCars&action=pjActionUpdate&id=" + car_id);
						}
					});
				}else{
					$('#collect_current_mileage').html('');
					$('#collect_car_id').val('');
				}
				$('#start').val(0);
				
			}).on("change", "#type_id", function (e) {
				
				var select_type_id = $(this).find("option:selected").val();
				
				$.get("index.php?controller=pjAdminBookings&action=pjActionGetCars", {type_id: select_type_id}, function (data) {
					$("#boxCars").html(data);
					$('#start').val(0);
					
					var $collect_car_id = $('#collect_car_id'),
						$parent = $collect_car_id.closest("p");
					$collect_car_id.replaceWith(data);
					$parent.find("select[name=car_id]").attr("id", "collect_car_id").attr("name", "collect_car_id");
				});
				
				$.get("index.php?controller=pjAdminBookings&action=pjActionGetExtras", {type_id: select_type_id}, function (data) {
					if(data){
						$("#addExtra").show();
					}
					else{
						$("#addExtra").hide();
					}
					$("#boxExtras").html(data);
					if (chosen) {
						$("#extra_id").chosen();
					}
				});
				number_of_extras = 1;
				checkExtras();
			});
			
			$("#payment_method").bind("change", function (e) {
				if ($("option:selected", this).val() == 'creditcard') {
					$(".boxCC").show();
				} else {
					$(".boxCC").hide();
				}
			});
						
			$(".cr-button-validate-save").bind("click", function (e) {
				var $form = $(this).closest("form");	
				checkAvailability($form);
				if($form.valid() && $('#dates').val() == 1){
					$('#isUpdate').val(1);
				}
			});
			$("#btnSave4").bind("click", function (e) {
				var $form = $(this).closest("form");	
				$form.submit();
			});
			$("#btnSave5").bind("click", function (e) {
				var $form = $(this).closest("form");
				$('#status').val('collected');
				$('#car_id').val($('#collect_car_id').val());
				$form.submit();
			});
			$("#btnSave6").bind("click", function (e) {
				var $form = $(this).closest("form");
				$('#status').val('completed');
				$form.submit();
			});
			if (chosen) {
				$("#c_country").chosen();
				$("#extra_id").chosen();
			};
			if (chosen) {
				$("#booking_id").chosen();
				
			};
		}
		function checkExtras()
		{
			if(number_of_extras > 0)
			{
				$('#lblNoExtra').css('display', 'none');
			}else{
				$('#lblNoExtra').css('display', 'block');
			}
		}
		
		function getExtraHoursUsage($form){
			$.post("index.php?controller=pjAdminBookings&action=pjActionExtraHoursUsage", $form.serialize()).done(function (data) {
				$('#cr_extra_hours_usage').html(data.extra_hours_usage);
			});
		}
		function getExtraMileageCharge($form){
			$.post("index.php?controller=pjAdminBookings&action=pjActionExtraMileageCharge", $form.serialize()).done(function (data) {
				$('#cr_extra_mileage_charge').html(data.extra_mileage_charge);
			});
		}
		
		function getPrices($form){
			$('#pj_price_loader').css('display', 'block');
			$.post("index.php?controller=pjAdminBookings&action=pjActionGetPrices", $form.serialize()).done(function (data) {
					$("input#rental_days").val(data.rental_days);
					$("input#rental_hours").val(data.hours);
					$("input#car_rental_fee").val(data.car_rental_fee);
					$("input#price_per_day").val(data.price_per_day);
					$("input#price_per_hour").val(data.price_per_hour);
					$("input#price_per_day_detail").val(data.price_per_day_detail);
					$("input#price_per_hour_detail").val(data.price_per_hour_detail);
					$("input#extra_price").val(data.extra_price);
					$("input#insurance").val(data.insurance);
					$("input#age_fee").val(data.age_fee);
					$("input#second_driver_fee").val(data.second_driver_fee);
					$("input#sub_total").val(data.sub_total);
					$("input#tax").val(data.tax);
					$("input#tvq").val(data.tvq);
					$("input#total_price").val(data.total_price);
					$("input#required_deposit").val(data.required_deposit);
					
					$(".cr-total-quote").html(data.total_quote_label);
					$(".cr-due-payment").html(data.total_amount_due_label);
					
					$("#cr_rental_fee").html(data.car_rental_fee_label);
					$("#cr_rental_fee_detail").html(data.car_rental_fee_detail);
					$("#cr_price_per_day").html(data.price_per_day_label);
					$("#cr_price_per_hour").html(data.price_per_hour_label);
					$("#cr_price_per_day_detail").html(data.price_per_day_detail);
					$("#cr_price_per_hour_detail").html(data.price_per_hour_detail);
					$("#cr_extra_price").html(data.extra_price_label);
					$("#cr_insurance").html(data.insurance_label);
					$("#cr_age_fee").html(data.age_fee_label);
					$("#cr_second_driver_fee").html(data.second_driver_fee_label);
					$("#cr_insurance_detail").html(data.insurance_detail);
					$("#cr_sub_total").html(data.sub_total_label);
					$("#cr_tax").html(data.tax_label);
					$("#cr_tax_detail").html(data.tax_detail);
					$("#cr_tvq").html(data.tvq_label);
					$("#cr_tvq_detail").html(data.tvq_detail);
					$("#cr_total_price").html(data.total_price_label);
					$("#cr_required_deposit").html(data.required_deposit_label);
					$("#cr_required_deposit_detail").html(data.required_deposit_detail);
					
					$("#cr_rental_time").html(data.rental_time);
					$("#cr_rental_time").parent().css('display', 'block');
										
					$('#pj_price_loader').css('display', 'none');
					
					if($frmUpdate.length > 0)
					{
						if($form.valid() && $('#dates').val() == 1 && $('#isUpdate').val() == 1)
						{
							$form.submit();
						}
					}
			});
		}
		
		function checkAvailability($form){
			$('#pj_price_loader').css('display', 'block');
			$.post("index.php?controller=pjAdminBookings&action=pjActionCheckAvailability", $form.serialize()).done(function (data) {
				
				if (data.code === undefined) {
					return;
				}
				switch (data.code) {
				case 300:
					if($('#date_from').val() != '' && $('#date_to').val() != '')
					{
						$("input#dates").val('1');
					}
					$('#pj_price_loader').css('display', 'none');
					break;
				case 200:
					if($('#date_from').val() != '' && $('#date_to').val() != '')
					{
						$("input#dates").val('1');
					}
					getPrices($form)
					break;
				case 100:
					if($('#date_from').val() != '' && $('#date_to').val() != '')
					{
						$("input#dates").val('0');
					}
					$('#pj_price_loader').css('display', 'none');
					break;
				}
			});
		}
		
		function formatCurrency(price)
		{
			var format = '---', currency = myLabel.currency;
			switch (currency)
			{
				case 'GBP':
					format = "&pound;" + price.toFixed(2);
					break;
				case 'EUR':
					format = "&euro;" + price.toFixed(2);
					break;
				case 'JPY':
					format = "&yen;" + price.toFixed(2);
					break;
				case 'USD':
				case 'AUD':
				case 'CAD':
				case 'NZD':
				case 'CHF':
				case 'HKD':
				case 'SGD':
				case 'SEK':
				case 'DKK':
				case 'PLN':
					format = price.toFixed(2) + currency;
					break;
				case 'NOK':
				case 'HUF':
				case 'CZK':
				case 'ILS':
				case 'MXN':
					format = currency + price.toFixed(2);
					break;
				default:
					format = price.toFixed(2) + currency;
					break;
			}
			return format;
		}
		
		function calPayment()
		{
			var collected = 0, security_returned = 0, due_payment = 0,
				total_price = parseFloat($('#total_price').val());
			
			$( ".pj-payment-amount" ).each(function( e ) {
				var index = $( this ).attr('data-index'),
					value = $( this ).val(), 
					status = $( '#payment_status_' + index ).val(),
					payment_type = $( '#payment_type_' + index ).val();
				
				if(value != '' && isNaN(value) == false)
				{
					if(payment_type != 'securityreturned' && status == 'paid')
					{
						collected += parseFloat(value);
					}
					if(payment_type == 'securityreturned' && status == 'paid'){
						security_returned += parseFloat(value);
					}
				}
			});
			collected = collected - security_returned;
			due_payment = total_price - collected;
			if(due_payment < 0)
			{
				due_payment = 0;
			}
			collected = formatCurrency(collected);
			due_payment = formatCurrency(due_payment);
			$('#pj_collected').html(collected);
			$('#pj_due_payment').html(due_payment);
		}
		
		if (validate) {
			$.validator.addMethod("validDates", function (value, element) {
				return parseInt(value, 10) === 1;
			}, myLabel.dateRangeValidation);
		}
		
		if ($frmCreate.length > 0 && validate) {
			$frmCreate.validate({
				rules: {
					"dates": "validDates",
					"date_from": {
						remote: {
							url: "index.php?controller=pjAdminBookings&action=pjActionCheckPickup",
							data:{
								pickup_id: function(){
									return $frmCreate.find('select[name="pickup_id"]').val();
								}
							}
						}
					},
					"date_to": {
						remote: {
							url: "index.php?controller=pjAdminBookings&action=pjActionCheckReturn",
							data:{
								return_id: function(){
									return $frmCreate.find('select[name="return_id"]').val();
								}
							}
						}
					}
				},				
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em",
				ignore: ".ignore",
				invalidHandler: function (event, validator) {
				    if (validator.numberOfInvalids()) {
				    	var index = $(validator.errorList[0].element, this).closest("div[id^='tabs-']").index();
				    	if ($tabs.length > 0 && tabs && index !== -1) {
				    		$tabs.tabs(tOpt).tabs("option", "active", index-1);
				    	}
				    };
				}
			});
		}
		if ($frmUpdate.length > 0 && validate) {
			$frmUpdate.validate({
				rules: {
					"dates": "validDates",
					"date_from": {
						remote: {
							url: "index.php?controller=pjAdminBookings&action=pjActionCheckPickup",
							data:{
								pickup_id: function(){
									return $frmUpdate.find('select[name="pickup_id"]').val();
								}
							}
						}
					},
					"date_to": {
						remote: {
							url: "index.php?controller=pjAdminBookings&action=pjActionCheckReturn",
							data:{
								return_id: function(){
									return $frmUpdate.find('select[name="return_id"]').val();
								}
							}
						}
					}
				},
				errorPlacement: function (error, element) {
					if(element.attr('name') == 'dropoff_mileage')
					{
						error.insertAfter(element.parent().parent());
					}else{
						error.insertAfter(element.parent());
					}
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em",
				ignore: ".ignore",
				invalidHandler: function (event, validator) {
				    if (validator.numberOfInvalids()) {
				    	var index = $(validator.errorList[0].element, this).closest("div[id^='tabs-']").index();
				    	if ($tabs.length > 0 && tabs && index !== -1) {
				    		$tabs.tabs(tOpt).tabs("option", "active", index-1);
				    	}
				    };
				}
			});
		}
		
		function formatCarType(val, obj) {
			if (pjGrid.isEditor === true) {
				return val;
			}else{
				return ['<a href="index.php?controller=pjAdminTypes&action=pjActionUpdate&id=', obj.type_id ,'">'+ val + '</a>'].join(""); 
			}
		}

		function formatCar(val, obj) {
			if (pjGrid.isEditor === true) {
				return val;
			}else{
				return ['<a href="index.php?controller=pjAdminCars&action=pjActionUpdate&id=', obj.car_id ,'">'+ val + '</a>'].join("");
			}
		}

        function formatClient(val, obj) {
            if (pjGrid.isEditor === true) {
                return val;
            } else {
                return ['<a href="index.php?controller=pjAdminCustomers&action=pjActionGetCustomerInfo&id=', obj.customer_id, '">' + val + '</a>'].join("");
            }
        }
		
		if ($("#grid").length > 0 && datagrid) {
			var gridSettings = $.cookie('selectedPaginationOptions') && JSON.parse($.cookie('selectedPaginationOptions'));
			var isRedirected = $.cookie('isRedirected') && JSON.parse($.cookie('isRedirected'));
			if(gridSettings) {
				var gridQuery = $.map(gridSettings, function(val,index) {
					var str = index + "=" + val;
					return str;
				}).join("&");
			}
			var $grid = $("#grid").datagrid({
				buttons: [
					{type: "copy", url: "index.php?controller=pjAdminBookings&action=pjActionContract&id={:id}&locations_id={:location_id}", target: '_blank'},
					{type: "edit", url: "index.php?controller=pjAdminBookings&action=pjActionUpdate&id={:id}"},
					{type: "delete", url: "index.php?controller=pjAdminBookings&action=pjActionDelete&id={:id}"}
			  	],
				columns: [
				    {text: myLabel.booking_id, type: "text", sortable: false, editable: false, width: 50 },
				    {text: myLabel.booking_type, type: "text", sortable: false, editable: false, width: 80 , renderer: formatCarType},
				    {text: myLabel.booking_car, type: "text", sortable: false, editable: false, width: 140, renderer: formatCar},
                    {
                        text: myLabel.booking_client,
                        type: "text",
                        sortable: false,
                        editable: false,
                        width: 100,
                        renderer: formatClient
                    },
				    {text: myLabel.booking_total, type: "text", sortable: true, editable: false, width: 90},
					{text: myLabel.status, type: "select", sortable: true, editable: true, width: 80, options: [
							{label: myLabel.pending, value: "pending"},
							{label: myLabel.collected, value: "collected"},
							{label: myLabel.completed, value: "completed"}
						], applyClass: "pj-status"},
					{text: myLabel.booking_payment_status, type: "select", sortable: false, editable: true, width: 60, options: [
							{label: myLabel.notpaid, value: "notpaid"},
							{label: myLabel.paid, value: "paid"},
							{label: myLabel.promo, value: "promo"}
						], applyClass: "pj-booking-payment-status"},
					{text: myLabel.booking_to, type: "text", sortable: false, editable: false, width: 70},
				],
				dataUrl:
					isRedirected
						?
						"index.php?controller=pjAdminBookings&action=pjActionGetBookings&payments_not_paid=notpaid" + '&' + gridQuery
						:
						"index.php?controller=pjAdminBookings&action=pjActionGetBookings&payments_not_paid=notpaid",
				dataType: "json",
				fields: ['booking_id','type','car_info', 'client', 'total_price', 'status','booking_payment_status', 'to'],
				paginator: {
					gotoPage: true,
					paginate: true,
					total: true,
					rowCount: true
				},
				saveUrl: "index.php?controller=pjAdminBookings&action=pjActionSave&id={:id}",
			});
			$.cookie('isRedirected', false);
			// $.cookie('selectedPaginationOptions', JSON.stringify({}));
			var queryHashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			var pageAction = queryHashes[1];
			$.cookie('selectedPanelPage', pageAction);
		}


		$(document).on("click", ".btn-all", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			$(this).addClass("pj-button-active").siblings(".pj-button").removeClass("pj-button-active");
			var content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache");
			$.extend(cache, {
				status: "",
				filter: "",
				q: "",
				type_id: "",
				booking_id: "",
				pickup_from: "",
				pickup_to: "",
				return_from: "",
				return_to: "",
				pickup_id: "",
				return_id: "",
				registration_number: ""
			});

			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminBookings&action=pjActionGetBookings" + pjGrid.queryString, "created", "DESC", content.page, content.rowCount);
			return false;
		}).on("click", ".btn-filter", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}

			var $this = $(this),
				content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache"),
				obj = {};

			$this.addClass("pj-button-active").siblings(".pj-button").removeClass("pj-button-active");

			$("#filter").val($this.data("value"));

			obj.status = "";
			obj[$this.data("column")] = $this.data("value");
			$.extend(cache, obj);
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminBookings&action=pjActionGetBookings" + pjGrid.queryString, "created", "DESC", content.page, content.rowCount);
			return false;
		}).on("focusin", "#pickup_from, #pickup_to, #return_from, #return_to", function (e) {
			$(this).datepicker({
				firstDay: $(this).attr('rel'),
				dateFormat: $(this).attr('rev'),
				onSelect: function (dateText, inst) {
				}
			});

		}).on("focusin", ".datetimepick", function (e) {
			var minDateTime, maxDateTime,
				$this = $(this),
				custom = {},
				o = {
					firstDay: $this.attr("rel"),
					dateFormat: $this.attr("rev"),
					timeFormat: $this.attr("lang"),
					stepMinute: 5,
					onClose:function(){
						if (($frmUpdate.length > 0) && ($this.attr("name") == 'date_from' || $this.attr("name") == 'date_to')) {
							checkAvailability($frmUpdate);
						}
						if (($frmCreate.length > 0) && ($this.attr("name") == 'date_from' || $this.attr("name") == 'date_to')) {
							if($('#date_from').val() != '' && $('#date_to').val() != '' && $('#type_id').val() != '')
							{
								checkAvailability($frmCreate);
							}
						}
						if($this.attr("name") == 'date_to'){
							$('#dropoff_datetime').val($this.val());
						}
						if($this.attr("name") == 'actual_dropoff_datetime'){
							getExtraHoursUsage($frmUpdate);
						}
					}
				};
			switch ($this.attr("name")) {
				case "date_from":
					if($(".datetimepick[name='date_to']").val() != '')
					{
						maxDateTime = $(".datetimepick[name='date_to']").datetimepicker({
							firstDay: $this.attr("rel"),
							dateFormat: $this.attr("rev"),
							timeFormat: $this.attr("lang")
						}).datetimepicker("getDate");
						// $(".datetimepick[name='date_to']").datepicker("destroy").removeAttr("id");
						if (maxDateTime !== null) {
							custom.maxDateTime = maxDateTime;
						}
					}
					break;
				case "date_to":
					if($(".datetimepick[name='date_from']").val() != '')
					{
						minDateTime = $(".datetimepick[name='date_from']").datetimepicker({
							firstDay: $this.attr("rel"),
							dateFormat: $this.attr("rev"),
							timeFormat: $this.attr("lang")
						}).datetimepicker("getDate");
						// $(".datetimepick[name='date_from']").datepicker("destroy").removeAttr("id");
						if (minDateTime !== null) {
							custom.minDateTime = minDateTime;
						}
					}
					break;
			}
			$(this).datetimepicker($.extend(o, custom));

		}).on("click", ".pj-form-field-icon-date", function (e) {
			var $dp = $(this).parent().siblings("input[type='text']");
			if ($dp.hasClass("hasDatepicker")) {
				$dp.datepicker("show");
			} else {
				$dp.trigger("focusin").datepicker("show");
			}

		}).on("submit", ".frm-filter", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			var $this = $(this),
				content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache");
			$.extend(cache, {
				q: $this.find("input[name='q']").val(),
				status: "",
				type_id: "",
				booking_id: "",
				pickup_from: "",
				page: content.page,
				pickup_to: "",
				return_from: "",
				return_to: "",
				pickup_id: "",
				return_id: "",
				registration_number:""
			});
			$.cookie('selectedPaginationOptions', JSON.stringify(cache));
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminBookings&action=pjActionGetBookings", "created", "DESC", content.page, content.rowCount);
			return false;
		}).on("click", ".pj-button-detailed, .pj-button-detailed-arrow", function (e) {
			e.stopPropagation();
			$(".pj-form-filter-advanced").toggle();
		}).on("submit", ".frm-filter-advanced", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			var obj = {},
				$this = $(this),
				arr = $this.serializeArray(),
				content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache");
			for (var i = 0, iCnt = arr.length; i < iCnt; i++) {
				obj[arr[i].name] = arr[i].value;
			}
			$.extend(cache, obj);
			$.cookie('selectedPaginationOptions', JSON.stringify(cache));
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminBookings&action=pjActionGetBookings" + pjGrid.queryString, "id", "DESC", content.page, content.rowCount);
			return false;
		}).on("reset", ".frm-filter-advanced", function (e) {
			$(".pj-button-detailed").trigger("click");

			$('#status').val('');
			$('#type_id').val('');
			$('#booking_id').val('');
			$('#pickup_from').val('');
			$('#pickup_to').val('');
			$('#return_from').val('');
			$('#return_to').val('');
			$('#pickup_id').val('');
			$('#return_id').val('');
			$('#registration_number').val('');

		}).on("change", ".pj-extra-item", function (e) {
			var extra_price = $('option:selected', this).attr('data-price');
			$(this).siblings().html(extra_price);
			if($frmUpdate.length > 0){
				getPrices($frmUpdate);
			}
			if($frmCreate.length > 0){
				getPrices($frmCreate);
			}
		}).on("change", ".pj-extra-qty", function (e) {
			if($frmUpdate.length > 0){
				getPrices($frmUpdate);
			}
			if($frmCreate.length > 0){
				getPrices($frmCreate);
			}
		}).on(
			'change',
			'select[name="c_driver_age"], select[name="c_second_driver_age"], [data-second-driver-toggle],' +
			'input[name="discount_amount"], select[name="discount_type"], select[name="discount_per"]',
			function (e) {
				if($frmUpdate.length > 0){
					getPrices($frmUpdate);
				}
				if($frmCreate.length > 0){
					getPrices($frmCreate);
				}
			}).on("click", "#cr_set_as_current", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			$('#pickup_mileage').val($(this).attr('rev'));
		}).on("keydown", "#dropoff_mileage", function (e) {
			clearTimeout(keyPressTimeout);
			keyPressTimeout = setTimeout( function() {
				getExtraMileageCharge($frmUpdate);
			},500);
		}).on("click", "#btnAddPayment", function (e) {
			var $tr,
				$tbody = $("#tblPayment tbody"),
				index = Math.ceil(Math.random() * 999999),
				h = $tbody.find("tr:last").find("td:first").html(),
				i = (h === null) ? 0 : parseInt(h, 10);

			i = !isNaN(i) ? i : 0;
			$tr = $("#tblPaymentsClone").find("tbody").clone();
			$tbody.find(".notFound").remove();
			var tr_html = $tr.html().replace(/\{INDEX\}/g, 'x_' + index);
			tr_html = tr_html.replace(/\{PTCLASS\}/g, 'pj-payment-type');
			tr_html = tr_html.replace(/\{ACLASS\}/g, 'pj-payment-amount');
			tr_html = tr_html.replace(/\{PDCLASS\}/g, 'pj-payment-datetime');
			tr_html = tr_html.replace(/\{SCLASS\}/g, 'pj-payment-status');
			$tbody.append(tr_html);

			$tbody.find("tr:last").find(".spin").spinner({
				min: 0,
				step: 1
			});
		}).on("click", ".btnRemovePayment", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			var $tr = $(this).closest("tr");
			$tr.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
				$tr.remove();
				calPayment();
			});
			return false;
		}).on("click", ".btnDeletePayment", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			if ($dialogDeletePayment.length > 0 && dialog) {
				$dialogDeletePayment.data('link', $(this)).dialog("open");
				calPayment();
			}
			return false;
		}).on("change", ".pj-payment-type", function (e) {

			var index = $(this).attr('data-index'),
				val = $(this).val(),
				extra_mileage_charge = $('#extra_mileage_charge').val(),
				required_deposit = $('#required_deposit').val();
			if(val == 'online'){
				var online = parseFloat(required_deposit);
				$('#amount_' + index).val(online.toFixed(2));
			}else if(val == 'extra' && extra_mileage_charge != ''){
				var extra_mileage_charge = parseFloat(extra_mileage_charge);
				$('#amount_' + index).val(extra_mileage_charge.toFixed(2));
			}else if(val == 'securitypaid' || val == 'securityreturned'){
				var security = parseFloat(myLabel.security_deposit);
				$('#amount_' + index).val(security.toFixed(2));
			}else{
				$('#amount_' + index).val('');
			}
			calPayment();
		}).on("keydown", ".pj-payment-amount", function (e) {
			clearTimeout(keyPressTimeout);
			keyPressTimeout = setTimeout( function() {
				calPayment();
			},300);
		}).on("change", ".pj-payment-status", function (e) {
			calPayment();
		}).on("click", ".reminder-email", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			if ($dialogReminderEmail.length > 0 && dialog) {
				$dialogReminderEmail.data("id", $(this).data("id")).dialog("open");
			}
			return false;
		}).on("click", ".reminder-sms", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			if ($dialogReminderSms.length > 0 && dialog) {
				$dialogReminderSms.data("id", $(this).data("id")).dialog("open");
			}
			return false;
		}).on("change", "#collect_car_id", function (e) {
			var car_id = $("option:selected", this).val();
			if(car_id){
				$.get("index.php?controller=pjAdminBookings&action=pjActionGetCarMileage", {car_id: car_id}, function (data) {
					if ($frmUpdate.length > 0) {
						$('#collect_current_mileage').html(data + ' ' + myLabel.mileage_unit);
						$('#cr_set_as_current').attr('rev', data);
					}
				});
			}else{
				$('#collect_current_mileage').html('');
			}
		}).on('click', '[data-second-driver-toggle]', function (e) {
			var $checkbox = $(this);
			var $content = $('[data-second-driver]');

			if ($checkbox.prop('checked')) {
				$content.show();
				$content.find('input, select').removeClass('ignore');
				$('body').find('input[name="second_driver"]').val(1);
			} else {
				$content.hide();
				$content.find('input, select').val('');
				$content.find('input, select').addClass('ignore');
				$('body').find('input[name="second_driver"]').val(0);
			}
		}).on("click", ".export-excel, .export-pdf", function (e) {
			let insurance_type = $('#insurance_type').find("option:selected").val(),
				insurance_company_id =  $('#insurance_company_id').find("option:selected").val(),
				status =  $('#status').find("option:selected").val(),
				location_id =  $('#location_id').find("option:selected").val(),
				bill_for_insurance =  $('#bill_for_insurance').find("option:selected").val(),
				export_type = $(this).attr('id');

			let data = {
				insurance_type: insurance_type,
				insurance_company_id: insurance_company_id,
				status: status,
				location_id: location_id,
				bill_for_insurance: bill_for_insurance,
				export_type: export_type,
			}
			if(export_type === 'export-excel'){
				$.ajax({
					url: 'index.php?controller=pjAdminBookings&action=pjActionExportUnpaidPayments',
					type: 'POST',
					data: data,
					success: function(data) {
						$.redirect(data.filename);
					}
				}).done(function(response){});
			}
			if (export_type === 'export-pdf'){
				$.redirect(
					'index.php?controller=pjAdminBookings&action=pjActionExportUnpaidPayments',
					data,
					'POST',
					"_blank"
				);
			}
			return false;
		});

		console.log($grid);

	});
})(jQuery_1_8_2);
