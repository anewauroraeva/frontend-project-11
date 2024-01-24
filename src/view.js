// import i18next from 'i18next';

const render = (watchedState, elements) => {
  const { form, input, feedback } = elements;
  if (watchedState.form.isUrlValid) {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = watchedState.feedback.success;
    form.reset();
    form.focus();
  }
  if (watchedState.form.isUrlValid === false) {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    console.log(watchedState.error);
    feedback.textContent = watchedState.error;
  }
};

export default render;
