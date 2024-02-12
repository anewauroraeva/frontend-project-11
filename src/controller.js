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

const updatePosts = (state/* , timeout */) => {
  const stateCopy = _.cloneDeep(state);
  // console.log(stateCopy);
  const { feeds } = stateCopy;
  // console.log(feeds);
  // console.log('dostali feeds');
  const currentPosts = stateCopy;
  // console.log('dostali aktualnye posty');
  /* const addNewPosts =  */
  const parsedFeeds = feeds.map(({ link }) => {
    console.log(feeds);
    console.log(getRssData(link));
    const dataPromise = getRssData(link)
      .then((response) => {
        // console.log(response);
        // console.log('before parsing');
        // console.log((response.data.contents));
        parse(response.data.contents);
        console.log(parse(response.data.contents));
      })
      .then((parsedData) => {
        console.log(normalizePosts(parsedData.posts));
        normalizePosts(parsedData.posts);
      })
      .catch((error) => {
        stateCopy.error = error.message;
      });
    return dataPromise;
  });

  Promise.all([parsedFeeds])
    /* .then((parsedData) => {
      console.log(normalizePosts(parsedData.posts));
      normalizePosts(parsedData.posts);
    }) */
    .then((normPosts) => {
      console.log(normPosts);
      const newPostsLinks = normPosts.map((nPost) => nPost.link);
      const currPostsLinks = currentPosts.map((currPost) => currPost.link);
      const filteredNewPosts = newPostsLinks.filter((nPost) => !currPostsLinks.includes(nPost));
      state.posts.unshift(filteredNewPosts);
    })
    .catch((error) => {
      stateCopy.error = error.message;
    })
    .finally(() => {
      setTimeout(() => updatePosts(state), defTimeout);
    });
  /* getRssData(link)
    .then((resp) => {
      parse(resp.data.contents);
      console.log(parse(resp.data.contents));
    })
    .then((parsedData) => normalizePosts(parsedData.posts))
    .then((normPosts) => {
      console.log(normPosts);
      const newPostsLinks = normPosts.map((nPost) => nPost.link);
      const currPostsLinks = currentPosts.map((currPost) => currPost.link);
      const filteredNewPosts = newPostsLinks.filter((nPost) => !currPostsLinks.includes(nPost));
      state.posts.unshift(filteredNewPosts);
    })
    .catch((error) => {
      stateCopy.error = error.message;
    })
    .finally(() => {
      setTimeout(() => updatePosts(state), defTimeout);
    })); */
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
        const feed = normalizeFeed(parsedData.feed);
        feed.link = url;
        watchedState.feeds.unshift(feed);
        const posts = normalizePosts(parsedData.posts);
        const allPosts = watchedState.posts.concat(posts);
        watchedState.posts = allPosts;
      })
      .then(() => {
        watchedState.form.isValid = true;
        watchedState.addedLinks.push(url);
        watchedState.ui.submitDisabled = false;
        watchedState.form.formState = 'sent';
        updatePosts(watchedState, defTimeout);
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
  // console.log(watchedState);
  // updatePosts(watchedState, 5000);
};

export default app;
