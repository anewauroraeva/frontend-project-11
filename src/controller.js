import onChange from 'on-change';
import i18n from 'i18next';
import * as yup from 'yup';
import _ from 'lodash';
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
    .required(i18nInstance.t('feedback.required'))
    .url(i18nInstance.t('feedback.invalidUrl'))
    .notOneOf(addedLinks, i18nInstance.t('feedback.duplicate'))
    .validate(url);
  return schema;
};

// const timeout = 5000;
const getRssData = (link) => {
  const allOrigins = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`;
  return axios.get(allOrigins); // , { timeout });
};
// console.log(getRssData('https://lorem-rss.hexlet.app/feed'));

const normalizeFeed = (feed) => { // works
  const { feedTitle, feedDescription } = feed;
  const fullFeed = {
    id: Number(_.uniqueId()),
    title: feedTitle,
    description: feedDescription,
  };
  return fullFeed;
};
// console.log(normalizeFeed({ feedTitle: 'pipupu', feedDescription: 'pupipu' }));

const normalizePosts = (parcedPosts) => { // works
  const posts = parcedPosts.map((post) => {
    const id = Number(_.uniqueId());
    const { title, description, link } = post;
    return {
      // id: Number(uniqueId()),
      id,
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
console.log(normalizePosts(checkPosts)); */

/* const updateFeeds = () => {
  // setTimeout()
  // change watchedState
}; */

const updatePosts = (state) => {
  const stateCopy = _.cloneDeep(state);
  const { feeds } = stateCopy;
  const currentPosts = stateCopy;
  const feedsPros = feeds.map(({ link }) => {
    getRssData(link)
      .then((resp) => {
        parse(resp.data.contents);
        console.log(parse(resp.data.contents));
      })
      .then((parsedData) => normalizePosts(parsedData.posts))
      .catch((error) => {
        stateCopy.error = error.message;
      }) // to stateCopy.error
      .then((posts) => {
        // const newPosts =
        console.log(posts);

        const currentPostsLinks = currentPosts.map((currPost) => currPost.link);
        const newPostsLinks = newPosts.map((newPost) => newPost.link);

        const reallyNewPosts = newPostsLinks.filter((nPLink) => !currentPostsLinks.includes(nPLink));
        return reallyNewPosts;
      })
      .then((nPosts) => state.posts.unshift(nPosts))
      .catch((e) => {
        stateCopy.error = e.message;
      });
  });
};
const checkState = {
  form: {
    isValid: false,
    formState: 'idle', // 'sending' 'sent' 'failed'
  },
  addedLinks: [],
  feeds: [],
  posts: [],
  error: '',
  ui: {
    submitDisabled: false,
  },
};
console.log(updatePosts(checkState));
/* const updatePosts = (state) => {
  const stateCopy = _.cloneDeep(state); // or { ...state }???
  const { feeds } = stateCopy;
  const currentPosts = stateCopy.posts;
  const newPosts = '';
  // get feeds posts links
  const getCurrentPostsLinks = currentPosts.map(({ link }) => {
    console.log(link);
  });

  const trackNewPosts = (links) => {
    links.forEach((link) => {
      getRssData(link)
        .then((response) => parse(response.data.contents))
        .then((parsedData) => console.log(parsedData));
    });
  };
}; */

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('button[type=submit]'),
    feedback: document.querySelector('.feedback'),
  };
  const { form } = elements;

  const i18nInstance = i18n.createInstance();
  i18nInstance.init({
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
    error: '',
    ui: {
      submitDisabled: false,
    },
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
    render(state, elements, i18nInstance);
  });

  // console.log(watchedState);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log(updatePosts(watchedState));
    watchedState.error = '';
    watchedState.form.formState = 'sending';
    watchedState.ui.submitDisabled = true;
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validateURL(url, watchedState.addedLinks, i18nInstance)
      .then((validUrl) => getRssData(validUrl))
      .then((response) => parse(response.data.contents))
      .then((parsedData) => {
        console.log(parsedData);
        const feed = normalizeFeed(parsedData.feed);
        watchedState.feeds.unshift(feed);
        const posts = normalizePosts(parsedData.posts);
        const allPosts = watchedState.posts.concat(posts);
        watchedState.posts = allPosts;
        console.log(watchedState.posts);
      })
      .then(() => {
        watchedState.form.isValid = true; // watchedState changes
        watchedState.addedLinks.push(url); // watchedState changes
        watchedState.ui.submitDisabled = false;
        watchedState.form.formState = 'sent'; // watchedState changes
        // console.log(watchedState.form.formState);
        /* watchedState.form.formState = 'idle';
        watchedState.form.isValid = false; */
        // console.log('success');
        // console.log(watchedState);
      })
      .catch((error) => {
        const { message } = error;
        // watchedState.form.isValid = false;
        watchedState.form.formState = 'failed';
        watchedState.ui.submitDisabled = false;
        // console.log(watchedState.form.error);
        // console.log(message);
        switch (message) {
          case 'Network Error':
            watchedState.error = i18nInstance.t('feedback.networkError');
            break;
          case 'invalidRss':
            watchedState.error = i18nInstance.t('feedback.invalidRss');
            break;
          default:
            watchedState.error = error.message;
            break;
        }
        /* if (message === 'Network Error') {
          watchedState.error = i18nInstance.t('feedback.networkError'); // watchedState changes
        } else if (message === 'invalidRss') {
          watchedState.error = i18nInstance.t('feedback.invalidRss'); // watchedState changes
        } else {
          watchedState.error = error.message; // watchedState changes
        } */
        watchedState.form.isValid = false; // watchedState changes
        watchedState.ui.submitDisabled = false;
      });
    /* watchedState.form.formState = 'idle';
    watchedState.form.isValid = false;
    console.log(watchedState.form.formState); */
    console.log(watchedState);
    watchedState.form.formState = 'idle';
  });
  // watchedState.form.formState = 'idle';
  // watchedState.form.isValid = false;
  // console.log(watchedState);
};

export default app;
