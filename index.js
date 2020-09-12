const express = require('express')
const hbs = require("handlebars")
const fs = require("fs")
const semver = require('semver')
const bent = require('bent')

const app = express()
const PORT = 3100
const getJSON = bent('json')
app.use(express.json());
app.engine('hbs', function (filePath, options, callback) { // define the template engine
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(err)
        const rendered = hbs.compile(content.toString());
        return callback(null, rendered({ dependencies: options.dependencies }))
    })
});
app.set('views', './views')
app.set('view engine', 'hbs');

app.get('/dependencies', function (req, res) {
    fs.readFile(`${__dirname}/package.json`, function (err, content) {
        if (err) throw err;
        const dependencies = Object.entries(JSON.parse(content.toString()).dependencies).map((dependency) => {
            return {
                name: dependency[0],
                version: dependency[1]
            }
        });
        res.render('dependencies', { dependencies });
    })
});

app.get('/minimum-secure', async function (request, response) {
    const nodeVersions = await getJSON('https://nodejs.org/dist/index.json');
    const secureVersions = nodeVersions.filter((version) => {
        if (version.security) return true;
    });

    const minSecureVersion = secureVersions.reduce((accum, currentValue) => {
        const versionNumber = currentValue.version.split('.')[0];
        if (!accum[versionNumber]) {
            accum[versionNumber] = currentValue;
        }
        if (accum[versionNumber]) {
            if (semver.gt(accum[versionNumber].version, currentValue.version)) {
                accum[versionNumber] = currentValue;
            }
        }
        return accum;
    }, {})
    response.send(minSecureVersion);
});

app.get('/latest-releases', async function (request, response) {
    const nodeVersions = await getJSON('https://nodejs.org/dist/index.json');
    const latestReleases = nodeVersions.reduce((accum, currentValue) => {
        const versionNumber = currentValue.version.split('.')[0];
        if (!accum[versionNumber]) {
            accum[versionNumber] = currentValue;
        }
        if (accum[versionNumber]) {
            if (semver.lt(accum[versionNumber].version, currentValue.version)) {
                accum[versionNumber] = currentValue;
            }
        }
        return accum;
    }, {})
    response.send(latestReleases);
});

app.listen(PORT)
module.exports = app;
