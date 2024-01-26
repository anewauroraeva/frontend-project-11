// import i18next from 'i18next';

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
    console.log(watchedState.error);
    feedback.textContent = watchedState.error;
  }

  /* if (watchedState.form.formState === 'sent') {
    const postsContainer = document.querySelector('div.posts');
    const feedContainer = document.querySelector('div.feeds');
  } */
};

export default render;
