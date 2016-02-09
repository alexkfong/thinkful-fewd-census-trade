$(document).ready(function() {

	//button is clicked
	$('#navbarInterface').on( 'click', 'li', function(event) {

		clearDOM();

		// parse event id string for country name
		var countryRequested = event.target.id.substr(6).toLowerCase();

		// pass the string to a function that runs API
		// and gets country data
		getCountryDataAPI( countryRequested );
		getCountryDataAPI( 'china' );

	});

});

// data is displayed within a div per country.
// this function determines which country is being displayed
// and then appends it with the appropriate HTML
// into the appropriate section in the DOM
function prepareDataDOM( country ) {

	var results = $('.templates .dataCountry').clone();
	
	if( country == 'china' ) {
		results.attr( 'id', 'chinaData' );
	} 
	else {
		results.attr( 'id', 'selectedCountry' );
	}
		
	results.find( 'h2' ).text( country );
	$( '#dataSection' ).append( results );

};

// meant to loop to build out data.
function buildDataWrapperDOM ( data, countryRequested, actualData ) {

	var results = $( '.templates .dataDiv' ).clone();
	var dataID = countryRequested + data.slice(0,-4).toLowerCase();
	var whichDIV;

	switch( data.slice(0,-4) ) {
		case 'IMPALL':
			results.attr('id', dataID );
			results.find( '.dataName' ).text( 'Imports ');
			break;
		case 'IMPMANF':
			results.attr('id', dataID );
			results.find( '.dataName' ).text( 'Manufactured imports');
			break;
		case 'EXPALL':
			results.attr('id', dataID );
			results.find( '.dataName' ).text( 'Exports');
			break;
		case 'EXPMANF':
			results.attr('id', dataID );
			results.find( '.dataName' ).text( 'Manufactured exports');
			break;
	}
	
	if( countryRequested == 'china' ) {
		$( '#dataSection' ).find( '#chinaData' ).append( results );	
		whichDiv = '#chinaData';
	}
	else {
		$( '#dataSection' ).find( '#selectedCountry' ).append( results );
		whichDiv = '#selectedCountry';
	}

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

	getCountryDataAPIjson( censusURL, censusCountryCode, censusAPIKey, censusDataQueries );
	
};

// actually makes request for JSON here.
function getCountryDataAPIjson ( censusURL, censusCountryCode, censusAPIKey, censusDataQueries ) {

	var completeQuery = censusURL + censusDataQueries.importsAll + censusDataQueries.importsManf + censusDataQueries.exportsAll + censusDataQueries.exportsManf + censusCountryCode.countryURL + censusAPIKey;

	var queryResult = $.getJSON( completeQuery, function( data ) {
	
		console.log('Query in progress.');
	
	})
	.done( function( data ) {

		prepareDataDOM( data[1][ censusDataQueries.totalYears * 4 ].toLowerCase() );

		// loop through data, which is four data sets of five pieces of data
		for( var i=0; i<4; i++ ) {

			// build a class with two arrays
			var actualResults = new function() {
				this.dollarValue = {};
				this.year = {};
			};

			// loop through the set of data for one category
			for( var k=0; k<censusDataQueries.totalYears; k++) {
				
				actualResults.dollarValue[k] = data[1][(i*4)+(k+i)];
				actualResults.year[k] = data[0][(i*4)+(k+i)].substr( data[0][(i*4)+(k+i)].length - 4 );
			
			}

			buildDataWrapperDOM( data[0][censusDataQueries.totalYears * i], data[1][ censusDataQueries.totalYears * 4 ].toLowerCase(), actualResults );

		}
	
	})
	.fail( function() {
	
		console.log('Error: Fail');
		clearDOM();

		// push an error message to the DOM
	
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