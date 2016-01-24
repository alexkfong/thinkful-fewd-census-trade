$(document).ready(function() {

	// Begin by running API to get China data
	var chinaData = getCountryDataAPI( 'china' );

	//button is clicked
	$('#navbarInterface').on( 'click', 'li', function(event) {

		// parse event id string for country name
		var countryName = event.target.id.substr(6);
		
		// pass which button is to a function that runs API
		// and gets country data
		var countryData = getCountryDataAPI( countryName );

		// Data received, update the DOM

	});

});

function getCountryDataAPI( countryName ) {

	return 0;

};