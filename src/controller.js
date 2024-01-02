import validate from './validate.js';
import render from './view.js';

const state = {
  isValid: null,
  links: [],
  submitMessage: '',
  submitState: {
    success: {
      message: 'RSS успешно загружен',
    },
    invalidRss: {
      message: 'Ресурс не содержит валидный RSS',
    },
    duplicate: {
      message: 'RSS уже существует',
    },
    invalidUrl: {
      message: 'Ссылка должна быть валидным URL',
    },
  },
};

const app = async () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    message: document.querySelector('.feedback'),
  };
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const isValidInput = validate(elements.input.value);
    if (!isValidInput) {
      state.isValid = false;
      state.submitMessage = state.submitState.invalidUrl.message;
    }
    if (state.links.includes(elements.input.value)) {
      state.isValid = false;
      state.submitMessage = state.submitState.duplicate.message;
    }
    const response = 'request to server'; // !!!!!!!!
    if (!response) {
      state.isValid = false;
      state.submitMessage = state.submitState.invalidRss.message;
    }
    state.isValid = true;
    state.submitMessage = state.submitState.success.message;
    /* if there's rss - isValid true, submit message = success message
      if no rss - isvalid false, submit message = invalidrss message */
  });
  render(state, elements);
};

export default app;
