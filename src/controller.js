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

const getRssData = (link) => {
  const allOrigins = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`;
  return axios.get(allOrigins);
};

const normalizeFeed = (feed) => {
  const { feedTitle, feedDescription, link } = feed;
  // console.log(link);
  const fullFeed = {
    id: Number(_.uniqueId()),
    title: feedTitle,
    description: feedDescription,
    link,
  };
  console.log(fullFeed);
  return fullFeed;
};

const normalizePosts = (parcedPosts) => {
  const posts = parcedPosts.map((post) => {
    const id = Number(_.uniqueId());
    const { title, description, link } = post;
    return {
      id,
      title,
      description,
      link,
    };
  });
  return posts;
};

const defTimeout = 5000;

const updatePosts = (state) => {
  const stateCopy = _.cloneDeep(state);
  // console.log(stateCopy);
  const { feeds } = stateCopy;
  // console.log(feeds);
  // console.log('currPosts', currentPosts); // undefined or []
  // console.log('dostali aktualnye posty');
  /* const addNewPosts =  */
  const parsedFeedsPromise = feeds.map(({ link }) => getRssData(link)
    .then((response) => parse(response.data.contents)) // OK
    .then((parsedData) => normalizePosts(parsedData.posts)) // { // OK
    /* console.log(parsedData.posts); // OK
      normalizePosts(parsedData.posts);
      console.log(normalizePosts(parsedData.posts)); // OK
    }) */
    .then((normPosts) => {
      /* const currentPosts = stateCopy.posts;
      const currentPostsLinks = currentPosts.map((cPost) => cPost.link);
      const filtered = normPosts.filter((nPost) => {
        // const normLink = nPost.link;
        const result = !currentPostsLinks.includes(nPost.link);
        return result;
      });
      state.posts.unshift(filtered); */
      const currentPosts = stateCopy.posts;
      // console.log(stateCopy.posts);
      // console.log(normPosts); // OK
      // const { title, description, link } = normPost;
      // const newPostsLinks = normPosts.map((nPost) => nPost.link);
      // console.log(newPostsLinks); // OK new added
      // console.log(stateCopy.posts); // new posts are adding but it's [] or undefined
      const currPostsLinks = currentPosts.map((currPost) => currPost.link);
      // console.log('curr', currPostsLinks); // shows all li's but new are empty arrays
      const filteredNewPosts = normPosts.filter((nPost) => !currPostsLinks.includes(nPost.link));
      // console.log(filteredNewPosts);
      // state.posts.unshift(filteredNewPosts);
      filteredNewPosts.forEach((fPost) => {
        state.posts.unshift(fPost);
      });
    })
    .catch((error) => {
      stateCopy.error = error;
    })
    .finally(() => {
      setTimeout(() => {
        updatePosts(state);
      }, defTimeout);
    }));
  const promise = Promise.all(parsedFeedsPromise);

  return promise;
  // console.log(parsedFeedsPromise); // undefined
  /* Promise.all([parsedFeedsPromise])
    .then((normPosts) => {
      console.log(parsedFeedsPromise);
      console.log(normPosts); // undefined
      const newPostsLinks = normPosts.map((nPost) => nPost.link);
      console.log(newPostsLinks); // undefined
      // console.log(stateCopy.posts); // new posts are adding but it's [] or undefined
      const currPostsLinks = currentPosts.map((currPost) => currPost.link);
      const filteredNewPosts = newPostsLinks.filter((nPost) => !currPostsLinks.includes(nPost));
      state.posts.unshift(filteredNewPosts);
    })
    .catch((error) => {
      stateCopy.error = error.message;
    })
    .finally(() => {
      setTimeout(() => {
        updatePosts(state);
      }, defTimeout);
    }); */
};

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
      formState: 'idle',
    },
    addedLinks: [],
    feeds: [],
    posts: [],
    error: '',
    ui: {
      submitDisabled: false,
    },
    feedback: {
      success: i18nInstance.t('feedback.success'),
      invalidRss: i18nInstance.t('feedback.invalidRss'),
      invalidUrl: i18nInstance.t('feedback.invalidUrl'),
      duplicate: i18nInstance.t('feedback.duplicate'),
      networkError: i18nInstance.t('feedback.networkError'),
    },
  };

  const watchedState = onChange(state, () => {
    render(state, elements, i18nInstance);
  });

  // console.log(watchedState);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // updatePosts(watchedState, 5000);
    watchedState.error = '';
    watchedState.form.formState = 'sending';
    watchedState.ui.submitDisabled = true;
    const formData = new FormData(e.target);
    const url = formData.get('url');
    validateURL(url, watchedState.addedLinks, i18nInstance)
      .then((validUrl) => getRssData(validUrl))
      .then((response) => parse(response.data.contents))
      .then((parsedData) => {
        const { feed } = parsedData;
        feed.link = url;
        const normFeed = normalizeFeed(feed);
        // feed.link = url;
        // console.log(feed.link);
        watchedState.feeds.unshift(normFeed);
        const posts = normalizePosts(parsedData.posts);
        const allPosts = watchedState.posts.concat(posts);
        watchedState.posts = allPosts;
      })
      .then(() => {
        watchedState.form.isValid = true;
        watchedState.addedLinks.push(url);
        watchedState.ui.submitDisabled = false;
        watchedState.form.formState = 'sent';
        updatePosts(watchedState);
      })
      .catch((error) => {
        const { message } = error;
        watchedState.form.formState = 'failed';
        watchedState.ui.submitDisabled = false;
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
        watchedState.form.isValid = false;
        watchedState.ui.submitDisabled = false;
      });
    watchedState.form.formState = 'idle';
  });
  console.log(watchedState);
  // updatePosts(watchedState, 5000);
};

export default app;
