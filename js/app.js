$(document).ready(function() {

	// Begin by running API to get China data
	var chinaData = getCountryDataAPI( 'china' );

	//button is clicked
	$('#navbarInterface').on( 'click', 'li', function(event) {

		// parse event id string for country name
		var countryRequested = event.target.id.substr(6).toLowerCase();

		// pass the string to a function that runs API
		// and gets country data
		var countryData = getCountryDataAPI( countryRequested );

		// Data received, update the DOM

	});

});

// Uses census international trade API to get data about countries
function getCountryDataAPI( countryRequested ) {

	var censusAPIKey = '9c47725855f7e2bfbcab42b2038bb795bb1ffe3c';
	var censusURL = 'http://api.census.gov/data/2014/intltrade/imp_exp?';
	var censusCountryCode = getCountryCodeAPI ( countryRequested );

	return 0;

};

// takes parsed string and returns codes for API
// including country name if API does not return country name
function getCountryCodeAPI ( countryRequested ) {

	var countryCode;
	var countryName;

	switch(countryRequested) {
		case 'australia':
			countryCode = 6021;
			countryName = 'Australia';
			break;
		case 'brunei':
			countryCode = 5610;
			countryName = 'Brunei';
			break;
		case 'canada':
			countryCode = 1220;
			countryName = 'Canada';
			break;
		case 'chile':
			coutryCode = 3370;
			countryName = 'Chile';
			break;
		case 'china':
			countryCode = 5700;
			countryName = 'China';
			break;
		case 'japan':
			countryCode = 5880;
			countryName = 'Japan';
			break;
		case 'malaysia':
			countryCode = 5570;
			countryName = 'Malaysia';
			break;
		case 'mexico':
			countryCode = 2010;
			countryName = 'Mexico';
			break;
		case 'newzealand':
			countryCode = 6141;
			countryName = 'New Zealand';
			break;
		case 'peru':
			countryCode = 3330;
			countryName = 'Peru';
			break;
		case 'singapore':
			countryCode = 5590;
			countryName = 'Singapore';
			break;
		case 'vietnam':
			countryCode = 5520;
			countryName = 'Vietnam';
			break;
	}

	return {
		countryCode: countryCode,
		countryName: countryName
	};
};