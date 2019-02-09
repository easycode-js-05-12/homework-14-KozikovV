class VideoPlayerBasic {
    constructor(settings) {
      this._settings = Object.assign(VideoPlayerBasic.getDefaultSettings(), settings);
      this._videoContainer = null;
      this._video = null;
      this._toggleBtn = null;
      this._progress = null;
      this._mouseDown = false;
      this._volume = null;                // калька змінні для елементів при створенні класу
      this._playbackRate = null;
      this._btnSkipPrev = null;
      this._btnSkipNext = null;
    }
/**
 * @description method which initialization videoplayer and do three methods: add template, set control elements of video player and set events for them
 * @returns {undefined} undefined
 */
    init() {
      // Проверить переданы ли  видео и контейнер
      if (!this._settings.videoUrl) return console.error("Передайте адрес видео");
      if (!this._settings.videoPlayerContainer) return console.error("Передайте селектор контейнера");
      
      // Создадим разметку и добавим ее на страницу
      this._addTemplate();
      // Найти все элементы управления
      this._setElements();
      // Установить обработчики событий
      this._setEvents();
    }
/**
 * @description method change symbols on control element play/pause and set video on play or pause
 * @returns {undefined} undefined
 */
    toggle() {
      const method = this._video.paused ? 'play' : 'pause';
      this._toggleBtn.textContent = this._video.paused ? '❚ ❚' :  '►';
      this._video[method]();
    }
/**
 * @description method change progress timing bar on video player
 * @returns {undefined} undefined
 */
    _handlerProgress() {
      const percent = (this._video.currentTime / this._video.duration) * 100;
      this._progress.style.flexBasis = `${percent}%`;
    }
/**
 * @description method set current time of video
 * @returns {undefined} undefined
 */
    _scrub(e) {
      this._video.currentTime = (e.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
    }
/**
 * @description method set elements of control video player
 * @returns {undefined} undefined
 */
    _setElements() {
      this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
      this._video = this._videoContainer.querySelector('video');
      this._toggleBtn = this._videoContainer.querySelector('.toggle');
      this._progress = this._videoContainer.querySelector('.progress__filled');
      this._progressContainer = this._videoContainer.querySelector('.progress');
      this._volume = this._videoContainer.querySelector('.volume');                 // встановлюєм елементи для звуку швидкості і кнопок прокрутки 
      this._playbackRate = this._videoContainer.querySelector('.playbackRate');
      this._btnSkipNext = this._videoContainer.querySelector('.next');
      this._btnSkipPrev = this._videoContainer.querySelector('.prev');
    }
/**
 * @description method set events on control elements of video player
 * @returns {undefined} undefined
 */
   _setEvents() {
      let clickCount = 0;
      this._video.addEventListener('click', () => {
        setTimeout(() => {
          if (clickCount === 2) {
            clickCount--;
          } else if (clickCount === 1) {
            clickCount--;
          } else if (!clickCount) {
            this.toggle();
          }
         },300);
      });
      this._toggleBtn.addEventListener('click', () => this.toggle());
      this._video.addEventListener('timeupdate', () => this._handlerProgress());
      this._progressContainer.addEventListener('click', (e) => this._scrub(e));
      this._progressContainer.addEventListener('mousemove', (e) => this._mouseDown && this._scrub(e));
      this._progressContainer.addEventListener('mousedown', (e) => this._mouseDown = true);
      this._progressContainer.addEventListener('mouseup', (e) => this._mouseDown = false);
      this._volume.addEventListener('input', () => this._setVolume());                    // події на інпути, клік та подвійний клік
      this._playbackRate.addEventListener('input', () => this._setPlaybackRate());
      this._btnSkipNext.addEventListener('click', (e) => this._skipVideo(e));
      this._btnSkipPrev.addEventListener('click', (e) => this._skipVideo(e));
      this._video.addEventListener('dblclick', (e) => {
        clickCount = 2;
        this._mouseClickSkipVideo(e)
      });
    }
/**
 * @description method add video player to template
 * @returns {undefined} undefined
 */
    _addTemplate() {
      const template = this._createVideoTemplate();
      const container = document.querySelector(this._settings.videoPlayerContainer);
      container ? container.insertAdjacentHTML("afterbegin", template) : console.error('контейнер не найден');
    }
/**
 * @description method create template of video player
 * @returns {undefined} undefined
 */

 // і в розмітку додав значення з налаштувань
    _createVideoTemplate() {
      return `
      <div class="player">
        <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
        <div class="player__controls">
          <div class="progress">
          <div class="progress__filled"></div>
          </div>
          <button class="player__button toggle" title="Toggle Play">►</button>
          <input type="range" name="volume" class="player__slider volume" min=0 max="1" step="0.05" value="${this._settings.volume}">
          <input type="range" name="playbackRate" class="player__slider playbackRate" min="0.5" max="2" step="0.1" value="${this._settings.playbackRate}">
          <button data-skip="${this._settings.skipPrev}" class="player__button prev">« ${this._settings.skipPrev}s</button>
          <button data-skip="${this._settings.skipNext}" class="player__button next">${this._settings.skipNext}s »</button>
        </div>
      </div>
      `;
    }
/**
 * @description method for change volume value
 * @returns {undefined} undefined
 */
    _setVolume() {
      this._video.volume = this._volume.value;            // гучність відео дорівнює значення інпуту, по дефолту гучність відео в вбудованих налаштуваннях від 0 до 1
    }
/**
 * @description method for change playback rate
 * @returns {undefined} undefined
 */
    _setPlaybackRate() {
      this._video.playbackRate = this._playbackRate.value;  // швидкість відео дорівню значеню інпуту
    }

/**
 * @description method for skip video on click on button
 * @returns {undefined} undefined
 */
    _skipVideo(e) {
      e.preventDefault();             // стандіртні події кнопки зупиняємо
      const skipTime = + e.target.dataset.skip;   // забираєм значення з дата атрибута
      e.target.classList.contains('prev') ? this._video.currentTime -= skipTime : this._video.currentTime += skipTime; // якщо клас в кнопки прев то гортає назад якщо ні то вперед
    }
/**
 * @description method for skip video on double click video window
 * @returns {undefined} undefined
 */
    _mouseClickSkipVideo(e) {
      e.offsetX < 160 ? this._video.currentTime -= this._settings.doubleClickPrev : this._video.currentTime += this._settings.doubleClickPrev;  // якщо менше половини то від часу відео віднімається значення або навпаки 
    }

/**
 * @description static method get default  settings of videi player
 * @returns {undefined} undefined
 */
    static getDefaultSettings() {
        /**
         * Список настроек
         * - адрес видео
         * - тип плеера "basic", "pro"
         * - controls - true, false
         */
        return {
          videoUrl: '',
          videoPlayerContainer: '.myplayer',
          volume: 1,          // стандартні налаштування
          playbackRate: 1,
          skipNext: 1,
          skipPrev: 1,
          doubleClickPrev: 1,
          doubleClickNext:1
        }
    }
}

const myPlayer = new VideoPlayerBasic({
  videoUrl: 'video/mov_bbb.mp4',
  videoPlayerContainer: 'body',
  skipNext: 2,              
  skipPrev: 1,
  doubleClickNext: 2,
  doubleClickPrev: 2
});

myPlayer.init();