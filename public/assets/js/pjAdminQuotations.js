var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
    $(function () {
        var $frmCreateQuotation = $("#frmCreateQuotation"),
            $frmUpdateQuotation = $("#frmUpdateQuotation"),
            $dialogDeleteQuotation = $("#dialogDeletePayment"),
            $frmCreate = $("#frmCreate"),
            $frmUpdate = $("#frmUpdate"),
            dialog = ($.fn.dialog !== undefined),
            chosen = ($.fn.chosen !== undefined),
            datagrid = ($.fn.datagrid !== undefined);

        if ($frmCreateQuotation.length > 0) {
            $frmCreateQuotation.validate({
                rules: {
                    "email": {
                        required: true,
                        email: true,
                        remote: "index.php?controller=pjAdminQuotations&action=pjActionCheckEmail"
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
        if ($frmUpdateQuotation.length > 0) {
            $frmUpdateQuotation.validate({
                rules: {
                    "email": {
                        required: true,
                        email: true,
                        remote: "index.php?controller=pjAdminQuotations&action=pjActionCheckEmail&id=" + $frmUpdateQuotation.find("input[name='id']").val()
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
        if ($dialogDeleteQuotation.length > 0 && dialog) {
            $dialogDeleteQuotation.dialog({
                modal: true,
                autoOpen: false,
                resizable: false,
                draggable: false,
                buttons: {
                    "Delete": function () {
                        var $this = $(this),
                            $link = $this.data("link"),
                            $tr = $link.closest("tr");
                        $.post("index.php?controller=pjAdminQuotations&action=pjActionDelete", {
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
                    {type: "edit", url: "index.php?controller=pjAdminQuotations&action=pjActionUpdate&id={:id}"},
                    {type: "delete", url: "index.php?controller=pjAdminQuotations&action=pjActionDelete&id={:id}"}
                ],
                columns: [
                    {text: myLabel.from, type: "text", sortable: false, editable: false},
                    {text: myLabel.to, type: "text", sortable: false, editable: false},
                    {text: myLabel.total, type: "text", sortable: false, editable: false},
                    {text: myLabel.name, type: "text", sortable: false, editable: false},
                    {text: myLabel.phone, type: "text", sortable: false, editable: false},
                ],
                dataUrl: "index.php?controller=pjAdminQuotations&action=pjActionGetQuotations",
                dataType: "json",
                fields: ['from', 'to', 'total', 'c_name', 'c_phone'],
                paginator: false,
                saveUrl: "index.php?controller=pjAdminQuotations&action=pjActionSave&id={:id}"
            });
        }


        function getPrices($form){
            $('#pj_price_loader').css('display', 'block');
            $.post("index.php?controller=pjAdminQuotationAmounts&action=pjActionGetPrices", $form.serialize()).done(function (data) {
                $("input#insurance").val(data.insurance);
                $("input#age_fee").val(data.age_fee);
                $("input#second_driver_fee").val(data.second_driver_fee);
                $("input#frais_gp").val(data.frais_gp);
                $("input#frais_i").val(data.frais_i);
                $("input#frais_dr").val(data.frais_dr);
                $("input#sub_total").val(data.sub_total);
                $("input#price").val(data.price);
                $("input#tax").val(data.tax);
                $("input#tvq").val(data.tvq);
                $("input#total").val(data.total);

                $(".cr-total-quote").html(data.total_quote_label);
                $(".cr-due-payment").html(data.total_amount_due_label);

                $("#cr_insurance").html(data.insuranc);
                $("#cr_age_fee").html(data.age_fee);
                $("#cr_second_driver_fee").html(data.second_driver_fee);
                $("#rent_days").html(data.rental_days);
                $("#cr_frais_gp").html(data.frais_gp_label);
                $("#cr_frais_i").html(data.frais_i_label);
                $("#cr_frais_dr").html(data.frais_dr_label);
                $("#cr_sub_total").html(data.sub_total_label);
                $("#cr_tax").html(data.tax_label);
                $("#cr_tax_detail").html(data.tax_detail);
                $("#cr_tvq").html(data.tvq_label);
                $("#cr_tvq_detail").html(data.tvq_detail);
                $("#cr_total_price").html(data.total_price_label);
                $("#cr_required_deposit").html(data.required_deposit_label);
                $("#cr_required_deposit_detail").html(data.required_deposit_detail);

                $("#cr_rental_time").html(data.rental_time);
                $("#cr_rental_time").parent().css('display', 'block');

                $('#pj_price_loader').css('display', 'none');

                if($frmUpdate.length > 0)
                {
                    if($form.valid() && $('#dates').val() == 1 && $('#isUpdate').val() == 1)
                    {
                        $form.submit();
                    }
                }
            });
        }

        $(".cr-button-validate-save").bind("click", function (e) {
            var $form = $(this).closest("form");
            getPrices($form);
            if($form.valid() && $('#dates').val() == 1){
                $('#isUpdate').val(1);
            }
        });
        $("#btnSave").bind("click", function (e) {
            var $form = $(this).closest("form");
            $form.submit();
        });

        $("#content").on("change", "#type_id", function (e) {
            var select_type_id = $(this).find("option:selected").val();

            $.get("index.php?controller=pjAdminQuotations&action=pjActionGetCars", {type_id: select_type_id}, function (data) {
                $("#boxCars").html(data);
                $('#start').val(0);
                getPrices($frmCreate)
            });
        }).on("change", "#car_id", function (e) {
            getPrices($frmCreate)
        });


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
            $grid.datagrid("load", "index.php?controller=pjAdminQuotations&action=pjActionGetQuotation", "id", "ASC", content.page, content.rowCount);
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
            $grid2.datagrid("load", "index.php?controller=pjAdminQuotations&action=pjActionGetQuotation", "id", "ASC", content.page, content.rowCount);
            return false;
        }).on("click", "#btnAddQuotation", function (e) {
            var $tr,
                $tbody = $("#tblQuotation tbody"),
                index = Math.ceil(Math.random() * 999999),
                h = $tbody.find("tr:last").find("td:first").html(),
                i = (h === null) ? 0 : parseInt(h, 10);

            i = !isNaN(i) ? i : 0;
            $tr = $("#tblQuotationsClone").find("tbody").clone();
            $tbody.find(".notFound").remove();
            var tr_html = $tr.html().replace(/\{INDEX\}/g, 'x_' + index);
            tr_html = tr_html.replace(/\{PTCLASS\}/g, 'pj-km');
            tr_html = tr_html.replace(/\{ACLASS\}/g, 'pj-Quotation-amount');
            tr_html = tr_html.replace(/\{PDCLASS\}/g, 'pj-date');
            $tbody.append(tr_html);

            $tbody.find("tr:last").find(".spin").spinner({
                min: 0,
                step: 1
            });
        }).on("click", ".btnRemoveQuotation", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var $tr = $(this).closest("tr");
            $tr.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
                $tr.remove();
                // calPayment();
            });
            return false;
        }).on("click", ".btnDeleteQuotation", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            if ($dialogDeleteQuotation.length > 0 && dialog) {
                $dialogDeleteQuotation.data('link', $(this)).dialog("open");
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
                            getPrices($frmUpdate)
                        }
                        if (($frmCreate.length > 0) && ($this.attr("name") == 'date_from' || $this.attr("name") == 'date_to')) {
                            if($('#date_from').val() != '' && $('#date_to').val() != '' && $('#type_id').val() != '')
                            {
                                getPrices($frmCreate)
                            }
                        }
                    }
                };

            $(this).datetimepicker($.extend(o, custom));

        }).on('change', '#ch_frais_gp', function (e) {
            this.value = this.checked ? 1 : 0;
        }).on('change', '#ch_frais_i', function (e) {
            this.value = this.checked ? 1 : 0;
        }).on('change', '#ch_frais_dr', function (e) {
            this.value = this.checked ? 1 : 0;
        }).on("click", ".pj-form-field-icon-date", function (e) {
            var $dp = $(this).parent().siblings("input[type='text']");
            if ($dp.hasClass("hasDatepicker")) {
                $dp.datepicker("show");
            } else {
                $dp.trigger("focusin").datepicker("show");
            }

        }).on("click", ".send-email", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }

            var id = $("input[name='id']").val();
            var c_email = $("input[name='c_email']").val();

            var inspection = $(".mail-footer").html();
            let text = 'Mail is being sent.';
            $('.send-contract-mail').css('display', 'block');

            if (id) {
                $('.send-contract-mail').html(text);

                $.post("index.php?controller=pjAdminQuotations&action=pjActionSendContract", {
                    id: id,
                    c_email: c_email,
                    inspection: inspection
                }, function (data) {
                    $('.send-contract-mail').html(data.text);
                });
            } else {
                return false;
            }
        }).on("click", ".send-sms", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            let text = 'Sms is being sent.';
            var id = $("input[name='id']").val();
            var c_phone = $("input[name='c_phone']").val();
            $('.send-contract-sms').html(text);
            $('.send-contract-sms').css('display', 'block');
            if (id) {
                $.post("index.php?controller=pjAdminQuotations&action=pjActionSendSms", {
                    id: id,
                    c_phone: c_phone
                }, function (data) {
                    $('.send-contract-sms').html(data.text);
                });
            } else {
                return false;
            }
        }).on(
            'change',
            'select[name="c_driver_age"], select[name="c_second_driver_age"], [data-second-driver-toggle],' +
            'input[name="discount_amount"], select[name="discount_type"], select[name="discount_per"],' +
            'input[name="ch_frais_gp"], input[name="ch_frais_i"], input[name="ch_frais_dr"], ' +
            'input[name="desirable_total_price"], input[name="insurance"], input[name="age_fee"], input[name="second_driver_fee"]',
            function (e) {
                if($frmUpdate.length > 0){
                    getPrices($frmUpdate);
                }
                if($frmCreate.length > 0){
                    getPrices($frmCreate);
                }
            }).on("click", "#cr_set_as_current", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
        }).on("click", ".pj-table-icon-transfer", function (e) {
            var id = $(this).val();

            $.get("index.php?controller=controller=pjAdminQuotations&action=pjActionGetQuotation", {id: id}, function (data) {
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