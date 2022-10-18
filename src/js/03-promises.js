import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.form'),
};

const inputsValue = {};
let position = 1;

refs.form.addEventListener('input', addInputsValue);
refs.form.addEventListener('submit', onSubmit);

function addInputsValue(evt) {
  inputsValue[evt.target.name] = +evt.target.value;
  // console.log(inputsValue);
}

function onSubmit(evt) {
  evt.preventDefault();

  const { delay, step, amount } = inputsValue;

  addPromise(delay, step, amount);
}

function addPromise(delay, step, amount) {
  if (position <= amount) {
    createPromise(position, delay).then().catch();
  } else {
    refs.form.reset();
    position = 1;
    return;
  }

  position += 1;
  delay += step;
  addPromise(delay, step, amount);
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(
          Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`)
        );
      } else {
        reject(Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`));
      }
    }, delay);
  });
}
