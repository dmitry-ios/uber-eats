'use strict';

(function () {
  let warningAlert = document.querySelector(`#warning-alert`);
  let closeButton = document.querySelector(`#warning-alert button`);

  if (!warningAlert && !closeButton) {
    return;
  }

  warningAlert.classList.remove(`warning-alert--nojs`);

  let onAlertClose = function () {
    warningAlert.classList.add(`warning-alert--hidden`);
    closeButton.removeEventListener(`click`, onAlertClose);
  };

  closeButton.addEventListener(`click`, onAlertClose);
})();
