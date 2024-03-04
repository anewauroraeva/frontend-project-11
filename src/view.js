// import i18next from 'i18next';

const createContainer = (i18nInstance, item, watchedState) => {
  const itemsContainer = document.querySelector(`div.${item}`);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card', 'border-0');
  itemsContainer.append(cardContainer);

  const titleCardContainer = document.createElement('div');
  titleCardContainer.classList.add('card-body');
  cardContainer.append(titleCardContainer);

  const titleContainer = document.createElement('h2');
  titleContainer.classList.add('card-title', 'h4');
  titleContainer.textContent = i18nInstance.t(`items.${item}`);
  titleCardContainer.append(titleContainer);

  const itemList = document.createElement('ul');
  itemList.classList.add('list-group', 'border-0', 'rounded-0');
  cardContainer.append(itemList);
  // console.log(cardContainer);

  if (item === 'feeds') {
    // console.log('feeds');
    watchedState.feeds.forEach((feed) => {
      const feedElement = document.createElement('li');
      feedElement.classList.add('list-group-item', 'border-0', 'border-end-0');

      const feedTitle = document.createElement('h3');
      feedTitle.classList.add('h6', 'm-0');
      feedTitle.textContent = feed.title;

      const feedDescription = document.createElement('p');
      feedDescription.classList.add('m-0', 'small', 'text-black-50');
      feedDescription.textContent = feed.description;

      feedElement.append(feedTitle, feedDescription);
      itemList.append(feedElement);
    });
  }

  if (item === 'posts') {
    // forEach???
    watchedState.posts.forEach((post) => {
      // console.log('forEach posts');
      const { link, id, title } = post;
      const postElement = document.createElement('li');
      postElement.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      // console.log(postElement);
      const postLinkedTitle = document.createElement('a');
      postLinkedTitle.classList.add('fw-bold');
      postLinkedTitle.setAttribute('href', link);
      postLinkedTitle.dataset.id = id;
      postLinkedTitle.setAttribute('target', '_blank');
      postLinkedTitle.setAttribute('rel', 'noopener noreferrer');
      postLinkedTitle.textContent = title;

      const watchBtn = document.createElement('button');
      watchBtn.setAttribute('type', 'button');
      watchBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      watchBtn.dataset.id = post.id;
      watchBtn.dataset.bsToggle = 'modal';
      watchBtn.dataset.bsTarget = '#modal';
      watchBtn.textContent = i18nInstance.t('view');
      // console.log(itemList);
      postElement.append(postLinkedTitle, watchBtn);
      itemList.append(postElement);
      // console.log(postElement);
    });
  }
};

const handleError = (elements, watchedState) => {
  const { error } = watchedState;
  const { input, submit, feedback } = elements;
  input.classList.add('is-invalid');
  input.removeAttribute('readonly');
  submit.removeAttribute('disabled');
  feedback.classList.replace('text-success', 'text-danger');
  // feedback.classList.add('text-danger');
  // feedback.classList.remove('text-success');
  feedback.textContent = error;
};
const handleSuccess = (elements, watchedState) => {
  const {
    form, input, submit, feedback,
  } = elements;
  input.classList.remove('is-invalid');
  input.removeAttribute('readonly');
  submit.removeAttribute('disabled');
  feedback.textContent = '';
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = watchedState.feedback.success;
  form.reset();
  form.focus();
};

const render = (watchedState, elements, i18nInstance) => {
  const {
    input, submit, feedback,
  } = elements;

  switch (watchedState.form.formState) {
    case 'idle': {
      // console.log('idle');
      feedback.textContent = '';
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.remove('is-invalid');
      submit.removeAttribute('submit');
      break;
    }
    case 'sending': {
      // console.log('sending');
      submit.disabled = watchedState.ui.submitDisabled;
      break;
    }
    case 'sent': {
      // console.log('sent');
      const postContainer = document.querySelector('.posts');
      postContainer.textContent = '';
      const feedContainer = document.querySelector('.feeds');
      feedContainer.textContent = '';
      handleSuccess(elements, watchedState);
      createContainer(i18nInstance, 'feeds', watchedState);
      createContainer(i18nInstance, 'posts', watchedState);
      /* if (path === 'feeds') {
        createContainer(i18nInstance, 'feeds', watchedState);
      }
      if (path === 'posts') {
        createContainer(i18nInstance, 'posts', watchedState);
      } */
      break;
    }
    case 'failed': {
      // console.log('fail');
      handleError(elements, watchedState);
      break;
    }
    default:
      break;
  }
};

export default render;
