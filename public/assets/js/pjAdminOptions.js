var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {
		var tabs = ($.fn.tabs !== undefined),
			dialog = ($.fn.dialog !== undefined),
			$dialogDeletePrice = $("#dialogDeletePrice"),
			spinner = ($.fn.spinner !== undefined),
			$tabs = $("#tabs"),
			tOpt = {
				select: function (event, ui) {
					$(":input[name='tab_id']").val(ui.panel.id);
				}
			};
		
		if ($tabs.length > 0 && tabs) {
			$tabs.tabs(tOpt);
		}
		
		$(".field-int").spinner({
			min: 0
		});
		
		
		if (spinner) {
			$(".spinner").spinner({
				min: 0,
				step: 1
			});
		}
		
		if($('#cr_install_text').length > 0)
		{
			setInstall(0);
		}
		
		function setInstall(locale_id)
		{
			var clone_text = $("#install_clone_text").val();
			
			if(locale_id > 0)
			{
				clone_text = clone_text.replace('{LANG}', '&pjLang=' + locale_id);
			}else{
				$("#install_language").css('display', 'none');
				clone_text = clone_text.replace('{LANG}', '');
			}
			$("#cr_install_text").val(clone_text);
		}
		
		if ($dialogDeletePrice.length > 0 && dialog) {
			$dialogDeletePrice.dialog({
				modal: true,
				autoOpen: false,
				resizable: false,
				draggable: false,
				buttons: {
					"Delete": function () {
						var $this = $(this),
							$link = $this.data("link"),
							$tr = $link.closest("tr");
						$.post("index.php?controller=pjAdminOptions&action=pjActionDeletePrice", {
							id: $link.data("id")
						}).done(function () {
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
		
		$("#content").on("focusin", ".textarea_install", function (e) {
			$(this).select();
		}).on("change", "select[name='value-enum-o_allow_paypal']", function (e) {
			switch ($("option:selected", this).val()) {
			case 'Yes|No::No':
				$(".boxPaypal").hide();
				break;
			case 'Yes|No::Yes':
				$(".boxPaypal").show();
				break;
			}
		}).on("change", "select[name='value-enum-o_allow_authorize']", function (e) {
			switch ($("option:selected", this).val()) {
			case 'Yes|No::No':
				$(".boxAuthorize").hide();
				break;
			case 'Yes|No::Yes':
				$(".boxAuthorize").show();
				break;
			}
		}).on("change", "select[name='value-enum-o_allow_bank']", function (e) {
			switch ($("option:selected", this).val()) {
			case 'Yes|No::No':
				$(".boxBankAccount").hide();
				break;
			case 'Yes|No::Yes':
				$(".boxBankAccount").show();
				break;
			}
		}).on("change", "select[name='value-enum-o_send_email']", function (e) {
			switch ($("option:selected", this).val()) {
			case 'mail|smtp::mail':
				$(".boxSmtp").hide();
				break;
			case 'mail|smtp::smtp':
				$(".boxSmtp").show();
				break;
			}
		}).on("change", "select[name='value-enum-o_booking_periods']", function (e) {
			var $this = $(this),
				that = this,
				ele_name = $this.attr('name');
			ele_name = ele_name.replace("value-enum-", "");
			$.ajax({
				type: "POST",
				url: "index.php?controller=pjAdminOptions&action=pjActionUpdateSettings",
				data: {
					key: ele_name,
					value: $("option:selected", that).val()
				},
				dataType: 'json',
				success: function(data){
					if(data.code == '200')
					{
						switch ($("option:selected", that).val()) {
						case 'perday|perhour|both::perday':
							$(".boxChargePerDay").show();
							
							$(".boxMinimumBoth").css('display', 'none');
							$(".boxMinimumDay").css('display', 'inline');
							break;
						case 'perday|perhour|both::perhour':
							$(".boxChargePerDay").hide();
							
							$(".boxMinimumBoth").css('display', 'inline');
							$(".boxMinimumDay").css('display', 'none');
							break;
						case 'perday|perhour|both::both':
							$(".boxChargePerDay").hide();
							
							$(".boxMinimumBoth").css('display', 'inline');
							$(".boxMinimumDay").css('display', 'none');
							break;
						}
					}
				}
			});
			
		}).on("click change", "input.rent_by", function () {
			var $rent_by_hour = $("input[name='rent_by_hour']"),
				$rent_by_day = $("input[name='rent_by_day']"),
				$price_per_hour = $("input[name='price_per_hour']"),
				$price_per_day = $("input[name='price_per_day']");
			
			if ($rent_by_hour.is(":checked") && $rent_by_day.is(":checked")) {
				$(".pHours, .pDays").hide();
				$(".pPeriod").show().trigger("change");
				$price_per_hour.parent().show();
				$price_per_day.parent().show();
			} else if (!$rent_by_hour.is(":checked") && !$rent_by_day.is(":checked")) {
				$(".pPeriod, .pHours, .pDays, .pHour, .pDay").hide();
				$price_per_hour.parent().hide();
				$price_per_day.parent().hide();
			} else {
				$(".pPeriod").hide();
				
				if ($rent_by_hour.is(":checked")) {
					$(".pHours, .pHour").show();
					$(".pDays, .pDay").hide();
					$price_per_hour.parent().show();
					$price_per_day.parent().hide();
				} else if ($rent_by_day.is(":checked")) {
					$(".pHours, .pHour").hide();
					$(".pDays, .pDay").show();
					$price_per_hour.parent().hide();
					$price_per_day.parent().show();
				}
			}
			
		}).on("change", "select.pPeriod", function () {
			var $this = $(this);
			switch ($this.find("option:selected").val()) {
			case "hour":
				$this.closest("tr").find(".pHour").show().end().find(".pDay").hide();
				break;
			case "day":
				$this.closest("tr").find(".pHour").hide().end().find(".pDay").show();
				break;
			}
			
		}).on("click", ".btnDeletePrice", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			if ($dialogDeletePrice.length > 0 && dialog) {
				$dialogDeletePrice.data('link', $(this)).dialog("open");
			}
			return false;
		}).on("click", ".btnRemovePrice", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			var $tr = $(this).closest("tr");
			$tr.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
				$tr.remove();
			});
			return false;
		}).on("click", "#btnAddPrice", function (e) {
			var $tr,
				$tbody = $("#tblPrices tbody"),
				h = $tbody.find("tr:last").find("td:first").html(),
				i = (h === null) ? 0 : parseInt(h, 10);
				i = !isNaN(i) ? i : 0;
			
	   	  index = Math.ceil(Math.random() * 999999),
				
			$tr = $("#tblPricesClone").find("tbody").clone();
			$tbody.find(".notFound").remove();
			$tbody.append($tr.html().replace(/\{INDEX\}/g, 'x_' + index));
			
			$tbody.find("tr:last").find(".spin").spinner({
				min: 0,
				step: 1
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
			case "date_from[]":
				maxDate = $this.closest("tr").find(".datepick[name='date_to[]']").datepicker({
					firstDay: $this.attr("rel"),
					dateFormat: $this.attr("rev")
				}).datepicker("getDate");
				$this.closest("tr").find(".datepick[name='date_to[]']").datepicker("destroy").removeAttr("id");
				if (maxDate !== null) {
					custom.maxDate = maxDate;
				}
				break;
			case "date_to[]":
				minDate = $this.closest("tr").find(".datepick[name='date_from[]']").datepicker({
					firstDay: $this.attr("rel"),
					dateFormat: $this.attr("rev")
				}).datepicker("getDate");
				$this.closest("tr").find(".datepick[name='date_from[]']").datepicker("destroy").removeAttr("id");
				if (minDate !== null) {
					custom.minDate = minDate;
				}
				break;
			}
			$this.not('.hasDatepicker').datepicker($.extend(o, custom));
		}).on("change", "select[name='value-enum-o_email_confirmation']", function (e) {
			switch ($("option:selected", this).val()) {
			case '0|1::0':
				$(".boxClientConfirmation").hide();
				break;
			case '0|1::1':
				$(".boxClientConfirmation").show();
				break;
			}
		}).on("change", "select[name='value-enum-o_email_payment']", function (e) {
			switch ($("option:selected", this).val()) {
			case '0|1::0':
				$(".boxClientPayment").hide();
				break;
			case '0|1::1':
				$(".boxClientPayment").show();
				break;
			}
		}).on("change", "select[name='value-enum-o_email_cancel']", function (e) {
			switch ($("option:selected", this).val()) {
			case '0|1::0':
				$(".boxClientCancel").hide();
				break;
			case '0|1::1':
				$(".boxClientCancel").show();
				break;
			}
		}).on("change", "select[name='value-enum-o_admin_email_confirmation']", function (e) {
			switch ($("option:selected", this).val()) {
			case '0|1::0':
				$(".boxAdminConfirmation").hide();
				break;
			case '0|1::1':
				$(".boxAdminConfirmation").show();
				break;
			}
		}).on("change", "select[name='value-enum-o_admin_email_payment']", function (e) {
			switch ($("option:selected", this).val()) {
			case '0|1::0':
				$(".boxAdminPayment").hide();
				break;
			case '0|1::1':
				$(".boxAdminPayment").show();
				break;
			}
		}).on("change", "select[name='value-enum-o_admin_email_cancel']", function (e) {
			switch ($("option:selected", this).val()) {
			case '0|1::0':
				$(".boxAdminCancel").hide();
				break;
			case '0|1::1':
				$(".boxAdminCancel").show();
				break;
			}
		}).on("change", "select[name='integration_method']", function (e) {
			if($(this).val() == 'all')
			{
				$("#install_language").css('display', 'none');
				setInstall(0);
			}else{
				$("#install_language").css('display', 'inline-block');
				var locale_id =  parseInt($("#install_language").val(), 10);
				setInstall(locale_id);
			}
		}).on("change", "select[name='install_language']", function (e) {
			var locale_id =  parseInt($(this).val(), 10);
			setInstall(locale_id);
		}).on("click", ".pj-use-theme", function (e) {
			var theme = $(this).attr('data-theme');
			$('.pj-loader').css('display', 'block');
			$.ajax({
				type: "GET",
				async: false,
				url: 'index.php?controller=pjAdminOptions&action=pjActionUpdateTheme&theme=' + theme,
				success: function (data) {
					$('.theme-holder').html(data);
					$('.pj-loader').css('display', 'none');
				}
			});
		});
		
		$tblPrices = $("#tblPrices");
		if ($tblPrices.length > 0)
		{
			$("form").bind("submit", function (e) {
				if (e.preventDefault) {
					e.preventDefault();
				}
				
				var post, num,
					i = 0,
					$that = $(this),
					$tbody = $("#tblPrices tbody"),
					$tr = $("tr", $tbody),
					len = $tr.length,
					perLoop = 100,
					loops = len > perLoop ? Math.ceil(len / perLoop) : 1;
					
				num = loops;
				
				$that.find(":input").attr("readonly", "readonly");
				
				$(".bxStatus").hide();
				$(".bxStatusStart").show();
				$.post("index.php?controller=pjAdminOptions&action=pjActionDeletePrices").done(function () {
					setPrices();
				});

				function setPrices() {
					$.ajaxSetup({async:false});
					post = $tr.slice(i * perLoop, (i + 1) * perLoop).find(":input").serialize();
					
					$(".rent_by").each(function(){
						if(this.checked === true)
						{
							post += "&" + this.name + "=1";
						}
					})
					
					i++;
					$.post("index.php?controller=pjAdminOptions&action=pjActionSetPrices", post, callback);
				}
				
				function callback() {
					num--;
					if (num > 0) {
				        setPrices();
				    } else {
				    	$that.find(":input").removeAttr("readonly");
				    	$(".bxStatusStart").hide();
				    	$(".bxStatusEnd").show().fadeOut(2500);
				        return;
				    }
				}
				return false;
			});
		}

		if (window.tinyMCE !== undefined) {
			tinymce.init({
				selector: "textarea.mceSelector",
				plugins: [
					"advlist autolink lists link image charmap print preview anchor",
					"searchreplace visualblocks code fullscreen",
					"insertdatetime media table contextmenu paste"
				],
				width: 540,
				height: 568,
				toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
				// setup: function (editor) {
				// 	editor.on('change', function (e) {
				// 		editor.editorManager.triggerSave();
				// 		$(":input[name='" + editor.id + "']").valid();
				// 	});
				// }
			});
		}
	});
})(jQuery_1_8_2);