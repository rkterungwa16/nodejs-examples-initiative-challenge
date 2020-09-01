const tape = require('tape')
const bent = require('bent')
const getPort = require('get-port');
const assert = require('assert');

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
	
})

// more tests

tape('teardown', function (t) {
	context.server.close()
	t.end()
})
