import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
// import _ from 'lodash';
// import parcer from './parcer.js';
import render from './view.js';
import ru from './locales/index.js';

const validateURL = async (url, addedLinks, i18nInstance) => {
  yup.setLocale({
    mixed: {
      notOneOf: i18nInstance.t('feedback.duplicate'),
    },
    string: {
      url: i18nInstance.t('feedback.invalidUrl'),
    },
  });

  const schema = yup.string()
    .trim()
    .required()
    .url(i18nInstance.t('feedback.invalidUrl'))
    .notOneOf(addedLinks, i18nInstance.t('feedback.duplicate'));
  try {
    return schema.validate(url);
  } catch (error) {
    return error.message;
  }
};

const app = async () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type=submit]'),
    feedback: document.querySelector('.feedback'),
  };
  const { form } = elements; // , input, submit

  const i18nInstance = i18n.createInstance();
  await i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: { ru },
  });

  const state = {
    form: {
      isValid: null,
      formState: 'idle', // 'sending' 'sent' 'failed'
    },
    addedLinks: [],
    errorMessage: '',
    feedback: {
      success: i18nInstance.t('feedback.success'),
      invalidRss: i18nInstance.t('feedback.invalidRss'),
      invalidUrl: i18nInstance.t('feedback.invalidUrl'),
      duplicate: i18nInstance.t('feedback.duplicate'),
      networkError: i18nInstance.t('feedback.networkError'),
    },
  };
  console.log(state); // +

  const watchedState = onChange(state, () => {
    render(watchedState, elements);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.formState = 'sending';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    console.log(url);
    validateURL(url, watchedState.addedLinks, i18nInstance)
      .then((data) => {
        console.log('valid');
        watchedState.form.isValid = true;
        watchedState.errorMessage = '';
        // const validUrl = { id: _.uniqueId(), url };
        watchedState.addedLinks.push(data);
      })
      .catch((err) => {
        console.log('invalid');
        watchedState.form.isValid = false;
        console.log(err.message);
        watchedState.errorMessage = err.message;
      });
    watchedState.form.isValid = null;
    console.log(watchedState);
  });

  // сюда аксиос с гет (юрл)
  console.log(watchedState);
};

export default app;
