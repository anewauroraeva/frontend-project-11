// import i18next from 'i18next';
// const createFeed = (firstFeed, )

const postsContainer = document.querySelector('div.posts'); // outside

const cardContainer = document.createElement('div'); // outside
cardContainer.classList.add('card', 'border-0'); // outside
postsContainer.append(cardContainer); // outside

const headerContainer = document.createElement('div'); // outside
headerContainer.classList.add('card-body');
cardContainer.append(headerContainer);
const header = document.createElement('h2');
header.classList.add('card-title', 'h4');
headerContainer.append(header); // outside

const postsList = document.createElement('ul');
postsList.classList.add('list-group', 'border-0', 'rounded-0');
cardContainer.append(postsList);

const render = (watchedState, elements) => {
  const { form, input, feedback } = elements;
  if (watchedState.form.isValid) {
    input.classList.remove('is-invalid');
    feedback.textContent = '';
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = watchedState.feedback.success;
    form.reset();
    form.focus();
  } else {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    // console.log(watchedState.error);
    feedback.textContent = watchedState.error;
  }
  /* if (watchedState.form.formState === 'sending') {
    const { inputDisabled, submitDisabled } = watchedState.ui;
    // submitDisabled = false;
  } */

  if (watchedState.form.formState === 'sent') {
    const allPosts = watchedState.posts; // rename???

    allPosts.forEach((posts) => {
      posts.forEach((post) => {
        const {
          /* description, */ id, title, link,
        } = post;
        // console.log(title);
        const postEl = document.createElement('li');
        postEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
        // postEl.textContent = title;
        const postLink = document.createElement('a');
        postLink.setAttribute('href', link);
        postLink.classList.add('fw-bold');
        postLink.dataset.id = id;
        postLink.setAttribute('target', '_blank');
        postLink.setAttribute('rel', 'noopener', 'noreferrer');
        postLink.textContent = title;

        postEl.append(postLink);
        console.log('after postEl');

        const watchBtn = document.createElement('button');
        watchBtn.setAttribute('type', 'button');
        watchBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        watchBtn.dataset.id = id;
        watchBtn.dataset.bsToggle = 'modal';
        watchBtn.dataset.bsTarget = '#modal';
        watchBtn.textContent = 'Просмотр';
        postEl.append(watchBtn);

        postsList.append(postEl);
        console.log('after prepend to postsList');
      });
      // allPosts.prepend(cardContainer);
    });
    // allPosts.prepend(cardContainer);
    /* const { feeds } = watchedState;
    const feedContainer = document.querySelector('div.feeds'); */
  }
  console.log(watchedState);
};

export default render;
