## Create self-signed TLS certificate files  

NOT for production use !

To enable Transport Layer Security (TLS) for http servers we need to create proper certificates and keys. In order to make Browsers work correct with selfsigned certificates it is required to register the corresponding root certificate (which has been used to sign the server certificate).

This yeoman generator creates this files with minimal input (domainname or IP address).

#### Prerequisites
* openssl command line client is installed
* nodejs and npm in lates versions are installed

#### Installation

		npm i -g yo @pubcore/generator-selfsigned-tls

#### Description
If the working directory is empty, a root certificate will be generated. If root cert. (rootCA.pem and rootCA.key) already exists, it will be reused for other domains. Fore each domain a subfolder will be created containing domain specific config, key and cert files.

#### Example
On shell, create a directory, change into and execute and define some domain:

	yo @pubcore/selfsigned-tls

On success, beside some other files, following is created:
	- rootCA.pem
	- [domain]
	  |
	  +- server.crt
	  +- server.key

#### Distribution

##### server.crt and server.key
This two files needs to be plugged into your server(s). Please find corresponding server documentation how to enable https

##### rootCA.pem
This root certificate needs to be attached to browser's certificate store.

* On MacOS: Use keychain tool, Category "Certificates" (once added, it will be used by all browsers, not only Safari)
* In general: google for "Manually installing root certificates" for your browser

#### References
https://en.wikipedia.org/wiki/Root_certificate

https://medium.freecodecamp.org/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec

https://www.openssl.org

https://yeoman.io


