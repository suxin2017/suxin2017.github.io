hexo.extend.filter.register('before_post_render', function (data) {
    if(process.env.NODE_ENV !== 'production'){
        this.theme.config.cdn.url = ''
    }
  });