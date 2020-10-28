'use strict';

(() => {
  const Key = {
    ESCAPE: `Escape`
  };

  window.util = {
    Key,
    removeAdPins: () => {
      document.querySelectorAll(`.map__pin`).forEach((el) => {
        if (!el.classList.contains(`map__pin--main`)) {
          el.remove();
        }
      });
    }
  };
})();
