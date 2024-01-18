// import i18next from 'i18next';

const render = (watchedState, elements) => {
  const { form, input, feedback } = elements;
  if (watchedState.form.isValid) {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = watchedState.feedback.success;
    form.reset();
    form.focus();
  }
  if (watchedState.form.isValid === false) {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    console.log(watchedState.errorMessage);
    feedback.textContent = watchedState.errorMessage;
  }
};

export default render;
