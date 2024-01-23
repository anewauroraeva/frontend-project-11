import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
// import { uniqueId } from 'lodash';
import axios from 'axios';
import parse from './parser.js';
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

const getRssData = (link) => {
  const allOrigins = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`;
  return axios.get(allOrigins, { timeout: 10000 });
};
// console.log(getRssData('https://lorem-rss.hexlet.app/feed'));

const app = async () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type=submit]'),
    feedback: document.querySelector('.feedback'),
  };
  const { form } = elements;

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
    feeds: [],
    posts: [],
    loadingProcess: {
      loadState: 'idle',
    },
    ui: {
      seenPosts: [],
    },
    error: '',
    feedback: {
      success: i18nInstance.t('feedback.success'),
      invalidRss: i18nInstance.t('feedback.invalidRss'),
      invalidUrl: i18nInstance.t('feedback.invalidUrl'),
      duplicate: i18nInstance.t('feedback.duplicate'),
      networkError: i18nInstance.t('feedback.networkError'),
    },
  };

  const watchedState = onChange(state, () => {
    render(watchedState, elements);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    watchedState.formState = 'sending';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validateURL(url, watchedState.addedLinks, i18nInstance)
      .then((link) => getRssData(link))
      .then((response) => {
        console.log(response);
        const data = response.data.contents;
        return parse(data);
      });
    // watchedState.addedLinks.push({ id: uniqueId(), link });
    // .then(({ feed, posts }) => {});
  });
};

export default app;
