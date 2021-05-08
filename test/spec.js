const helpers = require('yeoman-test'),
	path = require('path'),
	fs = require('fs'),
	{ok} = require('assert').strict

describe('my generator', () => {
	it('creates key files', () =>
		helpers.run(path.join(__dirname, '../app'))
			.withPrompts({
				domain:'test',
				days: 100
			}).then(({cwd}) => {
				ok(fs.existsSync(`${cwd}/rootCA.pem`))
				ok(fs.existsSync(`${cwd}/test/server.csr`))
				ok(fs.existsSync(`${cwd}/test/server.crt`))
				ok(fs.existsSync(`${cwd}/test/server.key`))
			})
	)
})
