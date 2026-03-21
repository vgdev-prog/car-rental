var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {
		var $frmCreate = $("#frmCreate"),
			$frmUpdate = $("#frmUpdate"),
			validate = ($.fn.validate !== undefined),
			datagrid = ($.fn.datagrid !== undefined);
		
		if ($frmCreate.length > 0 && validate) {
			$frmCreate.validate({
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}
		if ($frmUpdate.length > 0 && validate) {
			$frmUpdate.validate({
				
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}
		
		$(".digits").spinner({
			min: 0
		});
		
		if ($("#grid").length > 0 && datagrid) {

			var $grid = $("#grid").datagrid({
				columns: [
						  {text: myLabel.booking_id, type: "text", sortable: true, editable: false},
						  {text: myLabel.user_name, type: "text", sortable: true, editable: false},
						  {text: myLabel.old_customer, type: "text", sortable: false, editable: false},
						  {text: myLabel.new_customer, type: "text", sortable: false, editable: false},
				          ],
				dataUrl: "index.php?controller=pjAdminBookingChangingCustomers&action=pjActionGet",
				dataType: "json",
				fields: ['booking',  'user_name' ,'old_customer','new_customer'],
				paginator: {
					gotoPage: true,
					paginate: true,
					total: true,
					rowCount: true
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
				status: "",
				q: ""
			});
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminBookingChangingCustomers&action=pjActionGet", "name", "ASC", content.page, content.rowCount);
			return false;
		}).on("submit", ".frm-filter", function (e) {
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
			$grid.datagrid("load", "index.php?controller=pjAdminBookingChangingCustomers&action=pjActionGet", "id", "ASC", content.page, content.rowCount);
			return false;
		});
	});
})(jQuery_1_8_2);