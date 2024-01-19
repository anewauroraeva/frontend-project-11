// https://lorem-rss.hexlet.app/
export default (request) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(request.data.content, 'application/xml');

  const errorNode = doc.querySelector('paseerror');
  if (errorNode) {
    console.log('parse error');
  } else {
    console.log('parse success');
  }
};
