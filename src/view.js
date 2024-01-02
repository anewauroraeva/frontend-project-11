import onChange from 'on-change';
import validate from './validate.js';

console.log(validate('https://lorem-rss.hexlet.app/feed'));

const render = (state, elements) => {
  const watchedState = onChange(state, () => {
    const { form, message } = elements;
    if (watchedState.isValid) {
      message.classList.remove('text-danger');
      message.classList.add('text-success');
      message.textContent = watchedState.submitMessage;
      form.reset();
      form.focus();
    }
  });
};

export default render;

console.log(document.querySelectorAll('.col-md-10'));
