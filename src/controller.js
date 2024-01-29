import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import { uniqueId } from 'lodash';
import axios from 'axios';
import parse from './parser.js';
import render from './view.js';
import ru from './locales/index.js';

const validateURL = (url, addedLinks, i18nInstance) => {
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
    .notOneOf(addedLinks, i18nInstance.t('feedback.duplicate'))
    .validate(url);
  /* try {
    return schema.validate(url);
  } catch (error) {
    console.log(error);
    return error.message;
  } */
  return schema;
};

const getRssData = (link) => {
  const allOrigins = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`;
  return axios.get(allOrigins); // , { timeout: 10000 });
};
// console.log(getRssData('https://lorem-rss.hexlet.app/feed'));

const normalizeFeed = (feed) => { // works
  const { feedTitle, feedDescription } = feed;
  const fullFeed = {
    id: Number(uniqueId()),
    title: feedTitle,
    description: feedDescription,
  };
  return fullFeed;
};
// console.log(assembleFeed({ feedTitle: 'pipupu', feedDescription: 'pupipu' }));

const normalizePosts = (parcedPosts) => { // works
  const posts = parcedPosts.map((post) => {
    // const id = Number(uniqueId());
    const { title, description, link } = post;
    return {
      id: Number(uniqueId()),
      title,
      description,
      link,
    };
  });
  return posts;
};
/* const checkPosts = [
  { title: 'lorum', description: 'ipsum', link: 'http://example.com/test/1706110440' },
  { title: 'hahaha', description: 'hihihi', link: 'http://example.com/test/1706110440' },
];
console.log(assemblePosts(checkPosts)); */

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
      isValid: false,
      formState: 'idle', // 'sending' 'sent' 'failed'
    },
    addedLinks: [],
    feeds: [],
    posts: [],
    ui: {
      inputDisabled: false,
      submitDisabled: false,
      seenPosts: [],
    },
    error: '',
    feedback: {
      success: i18nInstance.t('feedback.success'), // https://lorem-rss.hexlet.app/feed
      invalidRss: i18nInstance.t('feedback.invalidRss'), // https://news.yandex.ru/daily.rss
      invalidUrl: i18nInstance.t('feedback.invalidUrl'), // 123
      duplicate: i18nInstance.t('feedback.duplicate'), // https://lorem-rss.hexlet.app/feed
      networkError: i18nInstance.t('feedback.networkError'), // offline
    },
  };

  // const watchedState = onChange(state, render(elements, watchedState));
  const watchedState = onChange(state, () => {
    render(watchedState, elements);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(watchedState.form.formState);
    watchedState.form.formState = 'sending';
    console.log(watchedState.form.formState);
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validateURL(url, watchedState.addedLinks, i18nInstance)
      .then((validUrl) => getRssData(validUrl))
      .then((response) => parse(response.data.contents))
      .then((parsedData) => {
        console.log('parsed');
        const feed = normalizeFeed(parsedData.feed);
        watchedState.feeds.unshift(feed);
        const posts = normalizePosts(parsedData.posts);
        watchedState.posts.push(posts);
      })
      .then(() => {
        watchedState.form.formState = 'sent';
        console.log(watchedState.form.formState);
        watchedState.form.isValid = true;
        watchedState.addedLinks.push({ id: uniqueId(), url });
        /* watchedState.form.formState = 'idle';
        watchedState.form.isValid = false; */
        console.log(watchedState.form.formState);
      })
      .catch((error) => {
        const { message } = error;
        // watchedState.form.isValid = false;
        // watchedState.form.formState = 'failed';
        // console.log(watchedState.form.error);
        console.log(message);
        if (message === 'Network Error') {
          watchedState.error = i18nInstance.t('feedback.networkError');
        } else if (message === 'invalidRss') {
          watchedState.error = i18nInstance.t('feedback.invalidRss');
        } else {
          watchedState.error = error.message;
        }
        // console.log(watchedState.form.formState);
        watchedState.form.isValid = false;
        // console.log(watchedState.form.formState);
      });
    /* watchedState.form.formState = 'idle';
    watchedState.form.isValid = false;
    console.log(watchedState.form.formState); */
    // console.log(watchedState);
  });
  // watchedState.form.formState = 'idle';
  // watchedState.form.isValid = false;
  console.log(watchedState);
};

export default app;
