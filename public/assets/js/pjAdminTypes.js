var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {
		var $frmCreate = $("#frmCreate"),
			$frmUpdate = $("#frmUpdate"),
			$frmPrice = $("#frmPrice"),
			validate = ($.fn.validate !== undefined),
			chosen = ($.fn.chosen !== undefined),
			multiselect = ($.fn.multiselect !== undefined),
			tabs = ($.fn.tabs !== undefined),
			tipsy = ($.fn.tipsy !== undefined),
			datagrid = ($.fn.datagrid !== undefined),
			dialog = ($.fn.dialog !== undefined),
			$dialogDeletePrice = $("#dialogDeletePrice"),
			$dialogDeleteImage = $("#dialogDeleteImage"),
			spinner = ($.fn.spinner !== undefined),
			$tabs = $("#tabs");

		$(".field-int").spinner({
			min: 0
		});
		if (multiselect) {
			$("#extra_id").multiselect({

			});
		}
		if (spinner) {
			$(".spinner").spinner({
				min: 0,
				step: 1
			});
			$(".from-spinner").spinner({
				min: 0,
				step: 1
			});
			$(".to-spinner").spinner({
				min: 0,
				step: 1
			});
			$(".hour-from-spinner").spinner({
				min: 0,
				max: 23,
				step: 1
			});
			$(".hour-to-spinner").spinner({
				min: 0,
				max: 24,
				step: 1
			});
		}
		if (tipsy) {
			$(".listing-tip").tipsy({
				offset: 1,
				opacity: 1,
				html: true,
				gravity: "nw",
				className: "tipsy-listing"
			});
		}

		if ($tabs.length > 0 && tabs) {
			$tabs.tabs();
		}
		if ($frmPrice.length > 0 && validate) {
			$frmPrice.validate({
				onkeyup: false,
				errorLabelContainer: $(".bxRateErrors"),
				errorClass: "err"
			});
		}
		if ($frmCreate.length > 0 && validate) {
			$frmCreate.validate({
				errorPlacement: function (error, element) {
					if(element.attr('name') == 'default_distance')
					{
						error.insertAfter(element.parent().parent());
					}else{
						error.insertAfter(element.parent());
					}
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
		}
		if ($frmUpdate.length > 0 && validate) {
			$frmUpdate.validate({

				errorPlacement: function (error, element) {
					if(element.attr('name') == 'default_distance')
					{
						error.insertAfter(element.parent().parent());
					}else{
						error.insertAfter(element.parent());
					}
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
			function formatImage(val, obj) {
				var src = val ? val : 'app/web/img/backend/no_img.png';
				return ['<a href="index.php?controller=pjAdminTypes&action=pjActionUpdate&id=', obj.id ,'"><img src="', src, '" style="width: 100px" /></a>'].join("");
			}

			function formatModel(val, obj) {
				str = '<span class="attribute attribute-passengers float_left">' + obj.passengers + '</span>';
				str += '<span class="attribute attribute-luggages float_left">' + obj.luggages + '</span>';
				str += '<span class="attribute attribute-doors float_left">' + obj.doors + '</span>';
				str += '<span class="attribute attribute-transmission float_left">' + obj.transmission + '</span>';
				str += '<span class="attribute-custom float_left">' + obj.color + '</span>';
				str += '<span class="attribute-custom float_left">' + obj.horse_power + ' ' + myLabel.hp + '</span>';

				return str;
			}
			function formatCount(val, obj) {

				return ['<a href="index.php?controller=pjAdminCars&action=pjActionIndex&type_id=', obj.id ,'">'+ val + '</a>'].join("");
			}

			var $grid = $("#grid").datagrid({
				buttons: [{type: "edit", url: "index.php?controller=pjAdminTypes&action=pjActionUpdate&id={:id}"},
				          {type: "delete", url: "index.php?controller=pjAdminTypes&action=pjActionDelete&id={:id}"}
				          ],
				columns: [
						  {text: myLabel.type_image, type: "text", sortable: false, editable: false, width: 100, renderer: formatImage},
						  {text: myLabel.type, type: "text", sortable: true, editable: false, width: 130},
						  {text: myLabel.type_car_models, type: "text", sortable: false, editable: false, width: 160, renderer: formatModel},
						  {text: myLabel.type_num_cars, type: "text", sortable: true, editable: false, width: 110, renderer: formatCount},
						   {text: myLabel.status, type: "select", sortable: true, editable: true, options: [{
				        	  label: myLabel.active, value: "T"
				          }, {
				        	  label: myLabel.inactive, value: "F"
				          }], applyClass: "pj-status"}
				          ],
				dataUrl: "index.php?controller=pjAdminTypes&action=pjActionGet" ,
				dataType: "json",
				fields: ['thumb_path_1',  'type' , 'model' ,'cnt' ,'status'],
				paginator: {
					actions: [
					   {text: myLabel.delete_selected, url: "index.php?controller=pjAdminTypes&action=pjActionDeleteBulk", render: true, confirmation: myLabel.delete_confirmation},
					],
					gotoPage: true,
					paginate: true,
					total: true,
					rowCount: true
				},
				saveUrl: "index.php?controller=pjAdminTypes&action=pjActionSave&id={:id}",
				select: {
					field: "id",
					name: "record[]"
				}
			});
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

		if ($dialogDeleteImage.length > 0 && dialog) {
			$dialogDeleteImage.dialog({
				modal: true,
				autoOpen: false,
				resizable: false,
				draggable: false,
				buttons: {
					"Delete": function () {
						var $this = $(this),
							$link = $this.data("link");
						$.post("index.php?controller=pjAdminTypes&action=pjActionDeleteImage", {
							id: $link.data("id"),
							image: $link.data('image')
						}).done(function (data) {
							if(data.code == '200')
							{
								$dialogDeleteImage.dialog('close');
								$link.parent().parent().remove();
							}
						});
					},
					"Cancel": function () {
						$(this).dialog("close");
					}
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
			$grid.datagrid("load", "index.php?controller=pjAdminTypes&action=pjActionGet", "type", "ASC", content.page, content.rowCount);
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
			obj.status = "";
			obj[$this.data("column")] = $this.data("value");
			$.extend(cache, obj);
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminTypes&action=pjActionGet", "type", "ASC", content.page, content.rowCount);
			return false;
		}).on("click", ".pj-status-1", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			return false;
		}).on("click", ".pj-status-0", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			$.post("index.php?controller=pjAdminTypes&action=pjActionSetActive", {
				id: $(this).closest("tr").data("object")['id']
			}).done(function (data) {
				$grid.datagrid("load", "index.php?controller=pjAdminTypes&action=pjActionGet");
			});
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
			$grid.datagrid("load", "index.php?controller=pjAdminTypes&action=pjActionGet", "type", "ASC", content.page, content.rowCount);
			return false;
		}).on("change", "select.pPeriod", function () {
			var $this = $(this);
			switch ($this.find("option:selected").val()) {
			case "hour":
				$this.closest("tr").find(".pHour").show().end().find(".pDay").hide();
				$this.closest("tr").find(".from-spinner").removeClass('from-spinner').addClass('hour-from-spinner').spinner({
					min: 0,
					max: 23,
					step: 1
				});
				$this.closest("tr").find(".to-spinner").removeClass('to-spinner').addClass('hour-to-spinner').spinner({
					min: 0,
					max: 24,
					step: 1
				});
				$this.closest("tr").find(".from-spin").removeClass('from-spin').addClass('hour-from-spin').spinner({
					min: 0,
					max: 23,
					step: 1
				});
				$this.closest("tr").find(".to-spin").removeClass('to-spin').addClass('hour-to-spin').spinner({
					min: 0,
					max: 24,
					step: 1
				});

				break;
			case "day":
				$this.closest("tr").find(".pHour").hide().end().find(".pDay").show();
				$this.closest("tr").find(".hour-from-spinner").removeClass('hour-from-spinner').addClass('from-spinner').spinner({
					min: 0,
					max: null,
					step: 1
				});
				$this.closest("tr").find(".hour-to-spinner").removeClass('hour-to-spinner').addClass('to-spinner').spinner({
					min: 0,
					max: null,
					step: 1
				});
				$this.closest("tr").find(".hour-from-spin").removeClass('hour-from-spin').addClass('from-spin').spinner({
					min: 0,
					max: null,
					step: 1
				});
				$this.closest("tr").find(".hour-to-spin").removeClass('hour-to-spin').addClass('to-spin').spinner({
					min: 0,
					max: null,
					step: 1
				});
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

			$tbody.find("tr:last").find(".from-spin").spinner({
				min: 0,
				step: 1
			});
			$tbody.find("tr:last").find(".to-spin").spinner({
				min: 0,
				step: 1
			});
			$tbody.find("tr:last").find(".hour-from-spin").spinner({
				min: 0,
				max: 23,
				step: 1
			});
			$tbody.find("tr:last").find(".hour-to-spin").spinner({
				min: 0,
				max: 24,
				step: 1
			});
		}).on("focusin", ".datepick", function (e) {
			var minDate, maxDate,
				$this = $(this),
				$index = $(this).attr('data-index'),
				custom = {},
				o = {
					firstDay: $this.attr("rel"),
					dateFormat: $this.attr("rev")
				};
			switch ($this.attr("name")) {
			case "date_from["+$index+"]":
				maxDate = $this.closest("tr").find(".datepick[name='date_to["+$index+"]']").datepicker({
					firstDay: $this.attr("rel"),
					dateFormat: $this.attr("rev")
				}).datepicker("getDate");
				$this.closest("tr").find(".datepick[name='date_to["+$index+"]']").datepicker("destroy").removeAttr("id");
				if (maxDate !== null) {
					custom.maxDate = maxDate;
				}
				break;
			case "date_to["+$index+"]":
				minDate = $this.closest("tr").find(".datepick[name='date_from["+$index+"]']").datepicker({
					firstDay: $this.attr("rel"),
					dateFormat: $this.attr("rev")
				}).datepicker("getDate");
				$this.closest("tr").find(".datepick[name='date_from["+$index+"]']").datepicker("destroy").removeAttr("id");
				if (minDate !== null) {
					custom.minDate = minDate;
				}
				break;
			}
			$this.not('.hasDatepicker').datepicker($.extend(o, custom));
		}).on("click", ".pj-image-delete", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			$dialogDeleteImage.data('link', $(this)).dialog("open");
			return false;
		}).on("change", "[data-image]", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			$('#pj_type_loader').css('display', 'block');
			$frmUpdate.submit();
			return false;
		});
	});
})(jQuery_1_8_2);
