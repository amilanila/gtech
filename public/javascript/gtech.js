$(document).ready(function () {
	$( ".datepicker" ).datepicker();

	$("#leftNav").load("left-nav.html"); 

	var pathName = $(location).attr('pathname');
	if(pathName != undefined){
		var tabName = '';
		var selector = '';
		if(pathName.indexOf('manufacturer') > -1){
			selector = "#mainTab a[href=\"#manufacturer\"]";			
		} else if(pathName.indexOf('model') > -1){
			selector = "#mainTab a[href=\"#model\"]";			
		} else if(pathName.indexOf('servicetype') > -1){
			selector = "#mainTab a[href=\"#servicetype\"]";		
		} else if(pathName.indexOf('manual') > -1){
			selector = "#mainTab a[href=\"#manual\"]";			
		} else if(pathName.indexOf('task') > -1){
			selector = "#mainTab a[href=\"#task\"]";			
		} else if(pathName.indexOf('jobcard') > -1){
			selector = "#mainTab a[href=\"#jobcard\"]";			
		} else if(pathName.indexOf('part') > -1){
			selector = "#mainTab a[href=\"#part\"]";			
		} else if(pathName.indexOf('job') > -1 || pathName == '/'){
			selector = "#mainTab a[href=\"#job\"]";			
		}
		
		$(selector).tab('show');

		// job edit
		var selectedMake = $('#selectedMake').val();
		var selectedModel = $('#selectedModel').val();
		var selectedStatus = $('#selectedStatus').val();
		var selectedServiceTypes = $('#selectedServiceTypes').val();
		
		if(selectedMake != undefined && selectedMake != "-1"){
			$('.job-make').val(selectedMake);			
		}
		if(selectedModel != undefined && selectedModel != "-1"){
			$('.job-models').val(selectedModel);			
		}
		if(selectedStatus != undefined && selectedStatus != "-1"){
			$('.job-status').val(selectedStatus);			
		}
		if(selectedServiceTypes != undefined && selectedServiceTypes != "-1"){
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

		// job card edit
		var selectedTasks = $('#selectedTasks').val();
		if(selectedTasks != undefined && selectedTasks != "-1"){
			var arr = selectedTasks.split(',');
			$('.jobcard-task > li > input').each(function(){
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
		if(selectedMakeModel != undefined && selectedMakeModel != "-1"){
			$('.model-make').val(selectedMakeModel);
		}
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

	/////////////////// Validation //////////////////////

	// job parameter validation
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

	$('.remove-task-link').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
     	$(".modal-footer #removeTaskLink").attr('href', '/task/remove/' + id);
     	$('#taskDeleteModal').modal('show');
	});	

	$('.remove-jobcard-link').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
     	$(".modal-footer #removeJobCardLink").attr('href', '/jobcard/remove/' + id);
     	$('#jobcardDeleteModal').modal('show');
	});	

	$('.remove-part-link').click(function(e){
		e.preventDefault();
		var id = $(this).data('id');
     	$(".modal-footer #removePartLink").attr('href', '/part/remove/' + id);
     	$('#partDeleteModal').modal('show');
	});		
});