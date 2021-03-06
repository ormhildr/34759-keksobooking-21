'use strict';

const MainPinSizes = {
  SIDE: 65,
  TIP: 16
};

const LocationLimits = {
  MIN_X: 0,
  MAX_X: 1200,
  MIN_Y: 130,
  MAX_Y: 630
};

const map = document.querySelector(`.map`);
const pins = map.querySelector(`.map__pins`);
const mapFilters = map.querySelector(`.map__filters-container`);
const mainPin = document.querySelector(`.map__pin--main`);

const adForm = window.form.adForm;
const adAddress = adForm.querySelector(`input[name=address]`);

let isPageEnabled = true;

let mainAds = [];

const setFormEnabled = (form, enabled) => {
  for (let element of form.children) {
    element.disabled = !enabled;
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
  window.util.removeAdPins();

  let fragment = new DocumentFragment();

  ads.forEach((ad) => {
    const pin = window.renderPin(ad);
    fragment.append(pin);

    pin.addEventListener(`click`, () => {
      removeActivePin();

      pin.classList.add(`map__pin--active`);

      removeActiveCard();

      mapFilters.before(window.renderCard(ad));

      const currentCard = map.querySelector(`.map__card`);
      const cardCloser = currentCard.querySelector(`.popup__close`);

      const closeCard = () => {
        currentCard.remove();
        pin.classList.remove(`map__pin--active`);

        document.removeEventListener(`keydown`, onEscPressCard);
      };

      const onEscPressCard = (evt) => {
        window.util.escPress(evt, closeCard);
      };

      cardCloser.addEventListener(`click`, () => {
        closeCard();
      });

      document.addEventListener(`keydown`, onEscPressCard);
    });
  });

  pins.append(fragment);
};

const onFilteredPins = window.debounce(() => {
  removeActiveCard();
  updateAds(window.filter.getFilterAds(mainAds));
});

const successHandler = (data) => {
  mainAds = data;
  updateAds(window.filter.getFilterAds(mainAds));
};

const errorHandler = (errorMessage) => {
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
    isPageEnabled = true;

    window.form.onValidateGuests();
    window.form.onValidatePrice();
    adAddress.value = getAddressCoordinates();

    window.backend.load(successHandler, errorHandler);
    setFormEnabled(window.filter.mapForm, true);
  }
};

const getAddressCoordinates = () => {
  let addressCoordinates = `${Math.floor(parseInt(mainPin.style.left, 10) + MainPinSizes.SIDE / 2)},
  ${isPageEnabled ? Math.floor(parseInt(mainPin.style.top, 10) + MainPinSizes.SIDE + MainPinSizes.TIP) :
    Math.floor(parseInt(mainPin.style.top, 10) + MainPinSizes.SIDE / 2)}`;

  return addressCoordinates;
};

const checkMapLimits = (min, max, location) => {
  if (location < min) {
    return min;
  }
  if (location > max) {
    return max;
  }
  return location;
};

mainPin.addEventListener(`mousedown`, (evt) => {
  if (evt.which === 1) {
    enablePage();
  }

  let startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  const onMouseMove = (moveEvt) => {
    moveEvt.preventDefault();

    const shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    const minPinY = LocationLimits.MIN_Y - (MainPinSizes.SIDE + MainPinSizes.TIP);
    const maxPinY = LocationLimits.MAX_Y - (MainPinSizes.SIDE + MainPinSizes.TIP);

    const minPinX = LocationLimits.MIN_X - Math.floor(MainPinSizes.SIDE / 2);
    const maxPinX = LocationLimits.MAX_X - Math.floor(MainPinSizes.SIDE / 2);

    const currentLocationX = mainPin.offsetLeft - shift.x;
    const currentLocationY = mainPin.offsetTop - shift.y;

    mainPin.style.top = `${checkMapLimits(minPinY, maxPinY, currentLocationY)}px`;
    mainPin.style.left = `${checkMapLimits(minPinX, maxPinX, currentLocationX)}px`;

    adAddress.value = getAddressCoordinates();
  };

  const onMouseUp = (upEvt) => {
    upEvt.preventDefault();

    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);
  };

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);

});

mainPin.addEventListener(`click`, () => {
  enablePage();
});

window.filter.mapForm.addEventListener(`change`, onFilteredPins);

window.map = {
  map,
  disablePage: () => {
    adForm.classList.add(`ad-form--disabled`);
    map.classList.add(`map--faded`);

    setFormEnabled(adForm, false);
    setFormEnabled(window.filter.mapForm, false);

    isPageEnabled = false;

    adAddress.value = getAddressCoordinates();
  }
};
