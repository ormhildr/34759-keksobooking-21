'use strict';

(() => {
  const Key = {
    ENTER: `Enter`,
    ESCAPE: `Escape`
  };

  window.util = {
    isEscEvent: (evt, element) => {
      if (evt.key === Key.ESCAPE) {
        evt.preventDefault();
        element.remove();
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
