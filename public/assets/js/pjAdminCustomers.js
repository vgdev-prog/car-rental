var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
    $(function () {
        var $frmCreateCustomer = $("#frmCreateCustomer"),
            $frmUpdateCustomer = $("#frmUpdateCustomer"),
            $dialogDeleteTicket = $("#dialogDeletePayment"),
            $dialogDeletePayment = $("#dialogDeletePayment"),
            $frmCreate = $("#frmCreate"),
            $frmUpdate = $("#frmUpdate"),
            dialog = ($.fn.dialog !== undefined),
            datagrid = ($.fn.datagrid !== undefined);

        if ($frmCreateCustomer.length > 0) {
            $frmCreateCustomer.validate({
                rules: {
                    "email": {
                        required: true,
                        email: true,
                        remote: "index.php?controller=pjAdminCustomers&action=pjActionCheckEmail"
                    }
                },
                messages: {
                    "email": {
                        remote: myLabel.email_taken
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
        if ($frmUpdateCustomer.length > 0) {
            $frmUpdateCustomer.validate({
                rules: {
                    "email": {
                        required: true,
                        email: true,
                        remote: "index.php?controller=pjAdminCustomers&action=pjActionCheckEmail&id=" + $frmUpdateCustomer.find("input[name='id']").val()
                    }
                },
                messages: {
                    "email": {
                        remote: myLabel.email_taken
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
        if ($dialogDeleteTicket.length > 0 && dialog) {
            $dialogDeleteTicket.dialog({
                modal: true,
                autoOpen: false,
                resizable: false,
                draggable: false,
                buttons: {
                    "Delete": function () {
                        var $this = $(this),
                            $link = $this.data("link"),
                            $tr = $link.closest("tr");
                        $.post("index.php?controller=pjAdminBookings&action=pjActionDeleteTicket", {
                            id: $link.data("id")
                        }).done(function () {
                            https://eubiq.ca:10000/
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

        if ($dialogDeletePayment.length > 0 && dialog) {
            $dialogDeletePayment.dialog({
                modal: true,
                autoOpen: false,
                resizable: false,
                draggable: false,
                buttons: {
                    "Delete": function () {
                        var $this = $(this),
                            $link = $this.data("link"),
                            $tr = $link.closest("tr");
                        $.post("index.php?controller=pjAdminBookings&action=pjActionDeletePayment", {
                            id: $link.data("id")
                        }).done(function () {https://eubiq.ca:10000/
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

        if ($("#grid").length > 0 && datagrid) {


            var $grid = $("#grid").datagrid({
                buttons: [{type: "edit", url: "index.php?controller=pjAdminCustomers&action=pjActionUpdate&id={:id}"},
                    {
                        type: "customer-info",
                        url: "index.php?controller=pjAdminCustomers&action=pjActionGetCustomerInfo&id={:id}"
                    }
                ],
                columns: [{text: myLabel.c_title, type: "text", sortable: true, editable: false},
                    {text: myLabel.name, type: "text", sortable: true, editable: false},
                    {text: myLabel.email, type: "text", sortable: true, editable: false},
                    {text: myLabel.phone, type: "text", sortable: true, editable: false},
                    {text: myLabel.driver_licence_number, type: "text", sortable: false, editable: true},
                    {text: myLabel.status, type: "select", sortable: true, editable: true, options: [{
                            label: myLabel.active, value: "T"
                        }, {
                            label: myLabel.inactive, value: "F"
                        }], applyClass: "pj-status"
                    }
                ],
                dataUrl: "index.php?controller=pjAdminCustomers&action=pjActionGetCustomer",
                dataType: "json",
                fields: ['c_title', 'name', 'email', 'phone', 'driver_licence_number', 'c_status'],
                paginator: {
                    gotoPage: true,
                    paginate: true,
                    total: true,
                    rowCount: true
                },
                saveUrl: "index.php?controller=pjAdminCustomers&action=pjActionSave&id={:id}"
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
            $grid.datagrid("load", "index.php?controller=pjAdminCustomers&action=pjActionGetCustomer", "id", "ASC", content.page, content.rowCount);
            return false;
        }).on("click", "#btnAddTicket", function (e) {
            var $tr,
                $tbody = $("#tblTickets tbody"),
                index = Math.ceil(Math.random() * 999999),
                h = $tbody.find("tr:last").find("td:first").html(),
                i = (h === null) ? 0 : parseInt(h, 10);

            i = !isNaN(i) ? i : 0;
            $tr = $("#tblTicketsClone").find("tbody").clone();
            $tbody.find(".notFound").remove();
            var tr_html = $tr.html().replace(/\{INDEX\}/g, 'x_' + index);
            tr_html = tr_html.replace(/\{PTCLASS\}/g, 'pj-parking_ticket-traffic_ticket');
            tr_html = tr_html.replace(/\{ACLASS\}/g, 'pj-parking_ticket-amount');
            tr_html = tr_html.replace(/\{SCLASS\}/g, 'pj-parking_ticket-status');
            $tbody.append(tr_html);

            $tbody.find("tr:last").find(".spin").spinner({
                min: 0,
                step: 1
            });
        }).on("click", ".btnRemoveTicket", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var $tr = $(this).closest("tr");
            $tr.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
                $tr.remove();
            });
            return false;
        }).on("click", ".btnDeleteTicket", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            if ($dialogDeleteTicket.length > 0 && dialog) {
                $dialogDeleteTicket.data('link', $(this)).dialog("open");
            }
            return false;
        }).on("click", "#btnAddPayment", function (e) {
            var $tr,
                $tbody = $("#tblPayment tbody"),
                index = Math.ceil(Math.random() * 999999),
                h = $tbody.find("tr:last").find("td:first").html(),
                i = (h === null) ? 0 : parseInt(h, 10);

            i = !isNaN(i) ? i : 0;
            $tr = $("#tblPaymentsClone").find("tbody").clone();
            $tbody.find(".notFound").remove();
            var tr_html = $tr.html().replace(/\{INDEX\}/g, 'x_' + index);
            tr_html = tr_html.replace(/\{PTCLASS\}/g, 'pj-payment-type');
            tr_html = tr_html.replace(/\{ACLASS\}/g, 'pj-payment-amount');
            tr_html = tr_html.replace(/\{PDCLASS\}/g, 'pj-payment-datetime');
            tr_html = tr_html.replace(/\{SCLASS\}/g, 'pj-payment-status');
            $tbody.append(tr_html);

            $tbody.find("tr:last").find(".spin").spinner({
                min: 0,
                step: 1
            });
        }).on("click", ".btnRemovePayment", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var $tr = $(this).closest("tr");
            $tr.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
                $tr.remove();
                calPayment();
            });
            return false;
        }).on("click", ".btnDeletePayment", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            if ($dialogDeletePayment.length > 0 && dialog) {
                $dialogDeletePayment.data('link', $(this)).dialog("open");
                calPayment();
            }
            return false;
        }).on("focusin", ".datetimepick", function (e) {
            var minDateTime, maxDateTime,
                $this = $(this),
                custom = {},
                o = {
                    firstDay: $this.attr("rel"),
                    dateFormat: $this.attr("rev"),
                    timeFormat: $this.attr("lang"),
                    stepMinute: 5,
                    onClose:function(){
                        if (($frmUpdate.length > 0) && ($this.attr("name") == 'date_from' || $this.attr("name") == 'date_to')) {
                            checkAvailability($frmUpdate);
                        }
                        if (($frmCreate.length > 0) && ($this.attr("name") == 'date_from' || $this.attr("name") == 'date_to')) {
                            if($('#date_from').val() != '' && $('#date_to').val() != '' && $('#type_id').val() != '')
                            {
                                checkAvailability($frmCreate);
                            }
                        }
                        if($this.attr("name") == 'date_to'){
                            $('#dropoff_datetime').val($this.val());
                        }
                        if($this.attr("name") == 'actual_dropoff_datetime'){
                            getExtraHoursUsage($frmUpdate);
                        }
                    }
                };

            $(this).datetimepicker($.extend(o, custom));

        }).on("click", ".pj-form-field-icon-date", function (e) {
            var $dp = $(this).parent().siblings("input[type='text']");
            if ($dp.hasClass("hasDatepicker")) {
                $dp.datepicker("show");
            } else {
                $dp.trigger("focusin").datepicker("show");
            }

        }).on("click", ".pj-table-icon-transfer", function (e) {
            var id = $(this).val();

            $.get("index.php?controller=controller=pjAdminCustomers&action=pjActionGetCustomer", {id: id}, function (data) {
                if ($frmUpdate.length > 0) {
                    $('#collect_current_mileage').html(data + ' ' + myLabel.mileage_unit);
                    $('#cr_set_as_current').attr('rev', data);
                }
            });
            var index = $(this).attr('data-index'),
                val = $(this).val();

        }).on("click", ".export-excel", function (e) {
            $.ajax({
                url: 'index.php?controller=pjAdminCustomers&action=pjActionExportCustomers',
                type: 'POST',
                success: function(data) {
                    $.redirect(data.filename);
                }
            }).done(function(response){});
        });

    });
})(jQuery_1_8_2);