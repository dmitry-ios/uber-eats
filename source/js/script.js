'use strict';

(() => {
  const MAX_OFFSET = 100;
  const scrollButton = document.querySelector(`.scroll-button`);

  scrollButton.addEventListener(`click`, () => {
    window.scrollTo(0, 0);
  });

  window.addEventListener(`scroll`, () => {
    if (window.pageYOffset < MAX_OFFSET) {
      scrollButton.classList.add(`scroll-button--hidden`);
    } else if (scrollButton.classList.contains(`scroll-button--hidden`)) {
      scrollButton.classList.remove(`scroll-button--hidden`);
    }
  });
})();
