import validateURL from './validate.js';
import render from './view.js';

const runApp = async () => {
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

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type=submit]'),
    feedback: document.querySelector('.feedback'),
  };
  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(elements.input.value);
    const formData = new FormData(elements.form, elements.submit);
    formData.append('url', elements.input.value);
    // const url = formData.get('url');
    console.log(formData);
    /* const isValidInput = await validateURL(elements.input.value, state.links);
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
    state.submitMessage = state.submitState.success.message; */
  });
  render(state, elements);
};

export default runApp;
