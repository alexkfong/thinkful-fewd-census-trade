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
// and builds out the wrapper div for the country.
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

// now that the country wrapper div exists, this function
// populates it. It takes one data type at a time,
// creates a wrapper DIV for the data,
// and then inserts the actual data one entry at a time.
function buildDataWrapperDOM ( data, countryRequested, actualData ) {

	// clone the div that wraps a data set
	var results = $( '.templates .dataDiv' ).clone();
	
	// Object contains variables that are 
	// determined by which country is currently being displayed
	var countryDOM = {
		whichDiv: '',
		whichColor: ''
	};

	// create a unique ID name for the div that wras a single data set
	var dataID = countryRequested + data.slice(0,-4).toLowerCase();
	results.attr( 'id', dataID );

	// determine which data type we're using and then
	// prepare the appropriate HTML
	switch( data.slice(0,-4) ) {
		case 'IMPALL':
			results.find( '.dataName' ).text( 'Imports ');
			break;
		case 'IMPMANF':
			results.find( '.dataName' ).text( 'Manufactured imports');
			break;
		case 'EXPALL':
			results.find( '.dataName' ).text( 'Exports');
			break;
		case 'EXPMANF':
			results.find( '.dataName' ).text( 'Manufactured exports');
			break;
	}
	
	//now determine which country we're calling and select the 
	//appropriate color scheme and div naming convention
	if( countryRequested == 'china' ) {		
		countryDOM.whichDiv = '#chinaData';
		countryDOM.whichColor = 'backgroundRed';
	}
	else {
		countryDOM.whichDiv = '#selectedCountry';
		countryDOM.whichColor = 'backgroundBlue';
	}

	// Create on the DOM the container for data set
	$( '#dataSection' ).find( countryDOM.whichDiv ).append( results );	

	// Populate the data set with the data
	for( var i=0; i < actualData.year.length; i++ ) {
		
		var dataHTML = $( '.templates .dataUL' ).clone();
		var width = actualData.dollarValue[i] / 5000000000;
		var separatorsToAdd;
		var dollarValueParsed;
		
		// Ensure that something is displayed for even the smallest data
		if( width < 1 ) {
			width = 1;
		}

		dataHTML.find( '.dataYear' ).text( actualData.year[i] );
		dataHTML.find( '.barChart' ).attr( 'style', ('width:' + width + '%;' ) );
		
		// Add commas to the numbers
		dollarValueParsed = Math.round( actualData.dollarValue[i] / 1000000 ).toString();
		separatorsToAdd = Math.floor( dollarValueParsed / 3 );

		while( separatorsToAdd > 0 ) {

			if( (separatorsToAdd * 3) < dollarValueParsed.length ) {
				dollarValueParsed = dollarValueParsed.substr(0, dollarValueParsed.length - (3 * separatorsToAdd) ) + ',' + dollarValueParsed.substr( dollarValueParsed.length - (3 * separatorsToAdd ) );
			}
				
			separatorsToAdd--;

		}

		dataHTML.find( '.dataResult' ).text( dollarValueParsed );

		if( i==0 ) {
			dataHTML.find( '.barChart' ).attr( 'class', ( dataHTML.find( '.barChart' ).attr( 'class' ) + ' ' + countryDOM.whichColor ) );
		}
		else {
			dataHTML.find( '.barChart' ).attr( 'class', ( dataHTML.find( '.barChart' ).attr( 'class' ) + ' backgroundGray' ) );
		}

		$( '#dataSection' ).find( '#' + dataID ).find( '.dataList' ).append( dataHTML );

	}

};

// clears previously visualized data from prior API query
function clearDOM() {

	$( '#dataSection' ).empty();

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
				
				//the data value is stored here
				this.dollarValue = [];

				//the corresponding year is stored here.
				this.year = [];
			};

			// loop through the set of data for one category
			for( var k=0; k<censusDataQueries.totalYears; k++) {
				
				actualResults.dollarValue[k] = data[1][(i*4)+(k+i)];
				actualResults.year[k] = parseInt( data[0][(i*4)+(k+i)].substr( data[0][(i*4)+(k+i)].length - 4 ) );
			
			}

			buildDataWrapperDOM( data[0][censusDataQueries.totalYears * i], data[1][ censusDataQueries.totalYears * 4 ].replace(/\s/g, '').toLowerCase(), actualResults );

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
			countryCode = 3370;
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