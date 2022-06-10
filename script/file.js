const fs = require('fs')
const { join } = require('path')
const path = require('path')
const moment = require('moment');

const templateDir = path.join(__dirname, './template');
const postDir = path.join(__dirname, '../source/_posts')
function copyTemplate(type, title = '标题', content = '内容') {
	const fileContent = fs.readFileSync(join(templateDir, type));
	const fileName = title + '.md';
	const file = fileContent.toString()
		.replace('{{ date }}', moment().format('YYYY-MM-DD HH:mm:ss'))
		.replace('{{ title }}', title)
		.replace('{{ content }}', content)
	fs.writeFileSync(join(postDir, fileName), file)
	console.log(join(postDir, fileName))
}

exports.copyTemplate = copyTemplate;