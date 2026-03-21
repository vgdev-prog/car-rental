var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {
		initChosen();
		initFormValidation();
		initGrid();
		initEventHandlers();
	});

	function initChosen() {
		if ($.fn.chosen !== undefined) {
			$("#car_id").chosen();
		}
	}

	function initFormValidation() {
		var $form = $("#frmGenerateReport");
		if ($form.length > 0 && $.fn.validate !== undefined) {
			$form.validate({
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}
	}

	function formatCar(val, obj) {
		if (pjGrid.isEditor === true) return val;
		return `<a href="index.php?controller=pjAdminCars&action=pjActionUpdate&id=${obj.car_id}">${val}</a>`;
	}

	function formatClient(val, obj) {
		if (pjGrid.isEditor === true) return val;
		return `<a href="index.php?controller=pjAdminCustomers&action=pjActionGetCustomerInfo&id=${obj.customer_id}">${val}</a>`;
	}

	function initGrid() {
		if ($("#grid").length === 0 || $.fn.datagrid === undefined) return;
		const date_from = $("input[name='date_from']").val()
		const date_to =  $("input[name='date_to']").val();

		window.$grid = $("#grid").datagrid({
			columns: getGridColumns(),
			dataUrl: `index.php?controller=pjAdminReports&action=pjActionSalesReportData&date_from=${date_from}&date_to=${date_to}`,
			dataType: "json",
			fields: ['booking_id','car_info', 'client', 'total_price', 'location_name', 'total_for_period', 'payment_made','status','booking_payment_status'],
			paginator: {
				gotoPage: true,
				paginate: true,
				total: true,
				rowCount: true
			},
			saveUrl: "index.php?controller=pjAdminBookings&action=pjActionSave&id={:id}",
		});
	}

	function getGridColumns() {
		return [
			{text: myLabel.booking_id, type: "text", sortable: false, editable: false, width: 50 },
			{text: myLabel.booking_car, type: "text", sortable: false, editable: false, width: 120, renderer: formatCar},
			{text: myLabel.booking_client, type: "text", sortable: false, editable: false, width: 100, renderer: formatClient},
			{text: myLabel.booking_total, type: "text", sortable: true, editable: false, width: 90},
			{text: myLabel.location_name, type: "text", sortable: false, editable: false, width: 60},
			{text: myLabel.total_for_period, type: "text", sortable: false, editable: false, width: 60},
			{text: myLabel.payment_made, type: "text", sortable: false, editable: false, width: 60},
			{text: myLabel.status, type: "select", sortable: true, editable: true, width: 80, options: [
					{label: myLabel.pending, value: "pending"},
					{label: myLabel.collected, value: "collected"},
					{label: myLabel.completed, value: "completed"}
				], applyClass: "pj-status"},
			{text: myLabel.booking_payment_status, type: "select", sortable: false, editable: true, width: 30, options: [
					{label: myLabel.notpaid, value: "notpaid"},
					{label: myLabel.paid, value: "paid"},
					{label: myLabel.promo, value: "promo"}
				], applyClass: "pj-booking-payment-status"},
		];
	}

	function initEventHandlers() {
		$(document)
				.on("submit", ".pj-availability-form", onAvailabilityFormSubmit)
				.on("focusin", ".datepick", onDatepickFocus)
				.on("click", ".pj-form-field-icon-date", onDateIconClick)
				.on("change", "#location_id", function () {
					$("option:selected", this).attr('selected', 'selected');
				});
	}

	function onAvailabilityFormSubmit(e) {
		e.preventDefault();

		var content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache");
		$.extend(cache, {
			date_from: $(".datepick[name='date_from']").val(),
			date_to: $(".datepick[name='date_to']").val(),
			booking_payment_status: $('#booking_payment_status').val(),
			pj_payment_due: $('#pj_payment_due').val(),
			location_id: $('#location_id').val(),
			page: content.page,
		});



		$.cookie('selectedPaginationOptions', JSON.stringify(cache));
		$grid.datagrid("option", "cache", cache);
		$grid.datagrid("load", 'index.php?controller=pjAdminReports&action=pjActionSalesReportData', "created", "DESC", content.page, content.rowCount);
	}

	function onDatepickFocus() {
		var $this = $(this);
		var name = $this.attr("name");
		var rel = parseInt($this.attr("rel")) || 1;
		var rev = $this.attr("rev") || "yy-mm-dd";

		var custom = {};
		var options = {
			firstDay: rel,
			dateFormat: rev
		};

		switch (name) {
			case "date_from":
				const toPicker = $(".datepick[name='date_to']");
				const toDate = toPicker.datepicker("getDate");
				if (toDate) {
					custom.maxDate = toDate;
				}
				break;

			case "date_to":
				const fromPicker = $(".datepick[name='date_from']");
				const fromDate = fromPicker.datepicker("getDate");
				if (fromDate) {
					custom.minDate = fromDate;
				}
				break;
		}

		$this.datepicker($.extend(options, custom));
	}


	function onDateIconClick() {
		var $input = $(this).parent().siblings("input[type='text']");
		if ($input.hasClass("hasDatepicker")) {
			$input.datepicker("show");
		} else {
			$input.trigger("focusin").datepicker("show");
		}
	}

})(jQuery_1_8_2);