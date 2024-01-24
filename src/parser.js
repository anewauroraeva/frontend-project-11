const parse = (data) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'text/xml');
  // console.log(doc);

  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    /* console.log(errorNode);
    const div = document.querySelector('.posts');
    div.append(errorNode); */
    throw new Error('invalidRss');
  } else {
    const channel = doc.querySelector('channel');
    const feedTitle = channel.querySelector('title');
    const feedDescription = channel.querySelector('description');

    const feed = {
      feedTitle: feedTitle.textContent,
      feedDescription: feedDescription.textContent,
    };

    const items = channel.querySelectorAll('item');
    const posts = [...items].map((item) => {
      const title = item.querySelector('title').textContent;
      const description = item.querySelector('description').textContent;
      const link = item.querySelector('link').textContent;

      return { title, description, link };
    });
    console.log(posts);
    return { feed, posts };
  }
};

export default parse;
