const tape = require('tape')
const bent = require('bent')
const getPort = require('get-port')
const assert = require('assert')
const nock = require('nock')

const server = require('../')

const getJSON = bent('json')
const getBuffer = bent('buffer')

// Use `nock` to prevent live calls to remote services

const context = {}

tape('setup', async function (t) {
	const port = await getPort()
	context.server = server.listen(port)
	context.origin = `http://localhost:${port}`

	t.end()
})

tape('should get dependencies', async function (t) {
	const html = (await getBuffer(`${context.origin}/dependencies`)).toString()
	assert.ok(html.match(/bent/g) instanceof Array);
	assert.ok(html.match(/bent/g).length > 0);
	assert.equal(html.match(/bent/g)[0], 'bent');

	assert.ok(html.match(/express/g) instanceof Array);
	assert.ok(html.match(/express/g).length > 0);
	assert.equal(html.match(/express/g)[0], 'express');

	assert.ok(html.match(/handlebars/g) instanceof Array);
	assert.ok(html.match(/handlebars/g).length > 0);
	assert.equal(html.match(/handlebars/g)[0], 'handlebars');

});

tape('should get minimum secure release', async function (t) {
	const response = nock('http://localhost:3000/')
		.get('/minimum-secure')
		.reply(200, {
			"v0": {
				"version": "v0.10.46",
				"date": "2016-06-23",
				"files": [
					"headers",
					"linux-x64",
					"linux-x86",
					"osx-x64-pkg",
					"osx-x64-tar",
					"osx-x86-tar",
					"src",
					"sunos-x64",
					"sunos-x86",
					"win-x64-exe",
					"win-x86-exe",
					"win-x86-msi"
				],
				"npm": "2.15.1",
				"v8": "3.14.5.9",
				"uv": "0.10.37",
				"zlib": "1.2.8",
				"openssl": "1.0.1t",
				"modules": "11",
				"lts": false,
				"security": true
			}
		});
})

tape('should get latest releases', async function (t) {
	const response = nock('http://localhost:3000/')
		.get('/latest-releases')
		.reply(200, {
			"v0": {
				"version": "v0.9.9",
				"date": "2013-02-07",
				"files": [
					"linux-x64",
					"linux-x86",
					"osx-x64-pkg",
					"osx-x64-tar",
					"osx-x86-tar",
					"src",
					"sunos-x64",
					"sunos-x86",
					"win-x64-exe",
					"win-x86-exe",
					"win-x86-msi"
				],
				"npm": "1.2.10",
				"v8": "3.15.11.10",
				"uv": "0.9",
				"zlib": "1.2.3",
				"openssl": "1.0.1c",
				"modules": "0x000B",
				"lts": false,
				"security": false
			}
		});
})

// more tests

tape('teardown', function (t) {
	context.server.close()
	t.end()
})
