import * as yup from 'yup';

const validateURL = (url, links) => {
  const schema = yup.string().url().required().notOneOf(links, 'ima not adding double');
  console.log(links);
  return schema
    .validate(url)
    .then(() => null)
    .catch((err) => err.message);
};

// console.log(validate('https://lorem-rss.hexlet.app/feed'));
export default validateURL;
