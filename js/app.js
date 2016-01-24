$(document).ready(function() {

	// Begin by running API to get China data

	//button is clicked
	$('#navbarInterface').on( 'click', 'li', function(event) {

		// Interface test
		console.log( event.target.id );

		// pass which button is to a function that runs API
		// and gets country data

		// Data received, update the DOM

	});

});