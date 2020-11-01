"use strict";

const MAX_SIMILAR_ADS_COUNT = 5;
const DEFAULT_INPUT_FILTER = `any`;

const priceRange = {
  low: {
    MIN: 0,
    MAX: 10000
  },
  middle: {
    MIN: 10000,
    MAX: 50000
  },
  high: {
    MIN: 50000,
    MAX: Infinity
  }
};

const mapForm = document.querySelector(`.map__filters`);
const houseType = mapForm.querySelector(`#housing-type`);
const housePrice = mapForm.querySelector(`#housing-price`);
const houseRooms = mapForm.querySelector(`#housing-rooms`);
const houseGuests = mapForm.querySelector(`#housing-guests`);
const houseFeatures = mapForm.querySelector(`#housing-features`);

const filterType = (ad) => {
  return houseType.value === DEFAULT_INPUT_FILTER || ad.offer.type === houseType.value;
};

const filterPrice = (ad) => {
  return housePrice.value === DEFAULT_INPUT_FILTER ||
    priceRange[housePrice.value].MIN <= ad.offer.price && priceRange[housePrice.value].MAX >= ad.offer.price;
};

const filterRooms = (ad) => {
  return houseRooms.value === DEFAULT_INPUT_FILTER || String(ad.offer.rooms) === houseRooms.value;
};

const filterGuests = (ad) => {
  return houseGuests.value === DEFAULT_INPUT_FILTER || String(ad.offer.guests) === houseGuests.value;
};

const filterFeatures = (ad) => {
  const checkedFeatures = houseFeatures.querySelectorAll(`input:checked`);
  let activeFeatures = true;
  checkedFeatures.forEach((feature) => {
    activeFeatures = activeFeatures && ad.offer.features.includes(feature.value);
  });
  return activeFeatures;
};

const getFilterAds = (ads) => {
  const filterAds = [];
  for (let i = 0; i < ads.length; i++) {
    if (i === MAX_SIMILAR_ADS_COUNT) {
      break;
    }
    if (filterType(ads[i]) && filterPrice(ads[i]) && filterRooms(ads[i]) && filterGuests(ads[i]) && filterFeatures(ads[i])) {
      filterAds.push(ads[i]);
    }
  }
  return filterAds;
};

window.filter = {
  mapForm,
  getFilterAds
};
