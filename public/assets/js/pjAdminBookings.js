var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();

(function($, undefined) {
  $(function() {

    function signatureMobile() {
      var wrapper = document.getElementById('content');
      var clearButton = wrapper.querySelector('[data-action=clear]');
      var changeColorButton = wrapper.querySelector(
          '[data-action=change-color]');
      var undoButton = wrapper.querySelector('[data-action=undo]');
      var savePNGButton = wrapper.querySelector('[data-action=save-png]');
      var saveJPGButton = wrapper.querySelector('[data-action=save-jpg]');
      var saveSVGButton = wrapper.querySelector('[data-action=save-svg]');

      var saveButton1 = wrapper.querySelector('#btnSave');
      var saveButton2 = wrapper.querySelector('#btnSave2');
      var saveButton4 = wrapper.querySelector('#btnSave4');
      var canvas = document.getElementById('canvas') || null;
      var canvas2 = document.getElementById('canvas2') || null;

      if (!canvas) return;

      signaturePad = new SignaturePad(canvas, {
        // backgroundColor: 'rgb(255, 255, 255)'
      });

      function resizeCanvas() {
        var ratio = Math.max(window.devicePixelRatio || 1, 1);

        canvas.width = canvas.offsetWidth * ratio;
        canvas.height = canvas.offsetHeight * ratio;
        console.log('RR1', canvas);
        canvas.getContext('2d')
              .scale(ratio, ratio);
        var ctx = canvas.getContext('2d');
        var image = new Image();
        var image_width = canvas.offsetWidth;
        var image_height = canvas.offsetHeight;
        backgroundLine(canvas);
        resizeCanvas2();
        image.onload = function() {
          ctx.drawImage(image, 0, 0, image_width, image_height);
          ctx.globalCompositeOperation = 'destination-over';
        };
        image.src = document.querySelector('.signature').value;

      }

      function resizeCanvas2() {
        var ratio = Math.max(window.devicePixelRatio || 1, 1);
        canvas2.width = canvas2.offsetWidth * ratio;
        canvas2.height = canvas2.offsetHeight * ratio;
        console.log('RR2', canvas2);
        canvas2.getContext('2d')
               .scale(ratio, ratio);
        backgroundLine(canvas2);
      }

      window.onresize = resizeCanvas;
      resizeCanvas();

      function download(dataURL, filename) {
        return;
        if (navigator.userAgent.indexOf('Safari') > -1 &&
            navigator.userAgent.indexOf('Chrome') === -1) {
          window.open(dataURL);
        } else {
          var blob = dataURLToBlob(dataURL);
          var url = window.URL.createObjectURL(blob);

          var a = document.createElement('a');
          a.style = 'display: none';
          a.href = url;
          a.download = filename;

          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
        }
      }

      function dataURLToBlob(dataURL) {
        var parts = dataURL.split(';base64,');
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], {type: contentType});
      }

      clearButton.addEventListener('click', function(event) {
        signaturePad.clear();
        backgroundLine(canvas);
      });

      undoButton.addEventListener('click', function(event) {
        var data = signaturePad.toData();
        if (data) {
          data.pop();
          signaturePad.fromData(data);
        }
        backgroundLine(canvas);
      });

      signaturePad.addEventListener('beginStroke', (event) => {
        const html = document.querySelector('html');
        const isMobile = html.classList.contains('mobile');
        if (!isMobile) {
          event.preventDefault();
        }
      }, {once: true});

      function desktopSignature() {
        const html = document.querySelector('html');
        const isMobile = html.classList.contains('mobile');
        const signaturePadFooter = document.querySelector(
            '.signature-pad--footer');
        const signaturePadContainer = document.querySelector(
            '.signature-pad-container');
        if (!isMobile) {
          signaturePadContainer.style.pointerEvents = 'none';
          signaturePadContainer.style.width = '50%';
          signaturePadFooter.remove();
        }
      }

      desktopSignature();

      function saveBlob() {
        const html = document.querySelector('html');
        const isMobile = html.classList.contains('mobile');
        if (isMobile) {
          if (canvas.toDataURL() == canvas2.toDataURL()) {
            alert('Please provide a signature first.');
          } else {
            document.querySelector('.signature').value = signaturePad.toDataURL(
                'image/png');
          }
        }
      }

      function backgroundLine(canvas) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(0, 100);
        ctx.lineTo(700, 100);
        ctx.lineWidth = 3;
        ctx.compositeOperation = 'destination-over';
        ctx.stroke();
      }

      saveButton1.addEventListener('click', saveBlob);
      saveButton2.addEventListener('click', saveBlob);
      saveButton4.addEventListener('click', saveBlob);
      // saveSignatureButton.addEventListener("click", saveBlob);
      return signaturePad;
    }

    signatureMobile();

    function getActiveTab() {
      var cookieTabValue = $.cookie('tabs_selected');
      console.log('TEST:', typeof cookieTabValue);
      if (cookieTabValue === '2' || cookieTabValue === '3') {
        return cookieTabValue;
      }
// $($tabs).tabs({ active: $.cookie("tabs_selected") })
      return 0;
    }

    var $frmCreate = $('#frmCreate'),
        $frmUpdate = $('#frmUpdate'),
        $dialogUpdateCar = $('#dialogUpdateCar'),
        $dialogDeletePayment = $('#dialogDeletePayment'),
        $dialogDeleteTicket = $('#dialogDeleteTicket'),
        $dialogExtraMileageCharge = $('#dialogExtraMileageCharge'),
        $dialogReminderEmail = $('#dialogReminderEmail'),
        $dialogReminderSms = $('#dialogReminderSms'),
        validate = ($.fn.validate !== undefined),
        datepicker = ($.fn.datepicker !== undefined),
        tipsy = ($.fn.tipsy !== undefined),
        $content = $('#content'),
        datagrid = ($.fn.datagrid !== undefined),
        dialog = ($.fn.dialog !== undefined),
        tabs = ($.fn.tabs !== undefined),
        chosen = ($.fn.chosen !== undefined),
        $tabs = $('#tabs'),
        $tabsBottom = $('#tabs-bottom'),
        rental_days = 0,
        number_of_extras = 0,
        keyPressTimeout,
        tOpt = {
          select: function(event, ui) {
            $(':input[name=\'tab_id\']')
                .val(ui.panel.id);
          },
          activate: function(event, ui) {
            if ($tabs.hasClass('with-cookie')) {
              $.cookie('tabs_selected', $($tabs)
                  .tabs('option', 'active'));
            }

          },
          active: $tabs.hasClass('with-cookie')
                  ? getActiveTab()
                  : null,

          // active: $tabs.hasClass('with-cookie') $($tabs).tabs({ active: $.cookie("tabs_selected") })
        };

    if ($tabs.length > 0 && tabs) {
      $tabs.tabs(tOpt);
      $('.to-next-tab')
          .click(function() {
            $($tabs)
                .tabs('option', 'active', $($tabs)
                    .tabs('option', 'active') + 1);
            let body = $('html, body');
            body.stop()
                .animate({scrollTop: 0}, 500, 'swing', function() {
                  // alert("Finished animating");
                });

          });

    }
    // if ($tabsBottom.length > 0 && $tabsBottom) {
    // 	$tabsBottom.tabs();
    // }
    $('.digits')
        .spinner({
          min: 0,
        });

    $content.delegate('#opExtraAdd', 'click', function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      var $this = $(this);
      $.get('index.php?controller=pjAdminBookings&action=pjActionGetExtras', {
        type_id: $('#type_id')
            .val(),
      })
       .done(function(data) {
         var $tr,
             $tbody = $('#boxExtras tbody');
         $tbody.append(data);
         number_of_extras++;
         checkExtras();
       });
      return false;
    })
            .delegate('.opExtraDel', 'click', function(e) {
              if (e && e.preventDefault) {
                e.preventDefault();
              }
              $(this)
                  .parent()
                  .parent()
                  .remove();
              number_of_extras--;
              checkExtras();
              if ($frmUpdate.length > 0) {
                getPrices($frmUpdate);
              }
              if ($frmCreate.length > 0) {
                getPrices($frmCreate);
              }
              return false;
            });

    if ($dialogUpdateCar.length > 0 && dialog) {
      $dialogUpdateCar.dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        draggable: false,
        buttons: {
          'Ok': function() {
            var $this = $(this);
            car_id = $('#car_id')
                .val();
            mileage = $('#end')
                .val();

            $.post(
                'index.php?controller=pjAdminBookings&action=pjActionUpdateCarMileague',
                {
                  car_id: car_id,
                  mileage: mileage,
                })
             .done(function() {
               $this.dialog('close');
             });
          },
          'Cancel': function() {
            $(this)
                .dialog('close');
          },
        },
      });
    }

    if ($dialogDeletePayment.length > 0 && dialog) {
      $dialogDeletePayment.dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        draggable: false,
        buttons: {
          'Delete': function() {
            var $this = $(this),
                $link = $this.data('link'),
                $tr = $link.closest('tr');
            $.post(
                'index.php?controller=pjAdminBookings&action=pjActionDeletePayment',
                {
                  id: $link.data('id'),
                })
             .done(function() {
               https://eubiq.ca:10000/
                   $tr.css('backgroundColor', '#FFB4B4')
                      .fadeOut('slow', function() {
                        $tr.remove();
                        $this.dialog('close');
                        calPayment();
                        // Also update the payments summary after deletion
                        var bookingId = document.querySelector('#tblPayment').dataset.bookingId;
                        if (bookingId && window.refreshPaymentsSummary) {
                          refreshPaymentsSummary(bookingId);
                        }
                      });
             });
          },
          'Cancel': function() {
            $(this)
                .dialog('close');
          },
        },
      });
    }
    if ($dialogDeleteTicket.length > 0 && dialog) {
      $dialogDeleteTicket.dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        draggable: false,
        buttons: {
          'Delete': function() {
            var $this = $(this),
                $link = $this.data('link'),
                $tr = $link.closest('tr');
            $.post(
                'index.php?controller=pjAdminBookings&action=pjActionDeleteTicket',
                {
                  id: $link.data('id'),
                })
             .done(function() {
               https://eubiq.ca:10000/
                   $tr.css('backgroundColor', '#FFB4B4')
                      .fadeOut('slow', function() {
                        $tr.remove();
                        $this.dialog('close');
                      });
             });
          },
          'Cancel': function() {
            $(this)
                .dialog('close');
          },
        },
      });
    }
    if ($dialogReminderEmail.length > 0 && dialog) {
      $dialogReminderEmail.dialog({
        modal: true,
        resizable: false,
        draggable: false,
        autoOpen: false,
        width: 660,
        open: function() {
          $dialogReminderEmail.html('');
          $.get(
              'index.php?controller=pjAdminBookings&action=pjActionReminderEmail',
              {
                'id': $dialogReminderEmail.data('id'),
              })
           .done(function(data) {
             $dialogReminderEmail.html(data);
             validator = $dialogReminderEmail.find('form')
                                             .validate({
                                               errorPlacement: function(
                                                   error, element) {
                                                 error.insertAfter(
                                                     element.parent());
                                               },
                                               errorClass: 'error_clean',
                                             });
             $dialogReminderEmail.dialog('option', 'position', 'center');
           });
        },
        close: function() {
          crApp.enableButtons.call(null, $dialogReminderEmail);
        },
        buttons: (function() {
          var buttons = {};
          buttons[crApp.locale.button.send] = function() {
            if (validator.form()) {
              crApp.disableButtons.call(null, $dialogReminderEmail);
              $.post(
                  'index.php?controller=pjAdminBookings&action=pjActionReminderEmail',
                  $dialogReminderEmail.find('form')
                                      .serialize())
               .done(function(data) {
                 if (data.status == 'OK') {
                   $dialogReminderEmail.dialog('close');
                   noty({text: data.text, type: 'success'});
                 } else {
                   noty({text: data.text, type: 'error'});
                   crApp.enableButtons.call(null, $dialogReminderEmail);
                 }
               });
            }
          };
          buttons[crApp.locale.button.cancel] = function() {
            $dialogReminderEmail.dialog('close');
          };

          return buttons;
        })(),
      });
    }

    if ($dialogReminderSms.length > 0 && dialog) {
      $dialogReminderSms.dialog({
        modal: true,
        resizable: false,
        draggable: false,
        autoOpen: false,
        width: 660,
        open: function() {
          $dialogReminderSms.html('');
          $.get(
              'index.php?controller=pjAdminBookings&action=pjActionReminderSms',
              {
                'id': $dialogReminderSms.data('id'),
              })
           .done(function(data) {
             $dialogReminderSms.html(data);
             validator = $dialogReminderSms.find('form')
                                           .validate({
                                             errorPlacement: function(
                                                 error, element) {
                                               error.insertAfter(
                                                   element.parent());
                                             },
                                             errorClass: 'error_clean',
                                           });
             $dialogReminderSms.dialog('option', 'position', 'center');
           });
        },
        close: function() {
          crApp.enableButtons.call(null, $dialogReminderSms);
        },
        buttons: (function() {
          var buttons = {};
          buttons[crApp.locale.button.send] = function() {
            if ($('#client_phone')
                .val() != '') {
              if (validator.form()) {
                crApp.disableButtons.call(null, $dialogReminderSms);
                $.post(
                    'index.php?controller=pjAdminBookings&action=pjActionReminderSms',
                    $dialogReminderSms.find('form')
                                      .serialize())
                 .done(function(data) {
                   if (data.status == 'OK') {
                     $dialogReminderSms.dialog('close');
                     noty({text: data.text, type: 'success'});
                   } else {
                     noty({text: data.text, type: 'error'});
                     crApp.enableButtons.call(null, $dialogReminderSms);
                   }
                 });
              }
            } else {
              noty({text: myLabel.phone_not_available, type: 'error'});
            }
          };
          buttons[crApp.locale.button.cancel] = function() {
            $dialogReminderSms.dialog('close');
          };

          return buttons;
        })(),
      });
    }
    if ($dialogExtraMileageCharge.length > 0 && dialog) {
      $dialogExtraMileageCharge.dialog({
        modal: true,
        autoOpen: false,
        resizable: false,
        draggable: false,
        open: function() {
          let html = 'The customer has EXCEEDED the car mileage limit. <br> Extra mileage: ' +
              $dialogExtraMileageCharge.data('_em_charge');
          $dialogExtraMileageCharge.html(html);
        },
      });
    }
    if (tipsy) {
      $('.listing-tip')
          .tipsy({
            offset: 1,
            opacity: 1,
            html: true,
            gravity: 'nw',
            className: 'tipsy-listing',
          });
    }

    if ($frmUpdate.length > 0) {
      number_of_extras = myLabel.numberOfExtras;
      checkExtras();
    }

    if ($frmCreate.length > 0 || $frmUpdate.length > 0) {
      $('#setStartValue')
          .bind('click', function(e) {
            $('#start')
                .val($('#setStartValue')
                    .attr('rel'));
          });
      $('#updateCar')
          .bind('click', function(e) {
            if ($dialogUpdateCar.length > 0 && dialog) {

              car_id = $('#car_id')
                  .val();
              if (car_id) {
                $.get(
                    'index.php?controller=pjAdminBookings&action=pjActionGetCarMileageMsg',
                    {
                      car_id: car_id,
                      mileage: $('#end')
                          .val(),
                    }, function(data) {
                      $('#dialogUpdateCar')
                          .html(data);
                      $dialogUpdateCar.data('link', $(this))
                                      .dialog('open');
                    });
              }

            }
          });

      $('#content')
          .on('change', '#car_id', function(e) {
            var $this = $(this),
                car_id = $this.find('option:selected')
                              .val(),
                car_label = $this.find('option:selected')
                                 .text();
            if (car_id) {
              $.get(
                  'index.php?controller=pjAdminBookings&action=pjActionGetCarMileage',
                  {car_id: car_id}, function(data) {
                    if ($frmUpdate.length > 0) {
                      $('#collect_car_id')
                          .find('option[value=' + car_id + ']')
                          .attr('selected', 'selected');
                      $('#collect_current_mileage')
                          .html(data + ' ' + myLabel.mileage_unit);
                      $('#cr_set_as_current')
                          .attr('rev', data);
                      checkAvailability($frmUpdate);
                      $('.cr-car-info')
                          .html(car_label);
                      $('.cr-car-info')
                          .attr('href',
                              'index.php?controller=pjAdminCars&action=pjActionUpdate&id=' +
                              car_id);
                    }
                    if ($frmCreate.length > 0) {
                      checkAvailability($frmCreate);
                      $('.cr-car-info')
                          .html(car_label);
                      $('.cr-car-info')
                          .attr('href',
                              'index.php?controller=pjAdminCars&action=pjActionUpdate&id=' +
                              car_id);
                    }
                  });
            } else {
              $('#collect_current_mileage')
                  .html('');
              $('#collect_car_id')
                  .val('');
            }
            $('#start')
                .val(0);

          })
          .on('change', '#type_id', function(e) {
            var select_type_id = $(this)
                .find('option:selected')
                .val();
            var date_to = $('#date_to')
                .val();
            var date_from = $('#date_from')
                .val();
            $.get('index.php?controller=pjAdminBookings&action=pjActionGetCars',
                {
                  type_id: select_type_id,
                  date_to: date_to,
                  date_from: date_from,
                }, function(data) {
                  $('#boxCars')
                      .html(data);
                  $('#start')
                      .val(0);

                  var $collect_car_id = $('#collect_car_id'),
                      $parent = $collect_car_id.closest('p');
                  $collect_car_id.replaceWith(data);
                  $parent.find('select[name=car_id]')
                         .attr('id', 'collect_car_id')
                         .attr('name', 'collect_car_id');
                });

            $.get(
                'index.php?controller=pjAdminBookings&action=pjActionGetExtras',
                {type_id: select_type_id}, function(data) {
                  if (data) {
                    $('#addExtra')
                        .show();
                  } else {
                    $('#addExtra')
                        .hide();
                  }
                  $('#boxExtras')
                      .html(data);
                  if (chosen) {
                    $('#extra_id')
                        .chosen();
                  }
                });
            number_of_extras = 1;
            checkExtras();
          });

      $('#payment_method')
          .bind('change', function(e) {
            if ($('option:selected', this)
                .val() == 'creditcard') {
              $('.boxCC')
                  .show();
            } else {
              $('.boxCC')
                  .hide();
            }
          });

      $('.cr-button-validate-save')
          .bind('click', function(e) {
            var $form = $(this)
                .closest('form');
            checkAvailability($form);
            if ($form.valid() && $('#dates')
                .val() == 1) {
              $('#isUpdate')
                  .val(1);
            }
          });
      $('#btnSave4')
          .bind('click', function(e) {
            var $form = $(this)
                .closest('form');
            if ($('body')
                .hasClass('mobile')) {
              if (!window.signaturePad.isEmpty()) {
                $form.submit();
              }
              return;
            }
            $form.submit();
          });
      $('#btnSave5')
          .bind('click', function(e) {
            var $form = $(this)
                .closest('form');
            $.cookie('tabs_selected', 0);
            $('#status')
                .val('collected');
            $('#car_id')
                .val($('#collect_car_id')
                    .val());
            $form.submit();
          });
      $('#btnSave6')
          .bind('click', function(e) {
            $.cookie('tabs_selected', 0);
            var $form = $(this)
                .closest('form');
            $('input#save_user_who_clicked')
                .val(1);
            $('#status')
                .val('completed');
            $form.submit();
          });
      $('#signature-request')
          .bind('click', function(e) {
            let id = $('input[name=\'id\']')
                .val();
            let c_phone = $('input[name=\'c_phone\']')
                .val();
            if (c_phone) {
              $.ajax({
                url: 'index.php?controller=pjAdminBookings&action=pjActionSendSignatureToken',
                type: 'POST',
                data: {
                  id: id,
                  c_phone: c_phone,
                },
                success: function(data) {
                  alert(data.text);
                },
              })
               .done(function(response) {
               });
            } else {
              alert('The Telephone number is empty!');
            }
          });
      if (chosen) {
        $('#c_country')
            .chosen();
        $('#extra_id')
            .chosen();
      }
      ;
      if (chosen) {
        $('#booking_id')
            .chosen();

      }
      ;
      if (chosen) {
        $('#choose_customer')
            .chosen();
      }
    }

    function checkExtras() {
      if (number_of_extras > 0) {
        $('#lblNoExtra')
            .css('display', 'none');
      } else {
        $('#lblNoExtra')
            .css('display', 'block');
      }
    }

    function getExtraHoursUsage($form) {
      $.post(
          'index.php?controller=pjAdminBookings&action=pjActionExtraHoursUsage',
          $form.serialize())
       .done(function(data) {
         $('#cr_extra_hours_usage')
             .html(data.extra_hours_usage);
         $('#date_to')
             .val(data.to);
       });
    }

    function getExtraMileageCharge($form) {
      $.post(
          'index.php?controller=pjAdminBookings&action=pjActionExtraMileageCharge',
          $form.serialize())
       .done(function(data) {
         if (data.em_charge > 0) {
           $dialogExtraMileageCharge.data('_em_charge', data._em_charge)
                                    .dialog('open');
         }
         $('#cr_extra_mileage_charge')
             .html(data.extra_mileage_charge);
       });
    }

    function getPrices($form) {
      $('#pj_price_loader')
          .css('display', 'block');
      $.post('index.php?controller=pjAdminBookings&action=pjActionGetPrices',
          $form.serialize())
       .done(function(data) {
         $('input#rental_days')
             .val(data.rental_days);
         $('input#rental_hours')
             .val(data.hours);
         $('input#car_rental_fee')
             .val(data.car_rental_fee);
         $('input#new_price')
             .val(data.price_per_day);
         $('input#price_per_day')
             .val(data.price_per_day);
         $('input#price_per_hour')
             .val(data.price_per_hour);
         $('input#price_per_day_detail')
             .val(data.price_per_day_detail);
         $('input#price_per_hour_detail')
             .val(data.price_per_hour_detail);
         $('input#extra_price')
             .val(data.extra_price);
         $('input#insurance')
             .val(data.insurance);
         $('input#age_fee')
             .val(data.age_fee);
         $('input#second_driver_fee')
             .val(data.second_driver_fee);
         $('input#frais_gp')
             .val(data.frais_gp);
         $('input#frais_i')
             .val(data.frais_i);
         $('input#frais_dr')
             .val(data.frais_dr);
         $('input#sub_total')
             .val(data.sub_total);
         $('input#tax')
             .val(data.tax);
         $('input#tvq')
             .val(data.tvq);
         $('input#total_price')
             .val(data.total_price);
         $('input#required_deposit')
             .val(data.required_deposit);

         $('.cr-total-quote')
             .html(data.total_quote_label);
         $('.cr-due-payment')
             .html(data.total_amount_due_label);

         $('#cr_rental_fee')
             .html(data.car_rental_fee_label);
         $('#cr_rental_fee_detail')
             .html(data.car_rental_fee_detail);
         $('#cr_price_per_day')
             .html(data.price_per_day_label);
         $('#cr_price_per_hour')
             .html(data.price_per_hour_label);
         $('#cr_price_per_day_detail')
             .html(data.price_per_day_detail);
         $('#cr_price_per_hour_detail')
             .html(data.price_per_hour_detail);
         $('#cr_extra_price')
             .html(data.extra_price_label);
         $('#cr_insurance')
             .html(data.insurance_label);
         $('#cr_age_fee')
             .html(data.age_fee_label);
         $('#cr_second_driver_fee')
             .html(data.second_driver_fee_label);
         $('#cr_insurance_detail')
             .html(data.insurance_detail);
         $('#cr_frais_gp')
             .html(data.frais_gp_label);
         $('#cr_frais_i')
             .html(data.frais_i_label);
         $('#cr_frais_dr')
             .html(data.frais_dr_label);
         $('#cr_sub_total')
             .html(data.sub_total_label);
         $('#cr_tax')
             .html(data.tax_label);
         $('#cr_tax_detail')
             .html(data.tax_detail);
         $('#cr_tvq')
             .html(data.tvq_label);
         $('#cr_tvq_detail')
             .html(data.tvq_detail);
         $('#cr_vat')
             .html(data.vat_label);
         $('#cr_vat_detail')
             .html(data.vat_detail);
         $('#cr_tot')
             .html(data.tot_label);
         $('#cr_tot_detail')
             .html(data.tot_detail);
         $('#cr_surcharge')
             .html(data.surcharge_label);
         $('#cr_surcharge_detail')
             .html(data.surcharge_detail);
         $('#cr_total_price')
             .html(data.total_price_label);
         $('#cr_required_deposit')
             .html(data.required_deposit_label);
         $('#cr_required_deposit_detail')
             .html(data.required_deposit_detail);

         $('#cr_rental_time')
             .html(data.rental_time);
         $('#cr_rental_time')
             .parent()
             .css('display', 'block');

         $('#pj_price_loader')
             .css('display', 'none');

         if ($frmUpdate.length > 0) {
           if ($form.valid() && $('#dates')
               .val() == 1 && $('#isUpdate')
               .val() == 1) {
             $form.submit();
           }
         }
       });
    }

    function setInsurancePrice() {
      var id = $('input[name=\'id\']')
          .val();

      $.ajax({
        type: 'POST',
        url: 'index.php?controller=pjAdminBookings&action=pjActionPriceUpdate',
        data: {
          'id': id,
          'new_price': $('#new_price')
              .val(),
          'insurance': $('#insurance')
              .val(),
          'ch_frais_gp': $('#ch_frais_gp')
              .val(),
          'ch_frais_i': $('#ch_frais_i')
              .val(),
          'ch_frais_dr': $('#ch_frais_dr')
              .val(),
          'new_days': $('#new_days')
              .val(),
        },

        success: function(response) {
          location.reload();
        },
      });
    }

    function checkAvailability($form) {

      // var signature = document.querySelector(".signature").value;
      //
      // console.log(signature);

      $('#pj_price_loader')
          .css('display', 'block');
      $.post(
          'index.php?controller=pjAdminBookings&action=pjActionCheckAvailability',
          $form.serialize())
       .done(function(data) {
         if (data.code === undefined) {
           return;
         }
         switch (data.code) {
           case 300:
             if ($('#date_from')
                 .val() != '' && $('#date_to')
                 .val() != '') {
               $('input#dates')
                   .val('1');
             }
             $('#pj_price_loader')
                 .css('display', 'none');
             break;
           case 200:
             if ($('#date_from')
                 .val() != '' && $('#date_to')
                 .val() != '') {
               $('input#dates')
                   .val('1');
             }
             getPrices($form);
             break;
           case 100:
             if ($('#date_from')
                 .val() != '' && $('#date_to')
                 .val() != '') {
               $('input#dates')
                   .val('0');
             }
             $('#pj_price_loader')
                 .css('display', 'none');
             break;
         }
       });
    }

    function formatCurrency(price) {
      var format = '---', currency = myLabel.currency;
      switch (currency) {
        case 'GBP':
          format = '&pound;' + price.toFixed(2);
          break;
        case 'EUR':
          format = '&euro;' + price.toFixed(2);
          break;
        case 'JPY':
          format = '&yen;' + price.toFixed(2);
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

    function calPayment() {
      var collected = 0, security_returned = 0, due_payment = 0,
          total_price = parseFloat($('#total_price')
              .val());

      $('.pj-payment-amount')
          .each(function(e) {
            var index = $(this)
                    .attr('data-index'),
                value = $(this)
                    .val(),
                status = $('#payment_status_' + index)
                    .val(),
                payment_type = $('#payment_type_' + index)
                    .val();

            if (value != '' && isNaN(value) == false) {
              if (payment_type != 'securityreturned' && status == 'paid') {
                collected += parseFloat(value);
              }
              if (payment_type == 'securityreturned' && status == 'paid') {
                security_returned += parseFloat(value);
              }
            }
          });
      collected = collected - security_returned;
      due_payment = total_price - collected;
      if (due_payment < 0) {
        due_payment = 0;
      }
      collected = formatCurrency(collected);
      $('#input_due_payment')
          .val(due_payment.toFixed(2));
      due_payment = formatCurrency(due_payment);
      $('#pj_collected')
          .html(collected);
      $('#pj_due_payment')
          .html(due_payment);
    }

    function calTicket() {
      var collected = 0, security_returned = 0, due_payment = 0,
          total_price = parseFloat($('#total_price')
              .val());
      due_payment = parseFloat($('#pj_due_payment')
          .val());

      $('.pj-parking_ticket-amount')
          .each(function(e) {
            var index = $(this)
                    .attr('data-index'),
                value = $(this)
                    .val(),
                status = $('#tickets_status_' + index)
                    .val(),
                payment_type = $('#payment_type_' + index)
                    .val();

            if (value != '' && isNaN(value) == false) {
              if (status == 'paid') {
                collected += parseFloat(value);
                due_payment += parseFloat(value);
              } else {
                due_payment += parseFloat(value);
              }
            }
          });
      due_payment = due_payment + collected;
      total_price = total_price + collected;
      console.log(total_price);

      // if(due_payment < 0)
      // {
      // 	due_payment = 0;
      // }
      total_price = formatCurrency(total_price);
      due_payment = formatCurrency(due_payment);
      $('#input_due_payment')
          .val(due_payment.toFixed(2));
      $('#pj_total_price')
          .html(total_price);
      // $('#total_price').html(total_price);
      // $('#total_price').val(total_price);
      $('#cr_total_price')
          .html(total_price);
      // $('#cr_total_price').val(total_price);

      // $('#pj_due_payment').html(due_payment);
    }

    if (validate) {
      $.validator.addMethod('validDates', function(value, element) {
        return parseInt(value, 10) === 1;
      }, myLabel.dateRangeValidation);
    }

    if ($frmCreate.length > 0 && validate) {
      $frmCreate.validate({
        rules: {
          'dates': 'validDates',
          'date_from': {
            remote: {
              url: 'index.php?controller=pjAdminBookings&action=pjActionCheckPickup',
              data: {
                pickup_id: function() {
                  return $frmCreate.find('select[name="pickup_id"]')
                                   .val();
                },
              },
            },
          },
          'date_to': {
            remote: {
              url: 'index.php?controller=pjAdminBookings&action=pjActionCheckReturn',
              data: {
                return_id: function() {
                  return $frmCreate.find('select[name="return_id"]')
                                   .val();
                },
              },
            },
          },
        },
        errorPlacement: function(error, element) {
          error.insertAfter(element.parent());
        },
        onkeyup: false,
        errorClass: 'err',
        wrapper: 'em',
        ignore: '.ignore',
        invalidHandler: function(event, validator) {
          if (validator.numberOfInvalids()) {
            var index = $(validator.errorList[0].element, this)
                .closest('div[id^=\'tabs-\']')
                .index();
            if ($tabs.length > 0 && tabs && index !== -1) {
              $tabs.tabs(tOpt)
                   .tabs('option', 'active', index - 1);
            }
          }
          ;
        },
      });
    }
    if ($frmUpdate.length > 0 && validate) {
      $frmUpdate.validate({
        rules: {
          'dates': 'validDates',
          'date_from': {
            remote: {
              url: 'index.php?controller=pjAdminBookings&action=pjActionCheckPickup',
              data: {
                pickup_id: function() {
                  return $frmUpdate.find('select[name="pickup_id"]')
                                   .val();
                },
              },
            },
          },
          'date_to': {
            remote: {
              url: 'index.php?controller=pjAdminBookings&action=pjActionCheckReturn',
              data: {
                return_id: function() {
                  return $frmUpdate.find('select[name="return_id"]')
                                   .val();
                },
              },
            },
          },
        },
        errorPlacement: function(error, element) {
          if (element.attr('name') == 'dropoff_mileage') {
            error.insertAfter(element.parent()
                                     .parent());
          } else {
            error.insertAfter(element.parent());
          }
        },
        onkeyup: false,
        errorClass: 'err',
        wrapper: 'em',
        ignore: '.ignore',
        invalidHandler: function(event, validator) {
          if (validator.numberOfInvalids()) {
            var index = $(validator.errorList[0].element, this)
                .closest('div[id^=\'tabs-\']')[0].id.split('-')[1];
            if ($tabs.length > 0 && tabs && index !== -1) {
              $tabs.tabs(tOpt)
                   .tabs('option', 'active', index - 1);
            }
          }
          ;
        },
      });
    }

    function formatCarType(val, obj) {
      if (pjGrid.isEditor === true) {
        return val;
      } else {
        return [
          '<a href="index.php?controller=pjAdminTypes&action=pjActionUpdate&id=',
          obj.type_id, '">' + val + '</a>',
        ].join('');
      }
    }

    function formatCar(val, obj) {
      if (pjGrid.isEditor === true) {
        return val;
      } else {
        return [
          '<a href="index.php?controller=pjAdminCars&action=pjActionUpdate&id=',
          obj.car_id, '">' + val + '</a>',
        ].join('');
      }
    }

    function formatClient(val, obj) {
      if (pjGrid.isEditor === true) {
        return val;
      } else {
        return [
          '<a href="index.php?controller=pjAdminCustomers&action=pjActionGetCustomerInfo&id=',
          obj.customer_id, '">' + val + '</a>',
        ].join('');
      }
    }

    if ($('#grid').length > 0 && datagrid) {
      var gridSettings = $.cookie('selectedPaginationOptions') &&
          JSON.parse($.cookie('selectedPaginationOptions'));
      var isRedirected = $.cookie('isRedirected') &&
          JSON.parse($.cookie('isRedirected'));
      if (gridSettings) {
        var gridQuery = $.map(gridSettings, function(val, index) {
          var str = index + '=' + val;
          return str;
        })
                         .join('&');
      }

      let options = {
        columns: [
          {
            text: myLabel.booking_id,
            type: 'text',
            sortable: false,
            editable: false,
            width: 50,
          },
          {
            text: myLabel.pick_drop,
            type: 'text',
            sortable: false,
            editable: false,
            width: 130,
          },
          {
            text: myLabel.booking_type,
            type: 'text',
            sortable: false,
            editable: false,
            width: 80,
            renderer: formatCarType,
          },
          {
            text: myLabel.booking_car,
            type: 'text',
            sortable: false,
            editable: false,
            width: 120,
            renderer: formatCar,
          },
          {
            text: myLabel.booking_client,
            type: 'text',
            sortable: false,
            editable: false,
            width: 100,
            renderer: formatClient,
          },
          {
            text: myLabel.booking_total,
            type: 'text',
            sortable: true,
            editable: false,
            width: 90,
          },
          {
            text: myLabel.location_name,
            type: 'text',
            sortable: false,
            editable: false,
            width: 60,
          },
          {
            text: myLabel.status,
            type: 'select',
            sortable: true,
            editable: myLabel.role_id != 3,
            width: 80,
            options: [
              {label: myLabel.pending, value: 'pending'},
              {label: myLabel.collected, value: 'collected'},
              {label: myLabel.completed, value: 'completed'},
            ],
            applyClass: 'pj-status',
          },
          {
            text: myLabel.booking_payment_status,
            type: 'select',
            sortable: false,
            editable: myLabel.role_id != 3,
            width: 30,
            options: [
              {label: myLabel.notpaid, value: 'notpaid'},
              {label: myLabel.paid, value: 'paid'},
              {label: myLabel.promo, value: 'promo'},
            ],
            applyClass: 'pj-booking-payment-status',
          },
        ],
        dataUrl:
            isRedirected
            ?
            'index.php?controller=pjAdminBookings&action=pjActionGetBookings' +
                '&' + gridQuery
            :
            'index.php?controller=pjAdminBookings&action=pjActionGetBookings',
        dataType: 'json',
        fields: [
          'booking_id', 'pick_drop', 'type', 'car_info', 'client',
          'total_price', 'location_name', 'status', 'booking_payment_status',
        ],
        paginator: {
          gotoPage: true,
          paginate: true,
          total: true,
          rowCount: true,
        },
        saveUrl: 'index.php?controller=pjAdminBookings&action=pjActionSave&id={:id}',
        select: {
          field: 'id',
          name: 'record[]',
        },
      };

      if (myLabel.role_id != 3) {
        options.buttons = [
          {
            type: 'copy',
            url: 'index.php?controller=pjAdminBookings&action=pjActionContract&id={:id}&locations_id={:location_id}',
            target: '_blank',
          },
          {
            type: 'edit',
            url: 'index.php?controller=pjAdminBookings&action=pjActionUpdate&id={:id}',
          },
          {
            type: 'delete',
            url: 'index.php?controller=pjAdminBookings&action=pjActionDelete&id={:id}',
          },
        ];
        options.paginator.actions = [
          {
            text: myLabel.delete_selected,
            url: 'index.php?controller=pjAdminBookings&action=pjActionDeleteBookingBulk',
            render: true,
            confirmation: myLabel.delete_confirmation,
          },
        ];
      } else {
        options.buttons = [
          {
            type: 'edit',
            url: 'index.php?controller=pjAdminBookings&action=pjActionUpdate&id={:id}',
          },
        ];
      }

      var $grid = $('#grid')
          .datagrid(options);
      $.cookie('isRedirected', false);
      // $.cookie('selectedPaginationOptions', JSON.stringify({}));
      var queryHashes = window.location.href.slice(
          window.location.href.indexOf('?') + 1)
                              .split('&');
      var pageAction = queryHashes[1];
      $.cookie('selectedPanelPage', pageAction);
    }

    $(document)
        .on('click', '.btn-all', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          $(this)
              .addClass('pj-button-active')
              .siblings('.pj-button')
              .removeClass('pj-button-active');
          var content = $grid.datagrid('option', 'content'),
              cache = $grid.datagrid('option', 'cache');
          $.extend(cache, {
            status: '',
            filter: '',
            q: '',
            type_id: '',
            booking_id: '',
            pickup_from: '',
            pickup_to: '',
            return_from: '',
            return_to: '',
            pickup_id: '',
            return_id: '',
            registration_number: '',
          });

          $grid.datagrid('option', 'cache', cache);
          $grid.datagrid('load',
              'index.php?controller=pjAdminBookings&action=pjActionGetBookings' +
              pjGrid.queryString, 'created', 'DESC', content.page,
              content.rowCount);
          return false;
        })
        .on('click', '.btn-filter', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }

          var $this = $(this),
              content = $grid.datagrid('option', 'content'),
              cache = $grid.datagrid('option', 'cache'),
              obj = {};

          $this.addClass('pj-button-active')
               .siblings('.pj-button')
               .removeClass('pj-button-active');

          $('#filter')
              .val($this.data('value'));

          obj.status = '';
          obj[$this.data('column')] = $this.data('value');
          $.extend(cache, obj);
          $grid.datagrid('option', 'cache', cache);
          $grid.datagrid('load',
              'index.php?controller=pjAdminBookings&action=pjActionGetBookings' +
              pjGrid.queryString, 'created', 'DESC', content.page,
              content.rowCount);
          return false;
        })
        .on('focusin', '#pickup_from, #pickup_to, #return_from, #return_to',
            function(e) {
              $(this)
                  .datepicker({
                    firstDay: $(this)
                        .attr('rel'),
                    dateFormat: $(this)
                        .attr('rev'),
                    onSelect: function(dateText, inst) {
                    },
                  });

            })
        .on('focusin', '.datetimepick', function(e) {
          const isDriver = $('.date_from_block').data('role-driver');
          var minDateTime, maxDateTime,
              $this = $(this),
              custom = {},
              o = {
                firstDay: $this.attr('rel'),
                dateFormat: $this.attr('rev'),
                timeFormat: $this.attr('lang'),
                stepMinute: 5,
                onClose: function() {
                  if (($frmUpdate.length > 0) &&
                      ($this.attr('name') == 'date_from' ||
                          $this.attr('name') == 'date_to')) {
                    checkAvailability($frmUpdate);
                  }
                  if (($frmCreate.length > 0) &&
                      ($this.attr('name') == 'date_from' ||
                          $this.attr('name') == 'date_to')) {
                    if ($('#date_from')
                        .val() != '' && $('#date_to')
                        .val() != '' && $('#type_id')
                        .val() != '') {
                      checkAvailability($frmCreate);
                    }
                  }
                  if ($this.attr('name') == 'date_to') {
                    $('#dropoff_datetime')
                        .val($this.val());
                  }
                  if ($this.attr('name') == 'actual_dropoff_datetime') {
                    getExtraHoursUsage($frmUpdate);
                  }
                },
              };
          switch ($this.attr('name')) {
            case 'date_from':
              if (isDriver) {
                const today = new Date();
                const maxDate = new Date(today);
                maxDate.setDate(today.getDate() + 3);
                
                custom.minDateTime = today;
                custom.maxDateTime = maxDate;
              }
              if ($('.datetimepick[name=\'date_to\']')
                  .val() != '') {
                maxDateTime = $('.datetimepick[name=\'date_to\']')
                    .datetimepicker({
                      firstDay: $this.attr('rel'),
                      dateFormat: $this.attr('rev'),
                      timeFormat: $this.attr('lang'),
                    })
                    .datetimepicker('getDate');
                // $(".datetimepick[name='date_to']").datepicker("destroy").removeAttr("id");
                if (maxDateTime !== null) {
                  custom.maxDateTime = maxDateTime;
                }
              }
              break;
            case 'date_to':
              if ($('.datetimepick[name=\'date_from\']')
                  .val() != '') {
                minDateTime = $('.datetimepick[name=\'date_from\']')
                    .datetimepicker({
                      firstDay: $this.attr('rel'),
                      dateFormat: $this.attr('rev'),
                      timeFormat: $this.attr('lang'),
                    })
                    .datetimepicker('getDate');
                // $(".datetimepick[name='date_from']").datepicker("destroy").removeAttr("id");
                if (minDateTime !== null) {
                  custom.minDateTime = minDateTime;
                }
              }
              break;
          }
          $(this)
              .datetimepicker($.extend(o, custom));

        })
        .on('click', '.pj-form-field-icon-date', function(e) {
          var $dp = $(this)
              .parent()
              .siblings('input[type=\'text\']');
          if ($dp.hasClass('hasDatepicker')) {
            $dp.datepicker('show');
          } else {
            $dp.trigger('focusin')
               .datepicker('show');
          }

        })
        .on('submit', '.frm-filter', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          var $this = $(this),
              content = $grid.datagrid('option', 'content'),
              cache = $grid.datagrid('option', 'cache');
          $.extend(cache, {
            q: $this.find('input[name=\'q\']')
                    .val(),
            status: '',
            type_id: '',
            page: content.page,
            booking_id: '',
            pickup_from: '',
            pickup_to: '',
            return_from: '',
            return_to: '',
            pickup_id: '',
            return_id: '',
            registration_number: '',
          });
          $.cookie('selectedPaginationOptions', JSON.stringify(cache));
          $grid.datagrid('option', 'cache', cache);
          $grid.datagrid('load',
              'index.php?controller=pjAdminBookings&action=pjActionGetBookings',
              'created', 'DESC', content.page, content.rowCount);
          return false;
        })
        .on('click', '.pj-button-detailed, .pj-button-detailed-arrow',
            function(e) {
              e.stopPropagation();
              $('.pj-form-filter-advanced')
                  .toggle();
            })
        .on('submit', '.frm-filter-advanced', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          var obj = {},
              $this = $(this),
              arr = $this.serializeArray(),
              content = $grid.datagrid('option', 'content'),
              cache = $grid.datagrid('option', 'cache');
          for (var i = 0, iCnt = arr.length; i < iCnt; i++) {
            obj[arr[i].name] = arr[i].value;
          }
          $.extend(cache, obj);
          $.cookie('selectedPaginationOptions', JSON.stringify(cache));
          $grid.datagrid('option', 'cache', cache);
          $grid.datagrid('load',
              'index.php?controller=pjAdminBookings&action=pjActionGetBookings' +
              pjGrid.queryString, 'created', 'DESC', content.page,
              content.rowCount);
          return false;
        })
        .on('reset', '.frm-filter-advanced', function(e) {
          $('.pj-button-detailed')
              .trigger('click');

          $('#status')
              .val('');
          $('#booking_payment_status')
              .val('');
          $('#bill_for_insurance')
              .val('');
          $('#type_id')
              .val('');
          $('#booking_id')
              .val('');
          $('#pickup_from')
              .val('');
          $('#pickup_to')
              .val('');
          $('#return_from')
              .val('');
          $('#return_to')
              .val('');
          $('#pickup_id')
              .val('');
          $('#return_id')
              .val('');
          $('#registration_number')
              .val('');

        })
        .on('change', '#non', function(e) {
          this.value = this.checked
                       ? 1
                       : 0;
        })
        .on('change', '#garage', function(e) {
          this.value = this.checked
                       ? 1
                       : 0;
        })
        .on('change', '#oui', function(e) {
          this.value = this.checked
                       ? 1
                       : 0;
        })
        .on('change', '#p_t', function(e) {
          this.value = this.checked
                       ? 1
                       : 0;
        })
        .on('change', '#ch_frais_gp', function(e) {
          this.value = this.checked
                       ? 1
                       : 0;
        })
        .on('change', '#ch_frais_i', function(e) {
          this.value = this.checked
                       ? 1
                       : 0;
        })
        .on('change', '#ch_frais_dr', function(e) {
          this.value = this.checked
                       ? 1
                       : 0;
        })
        .on('change', '.pj-extra-item', function(e) {
          var extra_price = $('option:selected', this)
              .attr('data-price');
          $(this)
              .siblings()
              .html(extra_price);
          if ($frmUpdate.length > 0) {
            getPrices($frmUpdate);
          }
          if ($frmCreate.length > 0) {
            getPrices($frmCreate);
          }
        })
        .on('change',
            'select[name="insurance_type"]',
            function(e) {
              var insurance_type = $('option:selected', this)
                  .val();
              var content = $('select[name="insurance_company_id"]');
              if (insurance_type === 'assurance') {
                content.addClass('required');
              } else {
                content.removeClass('required');
              }
            })
        .on('change', '.pj-extra-qty', function(e) {
          if ($frmUpdate.length > 0) {
            getPrices($frmUpdate);
          }
          if ($frmCreate.length > 0) {
            getPrices($frmCreate);
          }
        })
        .on(
            'change',
            'select[name="c_driver_age"], select[name="c_second_driver_age"], [data-second-driver-toggle],' +
            'input[name="discount_amount"], select[name="discount_type"], select[name="discount_per"],' +
            'input[name="ch_frais_gp"], input[name="ch_frais_i"], input[name="ch_frais_dr"], ' +
            'input[name="desirable_total_price"], input[name="insurance"]',
            function(e) {
              if ($frmUpdate.length > 0) {
                getPrices($frmUpdate);
              }
              if ($frmCreate.length > 0) {
                getPrices($frmCreate);
              }
            })
        .on('click', '#cr_set_as_current', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          $('#pickup_mileage')
              .val($(this)
                  .attr('rev'));
        })
        .on('keydown', '#dropoff_mileage', function(e) {
          clearTimeout(keyPressTimeout);
          keyPressTimeout = setTimeout(function() {
            getExtraMileageCharge($frmUpdate);
          }, 1000);
        })
        .on('click', '#btnAddPayment', function(e) {
          var $tr,
              $tbody = $('#tblPayment tbody'),
              index = Math.ceil(Math.random() * 999999),
              h = $tbody.find('tr:last')
                        .find('td:first')
                        .html(),
              i = (h === null)
                  ? 0
                  : parseInt(h, 10);

          i = !isNaN(i)
              ? i
              : 0;
          $tr = $('#tblPaymentsClone')
              .find('tbody')
              .clone();
          $tbody.find('.notFound')
                .remove();
          var tr_html = $tr.html()
                           .replace(/\{INDEX\}/g, 'x_' + index);
          tr_html = tr_html.replace(/\{PTCLASS\}/g, 'pj-payment-type');
          tr_html = tr_html.replace(/\{ACLASS\}/g, 'pj-payment-amount');
          tr_html = tr_html.replace(/\{PDCLASS\}/g, 'pj-payment-datetime');
          tr_html = tr_html.replace(/\{SCLASS\}/g, 'pj-payment-status');
          $tbody.append(tr_html);

          $tbody.find('tr:last')
                .find('.spin')
                .spinner({
                  min: 0,
                  step: 1,
                });
        })
        .on('click', '#btnAddTicket', function(e) {
          var $tr,
              $tbody = $('#tblTickets tbody'),
              index = Math.ceil(Math.random() * 999999),
              h = $tbody.find('tr:last')
                        .find('td:first')
                        .html(),
              i = (h === null)
                  ? 0
                  : parseInt(h, 10);

          i = !isNaN(i)
              ? i
              : 0;
          $tr = $('#tblTicketsClone')
              .find('tbody')
              .clone();
          $tbody.find('.notFound')
                .remove();
          var tr_html = $tr.html()
                           .replace(/\{INDEX\}/g, 'x_' + index);
          tr_html = tr_html.replace(/\{PTCLASS\}/g,
              'pj-parking_ticket-traffic_ticket');
          tr_html = tr_html.replace(/\{ACLASS\}/g, 'pj-parking_ticket-amount');
          tr_html = tr_html.replace(/\{SCLASS\}/g, 'pj-parking_ticket-status');
          $tbody.append(tr_html);

          $tbody.find('tr:last')
                .find('.spin')
                .spinner({
                  min: 0,
                  step: 1,
                });
        })
        .on('click', '.btnRemoveTicket', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          var $tr = $(this)
              .closest('tr');
          $tr.css('backgroundColor', '#FFB4B4')
             .fadeOut('slow', function() {
               $tr.remove();
               calTicket();
             });
          return false;
        })
        .on('click', '.btnDeleteTicket', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          if ($dialogDeleteTicket.length > 0 && dialog) {
            $dialogDeleteTicket.data('link', $(this))
                               .dialog('open');
            calTicket();
          }
          return false;
        })
        .on('click', '.btnRemovePayment', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          var $tr = $(this)
              .closest('tr');
          $tr.css('backgroundColor', '#FFB4B4')
             .fadeOut('slow', function() {
               $tr.remove();
               calPayment();
             });
          return false;
        })
        .on('click', '.btnDeletePayment', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          if ($dialogDeletePayment.length > 0 && dialog) {
            $dialogDeletePayment.data('link', $(this))
                                .dialog('open');
          }
          return false;
        })
        .on('change', '.pj-payment-type', function(e) {

          var index = $(this)
                  .attr('data-index'),
              val = $(this)
                  .val(),
              extra_mileage_charge = $('#extra_mileage_charge')
                  .val(),
              required_deposit = $('#required_deposit')
                  .val();
          if (val == 'online') {
            var online = parseFloat(required_deposit);
            $('#amount_' + index)
                .val(online.toFixed(2));
          } else if (val == 'extra' && extra_mileage_charge != '') {
            var extra_mileage_charge = parseFloat(extra_mileage_charge);
            $('#amount_' + index)
                .val(extra_mileage_charge.toFixed(2));
          } else if (val == 'securitypaid' || val == 'securityreturned') {
            var security = parseFloat(myLabel.security_deposit);
            $('#amount_' + index)
                .val(security.toFixed(2));
          } else if (val == 'balance') {
            var input_due_payment = parseFloat($('#input_due_payment')
                .val());
            $('#amount_' + index)
                .val(input_due_payment);
          } else {
            $('#amount_' + index)
                .val('');
          }
          calPayment();
        })
        .on('keydown', '.pj-payment-amount', function(e) {
          clearTimeout(keyPressTimeout);
          keyPressTimeout = setTimeout(function() {
            calPayment();
          }, 300);
        })
        .on('keydown', '.pj-parking_ticket-amount', function(e) {
          clearTimeout(keyPressTimeout);
          keyPressTimeout = setTimeout(function() {
            calTicket();
          }, 300);
        })
        .on('change', '.pj-payment-status', function(e) {
          calPayment();
        })
        .on('click', '.reminder-email', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          if ($dialogReminderEmail.length > 0 && dialog) {
            $dialogReminderEmail.data('id', $(this)
                .data('id'))
                                .dialog('open');
          }
          return false;
        })
        .on('click', '.send-email', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }

          var id = $('input[name=\'id\']')
              .val();
          var inspection = $('.mail-footer')
              .html();
          let text = 'Mail is being sent.';
          $('.send-contract-mail')
              .css('display', 'block');

          if (id) {
            $('.send-contract-mail')
                .html(text);

            $.post(
                'index.php?controller=pjAdminBookings&action=pjActionSendContract',
                {
                  id: id,
                  inspection: inspection,
                }, function(data) {
                  $('.send-contract-mail')
                      .html(data.text);
                });
          } else {
            return false;
          }
        })
        .on('click', '.send-sms', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          let text = 'Sms is being sent.';
          var id = $('input[name=\'id\']')
              .val();
          var c_phone = $('input[name=\'c_phone\']')
              .val();
          $('.send-contract-sms')
              .html(text);
          $('.send-contract-sms')
              .css('display', 'block');
          if (id) {
            $.post(
                'index.php?controller=pjAdminBookings&action=pjActionSendSms', {
                  id: id,
                  c_phone: c_phone,
                }, function(data) {
                  $('.send-contract-sms')
                      .html(data.text);
                });
          } else {
            return false;
          }
        })
        .on('click', '.reminder-sms', function(e) {
          if (e && e.preventDefault) {
            e.preventDefault();
          }
          if ($dialogReminderSms.length > 0 && dialog) {
            $dialogReminderSms.data('id', $(this)
                .data('id'))
                              .dialog('open');
          }
          return false;
        })
        .on('change', '#collect_car_id', function(e) {
          var car_id = $('option:selected', this)
              .val();
          if (car_id) {
            $.get(
                'index.php?controller=pjAdminBookings&action=pjActionGetCarMileage',
                {car_id: car_id}, function(data) {
                  if ($frmUpdate.length > 0) {
                    $('#collect_current_mileage')
                        .html(data + ' ' + myLabel.mileage_unit);
                    $('#cr_set_as_current')
                        .attr('rev', data);
                  }
                });
          } else {
            $('#collect_current_mileage')
                .html('');
          }
        })
        .on('click', '[data-second-driver-toggle]', function(e) {
          var $checkbox = $(this);
          var $content = $('[data-second-driver]');

          if ($checkbox.prop('checked')) {
            $content.show();
            $content.find('input, select')
                    .removeClass('ignore');
            $('body')
                .find('input[name="second_driver"]')
                .val(1);
          } else {
            $content.hide();
            $content.find('input, select')
                    .val('');
            $content.find('input, select')
                    .addClass('ignore');
            $('body')
                .find('input[name="second_driver"]')
                .val(0);
          }
        });

    if ($('#email_grid').length > 0 && datagrid) {
      var $email_grid = $('#email_grid')
          .datagrid({
            columns: [
              {
                text: myLabel.created_at,
                type: 'text',
                sortable: false,
                editable: false,
              },
              {
                text: myLabel.user,
                type: 'text',
                sortable: false,
                editable: false,
              },
              {
                text: myLabel.email_to,
                type: 'text',
                sortable: false,
                editable: false,
              },
              {
                text: myLabel.email_status,
                type: 'text',
                sortable: false,
                editable: false,
              },
              {
                text: myLabel.email_response_text,
                type: 'text',
                sortable: false,
                editable: false,
              },
            ],
            dataUrl: 'index.php?controller=pjAdminBookings&action=pjActionGetBookingNotifications&booking_id=' +
                $('input[name=id]')
                    .val(),
            dataType: 'json',
            fields: ['created_at', 'username', 'to', 'status', 'text'],
            paginator: {
              gotoPage: true,
              paginate: true,
              total: true,
              rowCount: true,
            },
          });
    }
    $('.email-submit')
        .on('click', function(e) {
          e.preventDefault();
          let fd2 = new FormData();
          let imageInput = $('input[name=email_file]');
          let bookingId = $('input[name=id]')
              .val();
          let email_from = $('select[name=\'email_from\']')
              .val();
          let email_to = $('select[name=\'email_to\']')
              .val();
          let email_cc = $('select[name=\'email_cc\']')
              .val();
          let email_bcc = $('select[name=\'email_bcc\']')
              .val();
          let email_subject = $('input[name=\'email_subject\']')
              .val();
          let email_body = $('textarea[name=\'email_body\']')
              .val();

          fd2.append('email_file', imageInput.prop('files')[0]);
          fd2.append('booking_id', bookingId);
          fd2.append('email_from', email_from);
          fd2.append('email_to', email_to);
          if (email_cc != null) {
            fd2.append('email_cc', email_cc);
          }
          if (email_bcc != null) {
            fd2.append('email_bcc', email_bcc);
          }
          fd2.append('email_subject', email_subject);
          fd2.append('email_body', email_body);

          $.ajax({
            type: 'POST',
            contentType: false,
            processData: false,
            url: 'index.php?controller=pjAdminBookings&action=pjActionSendEmail',
            data: fd2,
            error: function(error) {
              console.error(error);
            },
            success: function(response) {
              $email_grid.datagrid('load',
                  'index.php?controller=pjAdminBookings&action=pjActionGetBookingNotifications&booking_id=' +
                  $('input[name=id]')
                      .val(), 'id', 'DESC', 1, 10);
              $('.email-form-message')
                  .html(response.text)
                  .css('display', 'block');
            },
          });
        });
  });
})(jQuery_1_8_2);
