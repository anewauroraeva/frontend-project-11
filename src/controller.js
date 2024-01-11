import onChange from 'on-change';
import validateURL from './validate.js';
import render from './view.js';

const runApp = async () => {
  const state = {
    isValid: null,
    links: [],
    submitState: 'idle',
    successMessage: 'RSS успешно загружен',
    submitError: '',
    /* submitState: { // надо будет сделать одну ошибку, нижнее всё в перевод
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
    }, */
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type=submit]'),
    feedback: document.querySelector('.feedback'),
  };

  const watchedState = onChange(state, () => { // add decent callback
    if (watchedState.isValid) {
      // after successful submit - rss loaded
      // state.submitState.success - message for feedback p
      // render(watchedState, elements)
      console.log('wState is valid');
      // return;
    }
    if (watchedState.isValid === false) {
      /* feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = watchedState.submitMessage;
      form.reset();
      form.focus(); */
    }
    render(watchedState, elements);
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const result = await validateURL(elements.input.value, state.links);
    // rename result
    // console.log(result); +
    if (!result) {
      watchedState.isValid = true;
      const formData = new FormData(elements.form, elements.submit);
      const url = formData.get('url');
      // console.log(url); +
      watchedState.links.push(url);
    }
    if (result) {
      watchedState.isValid = false;
      watchedState.submitError = result;
    }
    console.log(state);

    render(state, elements);
  });
};

export default runApp;
