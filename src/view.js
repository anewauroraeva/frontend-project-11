// import i18next from 'i18next';

const createContainer = (i18nInstance, item) => {
  const itemContainer = document.querySelector(`div.${item}`);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card', 'border-0');
  // postsContainer.append(cardContainer);

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('card-body');
  // cardContainer.append(headerContainer);
  const header = document.createElement('h2');
  header.classList.add('card-title', 'h4');
  header.textContent = i18nInstance.t(`items[${item}]`);
  // headerContainer.append(header);
  const itemList = document.createElement('ul');
  itemList.classList.add('list-group', 'border-0', 'rounded-0');
  cardContainer.append(itemList);
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
    form, input, submit, feedback,
  } = elements;
  const { feeds, posts } = watchedState;

  switch (watchedState.form.formState) {
    case 'idle': {
      feedback.textContent = '';
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
      input.classList.remove('is-invalid');
      input.removeAttribute('readonly');
      submit.removeAttribute('submit');
      break;
    }
    case 'sending': {
      input.setAttribute('readonly', watchedState.ui.inputReadOnly);
      submit.disabled = watchedState.ui.submitDisabled;
      break;
    }
    case 'sent': {
      handleSuccess(elements, watchedState);
      break;
    }
    case 'failed': {
      handleError(elements, watchedState);
      break;
    }
    default:
      break;
  }
  /* allPosts.forEach((posts) => {
      posts.forEach((post) => {
        const {
          description, id, title, link,
        } = post;
        // console.log(title);
        const postEl = document.createElement('li');
        postEl.classList.add('list-group-item', 'd-flex',
        'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

        const postLink = document.createElement('a');
        postLink.setAttribute('href', link);
        postLink.classList.add('fw-bold');
        postLink.dataset.id = id;
        postLink.setAttribute('target', '_blank');
        postLink.setAttribute('rel', 'noopener', 'noreferrer');
        postLink.textContent = title;

        // postEl.append(postLink);
        // console.log('after postEl');

        const watchBtn = document.createElement('button');
        watchBtn.setAttribute('type', 'button');
        watchBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        watchBtn.dataset.id = id;
        watchBtn.dataset.bsToggle = 'modal';
        watchBtn.dataset.bsTarget = '#modal';
        watchBtn.textContent = 'Просмотр';
        postEl.append(watchBtn);

        // postsList.append(postEl);
        // console.log('after prepend to postsList');
      });
      // allPosts.prepend(cardContainer);
      // postsList.append()
    }); */
  // allPosts.prepend(cardContainer);
  /* const { feeds } = watchedState;
    const feedContainer = document.querySelector('div.feeds'); */
  // }
  // console.log(watchedState);
};

export default render;
