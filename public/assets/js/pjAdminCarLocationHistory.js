var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
    $(function () {
        var $dialogDeleteCarLocationHistory = $("#dialogDeletePayment"),
            $frmCreate = $("#frmCreate"),
            $frmUpdate = $("#frmUpdate"),
            dialog = ($.fn.dialog !== undefined),
            chosen = ($.fn.chosen !== undefined),
            datagrid = ($.fn.datagrid !== undefined);
        if (chosen) {
            $("#car_id").chosen();
        }

        if ($dialogDeleteCarLocationHistory.length > 0 && dialog) {
            $dialogDeleteCarLocationHistory.dialog({
                modal: true,
                autoOpen: false,
                resizable: false,
                draggable: false,
                buttons: {
                    "Delete": function () {
                        var $this = $(this),
                            $link = $this.data("link"),
                            $tr = $link.closest("tr");
                        $.post("index.php?controller=pjAdminCarLocationHistory&action=pjActionDelete", {
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

        $(document).on("click", "#btnAddCarLocationHistory", function (e) {
            var $tr,
                $tbody = $("#tblCarLocationHistory tbody"),
                index = Math.ceil(Math.random() * 999999),
                h = $tbody.find("tr:last").find("td:first").html(),
                i = (h === null) ? 0 : parseInt(h, 10);

            i = !isNaN(i) ? i : 0;
            $tr = $("#tblCarLocationHistoryClone").find("tbody").clone();
            $tbody.find(".notFound").remove();
            var tr_html = $tr.html().replace(/\{INDEX\}/g, 'x_' + index);
            tr_html = tr_html.replace(/\{PTCLASS\}/g, 'pj-km');
            tr_html = tr_html.replace(/\{ACLASS\}/g, 'pj-maintenance-amount');
            tr_html = tr_html.replace(/\{PDCLASS\}/g, 'pj-from-date');
            tr_html = tr_html.replace(/\{PDCLASS\}/g, 'pj-to-date');
            $tbody.append(tr_html);

            $tbody.find("tr:last").find(".spin").spinner({
                min: 0,
                step: 1
            });
        }).on("click", ".btnRemoveCarLocationHistory", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var $tr = $(this).closest("tr");
            $tr.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
                $tr.remove();
                // calPayment();
            });
            return false;
        }).on("click", ".btnDeleteCarLocationHistory", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            if ($dialogDeleteCarLocationHistory.length > 0 && dialog) {
                $dialogDeleteCarLocationHistory.data('link', $(this)).dialog("open");
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

            $.get("index.php?controller=controller=pjAdminCarLocationHistory&action=pjActionGetCarLocationHistory", {id: id}, function (data) {
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