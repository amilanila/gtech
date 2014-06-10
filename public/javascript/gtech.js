$(document).ready(function () {
	$( ".datepicker" ).datepicker();

	var pathName = $(location).attr('pathname');
	if(pathName != undefined){
		var tabName = '';
		if(pathName.indexOf('manufacturer') > -1){
			tabName = 'manufacturer'; 
		} else if(pathName.indexOf('model') > -1){
			tabName = 'model';
		} else if(pathName.indexOf('servicetype') > -1){
			tabName = 'servicetype';
		} else if(pathName.indexOf('manual') > -1){
			tabName = 'manual';
		} else if(pathName.indexOf('job') > -1 || pathName == '/'){
			tabName = 'job';
		}
		
		// job edit
		var selectedMake = $('#selectedMake').val();
		var selectedModel = $('#selectedModel').val();
		var selectedStatus = $('#selectedStatus').val();
		var selectedServiceTypes = $('#selectedServiceTypes').val();
		
		if(selectedMake != "-1"){
			$('.job-make').val(selectedMake);			
		}
		if(selectedModel != "-1"){
			$('.job-models').val(selectedModel);			
		}
		if(selectedStatus != "-1"){
			$('.job-status').val(selectedStatus);			
		}
		if(selectedServiceTypes != "-1"){
			var arr = selectedServiceTypes.split(',');
			$('.job-servicetypes > li > input').each(function(){
				var self = this;
				var stype = this.value;		
				$(arr).each(function(){
					var selectedType = this;
					if(stype == selectedType){
						$(self).attr('checked', true);
					}					
				});
			});			
		}

		// model edit
		var selectedMakeModel = $('#selectedMakeModel').val();
		if(selectedMakeModel != "-1"){
			$('.model-make').val(selectedMakeModel);
		}

		var selector = "#mainTab a[href=\"#" + tabName + "\"]";
		$(selector).tab('show');			
	}

	//////////////////// event handling ////////////////////

	// tab selection -->
	$('#mainTab a').click(function (e) {
	  e.preventDefault();
	  var href = $(this).attr('href').replace('#','');	  
	  window.location.href = "/" + href;		  
	})

	$('.job-make').change(function (e) {
	  e.preventDefault();
	  var map = $('#makeModelMap').val();
	  var json = JSON.parse(map);

	  var selectedMake = $(this).val();
	  var selectedModels = json[selectedMake];

	  $('.job-models').empty();
	  $('.job-models').append($("<option></option>").attr("value", '-').text('- select -'));

	  if(selectedModels != undefined){
	  	var selectedModelsArr = selectedModels.split('#');	
	  	selectedModelsArr.forEach(function(selectedModel){
			$('.job-models').append($("<option></option>").attr("value", selectedModel).text(selectedModel));
	  	});
	  } 
	});

	// parameter validation
	$('.job-save-button').click(function(e){
		e.preventDefault();
		var make = $('.job-make').val();
	    var model = $('.job-models').val();
	    var rego = $('#rego').val();	    
	    var fname = $('#fname').val();	    

	    if(make == undefined || make == '-' || 
	       	model == undefined || model == '-' ||
	       	rego == undefined || rego == '' ||
	       	fname == undefined || fname == ''){
	       	// show warning dialog box
	       	$('#jobSaveErrorAlert').modal({
  				keyboard: false
			});
	       	return;
	    } else {
	    	$('#newJobForm').submit();
	    }
	});



	// remove links -->
	$('.remove-manufacturer-link').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
     	$(".modal-footer #removeManufacturerLink").attr('href', '/manufacturer/remove/' + id);
     	$('#manufacturerDeleteModal').modal('show');
	});

	$('.remove-model-link').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
     	$(".modal-footer #removeModelLink").attr('href', '/model/remove/' + id);
     	$('#modelDeleteModal').modal('show');
	});

	$('.remove-servicetype-link').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
     	$(".modal-footer #removeServiceTypeLink").attr('href', '/servicetype/remove/' + id);
     	$('#serviceTypeDeleteModal').modal('show');
	});

	$('.remove-job-link').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
     	$(".modal-footer #removeJobLink").attr('href', '/job/remove/' + id);
     	$('#jobDeleteModal').modal('show');
	});

	$('.remove-manual-link').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
     	$(".modal-footer #removeManualLink").attr('href', '/manual/remove/' + id);
     	$('#manualDeleteModal').modal('show');
	});
});


