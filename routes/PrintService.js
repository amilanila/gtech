var page = require('webpage').create(),
    system = require('system');

page.open('http://localhost:3000', function (status) {    
    if (status !== 'success') {
        console.log('Unable to load the address!');
        phantom.exit();
    } else {        
        window.setTimeout(function () {
            console.log("writing files ");
            page.render('C://documents//personal//project//gtech//public//prints//test.pdf');
            phantom.exit();
        }, 200);
    }
});