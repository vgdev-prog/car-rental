var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {
		"use strict";
		var datepicker = ($.fn.datepicker !== undefined),
			validate = ($.fn.validate !== undefined),
			datagrid = ($.fn.datagrid !== undefined),
			qs = "",
			$frmDefaultWTime = $('#frmDefaultWTime'),
			$frmTimeCustom = $("#frmTimeCustom");
		
		if ($frmDefaultWTime.length > 0 && validate) {
			$frmDefaultWTime.validate({
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em",
				submitHandler: function (form){
					$('.pj-timepicker').removeClass("err");
					$.post("index.php?controller=pjAdminTime&action=pjActionCheckTime", $(form).serialize()).done(function (data) {
						if(data.code == '200')
						{
							form.submit();
						}else{
							for(var i = 0; i < data.invalid_weekdays.length; i++)
							{
								$("input[name='"+data.invalid_weekdays[i]+"']").addClass("err");
							}
						}
					});
					return false;
				}
			});
		}
		if ($frmTimeCustom.length > 0 && validate) {
			$frmTimeCustom.validate({
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}
		
		$('.pj-timepicker ').timepicker({
			showPeriod: myLabel.showperiod
		});
		
		$("#content").on("click", ".working_day", function () {
			var checked = $(this).is(":checked"),
				$tr = $(this).closest("tr");
			$tr.find("select").attr("disabled", checked);
		}).on("focusin", ".datepick", function () {
			if (datepicker) {
				var $this = $(this);
				$this.datepicker({
					monthNames: myLabel.monthNames,
					dayNamesMin: myLabel.dayNamesMin,
					firstDay: $this.attr("rel"),
					dateFormat: $this.attr("rev")
				});
			}
		}).on("click", ".working_day", function () {
			var $this = $(this),
				$tr = $this.closest("tr"),
				day = $tr.attr('data-day');
			if ($this.is(":checked")) {
				$('.tsWorkingDay_' + day).hide();
			} else {
				$('.tsWorkingDay_' + day).show();
			}
		}).on("change", "input[name='is_dayoff']", function () {
			var $this = $(this),
				$form = $this.closest("form");
			if ($this.is(":checked")) {
				$form.find(".business").hide();
			} else {
				$form.find(".business").show();
			}
		});
		
		if ($("#grid").length > 0 && datagrid) {
			
			var $grid = $("#grid").datagrid({
				buttons: [{type: "edit", url: "index.php?controller=pjAdminTime&action=pjActionUpdateCustom&id={:id}"},
				          {type: "delete", url: "index.php?controller=pjAdminTime&action=pjActionDeleteDate&id={:id}"}
				          ],
				columns: [{text: myLabel.time_date, type: "text", sortable: true, editable: false, width: 100},
				          {text: myLabel.time_start, type: "text", sortable: true, editable: false, width: 100},
				          {text: myLabel.time_end, type: "text", sortable: true, editable: false, width: 100},
				          {text: myLabel.time_dayoff, type: "select", sortable: true, editable: false, options: [
			     				       {label: myLabel.time_yesno.T, value: 'T'}, 
			     				       {label: myLabel.time_yesno.F, value: 'F'}
			     				       ], applyClass: "pj-status"}],
				dataUrl: "index.php?controller=pjAdminTime&action=pjActionGetDate" + pjGrid.queryString,
				dataType: "json",
				fields: ['date', 'start_time', 'end_time', 'is_dayoff'],
				paginator: {
					actions: [
					   {text: myLabel.delete_selected, url: "index.php?controller=pjAdminTime&action=pjActionDeleteDateBulk", render: true, confirmation: myLabel.delete_confirmation}
					],
					gotoPage: true,
					paginate: true,
					total: true,
					rowCount: true
				},
				saveUrl: "index.php?controller=pjAdminTime&action=pjActionSaveDate&id={:id}",
				select: {
					field: "id",
					name: "record[]"
				}
			});
		}
		
		$(document).on("click", ".btn-all", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			$(this).addClass("pj-button-active").siblings(".pj-button").removeClass("pj-button-active");
			var content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache");
			$.extend(cache, {
				"is_dayoff": ""
			});
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminTime&action=pjActionGetDate" + pjGrid.queryString, "date", "ASC", content.page, content.rowCount);
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
			obj.is_dayoff = "";
			obj[$this.data("column")] = $this.data("value");
			$.extend(cache, obj);
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminTime&action=pjActionGetDate" + pjGrid.queryString, "date", "ASC", content.page, content.rowCount);
			return false;
		});
	});
})(jQuery_1_8_2);