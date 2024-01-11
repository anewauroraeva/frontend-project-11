const render = (state, elements) => {
  const { form, feedback } = elements;
  if (state.isValid) {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = state.successMessage;
    form.reset();
    form.focus();
  }
  if (state.isValid === false) {
    feedback.textContent = state.submitError;
  }
  /* const watchedState = onChange(state, () => {
    const { form, feedback } = elements;
    // const checkDiv = document.createElement('div');
    feedback.textContent = 'check div';
    if (watchedState.isValid) {
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = watchedState.submitMessage;
      form.reset();
      form.focus();
    }
  }); */
};

export default render;
