var Tabs = {

  init: function() {
    this.bindUIfunctions();
    this.pageLoadCorrectTab();
  },

  bindUIfunctions: function() {
    // Delegation
	$(".transformer-tabs a[href^='\\#']").click(function(event) {
	  if ($(this).hasClass('active')) {
	    Tabs.toggleMobileMenu(event, this);
	  } else {
	    Tabs.changeTab(this.hash);
	  }
	  return false;
	});

  },

  changeTab: function(hash) {

    var anchor = $("[href=\\" + hash + "]");
    var div = $(hash);

    // activate correct anchor (visually)
    anchor.addClass("active").parent().siblings().find("a").removeClass("active");

    // activate correct div (visually)
    div.addClass("active").siblings().removeClass("active");

    // update URL, no history addition
    window.history.replaceState("", "", hash);

    // Close menu, in case mobile
    anchor.closest("ul").removeClass("open");

  },

  // If the page has a hash on load, go to that tab
  pageLoadCorrectTab: function() {
    this.changeTab(document.location.hash);
  },

  toggleMobileMenu: function(event, el) {
    $(el).closest("ul").toggleClass("open");
  }

}

$( document ).ready(function(){
    Tabs.init();
	
	// Set hash based on location
	$.get('https://ipapi.co/region_code/', function(state){
		switch(state){
			case 'MA':
			case 'NH':
			case 'RI':
				Tabs.changeTab('#bos');
				break;
				
			case 'NY':
			case 'NJ':
			case 'CT':
				Tabs.changeTab('#nyc');
				break;
				
			case 'CA':
				$.get('https://ipapi.co/city/', function(city){
					if(city === "San Jose" || city === "Mountain View" || city === "Santa Clara"){
						Tabs.changeTab('#sv');
					} else {
						Tabs.changeTab('#sf');
					}
				});
				break;
				
			default:
				Tabs.changeTab('#onl');
		}
	});
	
});
