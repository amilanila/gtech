var page = require('webpage').create(),
    system = require('system'),
    config = require('../config.json');

page.paperSize = {
  format: 'A4',
  orientation: 'portrait',
  border: '1cm'
}

var filename = system.args[1];
var url = system.args[2];

page.open(url, function (status) {    
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {        
        window.setTimeout(function () {  
            var str = config.print.location + filename + '.pdf';
            //var str = 'C:/documents/personal/project/gtech/public/prints/' + filename + '.pdf';
            //var str = 'E:/mystuff/workspace/gtech/public/prints/' + filename + '.pdf';
            page.render(str);
            phantom.exit();
        }, 200);
    }
});