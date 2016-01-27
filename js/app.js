$(document).ready(function() {

	//button is clicked
	$('#navbarInterface').on( 'click', 'li', function(event) {

		clearDOM();

		// parse event id string for country name
		var countryRequested = event.target.id.substr(6).toLowerCase();

		// pass the string to a function that runs API
		// and gets country data
		var countryData = getCountryDataAPI( countryRequested );
		var chinaData = getCountryDataAPI( 'china' );
		
		console.log( countryData.exportsAll[0] );

		// Data received, update the DOM
		showDataDOM( countryData, countryRequested );
		showDataDOM( chinaData, 'china' );

	});

});


function showDataDOM( data, country ) {

	// build the wrapper container for one country
	var results = $('.templates .dataCountry').clone();
	var containerElement = results.find( '.dataCountry' );
	
	if( country != 'china' ) {
		containerElement.attr( 'id', 'selectedCountry' );
	} 
	else {
		containerElement.attr( 'id', 'chinaData' );
	}
		
	results.find( 'h2' ).text( country );
	$( '#dataSection' ).append( results );

	buildDataDOM( data.importsAll, country );
	buildDataDOM( data.importsManf, country );
	buildDataDOM( data.exportsAll, country );
	buildDataDOM( data.exportsManf, country );

};

function buildDataDOM ( data, country ) {

	var results = $( '.templates .dataDiv' ).clone();

};

// clears previously visualized data from prior API query
function clearDOM() {

};

// Uses census international trade API to get data about countries
function getCountryDataAPI( countryRequested ) {

	var censusURL = 'http://api.census.gov/data/2014/intltrade/imp_exp?get=';
	var censusAPIKey = '&key=9c47725855f7e2bfbcab42b2038bb795bb1ffe3c';
	var censusCountryCode = getCountryCodeAPI ( countryRequested );
	
	// object contains query strings for four types of data
	var censusDataQueries = {
		importsAll: 'IMPALL2014,IMPALL2013,IMPALL2012,IMPALL2011,IMPALL2010,',
		importsManf: 'IMPMANF2014,IMPMANF2013,IMPMANF2012,IMPMANF2011,IMPMANF2010,',
		exportsAll: 'EXPALL2014,EXPALL2013,EXPALL2012,EXPALL2011,EXPALL2010,',
		exportsManf: 'EXPMANF2014,EXPMANF2013,EXPMANF2012,EXPMANF2011,EXPMANF2010,',
		totalYears: 5
	};
	
	// builds out our data object, which is four arrays. because of how the
	// census API returns its JSON, I've included the number of years.
	var data = {

		importsAll: getCountryDataAPIjson( censusURL + censusDataQueries.importsAll + censusCountryCode.countryURL + censusAPIKey ),
		importsManf: getCountryDataAPIjson( censusURL + censusDataQueries.importsManf + censusCountryCode.countryURL + censusAPIKey),
		exportsAll: getCountryDataAPIjson( censusURL + censusDataQueries.exportsAll + censusCountryCode.countryURL + censusAPIKey),
		exportsManf: getCountryDataAPIjson( censusURL + censusDataQueries.exportsManf + censusCountryCode.countryURL + censusAPIKey),
		country: countryRequested,
		totalYears: censusDataQueries.totalYears
	
	};

	return data;

};

// actually makes request for JSON here.
function getCountryDataAPIjson ( censusURL ) {

	var queryResult = $.getJSON( censusURL, function( data ) {
	
		console.log('Query in progress.');
	
	})
	.done( function( data ) {

		$.each( data, function () {

			console.log( this );
		
		});
	
	})
	.fail( function() {
	
		console.log('Error: Fail');
	
	});

	return queryResult;

};

// takes parsed string and returns codes for API
// including country name if API does not return country name
// I've decided to separate the langauge of the API query from the 
// API's code for the country to promote code reusability.
// The country schedule numbers are unlikely to change census
// to census, but the API may. 
function getCountryCodeAPI ( countryRequested ) {

	var countryCode; 
	var countryURL = 'COUNTRY&SCHEDULE=';
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

	countryURL += countryCode.toString();

	return {
		countryCode: countryCode,
		countryURL: countryURL,
		countryName: countryName
	};
};