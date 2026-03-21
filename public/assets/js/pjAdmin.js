var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {

		var $frmLoginAdmin = $("#frmLoginAdmin"),
			$frmForgotAdmin = $("#frmForgotAdmin"),
			$frmUpdateProfile = $("#frmUpdateProfile"),
			$frmCreateNote = $("#frmCreateNote"),
			$availCarToday = $("#availCarToday"),
			$garageCarToday = $("#garageCarToday"),
			$promoCarToday = $("#promoCarToday"),
			$addGeneralNote = $("#addGeneralNote"),
			$addInsuranceNote = $("#addInsuranceNote"),
			dialog = ($.fn.dialog !== undefined),
			garageCarDialog = ($.fn.dialog !== undefined),
			promoCarDialog = ($.fn.dialog !== undefined),
			addGeneralNoteDialog = ($.fn.dialog !== undefined),
			addInsuranceDialog = ($.fn.dialog !== undefined),
			validate = ($.fn.validate !== undefined);
		if ($availCarToday.length > 0 && dialog) {
			$availCarToday.dialog({
				width: 400,
				modal: true,
				autoOpen: false,
				resizable: true,
				draggable: false,
				buttons: [
					{
						text: "Export",
						icon: "ui-icon-help",
						click: function( e ) {
							$.ajax({
								url: 'index.php?controller=pjAdmin&action=pjActionExportAvailableCars',
								type: 'POST',
								success: function(data) {
									window.location.replace(data.filename);
								}
							}).done(function(response){});
						}
					}
				],
				create: function( event, ui ) {
					$('.ui-dialog-buttonset').prependTo('.ui-dialog-titlebar');
				}
			});
		}
		if ($garageCarToday.length > 0 && garageCarDialog) {
			$garageCarToday.dialog({
				width: 400,
				modal: true,
				autoOpen: false,
				resizable: true,
				draggable: false,
			});
		}
		if ($promoCarToday.length > 0 && promoCarDialog) {
			$promoCarToday.dialog({
				width: 400,
				modal: true,
				autoOpen: false,
				resizable: true,
				draggable: false,
			});
		}
		$addGeneralNote.dialog({
			width: 400,
			modal: true,
			autoOpen: false,
			resizable: true,
			draggable: false,
		});
		if ($addInsuranceNote.length > 0 && addInsuranceDialog) {
			$addInsuranceNote.dialog({
				width: 400,
				modal: true,
				autoOpen: false,
				resizable: true,
				draggable: false,
			});
		}
		if ($frmLoginAdmin.length > 0 && validate) {
			$frmLoginAdmin.validate({
				rules: {
					login_email: {
						required: true,
						email: true
					},
					login_password: "required"
				},
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}

		if ($frmForgotAdmin.length > 0 && validate) {
			$frmForgotAdmin.validate({
				rules: {
					forgot_email: {
						required: true,
						email: true
					}
				},
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}

		if ($frmUpdateProfile.length > 0 && validate) {
			$frmUpdateProfile.validate({
				rules: {
					"email": {
						required: true,
						email: true
					},
					"password": "required",
					"name": "required"
				},
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}
		if ($frmCreateNote.length > 0 && validate) {
			$frmCreateNote.validate({
				rules: {
				},
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}

		try {
			var crCheckbox = JSON.parse($.cookie('crCheckbox'));
			if (typeof crCheckbox !== 'object') {
				throw new Error("Parameter is not an array!");
			}
		} catch (e) {
			var crCheckbox = {};
			$.cookie('crCheckbox', JSON.stringify(crCheckbox));
		}

		for (const [key, value] of Object.entries(crCheckbox)) {
			$('#' + key).prop("checked", value);
		}

		$(document).on("click", ".crCheckbox > label", function (e) {
			try {
				var crCheckbox = JSON.parse($.cookie('crCheckbox'));
				if (typeof crCheckbox !== 'object') {
					throw new Error("Parameter is not an array!");
				}
			}
			catch (e) {
				var crCheckbox = {};
				$.cookie('crCheckbox', JSON.stringify(crCheckbox));
			}
			let id = $(this).attr('for');
			crCheckbox[id] = !$('#' + id).prop('checked');
			$.cookie('crCheckbox',  JSON.stringify(crCheckbox));
		}).on("click", ".cnt_avail_today", function (e) {

			if (e && e.preventDefault) {
				e.preventDefault();
			}
			if ($availCarToday.length > 0 && dialog) {
				$availCarToday.data('link', $(this)).dialog("open");
			}
			return false;
		}).on("click", ".cnt_garage_today", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			if ($garageCarToday.length > 0 && garageCarDialog) {
				$garageCarToday.data('link', $(this)).dialog("open");
			}
			return false;
		}).on("click", ".cnt_promo_today", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			if ($promoCarToday.length > 0 && promoCarDialog) {
				$promoCarToday.data('link', $(this)).dialog("open");
			}
			return false;
		}).on("click", ".add_general_note", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			$addGeneralNote.data('link', $(this)).dialog("open");
			return false;
		}).on("click", ".add_insurance_note", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			if ($addInsuranceNote.length > 0 && addInsuranceDialog) {
				$addInsuranceNote.data('link', $(this)).dialog("open");
			}
			return false;
		}).on("click", ".btnSaveNote", function (e) {
			let general_note = $('#general_note').val(),
				insurance_note = $('#insurance_note').val();
			$.ajax({
				url: 'index.php?controller=pjAdminNotes&action=pjActionCreate',
				type: 'POST',
				data: {
					general_note: general_note,
					insurance_note: insurance_note,
				},
				success: function(data) {
					window.location.reload();
				}
			}).done(function(response){});
		})


	});
})(jQuery);
