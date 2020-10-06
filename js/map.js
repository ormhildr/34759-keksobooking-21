'use strict';

(() => {
  const PIN_TAIL_SIZE = 20;

  const map = document.querySelector(`.map`);
  const pins = map.querySelector(`.map__pins`);
  const mapFilters = map.querySelector(`.map__filters-container`);
  const mainPin = document.querySelector(`.map__pin--main`);

  const adForm = document.querySelector(`.ad-form`);
  const adAddress = adForm.querySelector(`input[name=address]`);
  const mapForm = document.querySelector(`.map__filters`);

  let isPageEnabled = true;

  const setFormEnabled = (form, enabled) => {
    for (let element of form.children) {
      element.disabled = !enabled;
    }
  };

  const enablePage = () => {
    const ads = window.data.generateAds(8);

    if (isPageEnabled === false) {
      adForm.classList.remove(`ad-form--disabled`);
      map.classList.remove(`map--faded`);

      setFormEnabled(adForm, true);
      setFormEnabled(mapForm, true);
      isPageEnabled = true;

      window.form.validateGuests();
      adAddress.value = getAddressCoordinates();

      pins.appendChild(window.pin.renderPins(ads));
      mapFilters.before(window.card.renderCard(ads[0]));
    }
  };

  const getAddressCoordinates = () => {
    let addressCoordinates;

    if (isPageEnabled) {
      addressCoordinates = `${Math.floor(parseInt(mainPin.style.left, 10) + window.pin.MAIN_PIN_SIZE / 2)}, ${Math.floor(parseInt(mainPin.style.top, 10) + window.pin.MAIN_PIN_SIZE + PIN_TAIL_SIZE)}`;
    } else {
      addressCoordinates = `${Math.floor(parseInt(mainPin.style.left, 10) + window.pin.MAIN_PIN_SIZE / 2)}, ${Math.floor(parseInt(mainPin.style.top, 10) + window.pin.MAIN_PIN_SIZE / 2)}`;
    }

    return addressCoordinates;
  };

  mainPin.addEventListener(`mousedown`, (evt) => {
    if (evt.which === 1) {
      enablePage();
    }
  });

  mainPin.addEventListener(`click`, () => {
    enablePage();
  });

  window.map = {
    disablePage: () => {
      adForm.classList.add(`ad-form--disabled`);
      map.classList.add(`map--faded`);

      setFormEnabled(adForm, false);
      setFormEnabled(mapForm, false);

      isPageEnabled = false;

      adAddress.value = getAddressCoordinates();
    }
  };
})();
