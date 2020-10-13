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
    }
  };
})();
