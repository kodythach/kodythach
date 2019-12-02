/*
 File: script.js
 91.461 Assignment 7: Using the jQuery Validation Plugin with Your Dynamic Table
 Kody Thach, UMass Lowell Computer Science, kody_thach@student.uml.edu
 Copyright (c) 2019 by Kody Thach. All rights reserved. May be
freely
 copied or excerpted for educational purposes with credit to the
author.
 modified by KT on December 01, 2019 at 6:51 PM

This javascript file is responsible for gathering the necessary form
input values in order to generate a multiplication table on the HTML
page upon pressing the generate button on the HTML page.
*/


/*
 * Created form validation for input_form
 */
$('#input_form').validate({
	// Requirements rules created for an input to be entered
	rules: {
		bStartNum: {
			required: true
		},
		eStartNum: {
			required: true
		},
		bLastNum: {
			required: true
		},
		eLastNum: {
			required: true
		}
	},
	// Custom error messages
	messages: {
		bStartNum: {
		  required: "ERROR: Please input a beginning starting number."
		},
		eStartNum: {
		  required: "ERROR: Please input a ending starting number."
		},
		bLastNum: {
		  required: "ERROR: Please input a beginning last number."
		},
		eLastNum: {
		  required: "ERROR: Please input a ending last number."
		}
	},

	// Upon submission of the button 'Generate Table', will it generate a table
    submitHandler: function() {
		generateTable();
		return false;
	},

	// what the error should be formatted inside of
	errorElement: "div",
});

/* 
 * Generates a multiplication table once the user clicks on the generate button
 */
function generateTable() {
	// parse integer values from input value
	var bStartNumVal = parseInt($('#bStartNum').val());
	var eStartNumVal = parseInt($('#eStartNum').val());
	var bLastNumVal = parseInt($('#bLastNum').val());
	var eLastNumVal = parseInt($('#eLastNum').val());
	$('#warning').empty();

	// check if beginning start num is bigger than ending start num then swap numbers to create table
	if (bStartNumVal > eStartNumVal) {
		$('#warning').append('<p>Swapped beginning and ending starting numbers to make table</p>')
		var tmp = bStartNumVal;
		bStartNumVal = eStartNumVal;
		eStartNumVal = tmp;
	}

	// check if beginning last num is bigger than ending last num then swap numbers to create table
	if (bLastNumVal > eLastNumVal) {
		$('#warning').append('<p>Swapped beginning and ending last numbers to make table</p>')
		var tmp = bLastNumVal;
		bLastNumVal = eLastNumVal;
		eLastNumVal = tmp;
	}

	// initialize table inside div with id="content"
	$('#content').html('<div id="tableContent"><table cellpadding="5px" align="center" id="multTable"></table></div>');
	
	// initialize first row of table to increment from beginning start num to ending start num
	var rows = '<tr><th></th>';
	for (let i = bStartNumVal; i <= eStartNumVal; i++) {
		rows += '<th>' + i + '</th>';
	}
	rows += '</tr>';

	var count = 0; // total number of elements; for styling the product box

	// for every num from beginning last num to ending last num, initialize the current num and create multiplication products
	for (let i = bLastNumVal; i <= eLastNumVal; i++) {
		rows += '<tr><td style="background-color: black; color: white;"><b>' + i + '</b></td>';
		// handle product calculation here
		for (let j = bStartNumVal; j <= eStartNumVal; j++) {
			// check if the total number of counts is an even or odd number
			if (count % 2 == 0) {
				rows += '<td>' + i*j + '</td>';
			} else {
				// attach odd class to table element to change its color
				rows += '<td class="odd">' + i*j + '</td>';
			}
			count += 1;
		}
		rows += '</tr>';
	}

	// fill table with calculated rows
	$('#multTable').html(rows);
}