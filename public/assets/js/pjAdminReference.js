var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
    $(function () {
        var $frmCreateReference = $("#frmCreateReference"),
            $frmUpdateReference = $("#frmUpdateReference"),
            $dialogDeleteReference = $("#dialogDeletePayment"),
            $frmCreate = $("#frmCreate"),
            $frmUpdate = $("#frmUpdate"),
            dialog = ($.fn.dialog !== undefined),
            chosen = ($.fn.chosen !== undefined),
            datagrid = ($.fn.datagrid !== undefined);
        if (chosen) {
            $("#car_id").chosen();
        }
        if ($frmCreateReference.length > 0) {
            $frmCreateReference.validate({
                rules: {
                    "email": {
                        required: true,
                        email: true,
                        remote: "index.php?controller=pjAdminReference&action=pjActionCheckEmail"
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
        if ($frmUpdateReference.length > 0) {
            $frmUpdateReference.validate({
                rules: {
                    "email": {
                        required: true,
                        email: true,
                        remote: "index.php?controller=pjAdminReference&action=pjActionCheckEmail&id=" + $frmUpdateReference.find("input[name='id']").val()
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
        if ($dialogDeleteReference.length > 0 && dialog) {
            $dialogDeleteReference.dialog({
                modal: true,
                autoOpen: false,
                resizable: false,
                draggable: false,
                buttons: {
                    "Delete": function () {
                        var $this = $(this),
                            $link = $this.data("link"),
                            $tr = $link.closest("tr");
                        $.post("index.php?controller=pjAdminReference&action=pjActionDelete", {
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
                    {type: "edit", url: "index.php?controller=pjAdminReference&action=pjActionUpdate&id={:id}"},
                    {type: "delete", url: "index.php?controller=pjAdminReference&action=pjActionDelete&id={:id}"}
                ],
                columns: [
                    {text: myLabel.name, type: "text", sortable: false, editable: false},
                    {text: myLabel.status, type: "select", sortable: true, editable: true, options: [{
                            label: myLabel.active, value: "T"
                        }, {
                            label: myLabel.inactive, value: "F"
                        }], applyClass: "pj-status"}
                ],
                dataUrl: "index.php?controller=pjAdminReference&action=pjActionGetReferences",
                dataType: "json",
                fields: ['name','status'],
                paginator: {
                    gotoPage: true,
                    paginate: true,
                    total: true,
                    rowCount: true
                },
                saveUrl: "index.php?controller=pjAdminReference&action=pjActionSave&id={:id}"
            });
        }

        $(document).on("click", ".btnRemoveReference", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            var $tr = $(this).closest("tr");
            $tr.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
                $tr.remove();
                // calPayment();
            });
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
            $grid.datagrid("load", "index.php?controller=pjAdminReference&action=pjActionGetReferences", "name", "ASC", content.page, content.rowCount);
            return false;
        }).on("click", ".btnDeleteReference", function (e) {
            if (e && e.preventDefault) {
                e.preventDefault();
            }
            if ($dialogDeleteReference.length > 0 && dialog) {
                $dialogDeleteReference.data('link', $(this)).dialog("open");
                // calPayment();
            }
            return false;
        });

    });
})(jQuery_1_8_2);