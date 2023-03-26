import state from "./state.js";
import variables from "./variables.js";

const {
  roomsType,
} = state;

const {
  rooms,
  settings,
  selectBox,
  settingsTabs,
  selectBoxList,
  settingsPanel,
  temperatureBtn,
  temperatureLine,
  temperatureElem,
  temperatureRound,
} = variables;


// Выпадающий список
selectBox.querySelector('.selectbox__selected').onclick = (event) => {
  selectBox.classList.toggle('open');
};

document.querySelector('body').onclick = (event) => {
  const { target } = event;

  if (!target.matches('.selectbox') &&
    !target.parentElement.matches('.selectbox')) {
    selectBox.classList.remove('open');
  }
};

selectBoxList.onclick = (event) => {
  const { target } = event;

  if (target.matches('.selectbox__item')) {
    const { room } = target.dataset;
    const selectedItem = selectBoxList.querySelector('.selected');

    selectedItem.classList.remove('selected');
    target.classList.add('selected');
    selectBox.classList.remove('open');
    selectRoom(room);
  }
}

// Выбор комнаты
function selectRoom(room) {
  const selectedRoom = rooms.querySelector('.selected');

  if (selectedRoom) {
    selectedRoom.classList.remove('selected');
  }

  if (room !== 'all') {
    const newSelectedRoom = rooms.querySelector(`[data-room=${room}]`);
    newSelectedRoom.classList.add('selected');
    renderScreen(false);
  } else {
    renderScreen(true);
  }

  const selectedSelectboxRoom = selectBox.querySelector('.selectbox__item.selected');
  selectedSelectboxRoom.classList.remove('selected');

  const newSelectedItem = selectBoxList.querySelector(`[data-room=${room}]`);
  newSelectedItem.classList.add('selected');
  const selectboxSelected = selectBox.querySelector('.selectbox__selected span');
  selectboxSelected.innerText = roomsType[room].name;
}

// Клик по элементу комнаты
rooms.querySelectorAll('.room').forEach(room => {
  room.onclick = (e) => {
    const value = room.dataset.room;
    selectRoom(value);
  }
});

// Отоброжение нужного экрана
function renderScreen(isRooms) {
  setTimeout(() => {
    if (isRooms) {
      rooms.style.display = 'grid';
      settings.style.display = 'none';
    } else {
      rooms.style.display = 'none';
      settings.style.display = 'grid';
    }
  }, 400);
}

// Панель настроек комнаты
/*** Регулировка температуры */
function renderTemperature(temperature) {
  const min = 16;
  const max = 40;
  const range = max - min;
  const percent = range / 100; // 0.24
  const lineMin = 54;
  const lineMax = 276;
  const lineRange = lineMax - lineMin;
  const linePercent = lineRange / 100; // 2.22
  const roundMin = -240;
  const roundMax = 48;
  const roundRange = roundMax - roundMin;
  const roundPercent = roundRange / 100; // 2.88




  if (temperature >= min && temperature <= max) {
    const finishPercent = Math.round((temperature - min) / percent);
    const lineFinishPercent = lineMin + linePercent * finishPercent;
    const roundFinishPercent = roundMin + roundPercent * finishPercent;

    temperatureLine.style.strokeDasharray = `${lineFinishPercent} 276`;
    temperatureRound.style.transform = `rotate(${roundFinishPercent}deg)`;
    temperatureElem.innerText = temperature;

  }
}

renderTemperature(21);

// Изменение температуры мышью

function changeTemperature() {
  let mouseover = false;
  let mousedown = false;

  temperatureBtn.onmouseover = () => mouseover = true;
  temperatureBtn.onmouseleave = () => mouseover = false;
  temperatureBtn.onmousedowen = () => mousedown = true;
  temperatureBtn.onmouseup = () => mousedown = false;
}