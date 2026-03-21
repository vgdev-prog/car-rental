var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();
(function ($, undefined) {
    // pjAdminInvoice::ActionCreate|ActionUpdate js

    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('action') != 'pjActionIndex') {
        $(function () {
            var state = {};

            $('#tabs').tabs();

            var invoice = {

                listActionURL: '/index.php?controller=pjAdminInvoices&action=pjActionIndex',
                countries: [],
                locations: [],
                customersCache: null,
                customer: null,
                invoice: null,

                invoiceTaxes: null,

                elements: {
                    form: $('#invoice_form'),

                    invoiceDate: $('#invoice_date'),
                    dueDate: $('#due_date'),

                    customerId: $('#customer_id'),
                    billingName: $('#billing_name'),
                    billingAddress: $('#billing_address'),

                    locationId: $('#invoice_form').find('#location_id'),
                    companyName: $('#company_name'),
                    companyAddress: $('#company_address'),
                    companyContacts: $('#company_contacts'),

                    tpsPercent: $('#tps'),
                    tpsNumber: $('#tps_number'),
                    tvqPercent: $('#tvq'),
                    tvqNumber: $('#tvq_number'),

                    totalPrice: $('#total_price'),
                    taxTotal: $('#tax_total'),
                    grandTotal: $('#grand_total'),

                    invoiceItemTemplate: $('#invoice_item_template'),
                    invoiceItemsContainer: $('#invoice_items > tbody'),

                    addInvoiceButton: $('#btn_add_invoice_item'),
                    pullBillingButton: $('#btn_pull_billing_data'),
                    pullCompanyButton: $('#btn_pull_company_data'),

                    saveButton: $('#save-btn'),
                    cancelButton: $('#cancel-btn'),

                    emailField: $('#email'),
                    phoneField: $('#phone'),

                    sendSmsButton: $('#send_sms'),
                    sendEmailButton: $('#send_email'),
                },

                getLocationId() {
                    return this.elements.locationId.val();
                },

                getLocationProp(name) {
                    // TODO update to use this.location instead of this.locations.find
                    let locationId = this.getLocationId();
                    if (!locationId) {
                        return;
                    }
                    let locationData = this.locations.find(row => row.id == locationId);

                    return locationData[name] ?? '';
                },

                getLocationSetting(name) {
                    let locationId = this.getLocationId();
                    if (!locationId) {
                        return;
                    }
                    let locationData = this.locations.find(row => row.id == locationId);

                    return locationData.settings.find(row => row.name == name)?.value;
                },

                getTpsPercent() {
                    let value = parseFloat(this.elements.tpsPercent.val());
                    if (!value) {
                        value = 0
                    }

                    return value;
                },

                getTvqPercent() {
                    let value = parseFloat(this.elements.tvqPercent.val());
                    if (!value) {
                        value = 0
                    }

                    return value;
                },

                /**
                 * updates prices in rows and in tfooter
                 */
                updatePrices() {

                    this.elements.invoiceItemsContainer.find('tr').each(function (e) {
                        invoice.updateRow(this);
                    })

                    this.updateTotalPrices();
                },

                /**
                 * adds a row to invoice items, sets event listeners
                 * @param data data to fill row's fields
                 */
                addItemRow(data = null) {
                    var container = this.elements.invoiceItemsContainer,
                        template = $(this.elements.invoiceItemTemplate.html());

                    if (data) {
                        template.find('[name="id[]"]').val(data.id);
                        template.find('[name="details[]"]').val(data.details);
                        template.find('[name="quantity[]"]').val(data.quantity);
                        template.find('[name="price[]"]').val(data.price);
                        template.find('[name="charge_taxes_input[]"]').prop('checked', data.charge_taxes == 'T');
                        template.find('[name="charge_taxes[]"]').val(data.charge_taxes);
                    }

                    template.find('a').click(function (e) {
                        e.preventDefault();

                        template.css("backgroundColor", "#FFB4B4").fadeOut("slow", function () {
                            template.remove();
                            invoice.updateTotalPrices();
                        });
                    })

                    template.find('[name="quantity[]"], [name="price[]"], [name="charge_taxes_input[]"]')
                        .on('click change keyup', function (e) {
                            invoice.updateRow(template);
                            invoice.updateTotalPrices();
                        });

                    template.find('[name="charge_taxes_input[]"]')
                        .on('change', function (e) {
                            template.find('[name="charge_taxes[]"]').val(this.checked ? 'T' : 'F');
                        });


                    template.addClass('pj-table-row-' + (container.children().length % 2 ? 'even' : 'odd'))
                    container.append(template);

                    return template;
                },

                /**
                 * updates dynamic tax and totals
                 */
                updateTotalPrices() {
                    let itemRowElements = $('#invoice_items > tbody > tr');

                    let priceTotal = 0,
                        taxTotal = 0;

                    $('[name="row_taxes[]"]', itemRowElements).each(function (i, e) {
                        taxTotal += parseFloat($(this).val());
                    });

                    $('[name="row_total[]"]', itemRowElements).each(function (i, e) {
                        priceTotal += parseFloat($(this).val());
                    });

                    this.elements.totalPrice.html(formatCurrency(priceTotal));
                    this.elements.taxTotal.html(formatCurrency(taxTotal));
                    this.elements.grandTotal.html(formatCurrency(priceTotal + taxTotal));
                },

                /**
                 * updates view and data of a row
                 * @param rowElement HTMLElement td element representing row
                 */
                updateRow(rowElement) {
                    let tps = this.getTpsPercent(),
                        tvq = this.getTvqPercent();

                    let id = $('[name="id[]"]', rowElement).val(),
                        quantity = $('[name="quantity[]"]', rowElement).val(),
                        price = $('[name="price[]"]', rowElement).val();


                    let rowTotal = quantity * price,
                        rowTaxes = $('[name="charge_taxes_input[]"]', rowElement).is(":checked")
                            ? rowTotal * (tps + tvq) / 100 : 0;

                    $('[name="row_total[]"]', rowElement).val(rowTotal.toFixed(2));
                    $('[name="row_taxes[]"]', rowElement).val(rowTaxes.toFixed(2));

                    $('.invoice-item-total', rowElement).html(formatCurrency(rowTotal));
                },

                init() {
                    var urlParams = new URLSearchParams(window.location.search);
                    var invoice_id = urlParams.has('id') ? urlParams.get('id') : undefined;

                    var requests = [];

                    requests.push($.ajax({
                        url: "index.php?controller=pjAdminLocations&action=pjActionGetAll",
                        processData: false,
                        contentType: false,
                        type: 'POST',
                        success: function (data) {
                            if (typeof data !== 'object') {
                                throw new Error('Wrong response object.');
                            }

                            invoice.locations.push(...data);
                            invoice.elements.locationId.find('option').each(function (i, el) {
                                $el = $(el);
                                if ($el.val() != '') {
                                    $el.remove();
                                }
                            });

                            data.forEach(function (item) {
                                invoice.elements.locationId.append($('<option>', {
                                    value: item.id,
                                    text: item.name
                                }));
                            });
                            invoice.elements.locationId.trigger("liszt:updated");
                        }
                    }));

                    if (invoice_id) {
                        requests.push($.ajax({
                            url: "index.php?controller=pjAdminInvoices&action=pjActionGet",
                            data: {
                                id: invoice_id
                            },
                            type: 'POST',
                            success: function (data) {
                                if (data.status == 0) {
                                    alert(data.message);
                                    window.location.href = invoice.listActionURL;
                                    return;
                                }
                                invoice.invoice = data.data;
                            }
                        }));
                    }

                    $.when(...requests).done(function (...results) {
                        // jQuery changes behaviour of this function arguments depending on number of requests passed
                        if (requests.length == 1) {
                            results = [results]
                        }
                        results.forEach(function (result, index) {

                        });

                        invoice.elements.locationId.trigger('change');
                        invoice.elements.customerId.trigger('change');

                        if (invoice.invoice) {
                            let elements = invoice.elements;

                            let invoiceDate = new Date(invoice.invoice.invoice_date);
                            elements.invoiceDate.val(
                                ('0' + invoiceDate.getDate()).slice(-2) + '-'
                                + ('0' + (invoiceDate.getMonth()+1)).slice(-2) + '-'
                                + invoiceDate.getFullYear()
                            );

                            let dueDate = new Date(invoice.invoice.due_date);
                            elements.dueDate.val(
                                ('0' + dueDate.getDate()).slice(-2) + '-'
                                + ('0' + (dueDate.getMonth()+1)).slice(-2) + '-'
                                + dueDate.getFullYear()
                            );

                            elements.billingName.val(invoice.invoice.billing_name);
                            elements.billingAddress.val(invoice.invoice.billing_address);

                            elements.locationId.val(invoice.invoice.location_id).change();
                            elements.locationId.trigger("liszt:updated");

                            elements.companyName.val(invoice.invoice.company_name);
                            elements.companyAddress.val(invoice.invoice.company_address);
                            elements.companyContacts.val(invoice.invoice.company_contacts);

                            elements.tpsNumber.val(invoice.invoice.tps_number);
                            elements.tpsPercent.val(invoice.invoice.tps);
                            elements.tvqNumber.val(invoice.invoice.tvq_number);
                            elements.tvqPercent.val(invoice.invoice.tvq);

                            if (invoice.invoice?.items) {
                                invoice.invoice.items.forEach(function (item) {
                                    let row = invoice.addItemRow(item);
                                    invoice.updateRow(row);
                                });
                            }
                        }

                        invoice.updatePrices();
                    });

                    // TODO replace this with ajax call
                    this.countries = country_data;

                    this.elements.locationId.chosen();

                    /* EVENT LISTENERS FOLLOWING */
                    this.elements.locationId.change(function (e) {
                        invoice.location = invoice.locations.find(row => row.id == $(this).val());
                    });

                    this.elements.addInvoiceButton.click(function (e) {
                        invoice.addItemRow();
                    });

                    this.elements.pullBillingButton.click(function (e) {
                        if (!invoice.customer) {
                            invoice.elements.customerId.chosen().next().fadeOut(100).fadeIn(100);
                            return;
                        }

                        let customer = invoice.customer,
                            country = invoice.countries.find(row => row.id == customer.c_country) ?? {};

                        let billingName = customer.c_company ? customer.c_company : customer.c_name,
                            billingAddress = [
                                customer.c_address,
                                customer.c_city,
                                customer.c_zip,
                                country?.country_title
                            ].filter(n => n).join('\n');

                        invoice.elements.billingName.val(billingName);
                        invoice.elements.billingAddress.val(billingAddress);
                    });

                    this.elements.pullCompanyButton.click(function (e) {
                        if (!invoice.getLocationId()) {
                            invoice.elements.locationId.next().fadeOut(100).fadeIn(100);
                            return;
                        }

                        let location = invoice.location,
                            country = invoice.countries.find(row => row.id == location.country_id) ?? {};

                        let companyName = location.name,
                            companyAddress = [
                                location.address_1,
                                location.city,
                                location.zip,
                                country?.country_title
                            ].filter(n => n).join('\n'),
                            companyContacts = [
                                location.phone ? 'Phone:' + location.phone : '',
                                location.name,
                                location.email
                            ].filter(n => n).join('\n');
                        ;

                        invoice.elements.companyName.val(companyName);
                        invoice.elements.companyAddress.val(companyAddress);
                        invoice.elements.companyContacts.val(companyContacts);

                        invoice.elements.tpsPercent.val(invoice.getLocationSetting('tps'));
                        invoice.elements.tpsNumber.val(invoice.getLocationProp('tps_number'));

                        invoice.elements.tvqPercent.val(invoice.getLocationSetting('tvq'));
                        invoice.elements.tvqNumber.val(invoice.getLocationProp('tvq_number'));

                        invoice.updatePrices();
                    });

                    this.elements.tvqPercent.add(this.elements.tpsPercent).on('change keyup', function (e) {
                        invoice.updatePrices();
                    })

                    let chosen = this.elements.customerId.chosen().data('chosen'),
                        chosenProto = Object.getPrototypeOf(chosen);
                    // we need to modify this method - removed search input modification
                    chosenProto.show_search_field_default = function () {
                        if (this.is_multiple && this.choices < 1 && !this.active_field) {
                            this.search_field.val(this.default_text);
                            return this.search_field.addClass("default");
                        } else {
                            return this.search_field.removeClass("default");
                        }
                    }.bind(chosen);

                    this.elements.customerId.next().find("input:first-child").bind("keyup.chosen paste.chosen cut.chosen", function (e) {
                        let query = $(e.target).val();

                        if (query.length < 3) {
                            // duplicate code here (few lines lower)
                            invoice.elements.customerId.find('option').each(function (i, el) {
                                $el = $(el);
                                if ($el.val() != '') {
                                    $el.remove();
                                }
                            });
                            invoice.elements.customerId.trigger("liszt:updated");
                            return;
                        }

                        requests.push($.ajax({
                            url: "index.php?controller=pjAdminCustomers&action=pjActionGetCustomer",
                            data: {
                                q: query
                            },
                            type: 'GET',
                            success: function (data) {
                                invoice.elements.customerId.find('option').each(function (i, el) {
                                    $el = $(el);
                                    if ($el.val() != '') {
                                        $el.remove();
                                    }
                                });

                                data.data.forEach(function (item) {
                                    invoice.elements.customerId.append($('<option>', {
                                        value: item.id,
                                        text: item.name
                                    }));
                                });
                                invoice.elements.customerId.trigger("liszt:updated");
                            }
                        }));
                    });

                    this.elements.customerId.change(function (e) {
                        let customerId = $(this).val();

                        invoice.customer = null;

                        if (!customerId) {
                            invoice.elements.phoneField.val('');
                            invoice.elements.emailField.val('');
                            return;
                        }

                        $.ajax({
                            url: "index.php?controller=pjAdminCustomers&action=pjActionGetCustomerById",
                            data: {
                                id: customerId
                            },
                            type: 'GET',
                            success: function (data) {
                                invoice.customer = data;
                                invoice.elements.phoneField.val(invoice.customer.c_phone);
                                invoice.elements.emailField.val(invoice.customer.c_email);
                            }
                        })
                    });

                    this.elements.cancelButton.click(function () {
                        $.cookie('isRedirected', true);
                        window.location.href = this.listActionURL;
                    });

                    this.elements.saveButton.click(function (e) {
                        invoice.elements.form.submit();
                    });

                    this.elements.form.submit(function (e) {
                        e.preventDefault();

                        if (!$(e.target).valid()) {
                            return;
                        }

                        let data = new FormData(e.target),
                            url = this.action;

                        $.ajax({
                            url: url,
                            data: data,
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            success: function (data) {
                                if (data.redirect) {
                                    window.location.href = data.redirect;
                                }

                                if (data.status == 1) {
                                    $('<div />').css('text-align', 'center').html('Changes are successfully saved.').dialog({
                                        modal: true,
                                        show: "slide",
                                        draggable: false,
                                        buttons: {
                                            "Ok": function () {
                                                $(this).dialog("close");
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }).validate({
                        onkeyup: false,
                        errorClass: "err",
                        // wrapper: "em",
                        ignore: ".ignore",
                    });

                    this.updateTotalPrices();
                }
            }

            invoice.init();

            // legacy code from now on
            $(document).on("focusin", ".datetimepick", function (e) {
                var $this = $(this),
                    options = {
                        firstDay: $this.attr("rel"),
                        dateFormat: $this.attr("rev"),
                        timeFormat: '',
                        showHour: false,
                        showMinute: false,
                        showTime: false,
                    };

                $this.datetimepicker(options);

            }).on("click", ".pj-form-field-icon-date", function (e) {
                var $dp = $(this).parent().siblings("input[type='text']");
                if ($dp.hasClass("hasDatepicker")) {
                    $dp.datepicker("show");
                } else {
                    $dp.trigger("focusin").datepicker("show");
                }
            });

            function formatCurrency(price) {
                var format = '---', currency = myLabel.currency;
                switch (currency) {
                    case 'GBP':
                        format = "&pound;" + price.toFixed(2);
                        break;
                    case 'EUR':
                        format = "&euro;" + price.toFixed(2);
                        break;
                    case 'JPY':
                        format = "&yen;" + price.toFixed(2);
                        break;
                    case 'USD':
                    case 'AUD':
                    case 'CAD':
                    case 'NZD':
                    case 'CHF':
                    case 'HKD':
                    case 'SGD':
                    case 'SEK':
                    case 'DKK':
                    case 'PLN':
                        format = price.toFixed(2) + ' ' + currency;
                        break;
                    case 'NOK':
                    case 'HUF':
                    case 'CZK':
                    case 'ILS':
                    case 'MXN':
                        format = currency + price.toFixed(2);
                        break;
                    default:
                        format = price.toFixed(2) + currency;
                        break;
                }
                return format;
            }


            $(document).on("click", ".send-email", function (e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }

                var id = invoice.invoice?.id;

                if (!id) {
                    alert('In order to send email to the customer you should save invoice first.')
                }

                $.post("index.php?controller=pjAdminInvoices&action=pjActionSendEmail", {
                    id: id
                }, function (data) {
                    if (data.status == 1) {
                        $('<div />').css('text-align', 'center').html('Email has been successfully sent.').dialog({
                            modal: true,
                            show: "slide",
                            draggable: false,
                            buttons: {
                                "Ok": function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    } else {
                        $('<div />').css('text-align', 'center').html('Email has not been sent.').dialog({
                            modal: true,
                            show: "slide",
                            draggable: false,
                            buttons: {
                                "Ok": function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                });
            }).on("click", ".send-sms", function (e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }

                var id = invoice.invoice?.id;

                if (!id) {
                    alert('In order to send email to the customer you should save invoice first.')
                }

                $.post("index.php?controller=pjAdminInvoices&action=pjActionSendSms", {
                    id: id
                }, function (data) {
                    if (data.status == 1) {
                        $('<div />').css('text-align', 'center').html('SMS has been successfully sent.').dialog({
                            modal: true,
                            show: "slide",
                            draggable: false,
                            buttons: {
                                "Ok": function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    } else {
                        $('<div />').css('text-align', 'center').html('SMS has not been sent.').dialog({
                            modal: true,
                            show: "slide",
                            draggable: false,
                            buttons: {
                                "Ok": function () {
                                    $(this).dialog("close");
                                }
                            }
                        });
                    }
                });
            });

        });
    } else {
        // LEGACY CODE FOLLOWS
        // pjActionIndex page javascript follows

        $(function () {
            var gridSettings = $.cookie('selectedPaginationOptions') && JSON.parse($.cookie('selectedPaginationOptions'));
            var isRedirected = $.cookie('isRedirected') && JSON.parse($.cookie('isRedirected'));
            if (gridSettings) {
                var gridQuery = $.map(gridSettings, function (val, index) {
                    var str = index + "=" + val;
                    return str;
                }).join("&");

                if (gridSettings.is_paid ?? null) {
                    $('#is_paid').val(gridSettings.is_paid).change();
                }
                if (gridSettings.customer_id ?? null) {
                    $('#customer_id').val(gridSettings)
                }
            }

            var $grid = $("#grid").datagrid({
                buttons: [
                    {
                        type: "print",
                        url: "index.php?controller=pjAdminInvoices&action=pjActionPrint&id={:id}&popup=true",
                        target: '_blank',
                        title: 'Print invoice'
                    },
                    {
                        type: "download",
                        url: "index.php?controller=pjAdminInvoices&action=pjActionInvoiceDownload&id={:id}",
                        title: 'Download invoice as PDF'
                    },
                    {
                        type: "edit",
                        url: "index.php?controller=pjAdminInvoices&action=pjActionInvoiceForm&id={:id}",
                        title: 'Edit invoice'
                    },
                    {
                        type: "delete",
                        url: "index.php?controller=pjAdminInvoices&action=pjActionDelete&id={:id}",
                        title: 'Delete invoice'
                    }
                ],
                columns: [
                    {text: myLabel.name, type: "text", sortable: true, editable: false},
                    {text: myLabel.invoice_id, type: "text", sortable: true, editable: false},
                    {
                        text: myLabel.is_paid, type: "select", sortable: true, editable: true, options: [
                            {label: myLabel.notpaid, value: "F"},
                            {label: myLabel.paid, value: "T"}
                        ], applyClass: "pj-status"
                    },
                ],
                dataUrl:
                    isRedirected
                        ? "index.php?controller=pjAdminInvoices&action=pjActionGetInvoices" + '&' + gridQuery
                        : "index.php?controller=pjAdminInvoices&action=pjActionGetInvoices",
                dataType: "json",
                fields: ['billing_name', 'id', 'is_paid'],
                paginator: {
                    actions: [
                        {
                            text: 'Delete selected',
                            url: "index.php?controller=pjAdminInvoices&action=pjActionDeleteInvoiceBulk",
                            render: true,
                            confirmation: 'Are you sure to delete selected records?'
                        }
                    ],
                    gotoPage: true,
                    paginate: true,
                    total: true,
                    rowCount: true
                },
                saveUrl: "index.php?controller=pjAdminInvoices&action=pjActionSave&id={:id}",
                select: {
                    field: "id",
                    name: "record[]"
                }
            });
            $.cookie('isRedirected', false);
            // $.cookie('selectedPaginationOptions', JSON.stringify({}));
            var queryHashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            var pageAction = queryHashes[1];
            $.cookie('selectedPanelPage', pageAction);


            $(document).on("click", ".pj-button-detailed, .pj-button-detailed-arrow", function (e) {
                e.stopPropagation();
                $(".pj-form-filter-advanced").toggle();
            }).on("submit", ".frm-filter-advanced", function (e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
                var obj = {},
                    $this = $(this),
                    arr = $this.serializeArray(),
                    content = $grid.datagrid("option", "content"),
                    cache = $grid.datagrid("option", "cache");
                for (var i = 0, iCnt = arr.length; i < iCnt; i++) {
                    obj[arr[i].name] = arr[i].value;
                }
                $.extend(cache, obj);
                $.cookie('selectedPaginationOptions', JSON.stringify(cache));
                $grid.datagrid("option", "cache", cache);
                // $grid.datagrid("load", "index.php?controller=pjAdminBookings&action=pjActionGetBookings" + pjGrid.queryString, "created", "DESC", content.page, content.rowCount);
                return false;
            });
// ------------------------------------------------
            let customerSelect = $('#customer_id');
            let chosen = customerSelect.chosen().data('chosen'),
                chosenProto = Object.getPrototypeOf(chosen);
            // we need to modify this method - removed search input modification
            chosenProto.show_search_field_default = function () {
                if (this.is_multiple && this.choices < 1 && !this.active_field) {
                    this.search_field.val(this.default_text);
                    return this.search_field.addClass("default");
                } else {
                    return this.search_field.removeClass("default");
                }
            }.bind(chosen);

            customerSelect.next().find("input:first-child").bind("keyup.chosen paste.chosen cut.chosen", function (e) {
                let query = $(e.target).val();

                if (query.length < 3) {
                    // duplicate code here (few lines lower)
                    customerSelect.find('option').each(function (i, el) {
                        $el = $(el);
                        if ($el.val() != '') {
                            $el.remove();
                        }
                    });
                    customerSelect.trigger("liszt:updated");
                    return;
                }

                $.ajax({
                    url: "index.php?controller=pjAdminCustomers&action=pjActionGetCustomer",
                    data: {
                        q: query
                    },
                    type: 'GET',
                    success: function (data) {
                        customerSelect.find('option').each(function (i, el) {
                            $el = $(el);
                            if ($el.val() != '') {
                                $el.remove();
                            }
                        });

                        data.data.forEach(function (item) {
                            customerSelect.append($('<option>', {
                                value: item.id,
                                text: item.name
                            }));
                            customerSelect.trigger("liszt:updated");
                        });
                    }
                });
            });

            customerSelect.change(function (e) {
                console.log(this.value);
            })

            $(document).on("focusin", "#invoice_date, #due_date", function (e) {
                $(this).datepicker({
                    firstDay: $(this).attr('rel'),
                    dateFormat: $(this).attr('rev'),
                    onSelect: function (dateText, inst) {
                    }
                });

            }).on("click", ".pj-form-field-icon-date", function (e) {
                var $dp = $(this).parent().siblings("input[type='text']");
                if ($dp.hasClass("hasDatepicker")) {
                    $dp.datepicker("show");
                } else {
                    $dp.trigger("focusin").datepicker("show");
                }

            }).on("submit", ".frm-filter", function (e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
                var $this = $(this),
                    content = $grid.datagrid("option", "content"),
                    cache = $grid.datagrid("option", "cache");
                $.extend(cache, {
                    q: $this.find("input[name='q']").val(),
                    page: content.page,
                    column: content.column,
                    direction: content.direction,
                });

                $.cookie('selectedPaginationOptions', JSON.stringify(cache));
                $grid.datagrid("option", "cache", cache);
                $grid.datagrid("load", "index.php?controller=pjAdminInvoices&action=pjActionGetInvoices", "created", "DESC", content.page, content.rowCount);
                return false;
            }).on("submit", ".frm-filter-advanced", function (e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
                var obj = {},
                    $this = $(this),
                    arr = $this.serializeArray(),
                    content = $grid.datagrid("option", "content"),
                    cache = $grid.datagrid("option", "cache");

                for (var i = 0, iCnt = arr.length; i < iCnt; i++) {
                    obj[arr[i].name] = arr[i].value;
                }
                $.extend(cache, obj);

                $grid.datagrid("option", "cache", cache);
                $grid.datagrid("load", "index.php?controller=pjAdminInvoices&action=pjActionGetInvoices", "created", "DESC", content.page, content.rowCount);
                return false;
            }).on("reset", ".frm-filter-advanced", function (e) {
                $(".pj-button-detailed").trigger("click");
                $('#is_paid').prop('selectedIndex', 0);
                $('#customer_id').prop('selectedIndex', 0).trigger("liszt:updated");
                $('#location_id').prop('selectedIndex', 0);
                $('#invoice_date').val('');
                $('#due_date').val('');
            }).on("click", ".btn-filter", function (e) {
                if (e && e.preventDefault) {
                    e.preventDefault();
                }

                var $this = $(this),
                    content = $grid.datagrid("option", "content"),
                    cache = $grid.datagrid("option", "cache"),
                    obj = {};

                $this.addClass("pj-button-active").siblings(".pj-button").removeClass("pj-button-active");

                $("#filter").val($this.data("value"));

                obj.status = "";
                obj[$this.data("column")] = $this.data("value");
                $.extend(cache, obj);
                $grid.datagrid("option", "cache", cache);
                !pjGrid?.queryString ? pjGrid.queryString = '' : null;
                $grid.datagrid("load", "index.php?controller=pjAdminInvoices&action=pjActionGetInvoices" + pjGrid.queryString, "created", "DESC", content.page, content.rowCount);
                return false;
            });

            $grid.on("click.dg", ".pj-table-sort-up, .pj-table-sort-down", function (e) {
                var $this = $(this),
                    content = $grid.datagrid("option", "content"),
                    cache = $grid.datagrid("option", "cache");
                $.extend(cache, {
                    column: $this.data("column"),
                    direction: $this.hasClass("pj-table-sort-up") ? "ASC" : "DESC"
                });
                $.cookie('selectedPaginationOptions', JSON.stringify(cache));

            });


        })
    }
})(jQuery_1_8_2);
