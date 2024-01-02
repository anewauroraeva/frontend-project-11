import * as yup from 'yup';

const schema = yup.string().url().required('Ссылка должна быть валидным URL'); // ('Ссылка должна быть валидным URL');

const validate = async (url) => {
  await schema.validate(url);
  // returns promise
};
// console.log(validate('https://lorem-rss.hexlet.app/feed'));
export default validate;
