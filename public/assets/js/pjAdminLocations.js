var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
	$(function () {
		var $frmCreate = $("#frmCreate"),
			$frmUpdate = $("#frmUpdate"),
			$dialogDeleteThumb = $("#dialogDeleteThumb"),
			tipsy = ($.fn.tipsy !== undefined),
			validate = ($.fn.validate !== undefined),
			chosen = ($.fn.chosen !== undefined),
			dialog = ($.fn.dialog !== undefined),
			datagrid = ($.fn.datagrid !== undefined);
		
		if (tipsy) {
			$(".listing-tip").tipsy({
				offset: 1,
				opacity: 1,
				html: true,
				gravity: "nw",
				className: "tipsy-listing"
			});
		}
		if ($dialogDeleteThumb.length && dialog) {
			$dialogDeleteThumb.dialog({
				modal: true,
				autoOpen: false,
				resizable: false,
				draggable: false,
				buttons: {
					"Delete": function () {
						$.post("index.php?controller=pjAdminLocations&action=pjActionDeleteThumb", {
							"id": $dialogDeleteThumb.data("id")
						}).done(function (data) {
							if (data && data.status) {
								switch (data.status) {
								case 'OK':
									$("#boxLocationThumb").remove();
									break;
								}
							}
						}).always(function () {
							$dialogDeleteThumb.dialog("close");
						});
					},
					"Cancel": function () {
						$dialogDeleteThumb.dialog("close");
					}
				}
			});
		}
		
		if ($frmCreate.length > 0 && validate) {
			$frmCreate.validate({
				errorPlacement: function (error, element) {
					error.insertAfter(element.parent());
				},
				onkeyup: false,
				errorClass: "err",
				wrapper: "em"
			});
			
			if (chosen) {
				$("#country_id").chosen();
			}
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
			
			if (chosen) {
				$("#country_id").chosen();
			}
			
			if($('#lat').val() != '' && $('#lng').val() != '')
			{
				initGMap(parseFloat($('#lat').val()), parseFloat($('#lng').val()), $('#name').val());
			}
		}
		
		if ($("#grid").length > 0 && datagrid) {
			function formatAddr (val, obj) {
				var str = '';
				if(val){
					str += val;
				}
				if(obj.city){
					if(str)
						str += ", " + obj.city;
					else str += obj.city;
				}
				if(obj.zip ){
					if(str)
					str +=  ", " +  obj.zip;
					else str +=   obj.zip;
				}
				
				return str;
			}
			
			var $grid = $("#grid").datagrid({
				buttons: [{type: "edit", url: "index.php?controller=pjAdminLocations&action=pjActionUpdate&id={:id}"},
				          {type: "delete", url: "index.php?controller=pjAdminLocations&action=pjActionDelete&id={:id}"}
				          ],
				columns: [
						  {text: myLabel.location_name, type: "text", sortable: true, editable: true, width: 200},
						  {text: myLabel.location_city_addr_zip, type: "text", sortable: true, editable: false, width: 200, renderer: formatAddr},
						  {text: myLabel.location_availability, type: "text", sortable: true, editable: false, width: 120},
						   {text: myLabel.status, type: "select", sortable: true, editable: true, options: [{
				        	  label: myLabel.active, value: "T"
				          }, {
				        	  label: myLabel.inactive, value: "F"
				          }], applyClass: "pj-status"}
				          ],
				dataUrl: "index.php?controller=pjAdminLocations&action=pjActionGet",
				dataType: "json",
				fields: ['name', 'address_1' , 'cnt' , 'status'],
				paginator: {
					actions: [
					   {text: myLabel.delete_selected, url: "index.php?controller=pjAdminLocations&action=pjActionDeleteBulk", render: true, confirmation: myLabel.delete_confirmation},
					],
					gotoPage: true,
					paginate: true,
					total: true,
					rowCount: true
				},
				saveUrl: "index.php?controller=pjAdminLocations&action=pjActionSave&id={:id}",
				select: {
					field: "id",
					name: "record[]"
				}
			});
		}
		
		function initGMap(lat, lng, title)
		{
			var latlng = new google.maps.LatLng(lat, lng);
			var mapOptions = {
					  center: latlng,
					  zoom: 12,
					  mapTypeId: google.maps.MapTypeId.ROADMAP
					};
			var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
			var marker = new google.maps.Marker({
								draggable: true,
								position: latlng,
								map: map,
								title: title
							});
			google.maps.event.addListener(marker, 'dragend', function (event) {
			    $('#lat').val(this.getPosition().lat());
			    $('#lng').val(this.getPosition().lng());
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
			$grid.datagrid("load", "index.php?controller=pjAdminLocations&action=pjActionGet", "name", "ASC", content.page, content.rowCount);
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
			$grid.datagrid("load", "index.php?controller=pjAdminLocations&action=pjActionGet", "name", "ASC", content.page, content.rowCount);
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
			$.post("index.php?controller=pjAdminLocations&action=pjActionSetActive", {
				id: $(this).closest("tr").data("object")['id']
			}).done(function (data) {
				$grid.datagrid("load", "index.php?controller=pjAdminLocations&action=pjActionGet");
			});
			return false;
		}).on("click", ".btnGoogleMapsApi", function (e) {
			var $this = $(this);
			$.post("index.php?controller=pjAdminLocations&action=pjActionGetGeocode", $(this).closest("form").serialize()).done(function (data) {
				if (data.code !== undefined && data.code == 200) {
					$("#lat").val(data.lat);
					$("#lng").val(data.lng);
					$('#zip').val(data.zip);
					$this.siblings("span").hide().html("");

					initGMap(parseFloat(data.lat), parseFloat(data.lng), $('#name').val());
				} else {
					$this.siblings("span").html("<br>" + myLabel.address_not_found).show();
				}
			});
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
			$grid.datagrid("load", "index.php?controller=pjAdminLocations&action=pjActionGet", "name", "ASC", content.page, content.rowCount);
			return false;
		}).on("click", ".btnDeleteThumb", function (e) {
			if ($dialogDeleteThumb.length && dialog) {
				$dialogDeleteThumb
					.data("id", $(this).data("id"))
					.dialog("open");
			}
		});
	});
})(jQuery_1_8_2);