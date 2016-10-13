$(document).ready(startApplication);

function startApplication() {	
	$('#page-add-student').dialog({
		width: 400,
		close: function(){
						$('.error-message').remove();
						$('.error').removeClass('error');
					}			
	}).dialog("close");
	
	$('#page-edit-student').dialog({
		width: 400
	}).dialog("close");
	
	$('#add-student-button').button().click(function(){
		$('#page-add-student').dialog('open');
	});
	
	$('.add-a-note').button();
	
	$( "#tags" ).autocomplete({
      source: people
  });
		
	$( "#datepicker" ).datepicker();
	
	addOptionsToSelect();
}


function addOptionsToSelect(){
	var myHTML = '';
	var template = '<option value="subject number #number#" name="myoption">#subject#</option>';
	var temporaryString = '';
	for(var i=0; i < subjects.length; i++){
		temporaryString = template;
		temporaryString = temporaryString.replace('#number#', i+1);
		temporaryString = temporaryString.replace('#subject#', subjects[i]);
		myHTML = myHTML + temporaryString;
	}
	$('.sub').html(myHTML);
}


function drawStudents(){
	
	var myHTML = '';
	var template = "<tr><td>#name#</td><td>#subject#</td><td>#date#</td><td>#grade#</td><td onclick='showEditStudent(this.parentNode, event)'><a class='glyphicon glyphicon-pencil' aria-hidden='true'></a></td></tr>";
	var temporaryString = '';
	
	for(var i=0; i < addedStudents.length; i++){
		temporaryString = template;
		temporaryString = temporaryString.replace('#name#', addedStudents[i].name);
		temporaryString = temporaryString.replace('#subject#', addedStudents[i].subject);
		temporaryString = temporaryString.replace('#date#', addedStudents[i].date);
		temporaryString = temporaryString.replace('#grade#', addedStudents[i].grade);
		myHTML = myHTML + temporaryString; 
	}
	$('#students-list tbody').html(myHTML);
}


var addedStudents = [];


function addStudent(myForm, event){
	event.preventDefault();
	
	var select = myForm.elements.subject;
	var optVal;
	for (var i = 0; i < select.options.length; i++) {
		var option = select.options[i];
		if(option.selected) {
			optVal = option.text;
		}
	}

	var inpVal = $('input:radio:checked').val();
	
	var newStudent = {
		"name": myForm.elements.students_name.value,
    "subject": optVal,
    "date": myForm.elements.mydate.value,
    "grade": inpVal
  }
	
	validate(newStudent);	
}


function showError(container, errorMessage) {
	container.attr("class", "error");
  var msgElem = document.createElement('span');
	msgElem = $(msgElem);
	msgElem.attr("class", "error-message");
  msgElem.html(errorMessage);
  container.append(msgElem);
}

function resetError(container) {
	container.attr("class", "");
		if(container.children('span').hasClass("error-message")){
				container.children('span').remove();
		}
}

function validate(student) {
	var newStudent = student;
	var a = $('#add-student-form input[name=students_name]').parent();
	var aa = $('#add-student-form input[name=students_name]').val();
  resetError(a);
    if (aa == "") {
      showError(a, ' Укажите ФИО студента.');
    }
		
	var b = $('#add-student-form input[name=mydate]').parent();
	var bb = $('#add-student-form input[name=mydate]').val(); 
  resetError(b);
    if (bb == "") {
      showError(b, ' Выберите дату.');
    }

	var c = $('#grd');
  resetError(c);
	var cc = $('#add-student-form input[name=grade]:checked').val();
		if (cc == undefined) {
      showError(c, ' Выберите оценку.');
    }
	
	if((aa != "") && (bb != "") && (cc != undefined)){
		for(i=0; i<addedStudents.length; i++){
			if((addedStudents.length > 0) && (addedStudents[i]['name'] == newStudent['name']) && (addedStudents[i]['subject'] == newStudent['subject'])){
				var asg = newStudent['grade'];
				var asd = newStudent['date'];
				addedStudents[i].grade = asg;
				addedStudents[i].date = asd;
				drawStudents();
				//Закрытие диалога
				$('#page-add-student').dialog('close');
				//Очистка диалога
				$('#tags').val('');
				addOptionsToSelect();
				$('#datepicker').val('');
				$('input:radio:checked').removeAttr('checked');
				return true;
			}
		}
		//Добавляем студента в массив
		addedStudents.push(newStudent);
		//Отрисовка
		drawStudents();
		//Закрытие диалога
		$('#page-add-student').dialog('close');
		//Очистка диалога
		$('#tags').val('');
		addOptionsToSelect();
		$('#datepicker').val('');
		$('input:radio:checked').removeAttr('checked');
	}
}


function editStudent(myForm, event){
	event.preventDefault();
	var select = myForm.elements.subject;
	var optVal;
	
	for (var i = 0; i < select.options.length; i++) {
		var option = select.options[i];
		if(option.selected) {
			optVal = option.text;
		}
	}

	var inpVal = $('input:radio:checked').val();
	
	var editStudent = {
		"name": myForm.elements.students_name.value,
    "subject": optVal,
    "date": myForm.elements.mydate.value,
    "grade": inpVal
  }
  
 for( var i=0; i<addedStudents.length; i++){
		if(addedStudents[i].name == editStudent.name){
			addedStudents[i] = editStudent;
		}
  }
	drawStudents();
  $('#page-edit-student').dialog('close');
}

function showEditStudent(note, event){
	event.preventDefault();
	var row = $(note);
	var name = row.find('td').eq(0).text();
	var subject = row.find('td').eq(1).text();
	var mydate = row.find('td').eq(2).text();
	console.log(mydate);
	console.log(typeof mydate);
	/* Преобразование в обект Date
	var mm = mydate.substring(0, 2);
	var dd = mydate.substring(3, 5);
	var yyyy = mydate.substring(6, mydate.length);	
	var date = new Date(yyyy, mm, dd);*/
	var grade = row.find('td')[3].textContent;
	
	$('#edit-student-form input[name=students_name]').val(name);
	$("#edit-student-form select option").each(function(subject){
		var b = $(this).text();
    if(b == subject){
			$(this).attr("selected", "selected");
		}
  });
	//$('#edit-student-form input[name=mydate]').datepicker( "setDate", mydate );
	$('#edit-student-form input[name=mydate]').val(mydate);
	$('#edit-student-form input[name=grade][value=' + grade + ']').prop('checked', true);
	$('#page-edit-student').dialog('open');
}