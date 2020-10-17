'use strict';

(() => {
  const PIN_TAIL_SIZE = 20;
  const MAX_SIMILAR_ADS_COUNT = 5;

  const map = document.querySelector(`.map`);
  const pins = map.querySelector(`.map__pins`);
  const mapFilters = map.querySelector(`.map__filters-container`);
  const mainPin = document.querySelector(`.map__pin--main`);

  const adForm = window.form.adForm;
  const adAddress = adForm.querySelector(`input[name=address]`);
  const mapForm = document.querySelector(`.map__filters`);
  const houseType = mapForm.querySelector(`#housing-type`);

  let isPageEnabled = true;

  let mainAds = [];

  const setFormEnabled = (form, enabled) => {
    for (let element of form.children) {
      element.disabled = !enabled;
    }
  };

  const filterType = () => {
    const result = mainAds.filter((ad) => {
      return ad.offer.type === houseType.value;
    });

    removeActiveCard();

    if (result.length === 0) {
      updateAds(mainAds);
    } else {
      updateAds(result);
    }
  };

  const removeActivePin = () => {
    Array.from(pins.children).forEach((child) => {
      if (child.classList.contains(`map__pin--active`)) {
        child.classList.remove(`map__pin--active`);
      }
    });
  };

  const removeActiveCard = () => {
    if (map.contains(map.querySelector(`.map__card`))) {
      map.removeChild(map.querySelector(`.map__card`));
    }
  };

  const updateAds = (ads) => {
    const takeNumber = ads.length > MAX_SIMILAR_ADS_COUNT
      ? MAX_SIMILAR_ADS_COUNT
      : ads.length;

    window.util.removeAdPins();

    for (let i = 0; i < takeNumber; i++) {
      const pin = window.pin.renderPin(ads[i]);
      pins.appendChild(pin);

      pin.addEventListener(`click`, () => {
        removeActivePin();

        pin.classList.add(`map__pin--active`);

        removeActiveCard();

        mapFilters.before(window.card.renderCard(ads[i]));

        const currentCard = map.querySelector(`.map__card`);
        const cardClose = currentCard.querySelector(`.popup__close`);

        cardClose.addEventListener(`click`, () => {
          currentCard.remove();
          pin.classList.remove(`map__pin--active`);
        });
        document.addEventListener(`keydown`, (evt) => {
          window.util.isEscEvent(evt, currentCard);
          pin.classList.remove(`map__pin--active`);
        });
      });
    }
  };

  const successHandler = (data) => {
    mainAds = data;
    updateAds(data);
  };

  const errorHandler = function (errorMessage) {
    const node = document.createElement(`div`);
    node.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: red; color: white`;
    node.style.position = `fixed`;
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = `30px`;

    node.textContent = errorMessage;
    document.body.insertAdjacentElement(`afterbegin`, node);
  };

  const enablePage = () => {
    if (isPageEnabled === false) {
      adForm.classList.remove(`ad-form--disabled`);
      map.classList.remove(`map--faded`);

      setFormEnabled(adForm, true);
      setFormEnabled(mapForm, true);
      isPageEnabled = true;

      window.form.validateGuests();
      window.form.validatePrice();
      adAddress.value = getAddressCoordinates();

      window.backend.load(successHandler, errorHandler);
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

  houseType.addEventListener(`change`, filterType);

  window.map = {
    map,
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
