const express = require('express')
const hbs = require("handlebars")
const fs = require("fs");

const app = express()
const PORT = 3000

app.engine('hbs', function (filePath, options, callback) { // define the template engine
    fs.readFile(filePath, function (err, content) {
        if (err) return callback(err)
        const rendered = hbs.compile(content.toString());
        return callback(null, rendered({dependencies: options.dependencies}))
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

app.listen(PORT)
module.exports = app;
