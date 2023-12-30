import * as yup from 'yup';

const schema = yup.string().url().required(); // ('Ссылка должна быть валидным URL');

const validate = async (url) => {
  const validationResult = await schema.validate(url);
  return validationResult;
};
console.log(validate('https://lorem-rss.hexlet.app/feed'));

const enteredUrls = []; // enteredUrls.includes(url);
