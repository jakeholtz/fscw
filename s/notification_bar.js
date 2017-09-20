// variable of the JSON for the spread sheet
var spreadSheet = 'https://script.google.com/macros/s/AKfycbwlRIzEdpph6dy6MlXSH4nf8E7XdcMp4I2dh7QDFOJzJRqNMss/exec'; // LIVE DATA
//var spreadSheet = 'https://script.google.com/macros/s/AKfycbzpWvBZFYqd8G0HT7iwdiGEOojA7bpAbQBf1tqIRdz_9y75vd8/exec'; // TEST DATA
var courseLocation = 'ONL';
var courseType = 'Intro to Coding (JS)';


// UPDATE THE ANNOUNCEMENT BAR
function updateAnnouncementBar(data){
	var today = new Date();
	today = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Remove the time
	
	// Get upcoming courses
	var upcomingCourses = data.filter(function(course){
		start_date = new Date(course.start_date);		
        return course.type === courseType && course.location === courseLocation && start_date > today;
    });
	
    // Sort the courses by date
	upcomingCourses.sort(function (a, b) {
	  var startA = new Date(a.start_date);
	  var startB = new Date(b.start_date);
	  
	  if (startA < startB) {
	  	return -1;
	  }
	  if (startA > startB) {
	    return 1;
	  }
	  
	  return 0;  // names must be equal
	});
	
	// Get the next course
	var nextCourse = upcomingCourses[0];
	if (nextCourse === undefined){
		return;
	}	
	
	// Get the next deadline	
	var deadlineDate = undefined;
	if (nextCourse.deadline_1 !== "" && new Date(nextCourse.deadline_1) >= today) {
		deadlineDate = new Date(nextCourse.deadline_1);
		
	} else if (nextCourse.deadline_2 !== "" && new Date(nextCourse.deadline_2) >= today){
		deadlineDate = new Date(nextCourse.deadline_2);
	}

	var daysRemaining = deadlineDate ? Math.floor((deadlineDate.getTime() - today.getTime())/(24*60*60*1000)) : -1;
	var seatsRemaining = Math.max(1, nextCourse.capacity - nextCourse.enrollments);
	var city = courseLocation === 'BOS' ? "Boston" : courseLocation === 'NYC' ? "New York" : courseLocation === 'SF' ? "San Francisco" : courseLocation === 'SV' ? "Silicon Valley" : "online"	
	$( "a.sqs-announcement-bar-url" ).replaceWith( '<a class="sqs-announcement-bar-url" target="_blank" href="/apply"></a>' );
	
	if (deadlineDate && daysRemaining === 0 ){
		$('.sqs-announcement-bar-text').html( '<p>Today is the last day to apply for the next ' + city + ' class. <u>Apply Now</u>!</p><span class="sqs-announcement-bar-close"></span>');
	} else if(deadlineDate && daysRemaining > 0 &&  daysRemaining < 7){
		$('.sqs-announcement-bar-text').html( '<p>Only ' + daysRemaining + (daysRemaining === 1 ? ' day': ' days') + ' left to apply for the next ' + city + ' class. <u>Apply Now</u>!</p><span class="sqs-announcement-bar-close"></span>');
    } else {
		$('.sqs-announcement-bar-text').html( '<p>Only ' + seatsRemaining + (seatsRemaining === 1 ? ' seat': ' seats') + ' remaining for the next ' + city + ' class. <u>Apply Now</u>!</p><span class="sqs-announcement-bar-close"></span>');
    }
	$('.sqs-announcement-bar-content' ).slideDown( "slow");
	
}


// RUN WHEN PAGE LOADS
$( document ).ready(function(){	

	// Update course location based on user's location
	$.get('https://ipapi.co/region_code/', function(state){
		switch(state){
			case 'MA':
			case 'NH':
			case 'RI':	
				courseLocation = 'BOS';
				break;
				
			case 'NY':
			case 'NJ':
			case 'CT':
				courseLocation = 'NYC';
				break;
				
			case 'CA':
				$.get('https://ipapi.co/city/', function(city){
					if(city === "San Jose" || city === "Mountain View" || city === "Santa Clara"){
						courseLocation = 'SV';
					} else {
						courseLocation = 'SF';
					}
				});
				break;
				
			default:
				courseLocation = 'ONL';
		}
		
		// Get JSON course data, filter to next course and update notification based on location
		$.getJSON(spreadSheet, updateAnnouncementBar);
	});
});
