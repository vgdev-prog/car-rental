var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {
		var $frmGenerateReport = $("#frmGenerateReport");
		var validate = ($.fn.validate !== undefined),
			chosen = ($.fn.chosen !== undefined),
			datagrid = ($.fn.datagrid !== undefined);
		if (chosen) {
			$("#car_id").chosen();
		}
		if ($frmGenerateReport.length > 0 && validate) {
			$frmGenerateReport.validate({
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}

		if ($("#grid").length > 0 && datagrid) {
			var $grid = $("#grid").datagrid({
				columns: [
					{text: myLabel.booking_id, type: "text", sortable: false, editable: false, width: 50 },
					{text: myLabel.amount, type: "text", sortable: true, editable: false, width: 90},
					{text: myLabel.payment_datetime, type: "text", sortable: true, editable: false, width: 90},
				],
				dataUrl: 'index.php?controller=pjAdminReports&action=pjActionPaymentReportData',
				dataType: "json",
				fields: ['booking_id','amount', 'payment_datetime'],
				paginator: {
					gotoPage: true,
					paginate: true,
					total: true,
					rowCount: true
				},
			});
		}

		$(document).on("submit", ".pj-availability-form", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			var content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache");
			$.extend(cache, {
				date_from: $(".datepick[name='date_from']").val(),
				date_to: $(".datepick[name='date_to']").val(),
				booking_payment_status: $('#booking_payment_status').find("option:selected").val(),
				location_id: $('#location_id').find("option:selected").val(),
				page: content.page,
			});
			$.cookie('selectedPaginationOptions', JSON.stringify(cache));
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", 'index.php?controller=pjAdminReports&action=pjActionPaymentReportData', "created", "DESC", content.page, content.rowCount);
			return false;
		}).on("click", ".export-excel", function (e) {
			let date_from = $(".datepick[name='date_from']").val(),
				date_to = $(".datepick[name='date_to']").val(),
				booking_payment_status = $('#booking_payment_status').find("option:selected").val(),
				location_id = $('#location_id').find("option:selected").val(),
				export_type = $(this).attr('id');
			$.get(
				'index.php?controller=pjAdminReports&action=pjActionPaymentReportData',
				{
					date_from: date_from,
					date_to: date_to,
					location_id: location_id,
					rowCount: 100000,
					page: 1,
				},
				function (data) {
					let arrObj={};
					$.each(data.data, function(key, value) {
						arrObj[key] = {
							booking_id: value.booking_id,
							amount: value.amount,
							payment_datetime: value.payment_datetime,
						};
					});
					let postData = JSON.stringify(arrObj);

					if(export_type === 'export-excel'){
						$.ajax({
							url: 'index.php?controller=pjAdminReports&action=pjActionPaymentReportExport',
							type: 'POST',
							data: {
								data: postData
							},
							success: function(data) {
								$.redirect(data.filename);
							}
						}).done(function(response){});
					}

				});
			return false;
		}).on("focusin", "#pickup_from, #pickup_to, #return_from, #return_to", function (e) {
			$(this).datepicker({
				firstDay: $(this).attr('rel'),
				dateFormat: $(this).attr('rev'),
				onSelect: function (dateText, inst) {
				}
			});

		}).on("focusin", ".datepick", function (e) {

			var minDate, maxDate,
				$this = $(this),
				custom = {},
				o = {
					firstDay: $this.attr("rel"),
					dateFormat: $this.attr("rev")
				};

			switch ($this.attr("name")) {
				case "date_from":
					if($(".datepick[name='date_to']").val() != '')
					{
						maxDate = $(".datepick[name='date_to']").datepicker({
							firstDay: $this.attr("rel"),
							dateFormat: $this.attr("rev")
						}).datepicker("getDate");
						$(".datepick[name='date_to']").datepicker("destroy").removeAttr("id");
						if (maxDate !== null) {
							custom.maxDate = maxDate;
						}
					}
					break;
				case "date_to":
					if($(".datetimepick[name='event_start_ts']").val() != '')
					{
						minDate = $(".datepick[name='date_from']").datepicker({
							firstDay: $this.attr("rel"),
							dateFormat: $this.attr("rev")
						}).datepicker("getDate");
						$(".datepick[name='date_from']").datepicker("destroy").removeAttr("id");
						if (minDate !== null) {
							custom.minDate = minDate;
						}
					}
					break;
			}

			$(this).datepicker($.extend(o, custom));

		}).on("click", ".pj-form-field-icon-date", function (e) {
			var $dp = $(this).parent().siblings("input[type='text']");
			if ($dp.hasClass("hasDatepicker")) {
				$dp.datepicker("show");
			} else {
				$dp.trigger("focusin").datepicker("show");
			}
		}).on("change", "#location_id", function (e) {
			$("option:selected", this).attr('selected','selected');
		});
	});

})(jQuery_1_8_2);