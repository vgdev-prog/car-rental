var jQuery_1_8_2 = jQuery_1_8_2 || $.noConflict();

(function($, undefined) {
// ***  Start Stripe  ***

  let stripe = null;
  let cardNumber = null;
  let cardCVC = null;
  let cardExpire = null;

  let paymentSucceeded = false;
  let currentClientSecret = null;
  let currentIntentId = null;

  // ** Helpers **
  function getAmount() {
    return parseFloat($('#payment-amount')
        .val());
  }

  function getCardholderName() {
    return $('#stripe-cardholder-name')
        .val()
        .trim();
  }

  function setStatus(message) {
    $('#stripe-status')
        .text(message);
  }

  function setButtonLoading($button, loading = true) {
    $button.prop('disabled', loading);
    $button.text(loading
                 ? 'LOADING...'
                 : 'CHARGE');
  }

  function clearDataCard() {
    $('#stripe-cardholder-name')
        .val('');
    if (cardNumber) cardNumber.clear();
    if (cardCVC) cardCVC.clear();
    if (cardExpire) cardExpire.clear();
  }

  function createPaymentIntent() {
    const locationId = document.querySelector('.payment-block')?.dataset.location;

    return $.ajax({
      type: 'POST',
      data: {locationId},
      url: '/index.php?controller=pjAdminBookings&action=pjCreatePaymentIntent',
    });
  }

  function setPaymentIntentAmount(amount, intentId) {
    const locationId = document.querySelector('.payment-block')?.dataset.location;

    return $.ajax({
      type: 'POST',
      url: '/index.php?controller=pjAdminBookings&action=pjSetPaymentIntentAmount',
      data: {amount, intentId, locationId},
    });
  }

  function initializeStripeBackend(id) {

    return $.ajax({
      type: 'POST',
      data:{id},
      url: '/index.php?controller=pjAdminBookings&action=pjInitializeStripe',
    });
  }


  // --- Payment Logic ---

  async function confirmPayment(clientSecret, cardholderName, $button) {
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {name: cardholderName},
        },
      });

      await addPaymentBackend(result.paymentIntent)

      if (result.error) {
        setStatus(result.error.message);
        paymentSucceeded = false;
      } else if (result.paymentIntent && result.paymentIntent.status ===
          'succeeded') {
        clearDataCard();
        setStatus('Payment succeeded!');
        paymentSucceeded = true;
        currentClientSecret = null;
        currentIntentId = null;
      }
    }
    catch (err) {
      console.error('Error confirming payment:', err);
      setStatus('An error occurred while confirming the payment.');
      paymentSucceeded = false;
    }
    finally {
      setButtonLoading($button, false);
    }
  }

  function formatDateToMySQL(date) {
    const pad = n => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  async function addPaymentBackend(data) {
    const bookingId = document.querySelector('#tblPayment').dataset.bookingId;
    const formData = new FormData();

    formData.append('id', bookingId);
    formData.append('payment_stripe_method', 'creditcard');
    formData.append('payment_stripe_type', 'online');
    formData.append('amount', (data.amount / 100).toFixed(2));
    formData.append('booking_update', 1);
    formData.append('payment_datetime', formatDateToMySQL(new Date()));
    formData.append('payment_status', 'paid');
    formData.append('payment_stripe', true);

    const response = await fetch(`/index.php?controller=pjAdminBookings&action=pjActionAddStripePayment`, {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      await refreshPaymentTable(bookingId);
    }
  }

  async function refreshPaymentTable(bookingId) {
    try {
      const response = await fetch(`/index.php?controller=pjAdminBookings&action=pjActionGetPaymentTableData&booking_id=${bookingId}`);
      const result = await response.json();
      
      if (result.status === 'ok') {
        const tableBody = document.querySelector('#tblPayment tbody');
        if (tableBody) {
          tableBody.innerHTML = result.html;
          
          $('.datetimepick').each(function() {
            const $this = $(this);
            if (!$this.hasClass('hasDatepicker')) {
              $this.datetimepicker({
                firstDay: parseInt($this.attr("rel")) || 0,
                dateFormat: "dd-mm-yy",
                timeFormat: "HH:mm",
                stepMinute: 5,
                showTime: true,
                showHour: true,
                showMinute: true,
                onClose: function(dateText) {
                  if (dateText) {
                    $this.val(dateText);
                  }
                }
              });
            }
          });
        }
      }
      
      await refreshPaymentsSummary(bookingId);
    } catch (error) {
      console.error('Error refreshing payment table:', error);
    }
  }

  async function refreshPaymentsSummary(bookingId) {
    try {
      const response = await fetch(`/index.php?controller=pjAdminBookings&action=pjActionGetUpdatedPaymentsSummary&booking_id=${bookingId}`);
      const result = await response.json();
      
      if (result.status === 'ok') {
        const collectedElement = document.querySelector('#pj_collected');
        if (collectedElement) {
          collectedElement.textContent = result.formatted_collected;
        }
        
        const paymentDueElement = document.querySelector('#pj_due_payment');
        if (paymentDueElement) {
          paymentDueElement.textContent = result.formatted_payment_due;
        }
      }
    } catch (error) {
      console.error('Error refreshing payments summary:', error);
    }
  }

  window.refreshPaymentsSummary = refreshPaymentsSummary;

  async function processPayment(amount, cardholderName, $button) {
    try {
      if (!currentClientSecret || paymentSucceeded) {
        const response = await createPaymentIntent();
        currentClientSecret = response.clientSecret;
        currentIntentId = response.intentId;

        await setPaymentIntentAmount(amount, currentIntentId);
      }
      await confirmPayment(currentClientSecret, cardholderName, $button);
    }
    catch (err) {
      console.error('Error processing payment:', err);
      setStatus('Error processing payment.');
      setButtonLoading($button, false);
    }
  }

  // --- Event Handler ---
  function handleStripePayment() {
    $('#stripe-submit')
        .off('click')
        .on('click', async function(e) {
          e.preventDefault();

          const $button = $(this);
          setStatus('');
          setButtonLoading($button, true);

          const amount = getAmount();
          if (isNaN(amount) || amount <= 0) {
            setStatus('Error: payment amount must be greater than 0');
            setButtonLoading($button, false);
            return;
          }

          const cardholderName = getCardholderName();
          if (!cardholderName) {
            setStatus('Please enter the cardholder’s name.');
            setButtonLoading($button, false);
            return;
          }

          await processPayment(amount, cardholderName, $button);
        });
  }

  // --- Stripe Initialization ---
  async function initializeStripe() {
    try {
      const locationId = document.querySelector('.payment-block')?.dataset.location;

      const response = await initializeStripeBackend(locationId);

      if (!response.publishableKey) return

      stripe = Stripe(response.publishableKey);

      const elements = stripe.elements({
        fonts: [
          {cssSrc: 'https://fonts.googleapis.com/css?family=Source+Code+Pro'},
        ],
        locale: window.__exampleLocale || 'en',
      });

      const elementStyles = {
        base: {
          color: '#32325D',
          fontWeight: 500,
          fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
          fontSize: '16px',
          fontSmoothing: 'antialiased',
          '::placeholder': {color: '#CFD7DF'},
          ':-webkit-autofill': {color: '#e39f48'},
        },
        invalid: {
          color: '#E25950',
          '::placeholder': {color: '#FFCCA5'},
        },
      };

      const elementClasses = {
        focus: 'focused',
        empty: 'empty',
        invalid: 'invalid',
      };

      cardNumber = elements.create('cardNumber', {
        style: elementStyles,
        classes: elementClasses,
        showIcon: true,
      });
      cardNumber.mount('#stripe-card-number');

      cardExpire = elements.create('cardExpiry', {
        style: elementStyles,
        classes: elementClasses,
      });
      cardExpire.mount('#stripe-card-expiry');

      cardCVC = elements.create('cardCvc', {
        style: elementStyles,
        classes: {...elementClasses, base: 'stripe-cvc'},
      });
      cardCVC.mount('#stripe-card-cvc');

      $('#stripe-cardholder-name')
          .css(elementStyles.base);

      handleStripePayment();

    }
    catch (err) {
      console.error('Error initializing Stripe:', err);
      throw err;
    }
  }


  document.addEventListener('DOMContentLoaded',() => {
    initializeStripe()
        .catch(err => {
          setStatus(
              'Failed to initialize payment system. Please try again later.');
        });

  })


  // *** End Stripe ***

})(jQuery_1_8_2);
