'use strict';

(() => {
  const GUESTS_VALIDATION_MSG = {
    1: `«для 1 гостя»`,
    2: `«для 2 гостей» или «для 1 гостя»`,
    3: `«для 3 гостей, «для 2 гостей» или «для 1 гостя»`,
    100: `«не для гостей»`
  };

  const adForm = document.querySelector(`.ad-form`);
  const roomsAmount = document.querySelector(`#room_number`);
  const guestsAmount = document.querySelector(`#capacity`);

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

    document.addEventListener(`keydown`, (evt)=> {
      if (evt.key === `Escape`) {
        evt.preventDefault();
        errorElement.remove();
      }
    });

    errorElement.addEventListener(`click`, ()=> {
      errorElement.remove();
    });
  };

  const successWindow = () => {
    document.body.insertAdjacentElement(`afterbegin`, successElement);

    document.addEventListener(`keydown`, (evt)=> {
      if (evt.key === `Escape`) {
        evt.preventDefault();
        successElement.remove();
      }
    });

    successElement.addEventListener(`click`, ()=> {
      successElement.remove();
    });
  };

  const resetForm = () => {
    document.querySelectorAll(`.map__pin`).forEach((el) => {
      if (!el.classList.contains(`map__pin--main`)) {
        el.remove();
      }
    });
    document.querySelector(`.map__card`).remove();
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

  roomsAmount.addEventListener(`change`, validateGuests);
  guestsAmount.addEventListener(`change`, validateGuests);

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
    validateGuests
  };
})();
