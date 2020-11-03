'use strict';

(() => {
  window.util = {
    escPress: (evt, cb) => {
      if (evt.key === `Escape`) {
        evt.preventDefault();
        cb();
      }
    },
    removeAdPins: () => {
      document.querySelectorAll(`.map__pin`).forEach((el) => {
        if (!el.classList.contains(`map__pin--main`)) {
          el.remove();
        }
      });
    }
  };
})();
