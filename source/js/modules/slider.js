import Swiper from "swiper";

export default () => {
  // Page data
  const historyPageKey = `story`;
  const historyPageHash = `#${historyPageKey}`;

  // Slider data
  let storySlider;
  let selectedSlideNumber;
  const sliderContainer = document.getElementById(historyPageKey);
  const slidesItemsData = {
    1: {
      backgroundImage: `url("img/slide1.jpg")`,
      backgroundColor: `linear-gradient(180deg, rgba(83, 65, 118, 0) 0%, #523E75 16.85%)`,
    },
    2: {
      backgroundImage: `url("img/slide2.jpg")`,
      backgroundColor: `linear-gradient(180deg, rgba(45, 54, 179, 0) 0%, #2A34B0 16.85%)`,
    },
    3: {
      backgroundImage: `url("img/slide3.jpg")`,
      backgroundColor: `linear-gradient(180deg, rgba(92, 138, 198, 0) 0%, 5183C4 16.85%`,
    },
    4: {
      backgroundImage: `url("img/slide4.jpg")`,
      backgroundColor: `linear-gradient(180deg, rgba(45, 39, 63, 0) 0%, 2F2A42 16.85%)`,
    },
  };

  // Slider main logic
  if (isHistoryPageUrl()) {
    setBackgroundForSlide(1, true);
    createSliderWithResizeListener();
  }

  window.addEventListener(`hashchange`, ({newURL}) => {
    if (isHistoryPageUrl(newURL)) {
      createSliderWithResizeListener();
    } else {
      destroySliderWithResizeListener();
    }
  });

  // Helpers
  function isHistoryPageUrl(url = window.location.href) {
    return url.includes(historyPageHash);
  }

  function createSliderWithResizeListener() {
    setSlider();
    window.addEventListener(`resize`, handleWindowResize);
  }

  function destroySliderWithResizeListener() {
    destroySlider();
    window.removeEventListener(`resize`, handleWindowResize);
  }

  function handleWindowResize() {
    destroySlider();

    if (isHistoryPageUrl()) {
      setSlider();
    }
  }

  function setSlider() {
    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
      setBackgroundForSlide(1, true);
      storySlider = new Swiper(`.js-slider`, {
        pagination: {
          el: `.swiper-pagination`,
          type: `bullets`
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            if (storySlider.activeIndex === 0 || storySlider.activeIndex === 1) {
              setBackgroundForSlide(1, true);
            } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
              setBackgroundForSlide(2, true);
            } else if (storySlider.activeIndex === 4 || storySlider.activeIndex === 5) {
              setBackgroundForSlide(3, true);
            } else if (storySlider.activeIndex === 6 || storySlider.activeIndex === 7) {
              setBackgroundForSlide(4, true);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    } else {
      setBackgroundForSlide(1);
      storySlider = new Swiper(`.js-slider`, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        pagination: {
          el: `.swiper-pagination`,
          type: `fraction`
        },
        navigation: {
          nextEl: `.js-control-next`,
          prevEl: `.js-control-prev`,
        },
        keyboard: {
          enabled: true
        },
        on: {
          slideChange: () => {
            if (storySlider.activeIndex === 0) {
              setBackgroundForSlide(1);
            } else if (storySlider.activeIndex === 2) {
              setBackgroundForSlide(2);
            } else if (storySlider.activeIndex === 4) {
              setBackgroundForSlide(3);
            } else if (storySlider.activeIndex === 6) {
              setBackgroundForSlide(4);
            }
          },
          resize: () => {
            storySlider.update();
          }
        },
        observer: true,
        observeParents: true
      });
    }
  }

  function destroySlider() {
    if (storySlider) {
      storySlider.destroy();
      document.body.classList.remove(getPageClassBySlideNumber(selectedSlideNumber));
    }
  }

  function setBackgroundForSlide(slideNumber, withBgColor = false) {
    if (!slideNumber || !slidesItemsData[slideNumber]) {
      return;
    }

    const {
      backgroundImage,
      backgroundColor,
    } = slidesItemsData[slideNumber];

    if (!backgroundImage || !backgroundColor) {
      return;
    }

    let resultBgImage = backgroundImage;

    if (withBgColor) {
      resultBgImage = `${backgroundImage}, ${backgroundColor}`;
    }

    sliderContainer.style.backgroundImage = resultBgImage;

    document.body.classList.remove(getPageClassBySlideNumber(selectedSlideNumber));
    document.body.classList.add(getPageClassBySlideNumber(slideNumber));

    selectedSlideNumber = slideNumber;
  }

  function getPageClassBySlideNumber(slideNumber) {
    return `page-root--history-slide--${slideNumber}`;
  }
};
