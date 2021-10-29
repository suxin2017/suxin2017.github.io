const { copyTemplate } = require("./file");
const moment = require("moment")

copyTemplate('miniPost.md',`v${moment().format('YYYY-MM-DD_HH-mm')}`,process.argv[2])