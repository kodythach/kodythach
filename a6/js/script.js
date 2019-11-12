/*
 File: script.js
 91.461 Assignment 6: Creating an Interactive Dynamic Table
 Kody Thach, UMass Lowell Computer Science, kody_thach@student.uml.edu
 Copyright (c) 2019 by Kody Thach. All rights reserved. May be
freely
 copied or excerpted for educational purposes with credit to the
author.
 created by KT on November 09, 2019 at 12:00 AM

This javascript file is responsible for gathering the necessary form
input values in order to generate a multiplication table on the HTML
page upon pressing the generate button on the HTML page.
*/

// initialize and obtain tags as JS objects
var bStartNum = document.getElementById('bStartNum');
var eStartNum = document.getElementById('eStartNum');
var bLastNum = document.getElementById('bLastNum');
var eLastNum = document.getElementById('eLastNum');
var content = document.getElementById('content');

/* 
 * Generates a multiplication table once the user clicks on the generate button
 */
function generateTable() {
	// checks if the user's inputs are a numeric value using regex
	if (/[a-zA-Z]/.test(bStartNum.value) || /[a-zA-Z]/.test(eStartNum.value) || /[a-zA-Z]/.test(bLastNum.value) || /[a-zA-Z]/.test(eLastNum.value)) {
		// if not numeric inputs, display error telling user to enter a numeric value
		document.getElementById('content').innerHTML = '<div id="error"><p>Error: Inputs should be a numeric value</p></div>';
		return;
	}

	// checks if any of the user's inputs are empty
	if (!bStartNum.value.trim().length || !eStartNum.value.trim().length || !bLastNum.value.trim().length || !eLastNum.value.trim().length) {
		// if not numeric inputs, display error telling user that no input should be empty
		document.getElementById('content').innerHTML = '<div id="error"><p>Error: No input should be empty</p></div>';
		return;
	}

	// parse integer values from input value
	var bStartNumVal = parseInt(bStartNum.value);
	var eStartNumVal = parseInt(eStartNum.value);
	var bLastNumVal = parseInt(bLastNum.value);
	var eLastNumVal = parseInt(eLastNum.value);

	// check if beginning start num is bigger than ending start num
	if (bStartNumVal > eStartNumVal) {
		document.getElementById('content').innerHTML = '<div id="error"><p>Error: Beginning Start Num cannot be bigger than ending Start Num</p></div>';
		return;
	}

	// check if beginning last num is bigger than ending last num
	if (bLastNumVal > eLastNumVal) {
		document.getElementById('content').innerHTML = '<div id="error"><p>Error: Beginning Last Num cannot be bigger than ending Last Num</p></div>';
		return;
	}

	// initialize table inside div with id="content"
	content.innerHTML = '<div id="tableContent"><table cellpadding="5px" align="center" id="multTable"></table></div>';
	
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
	document.getElementById('multTable').innerHTML = rows;
}