/* global hexo */
const htmlToText = require('html-to-text');
const sanitize = function (post) {
    const content = htmlToText.htmlToText(
        post,
        {
            ignoreHref: true,
            ignoreImage: true,
            uppercaseHeadings: false,
            wordwrap: false
        }
    );
    return content;
}

hexo.extend.filter.register('after_post_render', function (data) {
    const excerptLength = hexo.config.excerpt_length || 200;
    const post = sanitize(data.content);
    const excerpt = post.substr(0, excerptLength)+'...';
    data.excerpt = excerpt;
    return data;
});