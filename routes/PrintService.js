var page = require('webpage').create(),
    system = require('system');

page.paperSize = {
  format: 'A4',
  orientation: 'portrait',
  border: '1cm'
}

var filename = system.args[1];
var url = system.args[2];

console.log('=================== ' + filename);
console.log('=================== ' + url);

page.open(url, function (status) {    
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {        
        window.setTimeout(function () {            
            var str = 'C:/documents/personal/project/gtech/public/prints/' + filename + '.pdf';

            console.log('*************************************' + str);
            page.render(str);
            phantom.exit();
        }, 200);
    }
});