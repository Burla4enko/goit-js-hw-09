import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  startBtn: document.querySelector('[data-start]'),
};

let featureTime = null;
let timeLeft = null;
let timerId = null;
refs.startBtn.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= Date.now()) {
      Notify.failure('Please choose a date in the future');
      return;
    }
    featureTime = selectedDates[0].getTime();
    refs.startBtn.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  return { days, hours, minutes, seconds };
}

function renderTime({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function startTimer() {
  refs.startBtn.removeEventListener('click', startTimer);
  refs.startBtn.textContent = 'Stop';
  refs.startBtn.style.backgroundColor = 'tomato';
  refs.startBtn.addEventListener('click', stopTimer);
  refs.startBtn.disabled = false;
  getTime();
  timerId = setInterval(getTime, 1000);
}

function getTime() {
  timeLeft = featureTime - Date.now();
  renderTime(convertMs(timeLeft));

  if (timeLeft < 1000) {
    stopTimer();
  }
}

function stopTimer() {
  refs.startBtn.removeEventListener('click', stopTimer);
  refs.startBtn.textContent = 'Start';
  refs.startBtn.style.backgroundColor = 'transparent';
  refs.startBtn.addEventListener('click', startTimer);
  refs.startBtn.disabled = true;
  clearInterval(timerId);
  resetTimer();
}

function resetTimer() {
  refs.days.textContent = '00';
  refs.hours.textContent = '00';
  refs.minutes.textContent = '00';
  refs.seconds.textContent = '00';
}

refs.startBtn.addEventListener('click', startTimer);
