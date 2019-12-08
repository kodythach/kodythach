/*
 File: script.js
 91.461 Assignment 8: Using the jQuery UI Slider and Tab Widgets
 Kody Thach, UMass Lowell Computer Science, kody_thach@student.uml.edu
 Copyright (c) 2019 by Kody Thach. All rights reserved. May be
freely
 copied or excerpted for educational purposes with credit to the
author.
 modified by KT on December 08, 2019 at 3:57 PM

This javascript file is responsible for gathering the necessary form
input values in order to generate a multiplication table on the HTML
page upon changing the input values with a slider and even clicking on
a saved tab to display the table saved.
*/

var tables = {}; // holds the number of saved multiplication tables and their data
var tableCount = 0; // count of how many tables have been produced
var currentActiveTab = undefined; // holds which tab is active/clicked on
var maxNumber = 18; // max number to input multiplication table
var minNumber = -18; // min number to input multiplication table

/*
 * Created form validation for input_form
 */
$('#input_form').validate({
	// Requirements rules created for an input to be entered
	rules: {
		bStartNum: {
			min: minNumber,
			max: maxNumber,
			required: true
		},
		eStartNum: {
			min: minNumber,
			max: maxNumber,
			required: true
		},
		bLastNum: {
			min: minNumber,
			max: maxNumber,
			required: true
		},
		eLastNum: {
			min: minNumber,
			max: maxNumber,
			required: true
		}
	},
	// Custom error messages
	messages: {
		bStartNum: {
			min: "ERROR: Number is outside of range. Please enter a number between -18 and 18.",
			max: "ERROR: Number is outside of range. Please enter a number between -18 and 18.",
			required: "ERROR: Please input a beginning starting number."
		},
		eStartNum: {
			min: "ERROR: Number is outside of range. Please enter a number between -18 and 18.",
			max: "ERROR: Number is outside of range. Please enter a number between -18 and 18.",
			required: "ERROR: Please input a ending starting number."
		},
		bLastNum: {
			min: "ERROR: Number is outside of range. Please enter a number between -18 and 18.",
			max: "ERROR: Number is outside of range. Please enter a number between -18 and 18.",
			required: "ERROR: Please input a beginning last number."
		},
		eLastNum: {
			min: "ERROR: Number is outside of range. Please enter a number between -18 and 18.",
			max: "ERROR: Number is outside of range. Please enter a number between -18 and 18.",
			required: "ERROR: Please input a ending last number."
		}
	},

	// Upon submission of the button 'Save Table', will it generate a table
	submitHandler: function() {
		saveTable();
		return false;
	},

	// what the error should be formatted inside of
	errorElement: "div",
});

/* 
 * Generates a multiplication table based on the slider or text inputs
 */
function generateTableByInput() {
	// parse integer values from input value
	var bStartNumVal = parseInt($('#bStartNum').val());
	var eStartNumVal = parseInt($('#eStartNum').val());
	var bLastNumVal = parseInt($('#bLastNum').val());
	var eLastNumVal = parseInt($('#eLastNum').val());

	// check if each value is valid; if not then don't generate table
	if (bStartNumVal < minNumber || bStartNumVal > maxNumber)
		return;
	if (eStartNumVal < minNumber || eStartNumVal > maxNumber)
		return;
	if (bLastNumVal < minNumber || bLastNumVal > maxNumber)
		return;
	if (eLastNumVal < minNumber || eLastNumVal > maxNumber)
		return;
	generateTable(bStartNumVal, eStartNumVal, bLastNumVal, eLastNumVal, '#content', '#warning');
}

/* 
 * Generates a multiplication table based on the saved data of the tab clicked on
 */
function generateTableBySave(id) {
	generateTable(parseInt(tables[id][0]), parseInt(tables[id][1]), parseInt(tables[id][2]), parseInt(tables[id][3]), '#savedContent', '#savedWarning');
}

/*
 * Generates a multiplication table based on the inputs given
 * bStartNumVal: Beginning Start Number
 * eStartNumVal: Ending Start Number
 * bLastNumVal: Beginning Last Number
 * eLastNumVal: Ending Last Number
 * tablePlacement: Location of where to generate the multiplication table
 * warning: Location of where to append warning message
 */
function generateTable(bStartNumVal, eStartNumVal, bLastNumVal, eLastNumVal, tablePlacement, warning) {
	$(warning).empty();

	// check if beginning start num is bigger than ending start num then swap numbers to create table
	if (bStartNumVal > eStartNumVal) {
		$(warning).append('<p>Swapped beginning and ending starting numbers to make table</p>')
		var tmp = bStartNumVal;
		bStartNumVal = eStartNumVal;
		eStartNumVal = tmp;
	}

	// check if beginning last num is bigger than ending last num then swap numbers to create table
	if (bLastNumVal > eLastNumVal) {
		console.log(bLastNumVal);
		console.log(eLastNumVal);
		$(warning).append('<p>Swapped beginning and ending last numbers to make table</p>')
		var tmp = bLastNumVal;
		bLastNumVal = eLastNumVal;
		eLastNumVal = tmp;
	}

	// initialize table inside div with id="content"
	$(tablePlacement).html('<div id="tableContent"><table cellpadding="5px" align="center" id="multTable"></table></div>');
	
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
	$(tablePlacement).find('#multTable').html(rows);
}

