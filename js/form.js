'use strict';

(() => {
  const GUESTS_VALIDATION_MSG = {
    1: `«для 1 гостя»`,
    2: `«для 2 гостей» или «для 1 гостя»`,
    3: `«для 3 гостей, «для 2 гостей» или «для 1 гостя»`,
    100: `«не для гостей»`
  };


  const roomsAmount = document.querySelector(`#room_number`);
  const guestsAmount = document.querySelector(`#capacity`);

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

  window.form = {
    validateGuests
  };
})();
