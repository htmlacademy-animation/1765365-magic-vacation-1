import Swiper from "swiper";

export default () => {
  const storyPageKey = `story`;
  const sliderContainer = document.getElementById(storyPageKey);

  let storySlider;
  let selectedSlideNumber;

  const setSlider = function () {
    sliderContainer.style.backgroundImage = `url("img/slide1.jpg"), linear-gradient(180deg, rgba(83, 65, 118, 0) 0%, #523E75 16.85%)`;
    handleSlideChange(1);

    if (((window.innerWidth / window.innerHeight) < 1) || window.innerWidth < 769) {
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
              sliderContainer.style.backgroundImage = `url("img/slide1.jpg"), linear-gradient(180deg, rgba(83, 65, 118, 0) 0%, #523E75 16.85%)`;
              handleSlideChange(1);
            } else if (storySlider.activeIndex === 2 || storySlider.activeIndex === 3) {
              sliderContainer.style.backgroundImage = `url("img/slide2.jpg"), linear-gradient(180deg, rgba(45, 54, 179, 0) 0%, #2A34B0 16.85%)`;
              handleSlideChange(2);
            } else if (storySlider.activeIndex === 4 || storySlider.activeIndex === 5) {
              sliderContainer.style.backgroundImage = `url("img/slide3.jpg"), linear-gradient(180deg, rgba(92, 138, 198, 0) 0%, #5183C4 16.85%)`;
              handleSlideChange(3);
            } else if (storySlider.activeIndex === 6 || storySlider.activeIndex === 7) {
              sliderContainer.style.backgroundImage = `url("img/slide4.jpg"), linear-gradient(180deg, rgba(45, 39, 63, 0) 0%, #2F2A42 16.85%)`;
              handleSlideChange(4);
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
              sliderContainer.style.backgroundImage = `url("img/slide1.jpg")`;
              handleSlideChange(1);
            } else if (storySlider.activeIndex === 2) {
              sliderContainer.style.backgroundImage = `url("img/slide2.jpg")`;
              handleSlideChange(2);
            } else if (storySlider.activeIndex === 4) {
              sliderContainer.style.backgroundImage = `url("img/slide3.jpg")`;
              handleSlideChange(3);
            } else if (storySlider.activeIndex === 6) {
              sliderContainer.style.backgroundImage = `url("img/slide4.jpg")`;
              handleSlideChange(4);
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
  };

  window.addEventListener(`resize`, function () {
    destroySlider();
    setSlider();
  });

  setSlider();

  document.body.addEventListener(`screenChanged`, (event) => {
    const {detail} = event;
    const {screenName: pageKey} = detail;

    destroySlider();

    if (storyPageKey === pageKey) {
      setSlider();
    }
  });

  function destroySlider() {
    if (storySlider) {
      storySlider.destroy();
      document.body.classList.remove(getPageClassBySlideNumber(selectedSlideNumber));
    }
  }

  function handleSlideChange(slideNumber) {
    document.body.classList.remove(getPageClassBySlideNumber(selectedSlideNumber));
    document.body.classList.add(getPageClassBySlideNumber(slideNumber));

    selectedSlideNumber = slideNumber;
  }

  function getPageClassBySlideNumber(slideNumber) {
    return `page-root--history-slide--${slideNumber}`;
  }
};
