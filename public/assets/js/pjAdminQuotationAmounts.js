var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
    $(function () {
        var $frmCreateQuotationAmount = $("#frmCreateQuotationAmount"),
            $frmUpdateQuotationAmount = $("#frmUpdateQuotationAmount"),
            $dialogDeleteQuotationAmount = $("#dialogDeletePayment"),
            $frmCreate = $("#frmCreate"),
            $frmUpdate = $("#frmUpdate"),
            dialog = ($.fn.dialog !== undefined),
            chosen = ($.fn.chosen !== undefined),
            datagrid = ($.fn.datagrid !== undefined);
        if (chosen) {
            $("#car_id").chosen();
        }
        if ($frmCreateQuotationAmount.length > 0) {
            $frmCreateQuotationAmount.validate({
                rules: {
                    "email": {
                        required: true,
                        email: true,
                        remote: "index.php?controller=pjAdminQuotationAmounts&action=pjActionCheckEmail"
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
        if ($frmUpdateQuotationAmount.length > 0) {
            $frmUpdateQuotationAmount.validate({
                rules: {
                    "email": {
                        required: true,
                        email: true,
                        remote: "index.php?controller=pjAdminQuotationAmounts&action=pjActionCheckEmail&id=" + $frmUpdateQuotationAmount.find("input[name='id']").val()
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
        if ($dialogDeleteQuotationAmount.length > 0 && dialog) {
            $dialogDeleteQuotationAmount.dialog({
                modal: true,
                autoOpen: false,
                resizable: false,
                draggable: false,
                buttons: {
                    "Delete": function () {
                        var $this = $(this),
                            $link = $this.data("link"),
                            $tr = $link.closest("tr");
                        $.post("index.php?controller=pjAdminQuotationAmounts&action=pjActionDelete", {
                            id: $link.data("id"),
                            Qid: $link.data("id"),
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

        if ($("#grid").length > 0 && datagrid) {


            var $grid = $("#grid").datagrid({
                buttons: [
                    {type: "edit", url: "index.php?controller=pjAdminQuotationAmounts&action=pjActionUpdate&id={:id}"},
                    {type: "delete", url: "index.php?controller=pjAdminQuotationAmounts&action=pjActionDelete&id={:id}"}
                ],
                columns: [
                    {text: myLabel.location, type: "text", sortable: false, editable: false},
                    {text: myLabel.type, type: "text", sortable: false, editable: false},
                    {text: myLabel.day, type: "text", sortable: false, editable: true},
                    {text: myLabel.week, type: "text", sortable: false, editable: true},
                    {text: myLabel.month, type: "text", sortable: false, editable: true}
                ],
                dataUrl: "index.php?controller=pjAdminQuotationAmounts&action=pjActionGetQuotationCategoryAmount",
                dataType: "json",
                fields: ['location', 'type', 'day', 'week', 'month'],
                paginator: false,
                saveUrl: "index.php?controller=pjAdminQuotationAmounts&action=pjActionSave&id={:id}"
            });
        }

        if ($("#grid2").length > 0 && datagrid) {


            var $grid2 = $("#grid2").datagrid({
                buttons: [
                    {type: "edit", url: "index.php?controller=pjAdminQuotationAmounts&action=pjActionUpdate&id={:id}"},
                    {type: "delete", url: "index.php?controller=pjAdminQuotationAmounts&action=pjActionDelete&id={:id}"}
                ],
                columns: [
                    {text: myLabel.location, type: "text", sortable: false, editable: false},
                    {text: myLabel.car, type: "text", sortable: false, editable: false},
                    {text: myLabel.day, type: "text", sortable: false, editable: true},
                    {text: myLabel.week, type: "text", sortable: false, editable: true},
                    {text: myLabel.month, type: "text", sortable: false, editable: true}
                ],
                dataUrl: "index.php?controller=pjAdminQuotationAmounts&action=pjActionGetQuotationCarAmount",
                dataType: "json",
                fields: ['location', 'car', 'day', 'week', 'month'],
                paginator: {
                                gotoPage: true,
                                paginate: true,
                                total: true,
                                rowCount: true
                            },
                saveUrl: "index.php?controller=pjAdminQuotationAmounts&action=pjActionSave&id={:id}"
            });
        }

        // if ($("#grid2").length > 0 && datagrid) {
        //
        //
        //     var $grid2 = $("#grid2").datagrid({
        //         buttons: [{type: "edit", url: "index.php?controller=pjAdminQuotationAmounts&action=pjActionUpdate&id={:id}"},
        //             {
        //                 type: "QuotationAmount-info",
        //                 url: "index.php?controller=pjAdminQuotationAmounts&action=pjActionGetQuotationAmountInfo&id={:id}"
        //             }
        //         ],
        //         columns: [{text: myLabel.c_title, type: "text", sortable: true, editable: false},
        //             {text: myLabel.name, type: "text", sortable: true, editable: false},
        //             {text: myLabel.email, type: "text", sortable: true, editable: false},
        //             {text: myLabel.phone, type: "text", sortable: true, editable: false},
        //             {text: myLabel.driver_licence_number, type: "text", sortable: false, editable: true}
        //         ],
        //         dataUrl: "index.php?controller=pjAdminQuotationAmounts&action=pjActionGetQuotationAmount",
        //         dataType: "json",
        //         fields: ['c_title', 'name', 'email', 'phone', 'driver_licence_number'],
        //         paginator: {
        //             gotoPage: true,
        //             paginate: true,
        //             total: true,
        //             rowCount: true
        //         },
        //         saveUrl: "index.php?controller=pjAdminQuotationAmounts&action=pjActionSaveQuotationAmount&id={:id}"
        //     });
        // }

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
            $grid.datagrid("load", "index.php?controller=pjAdminQuotationAmounts&action=pjActionGetQuotationAmount", "id", "ASC", content.page, content.rowCount);
            return false;
        }).on("submit", ".frm-filter", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var $this = $(this),
                content = $grid2.datagrid("option", "content"),
                cache = $grid2.datagrid("option", "cache");
            $.extend(cache, {
                q: $this.find("input[name='q']").val()
            });
            $grid2.datagrid("option", "cache", cache);
            $grid2.datagrid("load", "index.php?controller=pjAdminQuotationAmounts&action=pjActionGetQuotationAmount", "id", "ASC", content.page, content.rowCount);
            return false;
        }).on("click", "#btnAddQuotationAmount", function (e) {
            var $tr,
                $tbody = $("#tblQuotationAmount tbody"),
                index = Math.ceil(Math.random() * 999999),
                h = $tbody.find("tr:last").find("td:first").html(),
                i = (h === null) ? 0 : parseInt(h, 10);

            i = !isNaN(i) ? i : 0;
            $tr = $("#tblQuotationAmountsClone").find("tbody").clone();
            $tbody.find(".notFound").remove();
            var tr_html = $tr.html().replace(/\{INDEX\}/g, 'x_' + index);
            tr_html = tr_html.replace(/\{PTCLASS\}/g, 'pj-km');
            tr_html = tr_html.replace(/\{ACLASS\}/g, 'pj-QuotationAmount-amount');
            tr_html = tr_html.replace(/\{PDCLASS\}/g, 'pj-date');
            $tbody.append(tr_html);

            $tbody.find("tr:last").find(".spin").spinner({
                min: 0,
                step: 1
            });
        }).on("click", ".btnRemoveQuotationAmount", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var $tr = $(this).closest("tr");
            $tr.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
                $tr.remove();
                // calPayment();
            });
            return false;
        }).on("click", ".btnDeleteQuotationAmount", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            if ($dialogDeleteQuotationAmount.length > 0 && dialog) {
                $dialogDeleteQuotationAmount.data('link', $(this)).dialog("open");
                // calPayment();
            }
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

            $.get("index.php?controller=controller=pjAdminQuotationAmounts&action=pjActionGetQuotationAmount", {id: id}, function (data) {
                if ($frmUpdate.length > 0) {
                    $('#collect_current_mileage').html(data + ' ' + myLabel.mileage_unit);
                    $('#cr_set_as_current').attr('rev', data);
                }
            });
            var index = $(this).attr('data-index'),
                val = $(this).val();

        });

    });
})(jQuery_1_8_2);