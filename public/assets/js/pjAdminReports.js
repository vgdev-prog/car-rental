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
			var booking_payment_status = '';
			if (typeof $("#booking_payment_status").find("option:selected").val() === "string"){
				booking_payment_status = $("#booking_payment_status").find("option:selected").val();
			}
			var bill_for_insurance = '';
			if (typeof $("#bill_for_insurance").find("option:selected").val() === "string"){
				bill_for_insurance = $("#bill_for_insurance").find("option:selected").val();
			}

			var location_ids = $(':checkbox:checked').map(function(){return this.value;}).get().toString();

			console.log(location_ids)
			var $grid = $("#grid").datagrid({
				columns: [
					// {text: myLabel.c_title, type: "text", sortable: true, editable: false},
					{text: myLabel.name, type: "text", sortable: true, editable: false},
					{text: myLabel.contract_count, type: "text", sortable: true, editable: false},
					{text: myLabel.ave_day_per_contract, type: "text", sortable: true, editable: false},
					{text: myLabel.ave_rate_per_contract, type: "text", sortable: true, editable: false},
					{text: myLabel.ave_rate_per_day, type: "text", sortable: true, editable: false},
					{text: myLabel.total, type: "text", sortable: true, editable: false},
					{text: myLabel.days_rented, type: "text", sortable: true, editable: false},
					{text: myLabel.total_days_available, type: "text", sortable: true, editable: false},
					{text: myLabel.utilization_rate, type: "text", sortable: true, editable: false},
					{text: myLabel.maintenance, type: "text", sortable: true, editable: false},
				],
				dataUrl: 'index.php?controller=pjAdminReports&action=pjActionCarsReport&date_from='+$(".datepick[name='date_from']").val()+'&date_to='+$(".datepick[name='date_to']").val()+'&car_id='+$("#car_id option:selected").val()+'&booking_payment_status='+booking_payment_status+'&bill_for_insurance='+bill_for_insurance+'&location_id='+location_ids,
				dataType: "json",
				fields: ['name','contract_count','ave_day_per_contract','ave_rate_per_contract','ave_rate_per_day','total','days_rented','total_days_available','utilization_rate','maintenance'],
				paginator: {
					gotoPage: true,
					paginate: true,
					total: true,
					rowCount: true
				},
			});
		}

		$(document).on("submit", ".frm-filter", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			var $this = $(this),
				content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache");
			var location_ids = $(':checkbox:checked').map(function(){return this.value;}).get().toString();
			$.extend(cache, {
				date_from: $(".datepick[name='date_from']").val(),
				date_to: $(".datepick[name='date_to']").val(),
				car_id: $("#car_id option:selected").val(),
				booking_payment_status: $('#booking_payment_status').find("option:selected").val(),
				bill_for_insurance: $('#bill_for_insurance').find("option:selected").val(),
				location_ids: $(':checkbox:checked').map(function(){return this.value;}).get().toString(),
				page: content.page,
			});
			$.cookie('selectedPaginationOptions', JSON.stringify(cache));
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminReports&action=pjActionCarsReport", "id", "ASC", content.page, content.rowCount);
			return false;
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
		}).on("click", ".export-excel, .export-pdf", function (e) {
			let date_from = $(".datepick[name='date_from']").val(),
				date_to = $(".datepick[name='date_to']").val(),
				car_id = $("#car_id option:selected").val(),
				booking_payment_status = $('#booking_payment_status').find("option:selected").val(),
				bill_for_insurance = $('#bill_for_insurance').find("option:selected").val(),
				location_ids = $(':checkbox:checked').map(function(){return this.value;}).get().toString();
				export_type = $(this).attr('id');
			$.get(
				'index.php?controller=pjAdminReports&action=pjActionCarsReport',
				{
					date_from: date_from,
					date_to: date_to,
					booking_payment_status: booking_payment_status,
					bill_for_insurance: bill_for_insurance,
					car_id: car_id,
					location_id: location_ids,
					rowCount: 100000,
					page: 1,
				},
				function (data) {
					let arrObj={};
					$.each(data.data, function(key, value) {
						arrObj[key] = {
							name: value.name,
							contract_count: value.contract_count,
							ave_day_per_contract: value.ave_day_per_contract,
							ave_rate_per_contract: value.ave_rate_per_contract,
							ave_rate_per_day: value.ave_rate_per_day,
							total: value.total,
							days_rented: value.days_rented,
							total_days_available: value.total_days_available,
							utilization_rate: value.utilization_rate,
							maintenance: value.maintenance,
						};
					});
					let postData = JSON.stringify(arrObj);

					if(export_type === 'export-excel'){
						$.ajax({
							url: 'index.php?controller=pjAdminReports&action=pjActionCarsReportExport',
							type: 'POST',
							data: {
								data: postData
							},
							success: function(data) {
								$.redirect(data.filename, {}, 'GET');
							}
						});
					} else {
						$.redirect(
							'index.php?controller=pjAppController&action=pjActionCarsReportPdf',
							{
								data: postData
							},
							'POST',
							"_blank"
						);
					}

				});
			return false;
		});
	});
	
})(jQuery_1_8_2);