const pug = require('pug');
const fs = require('fs');

var html = pug.renderFile('content.pug');
fs.writeFile('content.html', html, function(e){
    if (e) throw e;
})
