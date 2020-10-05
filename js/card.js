'use strict';

(() => {
  const cardTemplate = document.querySelector(`#card`).content.querySelector(`.map__card`);

  window.card = {
    cardTemplate,
    renderCard: (ad) => {
      const OfferType = {
        FLAT: {
          name: `Квартира`
        },
        BUNGALOW: {
          name: `Бунгало`
        },
        HOUSE: {
          name: `Дом`
        },
        PALACE: {
          name: `Дворец`
        },
        getById: (id) => {
          return OfferType[id.toUpperCase()];
        }
      };

      const cardElement = cardTemplate.cloneNode(true);
      const popupFeatures = cardElement.querySelector(`.popup__features`);
      const popupPhotos = cardElement.querySelector(`.popup__photos`);
      const popupPhoto = popupPhotos.querySelector(`.popup__photo`);

      cardElement.querySelector(`.popup__title`).textContent = ad.offer.title;
      cardElement.querySelector(`.popup__text--address`).textContent = ad.offer.address;
      cardElement.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
      cardElement.querySelector(`.popup__type`).textContent = OfferType.getById(ad.offer.type).name;
      cardElement.querySelector(`.popup__text--capacity`).textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
      cardElement.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;

      for (const element of window.data.ALL_FEATURES) {
        if (!ad.offer.features.includes(element)) {
          popupFeatures.removeChild(popupFeatures.querySelector(`.popup__feature--${element}`));
        }
      }

      cardElement.querySelector(`.popup__description`).textContent = ad.offer.description;

      for (const photo of ad.offer.photos) {
        const imgPhoto = popupPhoto.cloneNode(true);
        popupPhotos.appendChild(imgPhoto);
        imgPhoto.src = photo;
      }

      popupPhotos.removeChild(popupPhoto);

      cardElement.querySelector(`.popup__avatar`).src = ad.author.avatar;

      const hasChildren = (element) => {
        if (element.children.length === 0) {
          element.remove();
        }
      };

      hasChildren(popupFeatures);
      hasChildren(popupPhotos);

      return cardElement;
    }
  };
})();
