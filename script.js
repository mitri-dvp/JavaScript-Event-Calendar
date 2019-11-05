// Elements
const calendar = document.querySelector('.calendar');
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];
const btns = document.querySelectorAll('.title span');
const year = document.querySelector('.title p');
// Initialize events object
let currentYear = new Date().getFullYear();
let events;
function updateEventsList() {
  year.innerHTML = currentYear;
  if (localStorage.getItem(`${currentYear}events`)) {
    events = JSON.parse(localStorage.getItem(`${currentYear}events`));
  } else {
    events = {
      [currentYear]: {
        January: {},
        February: {},
        March: {},
        April: {},
        May: {},
        June: {},
        July: {},
        August: {},
        September: {},
        October: {},
        November: {},
        December: {}
      }
    };
  }
}
let day;
let month;
let color = '#ff3419';

// Listeners
window.addEventListener('load', displayMonths);
btns.forEach(btn => btn.addEventListener('click', changeYear));
document.body.addEventListener('click', e => {
  if (!e.target.className.match('number active') && !e.target.className.match('btn')) {
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(n => n.classList.remove('active'));
  }
});

// Functions //
// Make calendar
function displayMonths() {
  calendar.innerHTML = '';
  months.forEach((month, i) => {
    calendar.innerHTML += `
    <div class="month">
      <h1>${month}</h1>
      <ul class="days">
        <li class="day">sun</li>
        <li class="day">mon</li>
        <li class="day">tue</li>
        <li class="day">wed</li>
        <li class="day">thu</li>
        <li class="day">fri</li>
        <li class="day">sat</li>
      </ul>
    </div>
    `;
    const days = document.querySelectorAll('.days');
    let day = 1;
    let date = 0;
    while (new Date(`${month} ${day} ${currentYear}`).getDay() > date) {
      const li = document.createElement('li');
      li.innerHTML = '';
      days[i].appendChild(li);
      date++;
    }
    while (new Date(`${month} ${day} ${currentYear}`).getMonth() === new Date(`${month} 1 ${currentYear}`).getMonth()) {
      const li = document.createElement('li');
      if (
        new Date(`${month} ${day} ${currentYear}`).getMonth() === new Date().getMonth() &&
        new Date(`${month} ${day} ${currentYear}`).getDate() === new Date().getDate() &&
        new Date(`${month} ${day} ${currentYear}`).getFullYear() === new Date().getFullYear()
      ) {
        li.classList.add('today');
      }
      li.classList.add('number');
      li.innerHTML = day;
      days[i].appendChild(li);
      day++;
    }
  });
  const numbers = document.querySelectorAll('.number');
  numbers.forEach(n => n.addEventListener('click', () => selectDay(event, numbers)));
  updateEventsList();
  displayColoredEvents();
}

// Check for Events
function selectDay(e, numbers) {
  numbers.forEach(n => n.classList.remove('active'));
  e.target.classList.add('active');
  hasEvent(e.target);
}

let lastOne = document.createElement('div');
function hasEvent(number) {
  day = number.innerHTML;
  month = number.parentElement.parentElement.querySelector('h1').innerHTML;
  displayEvent();
}

function addModal() {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  modal.innerHTML = `
    <form>
      <h2>Add Event</h2>
      <input class="name" type="text" placeholder="Event name..." required>
      <div class="hour">
        <input type="number" min="1" max="12" required>
        <span>:</span>
        <input type="number" min="0" max="59" required>
        <select>
          <option value="am">am</option>
          <option value="pm">pm</option>
        </select>
      </div>
      <div class="label-colors">
        <div data-color="#ff3419"></div>
        <div data-color="#ff9f1a"></div>
        <div data-color="#fff200"></div>
        <div data-color="#32ff7e"></div>
        <div data-color="#18dcff"></div>
        <div data-color="#c56cf0"></div>
      </div>
      <input class="submit" type="submit" value="Add">
    </form>
`;
  document.body.appendChild(modal);
  modal.addEventListener('click', e => {
    if (e.target.className === 'modal') {
      modal.remove();
    }
  });
  modal.querySelector('form')[0].focus();
  modal.querySelector('form').addEventListener('submit', addEvent);
  modal.querySelectorAll('.label-colors div').forEach(color => color.addEventListener('click', selectColor));
}

