(function($, undefined) {
  $(function() {
    const $dateFrom = $('#date_from');
    const $dateTo = $('#date_to');
    const isDriver = $('.date_from_block').data('role-driver');


    function initializeDatepicker($element, fieldName) {
      if (!$element.length) return;

      const isFromField = fieldName === 'date_from';
      const options = createDatepickerOptions($element, fieldName);
      
      if (isFromField && isDriver) {
        addDriverRestrictions(options);
      }

      $element.datetimepicker(options);
      
      if (isFromField && !$element.val().trim()) {
        $element.datetimepicker('setDate', new Date());
      }
    }

    function createDatepickerOptions($element, fieldName) {
      return {
        firstDay: $element.attr('rel'),
        dateFormat: $element.attr('rev'),
        timeFormat: $element.attr('lang'),
        stepMinute: 5,
        onClose: () => validateDate(fieldName, $element.val())
      };
    }

    function getTimestampFromDateString(dateString) {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("-");
      const [hours, minutes] = timePart.split(":");
      const date = new Date(year, month - 1, day, hours, minutes);
      return date.getTime();
    }
    
    function addError(field, message) {
      const $parentP = field.closest('p');
      $parentP.find('em').remove();
      $parentP.append(`<em><label id="status-error" class="err" style="display: inline;">${message}</label></em>`);
      const $saveButton = $('#btnSave');
      $saveButton.addClass('pj-button-disabled').attr('disabled', true);
    }
    
    function clearError() {
      const $parentPFrom = $dateFrom.closest('p');
      const $parentPTo = $dateTo.closest('p');
      $parentPFrom.find('em').remove();
      $parentPTo.find('em').remove();
      const $saveButton = $('#btnSave');
      $saveButton.removeClass('pj-button-disabled').removeAttr('disabled');
    }

    function validateDate(fieldName, dateValue) {
      const fromVal = $dateFrom.val();
      const toVal = $dateTo.val();

      switch (fieldName) {
        case 'date_from':
          const dateFromValueFrom = getTimestampFromDateString(dateValue);
          const dateToValueFrom = getTimestampFromDateString(toVal);
          const isValidFrom = dateFromValueFrom < dateToValueFrom;

          
          if (isValidFrom) {
            clearError($dateFrom);
          } else {
            addError($dateFrom, 'Invalid range date');
          }
          break;
          case 'date_to':
            const dateToValueTo = getTimestampFromDateString(dateValue);
            const dateFromValueTo = getTimestampFromDateString(fromVal);
            const isValidTo = dateToValueTo > dateFromValueTo;
            
            if (isValidTo) {
              clearError($dateTo);
            } else {
              addError($dateTo, 'Invalid range date');
            }
            break;
      }
    }

    function addDriverRestrictions(options) {
      const today = new Date();
      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + 3);
      
      options.minDateTime = today;
      options.maxDateTime = maxDate;
    }

    initializeDatepicker($dateFrom, 'date_from');
    initializeDatepicker($dateTo, 'date_to');

  });
})(jQuery_1_8_2);