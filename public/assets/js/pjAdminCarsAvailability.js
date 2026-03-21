var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	// Cars aviability calendar tab
	$(function () {

		$("#location, #car_type").chosen({width: "100%"});
		$(".chosen-select").chosen({disable_search_threshold: 10});

		var calendarEl = document.getElementById('calendar');
		var calendar = new FullCalendar.Calendar(calendarEl, {
			dayMaxEventRows: true, // for all non-TimeGrid views
			views: {
				timeGrid: {
					dayMaxEventRows: 6 // adjust to 6 only for timeGridWeek/timeGridDay
				}
			},
			initialView: 'dayGridMonth',
			events: {
				url: 'index.php',
				method: 'GET',
				extraParams: function(){
					let params = {
						controller: 'pjAdminCars',
						action: 'pjActionGetAvailability'
					};

					['filter', 'car_ids', 'location', 'car_type', 'date_from', 'date_to'].forEach(function(item){
						let val = $('#' + item).val();
						if (val) {
							params[item] = val;
						}
					})

					return params;
				},
				failure: function() {
					alert('There was an error while fetching events!\nPlease try again later.');
				},
			},
		});
		calendar.render();

		let initCalls = [
			{
				url: "index.php?controller=pjAdminCars&action=pjActionGetCars",
				el: $('#car_ids'),
			},
			{
				url: "index.php?controller=pjAdminLocations&action=pjActionGetAll",
				el: $('#location'),
			},
			{
				url: "index.php?controller=pjAdminCars&action=pjActionGetCarTypes",
				el: $('#car_type')
			}
		];

		initCalls.forEach(function(item){
			$.ajax({
				url: item.url,
				processData: false,
				contentType: false,
				type: 'POST',
				success: function (data) {
					if (typeof data !== 'object') {
						throw new Error('Wrong response object.');
					}

					let el = item.el;

					el.find('option').each(function (i, el) {
						$el = $(el);
						if ($el.val() != '') {
							$el.remove();
						}
					});

					if (data.data) {
						data = data.data;
					}

					data.forEach(function (item) {
						el.append($('<option>', {
							value: item.id,
							text: item.name
						}));
					});

					el.trigger("chosen:updated");
				}
			});
		});

		$('#location, #car_ids, #car_type').change(function(e){
			calendar.refetchEvents();
		});

		$(document).on("focusin", "#date_from, #date_to", function (e) {
			$(this).datepicker({
				firstDay: $(this).attr('rel'),
				dateFormat: $(this).attr('rev'),
				onSelect: function (dateText, inst) {
					calendar.refetchEvents();
				}
			});
		});

		$(document).on("click", ".pj-button-detailed, .pj-button-detailed-arrow", function (e) {
			e.stopPropagation();
			$(".pj-form-filter-advanced").toggle();
		});

		$(document).on('click', 'input[type=reset]', function (e){
			$("#location, #car_type, #date_from, #date_to").val('').trigger("chosen:updated");
			calendar.refetchEvents();
		})

		$(document).on('click', '.frm-filter-advanced input[type=submit]', function(e) {
			calendar.refetchEvents();
		})

		$(document).on("click", ".btn-filter", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}

			let $this = $(this)
			$("#filter").val($this.data("value"));
			calendar.refetchEvents();

			return false;
		});

	});

})(jQuery_1_8_2);