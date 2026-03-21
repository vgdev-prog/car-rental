document.addEventListener('DOMContentLoaded', () => {
    const inputId = document.querySelector('input[name="id"]');
    const btnReturnProf = document.querySelector('.print-return-proof');
    const btnSendReturnProf = document.querySelector('.email-return-proof');
    const btnSendGoogleReview = document.querySelector('.send-google-review-email');

    let notificationTimeout = null;
    let notificationBox = null;


    btnReturnProf.addEventListener('click', onClickPrintReturnProf);
    btnSendReturnProf.addEventListener('click', onSendReturnProf);

    if (btnSendGoogleReview) {
        btnSendGoogleReview.addEventListener('click', onSendGoogleReviewEmail);
    }


    /**
     * Event Handlers Return Proof
     * @param event
     */
    function onClickPrintReturnProf(event) {
        event.preventDefault();

        const id = inputId.value;

        const form = document.createElement('form');
        form.action = 'index.php?controller=pjAdminBookings&action=pjActionPrintReturnProof';
        form.method = 'POST';
        form.target = '_blank';
        form.id = 'print-return-proof';

        const idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'id';
        idInput.value = id;
        form.appendChild(idInput);

        document.body.appendChild(form)

        form.submit();
        form.remove();
    }

    async function onSendReturnProf(event) {
        event.preventDefault();

        btnSendReturnProf.disabled = true;

        const id = inputId.value;
        if (!id) {
            btnSendReturnProf.disabled = false;
            return;
        }

        showNotification('Sending Return Proof email...');

        try {
            const response = await sendReturnProofRequest({id});

            if (response.status === true || response.status === 'OK') {
                showNotification('Return Proof sent successfully!');
            } else {
                showNotification(response.text || 'Failed to send Return Proof');
            }

            btnSendReturnProf.disabled = false;
        } catch (error) {
            console.error(error);
            showNotification(error.message || 'Error sending Return Proof');
            btnSendReturnProf.disabled = false;
        }

    }

    async function onSendGoogleReviewEmail(event) {
        event.preventDefault();

        btnSendGoogleReview.disabled = true;

        const id = inputId.value;
        if (!id) {
            btnSendGoogleReview.disabled = false;
            return;
        }

        showNotification('Sending Google Review email...');

        try {
            const response = await sendGoogleReviewEmailRequest({id});

            if (response.status === true || response.status === 'OK') {
                showNotification('Review sent successfully!');
            } else {
                showNotification(response.text || 'Failed to send email');
            }

            btnSendGoogleReview.disabled = false;
        } catch (error) {
            console.error(error);
            showNotification(error.message || 'Error sending email');
            btnSendGoogleReview.disabled = false;
        }
    }


    async function sendReturnProofRequest({id}) {
        const data = await fetch('index.php?controller=pjAdminBookings&action=pjActionSendReturnProof', {
            method: 'POST',
            body: new URLSearchParams({id})
        })

        return data.json();
    }

    async function sendGoogleReviewEmailRequest({id}) {
        const response = await fetch('index.php?controller=pjAdminBookings&action=pjActionSendGoogleReview', {
            method: 'POST',
            body: new URLSearchParams({id})
        });

        return response.json();
    }


    /**
     * Notifications Functions
     * @param message
     */

    function showNotification(message) {
        const content = document.querySelector('#content');
        if (!content) return;

        // Check if notice-box already exists
        notificationBox = content.querySelector('.notice-box');

        if (!notificationBox) {
            // Create notice-box structure using innerHTML
            const notificationBlock = `
        <div class="notice-box">
          <div class="notice-top"></div>
          <div class="notice-middle">
            <span class="notice-info">&nbsp;</span>
            <a href="#" class="notice-close"></a>
          </div>
          <div class="notice-bottom"></div>
        </div>
      `;

            content.insertAdjacentHTML('afterbegin', notificationBlock);
            notificationBox = content.querySelector('.notice-box');

            // Add close button handler
            const closeBtn = notificationBox.querySelector('.notice-close');
            if (closeBtn) {
                closeBtn.onclick = function (e) {
                    e.preventDefault();
                    clearNotification();
                };
            }
        }

        // Get notice-middle and add message
        const noticeMiddle = notificationBox.querySelector('.notice-middle');
        if (noticeMiddle) {
            const messageSpan = document.createElement('span');
            messageSpan.style.display = 'block';
            messageSpan.textContent = message;
            messageSpan.style.marginLeft = '42px';
            messageSpan.style.marginTop = '10px'

            // Insert before close button
            const closeLink = noticeMiddle.querySelector('.notice-close');
            noticeMiddle.insertBefore(messageSpan, closeLink);
        }

        // Clear previous timeout and set new one
        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
        }

        // Auto-hide after 5 seconds from last message
        notificationTimeout = setTimeout(() => {
            clearNotification();
        }, 3000);
    }

    function clearNotification() {
        if (!notificationBox) return;

        // Remove notification box from DOM
        if (notificationBox.parentNode) {
            notificationBox.parentNode.removeChild(notificationBox);
        }

        // Reset reference
        notificationBox = null;

        if (notificationTimeout) {
            clearTimeout(notificationTimeout);
            notificationTimeout = null;
        }
    }

});