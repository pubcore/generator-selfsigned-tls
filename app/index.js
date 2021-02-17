const Generator = require('yeoman-generator'),
	fs = require('fs')

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts)
	}
	initializing(){
	}
	async prompting() {
		this.answers = await this.prompt([{
			type: 'input', name: 'domain',
			message: 'Your domain or IP',
		}])
	}
	writing(){
		if(
			!fs.existsSync(this.destinationPath('rootCA.key'))
			|| !fs.existsSync(this.destinationPath('rootCA.pem'))
		){
			this.log('Generate a RSA-2048 key (rootCA.key)')
			this.spawnCommandSync(
				'openssl',
				['genrsa', '-des3', '-passout', 'pass:go4testing', '-out',
					this.destinationPath('rootCA.key'), 2048],
				{stdio:'inherit'}
			)
			this.log('Create Root SSL certificate (rootCA.pem)')
			this.spawnCommandSync(
				'openssl',
				['req', '-x509', '-new', '-passin', 'pass:go4testing', '-nodes', '-key',
					this.destinationPath('rootCA.key'), '-sha256', '-days', '1024',
					'-out', this.destinationPath('rootCA.pem'), '-subj',
					'/C=DE/ST=BW/L=Stuttgart/O=localDevUseOnly/OU=dev1/CN=localDevUseOnly/emailAddress=...'],
				{stdio:'inherit'}
			)
		}
		var {domain} = this.answers
		this.fs.copyTpl(
			this.templatePath('server.csr.cnf'),
			this.destinationPath(`${domain}/server.csr.cnf`),
			{...this.answers}
		)
		this.fs.copyTpl(
			this.templatePath('v3.ext'),
			this.destinationPath(`${domain}/v3.ext`),
			{...this.answers}
		)
	}
	install(){
		var {domain} = this.answers
		this.log('Create a certificate key (server.key)')
		this.spawnCommandSync(
			'openssl',
			['req', '-new', '-sha256', '-nodes', '-out',
				this.destinationPath(`${domain}/server.csr`), '-newkey', 'rsa:2048',
				'-keyout', `${domain}/server.key`, '-config',
				this.destinationPath(`${domain}/server.csr.cnf`)],
			{stdio:'inherit'}
		)
		this.log('Create certificate file (server.crt)')
		this.spawnCommandSync(
			'openssl',
			['x509', '-req', '-in', this.destinationPath(`${domain}/server.csr`),
				'-CA', this.destinationPath('rootCA.pem'), '-passin', 'pass:go4testing', '-CAkey',
				this.destinationPath('rootCA.key'), '-CAcreateserial', '-out',
				this.destinationPath(`${domain}/server.crt`), '-days', 500, '-sha256', '-extfile',
				this.destinationPath(`${domain}/v3.ext`)],
			{stdio:'inherit'}
		)
	}
}
