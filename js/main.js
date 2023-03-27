import state from "./state.js";
import variables from "./variables.js";

const {
  roomsData,
} = state;

const {
  rooms,
  slider,
  powerBtn,
  settings,
  selectBox,
  settingsTabs,
  selectBoxList,
  settingsPanels,
  temperatureBtn,
  temperatureLine,
  temperatureElem,
  temperatureRound,
  temperatureSaveBtn,
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
};

// Выбор комнаты
function selectRoom(room) {
  const selectedRoom = rooms.querySelector('.selected');

  if (selectedRoom) {
    selectedRoom.classList.remove('selected');
  }

  if (room !== 'all') {
    const newSelectedRoom = rooms.querySelector(`[data-room=${room}]`);
    const {
      lights,
      humidity,
      temperature,
    } = roomsData[room];

    roomsData.activeRoom = room;
    newSelectedRoom.classList.add('selected');
    renderScreen(false);
    temperatureElem.innerText = temperature;
    renderTemperature(temperature);
    setTemperaturePower();
    changeSettingsType(roomsData.activeTab);
    changeSlider(humidity, slider.humidity)
    changeSlider(lights, slider.lights)
  } else {
    renderScreen(true);
  }

  const selectedSelectboxRoom = selectBox.querySelector('.selectbox__item.selected');
  selectedSelectboxRoom.classList.remove('selected');

  const newSelectedItem = selectBoxList.querySelector(`[data-room=${room}]`);
  newSelectedItem.classList.add('selected');
  const selectboxSelected = selectBox.querySelector('.selectbox__selected span');
  selectboxSelected.innerText = roomsData[room].name;
}

// Клик по элементу комнаты
rooms.querySelectorAll('.room').forEach(room => {
  room.onclick = (e) => {
    const value = room.dataset.room;
    selectRoom(value);
  };
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

// Изменение температуры мышью
function changeTemperature() {
  let mouseover = false;
  let mousedown = false;
  let position = 0;
  let range = 0;
  let change = 0;

  temperatureBtn.onmouseover = () => mouseover = true;
  temperatureBtn.onmouseout = () => mouseover = false;
  temperatureBtn.onmouseup = () => mousedown = false;
  temperatureBtn.onmousedown = (e) => {
    mousedown = true;
    position = e.offsetY;
    range = 0;
  };
  temperatureBtn.onmousemove = (e) => {

    if (mouseover && mousedown) {
      range = e.offsetY - position;
      const newChange = Math.round(range / -10);

      if (newChange !== change) {
        let temper = +temperatureElem.innerText;

        if (newChange < change) {
          temper = temper - 1;
        } else {
          temper = temper + 1;
        }

        change = newChange;
        roomsData[roomsData.activeRoom].temperature = temper;
        renderTemperature(temper);
      }
    }

  };
}

changeTemperature();

// Сохронение температуры
temperatureSaveBtn.onclick = () => {
  const temper = +temperatureElem.innerText;
  roomsData[roomsData.activeRoom].temperature = temper;
  alert(`Температура установлена на ${temper} oC`);
}

// Отключение температуры
powerBtn.onclick = () => {
  powerBtn.classList.toggle('off');

  if (powerBtn.matches('.off')) {
    roomsData[roomsData.activeRoom].temperatureOff = true;
  } else {
    roomsData[roomsData.activeRoom].temperatureOff = false;
  }
}

// Установка значения кнопки включения температуры
function setTemperaturePower() {

  if (roomsData[roomsData.activeRoom].temperatureOff) {
    powerBtn.classList.add('off');
  } else {
    powerBtn.classList.remove('off');
  }
}

// Переключение настроек
settingsTabs.querySelectorAll('.option').forEach(tab => {
  tab.onclick = () => {
    const optionType = tab.dataset.type;

    roomsData.activeTab = optionType;
    changeSettingsType(optionType)
  };
});

// Смена панели настроек 
function changeSettingsType(type) {
  const selectedTab = settingsTabs.querySelector('.selected');
  const tab = settingsTabs.querySelector(`[data-type=${type}]`);
  const selectedPanel = settingsPanels.querySelector('.selected');
  const panel = settingsPanels.querySelector(`[data-type=${type}]`);

  selectedTab.classList.remove('selected');
  selectedPanel.classList.remove('selected');
  tab.classList.add('selected');
  panel.classList.add('selected');
}

// Функция изменения слайдера
function changeSlider(percent, slider) {

  if (percent >= 0 && percent <= 100) {
    const { type } = slider.parentElement.parentElement.dataset;

    slider.querySelector('span').innerText = percent;
    slider.style.height = `${percent}%`;
    roomsData[roomsData.activeRoom][type] = percent;
  }
}

// Отслеживание измения слайдера
function watchSlider(slider) {
  let mouseover = false;
  let mousedown = false;
  let position = 0;
  let range = 0;
  let change = 0;
  const parent = slider.parentElement;

  parent.onmouseover = () => {
    mouseover = true;
    mousedown = false;
  }
  parent.onmouseout = () => mouseover = false;
  parent.onmouseup = () => mousedown = false;
  parent.onmousedown = (e) => {
    mousedown = true;
    position = e.offsetY;
    range = 0;
  };
  parent.onmousemove = (e) => {

    if (mouseover && mousedown) {
      range = e.offsetY - position;
      const newChange = Math.round(range / -1);

      if (newChange !== change) {
        let percent = +slider.querySelector('span').innerText;

        if (newChange < change) {
          percent = percent - 1;
        } else {
          percent = percent + 1;
        }

        change = newChange;
        changeSlider(percent, slider)
      }
    }

  };
}

watchSlider(slider.lights)
watchSlider(slider.humidity)