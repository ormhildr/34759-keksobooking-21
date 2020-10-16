'use strict';

(() => {
  const MIN_TITLE_LENGTH = 30;
  const MAX_TITLE_LENGTH = 100;

  const GUESTS_VALIDATION_MSG = {
    1: `«для 1 гостя»`,
    2: `«для 2 гостей» или «для 1 гостя»`,
    3: `«для 3 гостей, «для 2 гостей» или «для 1 гостя»`,
    100: `«не для гостей»`
  };

  const MIN_PRICE_VALIDATION = {
    bungalow: `0`,
    flat: `1000`,
    house: `5000`,
    palace: `10000`
  };

  const adForm = document.querySelector(`.ad-form`);

  const titleAd = adForm.querySelector(`#title`);
  const roomsAmount = adForm.querySelector(`#room_number`);
  const guestsAmount = adForm.querySelector(`#capacity`);
  const typeHouse = adForm.querySelector(`#type`);
  const price = adForm.querySelector(`#price`);
  const timeIn = adForm.querySelector(`#timein`);
  const timeOut = adForm.querySelector(`#timeout`);

  const errorTemplate = document.querySelector(`#error`).content.querySelector(`.error`);
  const errorElement = errorTemplate.cloneNode(true);
  const errorBtn = errorElement.querySelector(`.error__button`);

  const successTemplate = document.querySelector(`#success`).content.querySelector(`.success`);
  const successElement = successTemplate.cloneNode(true);

  const btnReset = adForm.querySelector(`.ad-form__reset`);

  const errorWindow = () => {
    document.body.insertAdjacentElement(`afterbegin`, errorElement);

    errorBtn.addEventListener(`click`, () => {
      errorElement.remove();
    });

    document.addEventListener(`keydown`, (evt) => {
      window.util.isEscEvent(evt, errorElement);
    });

    errorElement.addEventListener(`click`, () => {
      errorElement.remove();
    });
  };

  const successWindow = () => {
    document.body.insertAdjacentElement(`afterbegin`, successElement);

    document.addEventListener(`keydown`, (evt) => {
      window.util.isEscEvent(evt, successElement);
    });

    successElement.addEventListener(`click`, () => {
      successElement.remove();
    });
  };

  const resetForm = () => {
    window.util.removeAdPins();

    if (window.map.map.contains(window.map.map.querySelector(`.map__card`))) {
      window.map.map.querySelector(`.map__card`).remove();
    }
    adForm.reset();
    window.map.disablePage();
  };

  const getGuestsLimits = (rooms) => {
    return rooms <= 3 ? [1, rooms] : [0];
  };

  const validateGuests = () => {
    let validationMsg = ``;

    const rooms = roomsAmount.value;
    const guests = guestsAmount.value;

    const limits = getGuestsLimits(rooms);
    if (!limits.includes(guests)) {
      validationMsg = GUESTS_VALIDATION_MSG[rooms];
    }

    guestsAmount.setCustomValidity(validationMsg);
  };

  const validatePrice = () => {
    price.min = MIN_PRICE_VALIDATION[typeHouse.value];
    price.placeholder = MIN_PRICE_VALIDATION[typeHouse.value];
  };

  const validateCheckOut = () => {
    timeOut.value = timeIn.value;
  };

  const validateCheckIn = () => {
    timeIn.value = timeOut.value;
  };

  titleAd.addEventListener(`input`, () => {
    const titleLength = titleAd.value.length;

    if (titleLength < MIN_TITLE_LENGTH) {
      titleAd.setCustomValidity(`Еще ${MIN_TITLE_LENGTH - titleLength} симв.`);
    } else if (titleLength > MAX_TITLE_LENGTH) {
      titleAd.setCustomValidity(`Удалите лишние ${titleLength - MAX_TITLE_LENGTH} симв.`);
    } else {
      titleAd.setCustomValidity(``);
    }

    titleAd.reportValidity();
  });

  roomsAmount.addEventListener(`change`, validateGuests);
  guestsAmount.addEventListener(`change`, validateGuests);
  typeHouse.addEventListener(`change`, validatePrice);
  timeIn.addEventListener(`change`, validateCheckOut);
  timeOut.addEventListener(`change`, validateCheckIn);

  adForm.addEventListener(`submit`, (evt) => {
    window.backend.save(new FormData(adForm), () => {
      successWindow();
      resetForm();
    }, errorWindow);
    evt.preventDefault();
  });

  btnReset.addEventListener(`click`, () => {
    resetForm();
  });

  window.form = {
    adForm,
    validateGuests,
    validatePrice
  };
})();
