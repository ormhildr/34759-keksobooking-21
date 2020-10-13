'use strict';

(() => {
  const MAIN_PIN_SIZE = 65;

  const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

  window.pin = {
    MAIN_PIN_SIZE,
    renderPin: (ad) => {
      const adElement = pinTemplate.cloneNode(true);
      const imgAd = adElement.querySelector(`img`);

      adElement.style = `left: ${ad.location.x - MAIN_PIN_SIZE}px; top: ${ad.location.y - MAIN_PIN_SIZE}px;`;
      imgAd.src = ad.author.avatar;
      imgAd.alt = ad.offer.title;

      return adElement;
    }
  };
})();
