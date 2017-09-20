//Autopopulate Class Records

//variable of the JSON for the spread sheet
var spreadSheet = 'https://script.googleusercontent.com/a/macros/firststepcoding.com/echo?user_content_key=wHbZw7GQ_E5-Yrzdt8QNpem9OSNn-kxUrS097s8G2l-SjUAe8Aq3-svZ8y4wcaqq40eG7LHwNQzsCQnkN6mr6Ypf43Z8APLJm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_nRPgeZU6HP8zZwrXhLHynpW4F7uziYGaS4chwneYR2u-8KjQVXFiQgQmN6v_FO7X1DduPk4L466NRQP25pqtKWJuVoR9X3sae21wYRIfbNNdO6q-2nD55Q&lib=M8sJBmubsRDapr99Vo8vyH6Okynu9QHlU';

//array to hold months of the year
var monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];


// FILTER CLASS DATA 
function processClassInfo(data){
    
	var courseLocationDivs = $('.course-listing').toArray();
	
	courseLocationDivs.forEach(function(courseLocationDiv){
		$("#" + courseLocationDiv.id).append('<div class="sqs-block horizontalrule-block sqs-block-horizontalrule" data-block-type="47"><div class="sqs-block-content"><hr></div></div>');
		var courses = getCourses(courseLocationDiv.title, courseLocationDiv.id, data);
	    writeCourses(courseLocationDiv.id, courses);
	});
}

function getCourses(type, location, data) {
	var today = new Date();	

	// GET ALL UPCOMING CLASSES
    var filteredCourses = data.filter(function(course){
		start_date = new Date(course.start_date);
        return course.type === type && course.location === location && start_date.valueOf() >= today.valueOf();
    });

	// ADD THE MOST RECENT PAST COURSE
	var latestPastCourse = data.filter(function(course){
		start_date = new Date(course.start_date);
        return course.type === type && course.location === location && start_date.valueOf() < today.valueOf();
    });
	if(latestPastCourse.length !==0){
		filteredCourses.unshift(latestPastCourse[latestPastCourse.length - 1]);
	}
	
	return filteredCourses;
}


