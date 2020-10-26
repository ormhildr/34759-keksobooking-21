'use strict';

const PinSizes = {
  WIDTH: 50,
  HEIGHT: 70
};

const pinTemplate = document.querySelector(`#pin`).content.querySelector(`.map__pin`);

window.pin = {
  renderPin: (ad) => {
    const adElement = pinTemplate.cloneNode(true);
    const imgAd = adElement.querySelector(`img`);

    adElement.style = `left: ${ad.location.x - PinSizes.WIDTH / 2}px; top: ${ad.location.y - PinSizes.HEIGHT}px;`;
    imgAd.src = ad.author.avatar;
    imgAd.alt = ad.offer.title;

    return adElement;
  }
};
