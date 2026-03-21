(function (window, undefined) {
	var document = window.document;
	var fancybox = (pjQ.$.fn.fancybox !== undefined);

	pjQ.$.ajaxSetup({
		xhrFields: {
			withCredentials: true
		}
	});

	function CR(options) {
		if (!(this instanceof CR)) {
			return new CR(options);
		}
		this.container = null;
		this.$container = null;
		this.current = 'loadSearch';
		this.step = 0;
		this.opts = {
			folder: ""
		};
		for (var attr in options) {
			if (options.hasOwnProperty(attr)) {
				this.opts[attr] = options[attr];
			}
		}
		this.init();
		return this;
	}
	CR.prototype = {
		init: function () {
			var self = this;
			self.container = document.getElementById("crContainer");
			self.$container = pjQ.$('#crContainer');
			self.loadSearch(0);

			pjQ.$(self.container).on('click.cr', '#crBtnMap', function(e){

				pjQ.$('#pjCrMapModal').modal('show');
				var canvasId = 'pjCrMapCanvas';

				pjQ.$.get([self.opts.folder, "index.php?controller=pjFront&action=pjActionGetLocations", "&session_id=", self.opts.session_id].join("")).done(function (data) {
					var map = new google.maps.Map(document.getElementById(canvasId), {
						zoom: 8,
						mapTypeId: google.maps.MapTypeId.ROADMAP
					});
					if (data && data.length) {
						var i, len, markers = [], _latLng, _marker, _info;
						for (i = 0, len = data.length; i < len; i++) {
							_latLng = new google.maps.LatLng(data[i].lat, data[i].lng);
							_marker = new google.maps.Marker({
								map: map,
								position: _latLng
							});
							var add_arr = [];
							if(data[i].state != null)
							{
								add_arr.push(data[i].state);
							}
							if(data[i].city != null)
							{
								add_arr.push(data[i].city);
							}
							if(data[i].zip != null)
							{
								add_arr.push(data[i].zip);
							}
							_info = new google.maps.InfoWindow({
								content: ['<span style="font-weight: bold; text-transform: uppercase">', data[i].name, '</span><br /><br />',
								    add_arr.join(", "), '<br />',
									data[i].address_1, '<br /><br />',
									'Email: <a href="mailto:', data[i].email, '">', data[i].email, '</a><br />',
									'Phone: ', data[i].phone].join("")
							});
							google.maps.event.addListener(_marker, "click", function (info, marker) {
								return function () {
									info.open(map, marker);
								};
							}(_info, _marker));
							if (i == len - 1) {
								map.setCenter(_latLng);
							}
							markers.push(_marker);
						}
					}
				});

				return false;
			}).on("click.cr", "#cr_same_location", function (e) {
				self.bindLocation();
			}).on("change.cr", "#cr_same_location", function (e) {
				self.bindLocation();
			}).on("change.cr", "#cr_pickup_id", function (e) {
				self.bindLocation();
			}).on("click.cr", "#crBtnQuote", function (e) {
				self.disableButtons();
				pjQ.$.post([self.opts.folder, "index.php?controller=pjFront&action=pjActionCheckWTime"].join(""), pjQ.$('#crFormSearch').serialize()).done(function (data) {
					if(data.status == 'OK')
					{
						self.loadCars.apply(self, [pjQ.$('#crFormSearch').serialize()]);
					}else{
						self.errorHandler(data.text);
						self.enableButtons(self);
					}
				}).fail(function () {
					self.enableButtons(self);
				});
				return false;
			}).on("click.cr", ".crBreadcrumbsEl", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				if(self.step != 5)
				{
					var rel = parseInt(pjQ.$(this).attr('rel'), 10);
					switch (rel) {
						case 1:
							self.loadSearch(1);
							break;
						case 2:
							self.loadCars();
							break;
						case 3:
							self.loadExtras();
							break;
						case 4:
							self.loadCheckout();
							break;
					}
				}else{
					if(rel == 1)
					{
						self.loadSearch(1);
					}
				}

				return false;
			}).on("click.cr", ".crLocaleEl", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				var locale_id = pjQ.$(this).attr('rel');
				self.setLocale(locale_id);
				return false;
			}).on("change.cr", "#crTransmission", function (e) {
				self.loadCars.apply(self, [null, self.type_id, pjQ.$(this).val(), self.col_name, self.direction]);
			}).on("change.cr", ".crTabsSelect", function (e) {
				var rel = pjQ.$('option:selected', this).attr('rel');
				self.loadCars.apply(self, [null, rel, self.transmission]);
			}).on("change.cr", ".crSort", function (e) {
				var rel = pjQ.$('option:selected', this).attr('rel');
				self.loadCars.apply(self, [null, self.type_id, self.transmission, rel.split("|")[0], rel.split("|")[1]]);
			}).on("click.cr", ".crBtnContinue", function (e) {

				if (e && e.preventDefault) {
					e.preventDefault();
				}
				self.type_id = pjQ.$(this).val();
				self.disableButtons();
				self.loadExtras();

				return false;
			}).on("click.cr", ".crChangeDates", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				self.loadSearch(1);
				return false;
			}).on("click.cr", "#crBtnWhen", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				self.loadSearch(1);
				return false;
			}).on("click.cr", "#crBtnCheckout", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				self.disableButtons();
				self.loadCheckout();
				return false;
			}).on("click.cr", "#crBtnConditions", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				pjQ.$('#pjCrTermsModal').modal('show');
				return false;
			}).on("click.cr", "#crBtnChoise", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				self.loadCars();
				return false;
			}).on("click.cr", ".crBtnAdd", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				self.addExtra.apply(self, [pjQ.$(this).val()]);
				return false;
			}).on("click.cr", ".crBtnRemove", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				self.removeExtra.apply(self, [pjQ.$(this).val()]);
				return false;
			}).on("change.cr", ".crSelectSmall", function (e) {
				var id = pjQ.$(this).attr('rel'),
					added = pjQ.$(this).attr('rev');
				if(added == 1)
				{
					self.addExtra.apply(self, [id]);
				}
			}).on("click.cr", "#crBtnBack", function (e) {
				if (e && e.preventDefault) {
					e.preventDefault();
				}
				self.loadExtras();
				return false;
			}).on("change.cr", "select[name='payment_method']", function (e) {
				switch (pjQ.$(this).val()) {
					case 'creditcard':
						pjQ.$('#crCCData').show();
						pjQ.$('#crBankData').hide();
						break;
					case 'bank':
						pjQ.$('#crCCData').hide();
						pjQ.$('#crBankData').show();
						break;
					default:
						pjQ.$('#crCCData').hide();
						pjQ.$('#crBankData').hide();
				}
			}).on('click', '[data-second-driver-toggle]', function (e) {
				var $checkbox = pjQ.$(this);
				var $content = pjQ.$('[data-second-driver]');

				if ($checkbox.prop('checked')) {
					$content.show();
					self.$container.find('input[name="second_driver"]').val(1);
				} else {
					self.$container.find('input[name="second_driver"]').val(0);
					$content.find('input, select').val('');
					$content.hide();
				}
			}).on('change', 'select[name="c_driver_age"], select[name="c_second_driver_age"], [data-second-driver-toggle]', function (e) {
				var $driverAge = pjQ.$('select[name="c_driver_age"]');
				var $secondDriver = pjQ.$('[data-second-driver-toggle]');
				var $secondDriverAge = pjQ.$('select[name="c_second_driver_age"]');

				self.disableButtons.call(self);
				pjQ.$.get([
					self.opts.folder,
					"index.php?controller=pjFront&action=pjActionGetCheckoutPrices",
					"&driver_age=", $driverAge.val(),
					"&second_driver=", (($secondDriver.prop('checked')) ? '1' : '0'),
					"&second_driver_age=", $secondDriverAge.val()
				].join("")).done(function (resp) {
					self.$container.find('[data-text="age_fee"]').html(resp.age_fee_formatted);
					self.$container.find('[data-text="second_driver_fee"]').html(resp.second_driver_fee_formatted);
					self.$container.find('[data-text="sub_total"]').html(resp.sub_total_formatted);
					self.$container.find('[data-text="tax"]').html(resp.tax_formatted);
					self.$container.find('[data-text="tvq"]').html(resp.tvq_formatted);
					self.$container.find('[data-text="total"]').html(resp.total_formatted);
					self.$container.find('[data-text="deposit"]').html(resp.deposit_formatted);
				}).always(function () {
					self.enableButtons.call(self);
				});
			});
		},
		disableButtons: function(){
			var self = this;
			self.$container.find(".btn").each(function (i, el) {
				pjQ.$(el).addClass('disabled').attr('disabled','disabled');
			});
		},
		enableButtons: function(){
			var self = this;
			self.$container.find(".btn").each(function (i, el) {
				pjQ.$(el).removeClass('disabled').removeAttr("disabled");
			});
		},
		bindMenu: function () {
			var self = this;

			self.$container.find(".crBreadcrumbsEl").each(function (i, el) {
				pjQ.$(el).removeAttr("disabled");
				var breadcrumb_rel = parseInt(pjQ.$(el).attr('rel'), 10);
				if(breadcrumb_rel > self.step)
				{
					pjQ.$(el).css('cursor', 'default');
				}else{
					if(self.step == 5 && breadcrumb_rel != 1 && breadcrumb_rel != 5)
					{
						pjQ.$(el).css('cursor', 'default');
					}
				}
			});
		},
		bindLocation: function(){
			var self = this;
			if(pjQ.$('#cr_same_location').is(':checked'))
			{
				pjQ.$('#cr_return_id').val(pjQ.$('#cr_pickup_id').val());
				pjQ.$('#cr_return_id').attr('disabled', 'disabled');
			}else{
				pjQ.$('#cr_return_id').removeAttr('disabled');
			}
		},
		bindSearch: function () {
			var self = this;
			if(pjQ.$('#pjHbCalendarLocale').length > 0)
			{
				moment.updateLocale('en', {
					months : pjQ.$('#pjCrCalendarLocale').data('months').split("_"),
			        weekdaysMin : pjQ.$('#pjCrCalendarLocale').data('days').split("_")
				});
			}
			pjQ.$('.pjCrTimePicker').datetimepicker({
				format: 'LT',
				ignoreReadonly: true,
				allowInputToggle: true
			});
			pjQ.$('.pjCrTimePickerFrom').on('dp.change', function (e) {
				pjQ.$('#cr_hour_from').val(e.date.hour());
				pjQ.$('#cr_minutes_from').val(e.date.minute());
			});
			pjQ.$('.pjCrTimePickerTo').on('dp.change', function (e) {
				pjQ.$('#cr_hour_to').val(e.date.hour());
				pjQ.$('#cr_minutes_to').val(e.date.minute());
			});

			if(pjQ.$('.pjCrDatePickerFrom').length > 0)
			{
				var currentDate = new Date();
				pjQ.$('.pjCrDatePickerFrom').datetimepicker({
					format: self.opts.momentDateFormat.toUpperCase(),
					locale: moment.locale('en'),
					allowInputToggle: true,
					minDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
					ignoreReadonly: true
				});
				pjQ.$('.pjCrDatePickerFrom').on('dp.change', function (e) {
					var toDate = new Date(e.date);
					toDate.setDate(toDate.getDate() + 1);
					var momentDate = new moment(toDate);
					pjQ.$('.pjCrDatePickerTo').datetimepicker().children('input').val(momentDate.format(self.opts.momentDateFormat.toUpperCase()));
					pjQ.$('.pjCrDatePickerTo').data("DateTimePicker").minDate(e.date);
				});
			}
			if(pjQ.$('.pjCrDatePickerTo').length > 0)
			{
				var min_to = pjQ.$('.pjCrDatePickerTo').eq(0).attr('data-min');
				var fromDate = new Date(min_to);
				pjQ.$('.pjCrDatePickerTo').datetimepicker({
					format: self.opts.momentDateFormat.toUpperCase(),
					locale: moment.locale('en'),
					allowInputToggle: true,
					ignoreReadonly: true,
					useCurrent: false,
					minDate: new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())
				});
			}

			if(pjQ.$('#cr_same_location').length > 0 && pjQ.$('#crReturnBox').length > 0)
			{
				self.bindLocation();
			}
			pjQ.$('.modal-dialog').css("z-index", "9999");
		},
		bindCheckout: function () {
			var self = this,
				btnConfirm = document.getElementById("crBtnConfirm");

			pjQ.$('.modal-dialog').css("z-index", "9999");

			$form = pjQ.$("#crContainer").find("form");
			$form.validate({
				onkeyup: false,
				onfocusout: function(element) {
			        var $el = pjQ.$(element);
			        $el.valid();
			    },
				errorElement: 'li',
				errorPlacement: function (error, element) {
					if(element.attr('name') == 'c_agree')
					{
						element.parent().parent().parent().addClass('has-error');
						error.appendTo(element.parent().next().find('ul'));
					}else{
						element.parent().addClass('has-error');
						error.appendTo(element.next().find('ul'));
					}
				},
				highlight: function(ele, errorClass, validClass) {
	            	var element = pjQ.$(ele);
	            	if(element.attr('name') == 'c_agree')
					{
						element.parent().parent().parent().addClass('has-error');
					}else{
						element.parent().addClass('has-error');
					}
	            },
	            unhighlight: function(ele, errorClass, validClass) {
	            	var element = pjQ.$(ele);
	            	if(element.attr('name') == 'c_agree')
					{
						element.parent().parent().parent().removeClass('has-error').addClass('has-success');
					}else{
						element.parent().removeClass('has-error').addClass('has-success');
					}
	            },
	            submitHandler: function(form){
	            	self.disableButtons();
	            	pjQ.$.post([self.opts.folder, "index.php?controller=pjFront&action=pjActionBookingSave", "&session_id=", self.opts.session_id].join(""), $form.serialize()).done(function (data) {
						switch (data.code) {
							case 100:
								self.errorHandler('\n' + self.opts.message_4);
								self.enableButtons();
								break;
							case 200:
								self.loadFinal(data);
								break;
						}
					});
					return false;
			    }
			});

		},
		bindFinal: function(data)
		{
			var self = this;
			if(data.payment == 'paypal')
			{
				if (typeof document.forms['crPaypal'] != 'undefined') {
					document.forms['crPaypal'].submit();
				}
			}else if(data.payment == 'authorize'){
				if (typeof document.forms['crAuthorize'] != 'undefined') {
					document.forms['crAuthorize'].submit();
				}
			}else{
				var btnStartOver = document.getElementById("crBtnStartOver");
				btnStartOver.onclick = function () {
					self.loadSearch(0);
				};
			}
		},
		loadFinal: function(data)
		{
			var self = this;
			var params = "&session_id=" + self.opts.session_id + "&booking_id=" + data.booking_id;
			if(self.opts.pjLang > 0)
			{
				params += "&pjLang=" + self.opts.pjLang;
			}
			pjQ.$.get([self.opts.folder, "index.php?controller=pjFront&action=pjActionLoadFinal", params].join("")).done(function (resp) {
				self.container.innerHTML = resp;
				self.bindFinal(data);
				self.step = 5;
				self.bindMenu();
			});
			self.current = "loadFinal";
		},
		loadSearch: function (index) {
			var self = this;
			var params = "&session_id=" + self.opts.session_id + "&index=" + index;
			if(self.opts.pjLang > 0)
			{
				params += "&pjLang=" + self.opts.pjLang;
			}
			pjQ.$.get([self.opts.folder, "index.php?controller=pjFront&action=pjActionLoadSearch", params].join("")).done(function (data) {
				self.container.innerHTML = data;
				self.bindSearch();
				self.step = 1;
				self.bindMenu();
			});
			self.current = "loadSearch";
		},
		loadCars: function () {
			var self = this,
				post = typeof arguments[0] != "undefined" ? arguments[0] : null,
				qs = "";
			qs += "&session_id=" + self.opts.session_id;
			if (typeof arguments[1] != "undefined") {
				self.type_id = arguments[1];
			} else {
				self.type_id = "all";
			}
			qs += "&type_id=" + self.type_id;
			if (typeof arguments[2] != "undefined") {
				self.transmission = arguments[2];
			} else {
				self.transmission = "";
			}
			qs += "&transmission=" + self.transmission;
			if (typeof arguments[3] != "undefined") {
				self.col_name = arguments[3];
			} else {
				self.col_name = "total_price";
			}
			qs += "&col_name=" + self.col_name;
			if (typeof arguments[4] != "undefined") {
				self.direction = arguments[4];
			} else {
				self.direction = "asc";
			}
			qs += "&direction=" + self.direction;
			if(self.opts.pjLang > 0)
			{
				qs += "&pjLang=" + self.opts.pjLang;
			}
			pjQ.$.post([self.opts.folder, "index.php?controller=pjFront&action=pjActionLoadCars", qs].join(""), post).done(function (data) {
				self.container.innerHTML = data;
				self.step = 2;
				self.bindMenu();
			});

			if (fancybox) {
				pjQ.$('body').on('click', '[data-show-gallery]', function (e) {
					var galleryId = pjQ.$(this).attr('data-show-gallery');
					var gallery = self.$container.find('[data-gallery="'+galleryId+'"]');

					gallery.find('a').fancybox();
					gallery.find('a:first').trigger('click');
				});
			}

			self.current = "loadCars";
		},
		loadExtras: function () {

			var self = this,
				qs = "&session_id=" + self.opts.session_id + "&type_id=" + self.type_id;
			if(self.opts.pjLang > 0)
			{
				qs += "&pjLang=" + self.opts.pjLang;
			}
			pjQ.$.get([self.opts.folder, "index.php?controller=pjFront&action=pjActionLoadExtras", qs].join("")).done(function (data) {
				self.container.innerHTML = data;
				pjQ.$('.modal-dialog').css("z-index", "9999");
				self.step = 3;
				self.bindMenu();
			});

			self.current = "loadExtras";

		},
		loadCheckout: function () {
			var self = this,
				qs = "&session_id=" + self.opts.session_id;
			if(self.opts.pjLang > 0)
			{
				qs += "&pjLang=" + self.opts.pjLang;
			}
			pjQ.$.get([self.opts.folder, "index.php?controller=pjFront&action=pjActionLoadCheckout", qs].join("")).done(function (data) {
				self.container.innerHTML = data;
				self.bindCheckout();
				self.step = 4;
				self.bindMenu();
			});
			self.current = "loadCheckout";
		},
		addExtra: function (extra_id) {
			var self = this;
			self.disableButtons();

			pjQ.$.post([self.opts.folder, "index.php?controller=pjFront&action=pjActionAddExtra", "&session_id=", self.opts.session_id, "&extra_id=", extra_id].join(""), pjQ.$('#crFormExtras').serialize()).done(function (data) {
				self.loadExtras();
			});
			return self;
		},
		removeExtra: function (extra_id) {
			var self = this;
			self.disableButtons();
			pjQ.$.get([self.opts.folder, "index.php?controller=pjFront&action=pjActionRemoveExtra", "&session_id=", self.opts.session_id, "&extra_id=", extra_id].join("")).done(function (data) {
				self.loadExtras();
			});
			return self;
		},
		setLocale: function (locale) {
			var self = this;
			pjQ.$.get([self.opts.folder, "index.php?controller=pjFront&action=pjActionSetLocale", "&session_id=", self.opts.session_id, "&locale=", locale].join("")).done(function (data) {
				switch (self.current) {
					case 'loadSearch':
						self.loadSearch(1);
						break;
					case 'loadCars':
						self.loadCars();
						break;
					case 'loadExtras':
						self.loadExtras();
						break;
					case 'loadCheckout':
						self.loadCheckout();
						break;
					case 'loadFinal':
						self.loadSearch(1);
						break;
				}
				if (window.myCR) {
					window.myCR.opts = data;
				}
			});
		},
		errorHandler: function (message) {
			if(pjQ.$('.crError').length > 0)
			{
				pjQ.$('.crError').html(message.replace(/\n/g, "<br />")).show();
				setTimeout(function() {
					pjQ.$('.crError').fadeOut();
    			}, 3000 );
			}else{
				alert(message);
			}
		}
	};
	return (window.CR = CR);
})(window);
