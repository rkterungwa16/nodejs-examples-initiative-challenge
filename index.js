const express = require('express')
const hbs = require("handlebars")
const fs = require("fs")
const https = require("https");

const app = express()
const PORT = 3000
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

app.get('/minimum-secure', function (request, response) {
    https.get("https://nodejs.org/dist/index.json", (res) => {
        const status = res.statusCode
        if (status === 200 || status === 201) {
            let responseBody = ''
            res.on('data', (responseData) => {
                responseBody += responseData
            })
            return res.on('end', () => {
                const parsedBody = JSON.parse(responseBody)
                const secureVersions = parsedBody.filter((version) => {
                    if (version.security) return true;
                });

                const minSecureVersion = secureVersions.reduce((accum, currentValue) => {
                    const versionNumber = currentValue.version.split('.')[0];
                    if (!accum[versionNumber]) {
                        accum[versionNumber] = currentValue;
                    }
                    if (accum[versionNumber]) {
                        const accumMinor = accum[versionNumber].version.split('.')[1];
                        const accumPatch = accum[versionNumber].version.split('.')[2];
                        const currentValueMinor = currentValue.version.split('.')[1];
                        const currentValuePatch = currentValue.version.split('.')[2];
                        if (accumMinor > currentValueMinor) {
                            accum[versionNumber] = currentValue;
                        }
                        if (accumMinor === currentValueMinor && accumPatch > currentValuePatch) {
                            accum[versionNumber] = currentValue;
                        }
                    }
                    return accum;
                }, {})
                response.send(minSecureVersion);
            })
        }
    })
});

app.listen(PORT)
module.exports = app;
