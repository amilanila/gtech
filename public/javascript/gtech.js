$(document).ready(function () {
	var pathName = $(location).attr('pathname');
	if(pathName != undefined){
		var tabName = '';
		if(pathName.indexOf('manufacturer') > -1){
			tabName = 'manufacturer'; 
		} else if(pathName.indexOf('model') > -1){
			tabName = 'model';
		} else if(pathName.indexOf('servicetype') > -1){
			tabName = 'servicetype';
		} else if(pathName.indexOf('job') > -1 || pathName == '/'){
			tabName = 'job';
		}
		
		var selector = "#mainTab a[href=\"#" + tabName + "\"]";
		$(selector).tab('show');			
	}

	$('#mainTab a').click(function (e) {
	  e.preventDefault();
	  var href = $(this).attr('href').replace('#','');	  
	  window.location.href = "/" + href;		  
	})
});


