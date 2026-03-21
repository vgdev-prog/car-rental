var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {
		var $frmGenerateReport = $("#frmGenerateReport");
		var validate = ($.fn.validate !== undefined),
			datagrid = ($.fn.datagrid !== undefined);

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
					// {text: myLabel.c_title, type: "text", sortable: true, editable: false},
					{text: myLabel.name, type: "text", sortable: true, editable: false},
					{text: myLabel.contract_count, type: "text", sortable: true, editable: false},
					{text: myLabel.ave_day_per_contract, type: "text", sortable: true, editable: false},
					{text: myLabel.ave_rate_per_contract, type: "text", sortable: true, editable: false},
					{text: myLabel.total, type: "text", sortable: true, editable: false},
					{text: myLabel.days_rented, type: "text", sortable: true, editable: false},
					{text: myLabel.total_days_available, type: "text", sortable: true, editable: false},
					{text: myLabel.utilization_rate, type: "text", sortable: true, editable: false},
					{text: myLabel.maintenance, type: "text", sortable: true, editable: false},
					// {text: myLabel.phone, type: "text", sortable: true, editable: false},
					// {text: myLabel.driver_licence_number, type: "text", sortable: false, editable: true}
				],
				dataUrl: 'index.php?controller=pjAdminReports&action=pjActionCarsReport&category=true&date_from='+$(".datepick[name='date_from']").val()+'&date_to='+$(".datepick[name='date_to']").val()+'&booking_payment_status='+$("#booking_payment_status").find("option:selected").val()+'&bill_for_insurance='+$("#bill_for_insurance").find("option:selected").val()+'&location_id='+$("#location_id").find("option:selected").val(),
				dataType: "json",
				fields: ['name','contract_count','ave_day_per_contract','ave_rate_per_contract','total','days_rented','total_days_available','utilization_rate','maintenance'],
				paginator: false,
			});
		}

		$(document).on("submit", ".frm-filter", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			var $this = $(this),
				content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache");
			$.extend(cache, {
				q: $this.find("input[name='q']").val()
			});
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminReports&action=pjActionCarsReport&category=true", "id", "ASC", content.page, content.rowCount);
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
		});
	});
	
})(jQuery_1_8_2);