const tape = require('tape')
const bent = require('bent')
const getPort = require('get-port')
const assert = require('assert')
const nock = require('nock')

const server = require('../')
const sampleMinimumReleases = require('./fixtures/minimumReleases.json')
const sampleLatestReleases = require('./fixtures/latestReleases.json')
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
	nock('http://localhost:3000', {
		reqheaders: {
			"accept": "application/json",
			"accept-encoding": "br, gzip, deflate"
		}
	})
		.get('/minimum-secure')
		.reply(200, sampleMinimumReleases)
	const minSecureReleases = await getJSON('http://localhost:3000/minimum-secure')
	assert.ok(minSecureReleases.v0 instanceof Object)
	assert.deepStrictEqual(minSecureReleases.v0, {
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
	})

	assert.ok(minSecureReleases.v4 instanceof Object)
	assert.deepStrictEqual(minSecureReleases.v4, {
		"version": "v4.6.0",
		"date": "2016-09-27",
		"files": [
			"headers",
			"linux-arm64",
			"linux-armv6l",
			"linux-armv7l",
			"linux-ppc64le",
			"linux-x64",
			"linux-x86",
			"osx-x64-pkg",
			"osx-x64-tar",
			"src",
			"sunos-x64",
			"sunos-x86",
			"win-x64-7z",
			"win-x64-exe",
			"win-x64-msi",
			"win-x64-zip",
			"win-x86-7z",
			"win-x86-exe",
			"win-x86-msi",
			"win-x86-zip"
		],
		"npm": "2.15.9",
		"v8": "4.5.103.37",
		"uv": "1.9.1",
		"zlib": "1.2.8",
		"openssl": "1.0.2j",
		"modules": "46",
		"lts": "Argon",
		"security": true
	})
})

tape('should get latest releases', async function (t) {
	nock('http://localhost:3000', {
		reqheaders: {
			"accept": "application/json",
			"accept-encoding": "br, gzip, deflate"
		}
	})
		.get('/latest-releases')
		.reply(200, sampleLatestReleases)
	const latestReleases = await getJSON('http://localhost:3000/latest-releases')
	assert.ok(latestReleases.v13 instanceof Object)
	assert.deepStrictEqual(latestReleases.v13, {
		"version": "v13.14.0",
		"date": "2020-04-29",
		"files": [
			"aix-ppc64",
			"headers",
			"linux-arm64",
			"linux-armv7l",
			"linux-ppc64le",
			"linux-s390x",
			"linux-x64",
			"osx-x64-pkg",
			"osx-x64-tar",
			"src",
			"sunos-x64",
			"win-x64-7z",
			"win-x64-exe",
			"win-x64-msi",
			"win-x64-zip",
			"win-x86-7z",
			"win-x86-exe",
			"win-x86-msi",
			"win-x86-zip"
		],
		"npm": "6.14.4",
		"v8": "7.9.317.25",
		"uv": "1.37.0",
		"zlib": "1.2.11",
		"openssl": "1.1.1g",
		"modules": "79",
		"lts": false,
		"security": false
	})

	assert.ok(latestReleases.v14 instanceof Object)
	assert.deepStrictEqual(latestReleases.v14, {
		"version": "v14.10.1",
		"date": "2020-09-10",
		"files": [
			"aix-ppc64",
			"headers",
			"linux-arm64",
			"linux-armv7l",
			"linux-ppc64le",
			"linux-s390x",
			"linux-x64",
			"osx-x64-pkg",
			"osx-x64-tar",
			"src",
			"win-x64-7z",
			"win-x64-exe",
			"win-x64-msi",
			"win-x64-zip",
			"win-x86-7z",
			"win-x86-exe",
			"win-x86-msi",
			"win-x86-zip"
		],
		"npm": "6.14.8",
		"v8": "8.4.371.19",
		"uv": "1.39.0",
		"zlib": "1.2.11",
		"openssl": "1.1.1g",
		"modules": "83",
		"lts": false,
		"security": false
	})
})

// more tests

tape('teardown', function (t) {
	context.server.close()
	t.end()
})