/*
 * Saves the data of a multiplication table
 */
function saveTable() {
	// obtain values of each input
	var bStartNum = $("#bStartNum").val();
	var eStartNum = $("#eStartNum").val();
	var bLastNum = $("#bLastNum").val();
	var eLastNum = $("#eLastNum").val();

	// display the saved tab window
	$("#tab_window").css("display", "block");

	// append a tab to display in the list of tabs (up to 14)
	if (Object.keys(tables).length < 14 || tableCount === undefined) {
		tables[tableCount] = [bStartNum, eStartNum, bLastNum, eLastNum];
		$("#tab_list").append("<div class='tab active_tab' id=" + tableCount + "> \
			<span class='data' style='float: left;'>" + bStartNum + " to " + eStartNum + " by " + bLastNum + " to " + eLastNum + "</span> \
			<span class='removeTab'>×</span> \
		</div>");

		// empty table to display the new one
		$("#savedContent").empty();

		// change the active tab to the most recent tab being added
		if (currentActiveTab !== undefined)
			$("#"+currentActiveTab).removeClass("active_tab");

		// keep count of the new active tab
		currentActiveTab = tableCount.toString();

		//generate table by save and increment table count
		generateTableBySave(tableCount);
		tableCount++;
	}
}


/*
 * Function to initialize slider features
 */
function setSlider() {
	// Beginning Start Number Slider info
	$("#bStartNum").val(0); // initialize text input to 0
	// create slider features
	$("#bstartNumSlider").slider({
		min: minNumber,
		max: maxNumber,

		// on slide, change text input value
		slide: function(event, ui) {
		  $("#bStartNum").val(ui.value);
		  $("#input_form").validate().element("#bStartNum");
		  generateTableByInput();
		}
	});
	// set slider to change on text input change
	$("#bStartNum").on("keyup", function() {
		$("#bstartNumSlider").slider("value", this.value);
		generateTableByInput();
	});

	// Ending Start Number Slider info
	$("#eStartNum").val(0); // initialize text input to 0
	$("#estartNumSlider").slider({
		min: minNumber,
		max: maxNumber,

		// create slider features
		slide: function(event, ui) {
		  $("#eStartNum").val(ui.value);
		  $("#input_form").validate().element("#eStartNum");
		  generateTableByInput();
		}
	});
	// set slider to change on text input change
	$("#eStartNum").on("keyup", function() {
		$("#estartNumSlider").slider("value", this.value);
		generateTableByInput();
	});

	// Beginning Last Number Slider info
	$("#bLastNum").val(0); // initialize text input to 0
	$("#blastNumSlider").slider({
		min: minNumber,
		max: maxNumber,

		// create slider features
		slide: function(event, ui) {
		  $("#bLastNum").val(ui.value);
		  $("#input_form").validate().element("#bLastNum");
		  generateTableByInput();
		}
	});
	// set slider to change on text input change
	$("#bLastNum").on("keyup", function() {
		$("#blastNumSlider").slider("value", this.value);
		generateTableByInput();
	});

	// Ending Last Number Slider info
	$("#eLastNum").val(0); // initialize text input to 0
	$("#elastNumSlider").slider({
		min: minNumber,
		max: maxNumber,

		// create slider features
		slide: function(event, ui) {
		  $("#eLastNum").val(ui.value);
		  $("#input_form").validate().element("#eLastNum");
		  generateTableByInput();
		}
	});
	// set slider to change on text input change
	$("#eLastNum").on("keyup", function() {
		$("#elastNumSlider").slider("value", this.value);
		generateTableByInput();
	});
}

// listener to remove tab upon clicking exit '×'
$('#tab_list').on('click', '.removeTab', function() {
	// deletes data from tables
	delete tables[$(this).parent('div').attr('id')];

	// remove tab from tab list
	$(this).parent('div').remove();

	// if there exists no more tabs, then don't display tab window and clear table
	if (Object.keys(tables).length <= 0) {
		$("#tab_window").css("display", "none");
		$("#savedContent").empty();
	}
});

// listener for when clicking on a tab, set the active tab class to this tab
$('#tab_list').on('click', '.data', function() {
	// add active tab class to tab clicked on
	$(this).parent('div').addClass("active_tab");

	// remove active tab from previously active tab
	$('#'+currentActiveTab).removeClass('active_tab');

	// set new active tab
	currentActiveTab = $(this).parent('div').attr('id');

	// generate table by save
	generateTableBySave($(this).parent('div').attr('id'));
});


// clears all saved tabs
function clearSavedTabs() {
	tables = {};
	$('#tab_list').empty();
	$("#tab_window").css("display", "none");
	$("#savedContent").empty();
}

setSlider(); // initialize slider upon start of site
generateTableByInput(); // generate table by default slider inputs