function addEvent(e) {
  e.preventDefault();
  const form = document.querySelector('form');
  const name = form[0].value;
  const hour = form[1].value;
  const mins = form[2].value;
  let min;
  if (mins < 10 && mins.length < 2) {
    min = `0${mins}`;
  } else if (mins.length > 2) {
    min = '00';
  } else {
    min = mins;
  }
  const meridiem = form[3].value;
  const id = new Date()
    .getTime()
    .toString()
    .substring(0, 11);
  if (!events[currentYear][month][day]) {
    events[currentYear][month][day] = [];
    events[currentYear][month][day].push({
      name,
      time: `${hour}:${min}${meridiem}`,
      color,
      id
    });
    localStorage.setItem(`${currentYear}events`, JSON.stringify(events));
  } else {
    events[currentYear][month][day].push({
      name,
      time: `${hour}:${min}${meridiem}`,
      color,
      id
    });
    localStorage.setItem(`${currentYear}events`, JSON.stringify(events));
  }
  form.parentElement.remove();
  displayEvent();
  setEventColor();
  displayColoredEvents();
}
// DELETE EVENT
function deleteEvent(e) {
  if (e.target.className === 'delete') {
    const { id } = e.target.parentElement.dataset;
    const test = events[currentYear][month][day].filter(ev => ev.id != id);
    events[currentYear][month][day] = test;
    localStorage.setItem(`${currentYear}events`, JSON.stringify(events));
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => {
      if (number.className.match('active')) {
        if (events[currentYear][month][+number.innerHTML].length == 0) {
          number.style.borderColor = 'transparent';
        }
      }
    });
    displayEvent();
  }
}

function selectColor(e) {
  const label = document.querySelector('.label-colors');
  color = e.target.dataset.color;
  label.style.backgroundColor = color;
}

function setEventColor(e) {
  const numbers = document.querySelectorAll('.number');
  numbers.forEach(number => {
    if (number.className.match('active')) {
      number.style.borderColor = `${color}`;
    }
  });
}

function changeYear(e) {
  if (e.target.innerHTML === '◂' && currentYear > 1975) {
    currentYear--;
    displayMonths();
    displayColoredEvents();
  } else {
    currentYear++;
    displayMonths();
    displayColoredEvents();
  }
}
// DISPLAY EVENTS
function displayEvent() {
  if (events[currentYear][month][day] == null || events[currentYear][month][day].length == 0) {
    const ui = document.createElement('div');
    ui.classList.add('ui');
    lastOne.remove();
    ui.innerHTML = `<h2>No events</h2>`;
    ui.innerHTML += `<button class="btn">+</button>`;
    lastOne = ui;
    document.body.appendChild(ui);
    document.querySelector('.btn').addEventListener('click', addModal);
  } else {
    const ui = document.createElement('div');
    ui.classList.add('ui');
    lastOne.remove();
    const dayEvents = events[currentYear][month][day];
    dayEvents.forEach(e => {
      ui.innerHTML += `
      <ul>
        <li style="border-color: ${e.color};" data-id="${e.id}">
        <p>${e.name}</p>
        <span>${e.time}</span>
        <button class="delete">X</button></li>
      </ul>
      `;
    });
    ui.innerHTML += `<button class="btn">+</button>`;
    lastOne = ui;
    document.body.appendChild(ui);
    document.querySelector('.btn').addEventListener('click', addModal);
    ui.addEventListener('click', deleteEvent);
  }
}

function displayColoredEvents() {
  const numbers = document.querySelectorAll('.number');
  numbers.forEach(number => {
    const eventMonth = number.parentElement.parentElement.querySelector('h1').innerHTML;
    const eventDay = number.innerHTML;
    if (events[currentYear][eventMonth][+eventDay]) {
      if (events[currentYear][eventMonth][+eventDay][0]) {
        number.style.borderColor = `${events[currentYear][eventMonth][+eventDay][0].color}`;
      }
    }
  });
}
