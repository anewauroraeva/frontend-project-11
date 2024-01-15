import onChange from 'on-change';
import i18n from 'i18next';
import validateURL from './validate.js';
import render from './view.js';
import ru from './locales/index.js';
import yup from 'yup';

const app = async () => {
  const state = {
    isValid: null,
    links: [],
    defaultLanguage: 'ru',
    submitState: 'idle',
    submitError: '',
    feedback: {
      success: i18n.t('feedback.example'),
      invalidRss: i18n.t('example'),
      invalidUrl: '',
      duplicate: '',
    },
  };

  console.log(state.feedback.invalidRss);

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type=submit]'),
    feedback: document.querySelector('.feedback'),
  };

  const { defaultLanguage } = state.defaultLanguage;
  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    defaultLanguage,
    debug: false,
    resources: { ru },
  })
    .then(() => {
      yup.setLocale({
        mixed: {
          notOneOf: i18nInstance.t('links'),
        },
        string: {
          url: i18nInstance.t('feedback.invalidUrl'),
        },
      }),
    });

  const watchedState = onChange(state, render(watchedState, i18nInstance, elements));

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

    // render(state, elements);
  });

  // render(watchedState, i18nInstance, elements);
};

export default app; // or app???
