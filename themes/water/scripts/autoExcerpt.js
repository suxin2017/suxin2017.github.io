/* global hexo */
const htmlToText = require('html-to-text');
const sanitize = function (post) {
    const content = htmlToText.htmlToText(
        post,
        {
            ignoreImage: true,
            ignoreHref: true,
            wordwrap: false,
            uppercaseHeadings: false
        }
    );
    return content;
}

hexo.extend.filter.register('after_post_render', function (data) {
    console.log(data)
    const excerptLength = hexo.config.excerpt_length || 200;
    const post = sanitize(data.content);
    const excerpt = post.substr(0, excerptLength)+'...';
    data.excerpt = excerpt;
    return data;
});