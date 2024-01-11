import onChange from 'on-change';

// console.log(validate('https://lorem-rss.hexlet.app/feed'));

const render = (state, elements) => {
  const watchedState = onChange(state, () => {
    const { form, feedback } = elements;
    console.log(feedback);
    if (watchedState.isValid) {
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = watchedState.submitMessage;
      form.reset();
      form.focus();
    }
  });
};

export default render;
