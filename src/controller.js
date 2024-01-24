import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import { uniqueId } from 'lodash';
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
    console.log(error);
    return error.message;
  }
};

const getRssData = (link) => {
  const allOrigins = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`;
  return axios.get(allOrigins, { timeout: 10000 });
};
// console.log(getRssData('https://lorem-rss.hexlet.app/feed'));

const assembleFeed = (feed) => { // works
  const { feedTitle, feedDescription } = feed;
  const fullFeed = {
    id: Number(uniqueId()),
    title: feedTitle,
    description: feedDescription,
  };
  return fullFeed;
};
// console.log(assembleFeed({ feedTitle: 'pipupu', feedDescription: 'pupipu' }));

const assemblePosts = (parcedPosts) => { // works
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
      formState: 'idle', // 'sending' 'invalidUrl' 'duplicate' 'sent' 'failed'
    },
    addedLinks: [],
    feeds: [],
    posts: [],
    loadingProcess: {
      loadState: 'idle', // loading, success, invalidRss, networkError
    },
    ui: {
      inputDisabled: false,
      submitDisabled: false,
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
    watchedState.form.formState = 'sending';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validateURL(url, watchedState.addedLinks, i18nInstance)
      .then((link) => {
        const addedLink = { id: Number(uniqueId()), link };
        watchedState.addedLinks.push(addedLink);
        return getRssData(link);
      }) /* {
        watchedState.loadingProcess.loadState = 'loading';
        watchedState.addedLinks.push(url);
        getRssData(link);
      }) */
      .then((response) => {
        // console.log(response);
        // watchedState.addedLinks.push(url);
        const data = response.data.contents;
        console.log(parse(data));
        return parse(data);
      })
      .then(({ feed, posts }) => {
        // feed.id = 'id from link';
        const newFeed = assembleFeed(feed);
        watchedState.feeds.push(newFeed);
        // posts.id = 'id from link';
        const newPosts = assemblePosts(posts);
        console.log(newPosts);
        watchedState.posts.push(newPosts);
        console.log(watchedState);
        watchedState.loadingProcess.loadState = 'success';
      })
      .catch(() => {
        watchedState.loadingProcess.loadState = 'invalidRss';
        console.log(watchedState);
        return watchedState.feedback.networkError;
      });
    // watchedState.addedLinks.push({ id: uniqueId(), url });
    console.log(watchedState.addedLinks);
  });
};

export default app;