function writeCourses(divId, courses) {
	var courseLocationDiv = $("#" + divId);
	
	// LOOP THROUGH EACH COURSE
	for (var i = 0; i < courses.length; i++) {
		courseLocationDiv.append('<!-- Starting a course -->');
		var rowId = "course"+(i+1);
		courseLocationDiv.append('<div id="'+ divId + rowId+'" class="row sqs-row"></div>');  
        var courseRow = $('#' + divId + rowId);
		courseRow.append('<div id="left" class="col sqs-col-9 span-9"><div id="' + divId + rowId + '-leftSideContent" class="sqs-block-content"></div></div>');
		courseRow.append('<div id="right" class="col sqs-col-3 span-3"><div id="' + divId + rowId + '-rightSideContent" class="sqs-block-content"></div></div>')
		var leftSideContent = $('#' + divId + rowId + '-leftSideContent');
		var rightSideContent = $('#' + divId + rowId + '-rightSideContent');
		
		// DISPLAY CLASS DATES
        var startDate = new Date(courses[i].start_date);
        var endDate = new Date(courses[i].end_date);
        leftSideContent.append('<h2><span data-preserve-html-node="true" style="color:#36B3A8">' 
			+ monthArray[startDate.getMonth()] + " " + startDate.getDate() + numSuffixOf(startDate.getDate())  + " - " 
			+ monthArray[endDate.getMonth()] + " " + endDate.getDate() + numSuffixOf(endDate.getDate()) + '</span></h2>');
      		  
        // DISPLAY CLASS DAYS AND TIMES
        // vars to hold the start date info
        var startTime = new Date(courses[i].start_time);
		var startHour = (startTime.getUTCHours() + 16) % 24; //Converting to the correct timezone
        var startMin = startTime.getMinutes();
		
        // vars to hold the end date info
        var endTime = new Date(courses[i].end_time);
        var endHour = (endTime.getUTCHours() + 16) % 24; //Converting to the correct timezone
        var endMin = endTime.getMinutes();

		// add dates and times to HTML
        leftSideContent.append('<h3>' + courses[i].meeting_days + ' from ' 
			+ ((startHour + 11) % 12 + 1 ) + ":" + ((startMin<10?'0':'') + startMin) + (startHour >= 12 ? 'PM' : 'AM') + ' - ' 
			+ ((endHour + 11) % 12 + 1 ) + ":" + ((endMin<10?'0':'') + endMin) + (endHour >= 12 ? 'PM ' : 'AM ') + courses[i].time_zone + '</h3>');
        		
        // DISPLAY COURSE BULLETS
        leftSideContent.append('<ul id="' + divId + rowId + '-bullets" ></ul>');
		var courseBullets = $('#' + divId + rowId + '-bullets');
		
        // If it exists, add a skip date or two
        if(courses[i].skip_date_1 !== ""){
            var skipDateOne = new Date(courses[i].skip_date_1);
            courseBullets.append('<li><span data-preserve-html-node="true">' + "No Class on " + monthArray[skipDateOne.getMonth()] + " " 
				+ skipDateOne.getDate() + numSuffixOf(skipDateOne.getDate()) + '</span></li>');
        } 
        if(courses[i].skip_date_2 !== ""){
            var skipDateTwo = new Date(courses[i].skip_date_2);
            courseBullets.append('<li><span data-preserve-html-node="true">'+"No Class on "+monthArray[skipDateTwo.getMonth()] + " " 
				+ skipDateTwo.getDate() + numSuffixOf(skipDateTwo.getDate())+'</span></li>');
        }
        		
        // DISPLAY APPLICATION DEADLINE BULLETS
        var today = new Date();
		var seatsRemaining = Math.max(1, courses[i].capacity - courses[i].enrollments);
		
		// Only show application deadlines if they exist and the class hasnt started and there are seats remaining
        if(courses[i].deadline_1 !== "" && startDate.valueOf() >= today.valueOf() && seatsRemaining !== 0 ){
			
			// Display deadline 1 if it is today or in the future
            var deadlineOne = new Date(courses[i].deadline_1);            
			if(deadlineOne.valueOf() >= today.valueOf()){
				courseBullets.append('<li><span data-preserve-html-node="true">' 
					+ "Applications must be submitted by "+ monthArray[deadlineOne.getMonth()] + " " + deadlineOne.getDate() + numSuffixOf(deadlineOne.getDate()));
			
			// Display deadlineTwo if deadlineOne has passed and deadlineTwo is today or in the future
			}else if(courses[i].deadline_2 !== ""){
                var deadlineTwo = new Date(courses[i].deadline_2);
                if(deadlineTwo.valueOf() >= today.valueOf()){
                	courseBullets.append('<li><span data-preserve-html-node="true">' 
						+ "Applications must be submitted by " + monthArray[deadlineTwo.getMonth()] + " " + deadlineTwo.getDate() + numSuffixOf(deadlineTwo.getDate()));
                }
                
            }
        }
		        
        // DISPLAY INFORMATION ABOUT AVAILABLE SEATS        
		// Create button if seats remain and start date has not passed
		if(seatsRemaining > 0 && startDate.valueOf() >= today.valueOf()){
			rightSideContent.append('<div class="sqs-block button-block sqs-block-button" data-block-type="53"><div id="' + divId + rowId + '-topSection" class="sqs-block-content"></div></div>');
			var topSection = $('#' + divId + rowId + '-topSection'); 
			topSection.append('<div id="' + divId + rowId + '-buttonContainer" class="sqs-block-button-container--center" data-alignment="center" data-button-size="medium"/>');
			var buttonContainer = $('#' + divId + rowId + '-buttonContainer'); 
			buttonContainer.append('<a href="/apply" class="sqs-block-button-element--medium sqs-block-button-element" data-initialized="true">Apply Now</a>');
			
			// Display number of remaining seats
			rightSideContent.append('<div class="sqs-block markdown-block sqs-block-markdown" data-block-type="44"><div id="' + divId + rowId + '-bottomSection" class="sqs-block-content"></div></div>');
			var bottomSection = $('#' + divId + rowId + '-bottomSection'); 
			bottomSection.append('<h3><center data-preserve-html-node="true">' + seatsRemaining + ((seatsRemaining === 1) ? ' Seat Left' : ' Seats Left') + '</center></h3>');
			
		// Otherwise, add text that the class was sold out	
        }else{            
            rightSideContent.append('<h2>&nbsp;</h2><h3 id="' + divId + rowId + '-soldOutHeader"></h3>');
			var soldOutHeader = $('#' + divId + rowId + '-soldOutHeader');
			soldOutHeader.append('<center data-preserve-html-node="true" style="font-family:proxima-nova,Helvetica,Arial,sans-serif;font-size:20px">Sold Out</center>');	
        }
		
		// ADD AN HR IF THERE ARE MORE COURSES
        if(i < courses.length-1){
			courseLocationDiv.append('<div class="sqs-block markdown-block sqs-block-markdown" data-block-type="44" style="margin:32px 0"><div class="sqs-block-content"><hr></div></div>');
		}	
    }
	
	courseLocationDiv.append('<div class="sqs-block horizontalrule-block sqs-block-horizontalrule" data-block-type="47"><div class="sqs-block-content"><hr></div></div>');
}


function numSuffixOf(i) {
	var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return "st";
    }
    if (j == 2 && k != 12) {
        return "nd";
    }
    if (j == 3 && k != 13) {
        return "rd";
    }
    return "th";
}

$( document ).ready(function(){
    $.getJSON(spreadSheet, processClassInfo);
});