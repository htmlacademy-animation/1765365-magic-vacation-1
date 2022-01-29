import throttle from 'lodash/throttle';

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 2000;
    this.animatedTransitionScreensStartIndex = 1;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);

    this.prevActiveScreen = 0;
    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    const currentPosition = this.activeScreen;
    this.reCalculateActiveScreenPosition(evt.deltaY);
    if (currentPosition !== this.activeScreen) {
      this.changePageDisplay();
    }
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    this.setActiveScreen(newIndex);
    this.changePageDisplay();
  }

  setActiveScreen(newIndex = 0) {
    this.prevActiveScreen = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
  }

  changePageDisplay() {
    this.changeActiveMenuItem();

    this.startScreenTransition(() => {
      this.changeVisibilityDisplay();
      this.emitChangeDisplayEvent();
    });
  }

  startScreenTransition(completeScreenTransition) {
    const transitionEventKey = `transitionend`;

    const transitionBlock = document.getElementById(`screen-transition-block`);
    const transitionActiveClassname = `screen-transition-animation-block--visible`;

    const animatedStartIndex = this.animatedTransitionScreensStartIndex;
    const shouldAnimateScreenTransition = this.prevActiveScreen <= animatedStartIndex && this.activeScreen > animatedStartIndex;

    if (shouldAnimateScreenTransition) {
      transitionBlock.classList.add(transitionActiveClassname);
      transitionBlock.addEventListener(transitionEventKey, handleTransitionEnd);

      return;
    }

    transitionBlock.classList.remove(transitionActiveClassname);
    completeScreenTransition();

    function handleTransitionEnd({target}) {
      target.classList.remove(transitionActiveClassname);
      completeScreenTransition();
      transitionBlock.removeEventListener(transitionEventKey, handleTransitionEnd);
    }
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);

    setTimeout(() => {
      // Таймаут добавлен с учётом описания задачи 1.13.
      // Ссылка на задачу - https://up.htmlacademy.ru/animation/1/tasks/2".
      // Часть описания задачи:
      // "Когда экран станет активным, из этой секции исчезнет класс screen--hidden,
      // и через 100 мс добавится класс active.
      // Для запуска линейной анимации можно отслеживать добавление этого класса."

      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    let currentActiveScreen = this.activeScreen;

    if (delta > 0) {
      this.setActiveScreen(Math.min(this.screenElements.length - 1, ++currentActiveScreen));
    } else {
      this.setActiveScreen(Math.max(0, --currentActiveScreen));
    }
  }
}
