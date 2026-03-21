var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	// Cars tab;
	$(function () {
		var $frmCreate = $("#frmCreate"),
			$frmUpdate = $("#frmUpdate"),
			$frmAvailability = $("#frmAvailability"),
			multiselect = ($.fn.multiselect !== undefined),
			tipsy = ($.fn.tipsy !== undefined),
			validate = ($.fn.validate !== undefined),
			datagrid = ($.fn.datagrid !== undefined);
		
		if (multiselect) {
			$("#car_id").multiselect({
				noneSelectedText: myLabel.view_all
			});
		}
		function loadAvailability(){
			$('.pj_availability_loader').css('display', 'block');
			$.post("index.php?controller=pjAdminCars&action=pjActionLoadAvailability", $frmAvailability.serialize()).done(function (data) {
				$('#pj_availability_content').html(data);
				$('.pj_availability_loader').css('display', 'none');
				if($(".pj-availability-content").length > 0)
				{
					var head_height = $('.content-head-row').height();
					$('.content-head-row').height(head_height + 20);
					$('.title-head-row').height(head_height + 20);
					
					$('.title-row').each(function(index) {
					    var id = $(this).attr('lang');
					    var h = $('#content_row_' + id).height();
					    if(h < 131){
					    	h = 116;
					    }
					    $(this).height(h);
					    $('#content_row_' + id).height(h);
					});
					$(".wrapper1").scroll(function(){
				        $(".wrapper2")
				            .scrollLeft($(".wrapper1").scrollLeft());
				    });
				    $(".wrapper2").scroll(function(){
				        $(".wrapper1")
				            .scrollLeft($(".wrapper2").scrollLeft());
				    });
				    
				    $(".wrapper2").height($("#compare_table").height() + 24);
				    
				    $('.pj-booking-middle').each(function(index) {
					    var status = $(this).attr('data-status');
					    $(this).parent().addClass('pj-td-' + status);
					});
				}
			})
		}
		if($frmAvailability.length > 0){
			loadAvailability();
		}
		if (validate) {
			$.validator.addMethod("validRegistrationNumber", function (value, element) {
				var $form = $(this).closest("form");	
				$.post("index.php?controller=pjAdminCars&action=pjActionCheckRegistrationNumber", $frmCreate.serialize()).done(function (data) {
					if (data.code === undefined) {
						return;
					}
					switch (data.code) {
					
					case 200:
						return true;
					case 100:
						return false;
					}
				})
			}, myLabel.car_same_reg);
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
		$(".digits").spinner({
			min: 0
		});
		
		if ($frmCreate.length > 0 && validate) {
			$frmCreate.validate({
				rules: {
					"registration_number": {
						required: true,
						remote: "index.php?controller=pjAdminCars&action=pjActionCheckRegistrationNumber"
					},
					"created_at": {
						required: true
					}
				},
				messages:{
					"registration_number": {
						remote: myLabel.car_same_reg
					},
					"created_at": {
						required: "Please select the date when this car was added to the system"
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
		if ($frmUpdate.length > 0 && validate) {
			$frmUpdate.validate({

				rules: {
					"registration_number": {
						required: true,
						remote: "index.php?controller=pjAdminCars&action=pjActionCheckRegistrationNumber&id=" + $frmUpdate.find("input[name='id']").val()
					},
					"created_at": {
						required: true
					}
				},
				messages:{
					"registration_number": {
						remote: myLabel.car_same_reg
					},
					"created_at": {
						required: "Please select the date when this car was added to the system"
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
		
		if ($("#grid").length > 0 && datagrid) {
			function formatDefault (str, obj) {
				if (obj.role_id == 3) {
					return '<a href="#" class="pj-status-icon pj-status-' + (str == 'F' ? '0' : '1') + '" style="cursor: ' +  (str == 'F' ? 'pointer' : 'default') + '"></a>';
				} else {
					return '<a href="#" class="pj-status-icon pj-status-1" style="cursor: default"></a>';
				}
			}
			
			function formatMileage(val, obj) {
				if(val == undefined){
					val = 0;
				}
				return val + ' ' + myLabel.o_unit;
			}
			
			var $grid = $("#grid").datagrid({
				buttons: [{type: "edit", url: "index.php?controller=pjAdminCars&action=pjActionUpdate&id={:id}"},
				          {type: "delete", url: "index.php?controller=pjAdminCars&action=pjActionDelete&id={:id}"}
				          ],
				columns: [
						  {text: myLabel.car_reg, type: "text", sortable: true, editable: true, width: 140},
						  {text: myLabel.car_make_model, type: "text", sortable: true, editable: false, width: 150},
						  {text: myLabel.car_location, type: "select", sortable: true, editable: true, editableWidth: 150, options: locationObject},
						  {text: myLabel.car_type, type: "text", sortable: false, editable: false, width: 140},
						  {text: myLabel.status, type: "select", sortable: true, editable: true, options: [{
								label: myLabel.active, value: "T"
							}, {
								label: myLabel.inactive, value: "F"
							}], applyClass: "pj-status"}
				          ],
				dataUrl: "index.php?controller=pjAdminCars&action=pjActionGet" + pjGrid.queryString,
				dataType: "json",
				fields: ['registration_number', 'make','location_id','car_types','status'],
				paginator: {
					actions: [
					   {text: myLabel.delete_selected, url: "index.php?controller=pjAdminCars&action=pjActionDeleteBulk", render: true, confirmation: myLabel.delete_confirmation},
					],
					gotoPage: true,
					paginate: true,
					total: true,
					rowCount: true
				},
				saveUrl: "index.php?controller=pjAdminCars&action=pjActionSave&id={:id}",
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
				status: "",
				type_id: "",
				q: ""
			});
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminCars&action=pjActionGet", "registration_number", "ASC", content.page, content.rowCount);
			return false;
		}).on("click", ".btn-garage", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var $this = $(this),
                content = $grid.datagrid("option", "content"),
                cache = $grid.datagrid("option", "cache"),
                obj = {};
            $this.addClass("pj-button-active").siblings(".pj-button").removeClass("pj-button-active");
            obj.status = "";
            obj.q = "";
            obj[$this.data("column")] = $this.data("value");
            $.extend(cache, obj);
            $grid.datagrid("option", "cache", cache);
            console.log('te2');
            console.log($this);
            $grid.datagrid("load", "index.php?controller=pjAdminCars&action=pjActionGet", "registration_number", "ASC", content.page, content.rowCount);
            return false;
        }).on("click", ".btn-filter", function (e) {
			if ($("#grid").length <= 0) {
				return;
			}
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			var $this = $(this),
				content = $grid.datagrid("option", "content"),
				cache = $grid.datagrid("option", "cache"),
				obj = {};
			$this.addClass("pj-button-active").siblings(".pj-button").removeClass("pj-button-active");
			obj.status = "";
			obj.type_id = "";
			obj[$this.data("column")] = $this.data("value");
			$.extend(cache, obj);
			$grid.datagrid("option", "cache", cache);
			$grid.datagrid("load", "index.php?controller=pjAdminCars&action=pjActionGet", "registration_number", "ASC", content.page, content.rowCount);
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
			$.post("index.php?controller=pjAdminCars&action=pjActionSetActive", {
				id: $(this).closest("tr").data("object")['id']
			}).done(function (data) {
				$grid.datagrid("load", "index.php?controller=pjAdminCars&action=pjActionGet");
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
			$grid.datagrid("load", "index.php?controller=pjAdminCars&action=pjActionGet", "registration_number", "ASC", content.page, content.rowCount);
			return false;
		}).on("submit", ".frm-filter-advanced", function (e) {
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
			$grid.datagrid("load", "index.php?controller=pjAdminCars&action=pjActionGet", "registration_number", "ASC", content.page, content.rowCount);
			return false;
		}).on("focusin", ".datepick", function (e) {
			
			var minDate, maxDate,
				$this = $(this),
				custom = {},
				o = {
					firstDay: $this.attr("rel"),
					dateFormat: $this.attr("rev"),
					onSelect: function (dateText, inst) {
						loadAvailability();
					}
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
		}).on("change", "#car_type", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			loadAvailability();
		}).on("change", "#car_id", function (e) {
			if (e && e.preventDefault) {
				e.preventDefault();
			}
			loadAvailability();
		}).on("click", ".reservation", function (event) {
          	var result = $(this).attr('class').split(" ")
            result = result[2].split("_")
            localStorage.setItem("model", result[0]);
            localStorage.setItem("type", result[1]);
        }).on("focusin", ".datetimepick", function (e) {
			var minDateTime, maxDateTime,
				$this = $(this),
				custom = {},
				o = {
					firstDay: parseInt($this.attr("rel")) || 0,
					dateFormat: "yy-mm-dd",
					timeFormat: "HH:mm:ss",
					showSecond: true,
					stepMinute: 5,
					showTime: true,
					showHour: true,
					showMinute: true,
					onClose: function(){
					}
				};

			if (!$(this).hasClass("hasDatepicker")) {
				$(this).datetimepicker($.extend(o, custom));
			}
		});

	});
	 
})(jQuery_1_8_2);