const { copyTemplate } = require("./file");
const moment = require("moment")

copyTemplate('post.md',process.argv[2] ?? `a${moment().format('YYYY-MM-DD_HH-mm')}`)