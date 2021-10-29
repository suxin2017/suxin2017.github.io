'use strict';

const pagination = require('hexo-pagination');
const { sort } = require('timsort');

function index_generator(locals) {
  const config = this.config;
  const posts = locals.posts.filter(post => {
    return post.categories.find({ name: 'post' }).length
  }).sort(config.index_generator.order_by);

  sort(posts.data, (a, b) => (b.sticky || 0) - (a.sticky || 0));

  const paginationDir = config.pagination_dir || 'page';
  const path = config.index_generator.path || '';

  return pagination(path, posts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
};

hexo.config.index_generator = Object.assign({
  per_page: typeof hexo.config.per_page === 'undefined' ? 10 : hexo.config.per_page,
  order_by: '-date'
}, hexo.config.index_generator);

hexo.extend.generator.register('index', index_generator);
