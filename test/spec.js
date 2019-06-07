const helpers = require('yeoman-test'),
	path = require('path'),
	fs = require('fs'),
	{ok} = require('assert').strict

describe('my generator', () => {
	it('creates key files', () =>
		helpers.run(path.join(__dirname, '../app'))
			.withPrompts({
				domain:'test'
			}).then(dir => {
				ok(fs.existsSync(`${dir}/rootCA.pem`))
				ok(fs.existsSync(`${dir}/test/server.csr`))
				ok(fs.existsSync(`${dir}/test/server.crt`))
				ok(fs.existsSync(`${dir}/test/server.key`))
			})
	)
})
