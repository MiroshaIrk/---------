export default {
  rooms: document.getElementById('rooms'),
  selectBox: document.querySelector('.selectbox'),
  selectBoxList: document.querySelector('.selectbox__list'),
  settings: document.getElementById('settings'),
  settingsTabs: document.getElementById('settingsTabs'),
  settingsPanels: document.getElementById('settingsPanel'),
  temperatureLine: document.querySelector('.temperature-line'),
  temperatureRound: document.querySelector('.temperature-round'),
  temperatureElem: document.querySelector('.temperature-button__info span'),
  temperatureBtn: document.querySelector('.temperature-button'),
  temperatureSaveBtn: document.querySelector('.set-btn'),
  powerBtn: document.querySelector('.power'),
  slider: {
    lights: document.getElementById('lightsSlider'),
    humidity: document.getElementById('humiditySlider'),

  },
  switchers: {
    lights: document.getElementById('lights-off'),
    humidity: document.getElementById('humidity-off'),
  },
};