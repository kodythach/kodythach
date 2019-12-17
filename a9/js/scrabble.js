/*
 File: js/scrabble.js
 91.461 Assignment 9: Implementing a Bit of Scrabble with Drag-and-Drop
 Kody Thach, UMass Lowell Computer Science, kody_thach@student.uml.edu
 Copyright (c) 2019 by Kody Thach. All rights reserved. May be
freely
 copied or excerpted for educational purposes with credit to the
author.
 modified by KT on December 16, 2019 at 10:54 PM

This javascript file is responsible for initializing the scrabble game by
appending the necessary elements and functions needed to carry out the game.
*/

// holds the distrubution data structure for the alphabet, their value, and amount of characters
var distribution = [];

// holds special tile attributes in the form of a JS object to be used as flags
var specials = {
    'normal': 0,
    'double_word': 1,
    'double_letter': 2
};

var strip_tile_word = []; // array of letter tiles placed in the scrabble strip
var dictionary = {}; // dictionary to hold all the words for scrabble
var current_score = 0; // current score the user accumulated
var additional_score = 0; // the possible score to add to the current score
var double_word_score = false; // flag to know if the user is legible for 2x the score of a valid word
var word_to_submit = ''; // valid word to submit to obtain an additional score
var is_valid_word = false; // flag to be used in areas where the word must be valid
var tiles_on_hand = 0; // number of tiles the user has on hand

/* obtains the total amount of tiles left in the distribution */
function getNumberOfTiles() {
    var total_amount = 0;
    for (let tile = 0; tile < distribution.length; tile++) {
        total_amount += distribution[tile].amount;
    }
    return total_amount;
}

/* generate tiles in the tile rack */
function generateTiles() {
    // obtains total amount of tiles left
    var total_amount = getNumberOfTiles();

    // generate 7 tiles from 27 possible tiles in distribution
    for (let i = tiles_on_hand; i < 7; i++) {
        // if there isn't anymore tiles left, don't try to generate more
        if (total_amount < 0) {
            alert('Out of tiles');
            break;
        }
        // random number to generate tile
        let random = Math.floor(Math.random() * 27);

        // if random number is a tile that has no amount left, choose another random number
        while (distribution[random].amount <= 0) {
            random = Math.floor(Math.random() * 27);
        }
        
        total_amount -= 1; // decrement total amount of tiles
        tiles_on_hand++; // increment number of tiles in hand
        
        // if letter generated is a blank tile, have tile be known as 'Blank', else just the letter itself
        let letter = distribution[random].letter === '_' ? 'Blank' : distribution[random].letter;

        // append tile to tile list in tile rack in the form of an img
        $("#tile_list").append("<img class='tile' id='" + letter + "' value=" + distribution[random].value + "\
                                src='img/characters/Scrabble_Tile_" + letter + ".jpg'></img>");
    }
}

/* show dialog to display a list of tiles to replace the blank tile in scrabble strip */
function showBlankTileDialog(current_slot) {
    // append dialog div
    $('#dialog').append('<div id="blank_tile_dialog" title="Choose a character"> \
                         </div>');
    
    // generate the alphabetical tiles inside the dialog
    for (let i = 0; i < 26; i++) {
        let letter = distribution[i].letter;
        $("#blank_tile_dialog").append("<img class='sub_letter_tile' id='" + letter + "' value=" + distribution[i].value + " \
                                        src='img/characters/Scrabble_Tile_" + letter + ".jpg'></img>");
    }

    // add a clickable function for the tiles inside the dialog box
    $('.sub_letter_tile').click(function(event) {
        // substitute blank character for letter
        let special_value = $(event.toElement).attr('value'); // value of tile affected by where it is in the scrabble strip slot

        // replace the blank tile inside the scrabble strip with a substituted tile from the dialog options
        $(current_slot).html(`<img class="placed_tile" id="${event.toElement.id}" slot="${$(current_slot).context.slot}" value="${$(event.toElement).attr('value')}" special_value =${special_value} blank="true" src="${event.toElement.src}"></img>`);
        $('#blank_tile_dialog').dialog('close'); // close dialog once done

        setPlacedTileDraggable(); // sets tiles that are placed to be draggable

        // stores letter data inside strip tile word data structure to be used in word and score counter display
        strip_tile_word[$(current_slot).context.slot].letter = event.toElement.id;

        // checks if the tile is going to be placed in a special tile
        if (strip_tile_word[$(current_slot).context.slot].special === specials.double_letter)
            special_value *= 2; // multiple by 2 if tile is on double letter score tile
        if (strip_tile_word[2].letter !== "" || strip_tile_word[12].letter !== "")
            double_word_score = true; // set to true to later multiply word score by 2
        else
            double_word_score = false;

        // stores value data inside strip tile word data structure to be used in word and score counter display
        strip_tile_word[$(current_slot).context.slot].value = parseInt(special_value);
        getCurrentWord();
    });

    // sets div to be a dialog to display
    $('#blank_tile_dialog').dialog({ 
        minWidth: 800,
        closeOnEscape: false,
        dialogClass: 'no-close',
        close: function(event, ui) 
        { 
            // close and remove dialog once done to prevent clutter in html
            $(this).empty();
            $(this).remove();
        }
    });
}

/* Generates strip tile dimensions in scrabble strip*/
function generateStripTiles() {
    // empty scrabble strip to make sure its on a clean slate
    $("#scrabble_strip").empty();

    // generate tile strips
    for (let i = 0; i < 15; i++) {
        // push data inside data structure
        strip_tile_word.push({ 'letter': '', 'special': specials.normal, 'value': 0 });
        var strip_tile_length = strip_tile_word.length;

        // sets tiles to be special if it is a special tile from the image
        if (strip_tile_length  === 3)
            strip_tile_word[i].special = specials.double_word;
        else if (strip_tile_length === 7)
            strip_tile_word[i].special = specials.double_letter;
        else if (strip_tile_length === 9)
            strip_tile_word[i].special = specials.double_letter;
        else if (strip_tile_length === 13)
            strip_tile_word[i].special = specials.double_word;
        
        // append an empty slot to the strip
        $("#scrabble_strip").append('<div class="strip_tile racked" \
                                     slot="' + i.toString() + '"></div>');
    }
}

/* makes tiles in tile rack draggable */
function makeTilesDraggable() {
    $('.tile').draggable({
        start: function(event, ui) {
            // triggers revert event on invalid areas
            $(this).draggable("option", "revert", "invalid");
        },
        revertDuration: 100 // how long it takes to revert tile back to original position
    });
}

/* Initializes data structure */
function initialize_distribution() {
    // Data structure from Ramon Meza's JSON file
    distribution = [
        {"letter":"A", "value":1,  "amount":9},
        {"letter":"B", "value":3,  "amount":2},
        {"letter":"C", "value":3,  "amount":2},
        {"letter":"D", "value":2,  "amount":4},
        {"letter":"E", "value":1,  "amount":12},
        {"letter":"F", "value":4,  "amount":2},
        {"letter":"G", "value":2,  "amount":3},
        {"letter":"H", "value":4,  "amount":2},
        {"letter":"I", "value":1,  "amount":9},
        {"letter":"J", "value":8,  "amount":1},
        {"letter":"K", "value":5,  "amount":1},
        {"letter":"L", "value":1,  "amount":4},
        {"letter":"M", "value":3,  "amount":2},
        {"letter":"N", "value":1,  "amount":6},
        {"letter":"O", "value":1,  "amount":8},
        {"letter":"P", "value":3,  "amount":2},
        {"letter":"Q", "value":10, "amount":1},
        {"letter":"R", "value":1,  "amount":6},
        {"letter":"S", "value":1,  "amount":4},
        {"letter":"T", "value":1,  "amount":6},
        {"letter":"U", "value":1,  "amount":4},
        {"letter":"V", "value":4,  "amount":2},
        {"letter":"W", "value":4,  "amount":2},
        {"letter":"X", "value":8,  "amount":1},
        {"letter":"Y", "value":4,  "amount":2},
        {"letter":"Z", "value":10, "amount":1},
        {"letter":"_", "value":0,  "amount":2}
    ];
}


/* submits word to receive an additional score if word is valid */
function submit() {
    // check if word is valid
    if (is_valid_word) {
        // add score to current score
        current_score += additional_score;

        // clear data of tiles inside strip
        strip_tile_word = [];

        // reset word counter
        $('#word_counter').text("Word: ");

        // close blank tile dialog if it exists
        try {
            $('#blank_tile_dialog').dialog('close');
        } catch(e) {} // do nothing and continue program if it doesn't exist

        // reset score counter
        $('#score_counter').text('Score: ' + current_score.toString());

        // remove tiles used from hand
        tiles_on_hand -= word_to_submit.length;

        // remove tiles used from distribution data structure
        for (let w = 0; w < word_to_submit.length; w++) {
            var current_char = word_to_submit[w];
            for (let d = 0; d < distribution.length; d++) {
                if (distribution[d].letter === current_char)
                    distribution[d].amount--;
            }
        }

        // disable submit button after submitting
        $('#submitBtn').prop('disabled', true);

        // reset flags
        double_word_score = false;
        is_valid_word = false;

        // reinitiate scrabble, except don't reset distribution
        initiateScrabble(true);
    }
}

/* completely restart the scrabble game */
function restart() {
    $('#tile_list').empty(); // empty tiles in tile rack
    tiles_on_hand = 0; // reset tiles on hand
    current_score = 0; // reset score
    strip_tile_word = []; // clear data of tiles inside strip

    // reset word counter
    $('#word_counter').text("Word: ");

    // close blank tile dialog if it exists
    try {
        $('#blank_tile_dialog').dialog('close');
    } catch(e) {} // do nothing and continue program if it doesn't exist

    // reset score counter
    $('#score_counter').text('Score: ' + current_score.toString());

    // reset flag
    double_word_score = false;

    // disable submit button if not already disabled
    $('#submitBtn').prop('disabled', true);

    // reinitiate scrabble and distribution
    initiateScrabble(false);
}

// set tiles inside of scrabble strip to be draggable
function setPlacedTileDraggable() {
    $('.placed_tile').draggable({
        start: function(event, ui) {
            // makes it so when you're dragging tile back to tile rack, it will be moving inside the correct div to place it back
            // instead of moving it inside the tiles inside the tile rack
            $(this).css("z-index", 1);

            // triggers revert event on invalid areas
            $(this).draggable("option", "revert", "invalid");
        },
        revertDuration: 100 // how long it takes to revert tile back to original position
    });
}

/* 
 * Obtains dictionary info
 * src of dictionary info from: https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt
 * src of ajax request seen from: http://yongcho.github.io/GUI-Programming-1/assignment9.html
 * as given by professor on piazza
 */
function getDictionary() {
    $.ajax({
        url: "https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt",
        success: function(result) {
          var words = result.split("\n"); // obtain array of words
      
          // add words to the dictionary, to allow for easier and fast word search
          // similar manner as if we were to use a hashmap
          for (var i = 0; i < words.length; ++i) {
            dictionary[words[i].toUpperCase()] = true;
          }
        }
      });
}

/* Initiates scrabble board */
function initiateScrabble(wasSubmit) {
    // if coming after pressing submit button, don't re-initialize distribution unless user restarts game
    if (!wasSubmit)
        initialize_distribution();

    getDictionary(); // obtain dictionary info
    generateTiles(); // generate new tiles in tile rack
    generateStripTiles(); // generate strip tiles inside scrabble strip
    makeTilesDraggable(); // make tiles inside tile rack draggable

    // initializes tile counter display
    $('#tile_counter').text('Tiles left: ' + getNumberOfTiles().toString());

    // gives tiles inside scrabble strip drop events
    $('.strip_tile').droppable({
        drop: function( event, ui ) {
            // checks to see if scrabble slot in scrabble strip is empty
            if (strip_tile_word[event.target.slot].letter === "") {
                // removes strip tile data if moving from one strip slot to another strip slot
                if (event.toElement.className.startsWith('placed_tile')) {
                    strip_tile_word[event.toElement.slot].letter = '';
                    strip_tile_word[event.toElement.slot].value = 0;
                }

                // remove element that's being dragged
                $(event.toElement).remove();

                // if element is blank, display dialog to pick a substitute tile in its place
                if (event.toElement.id === "Blank") {
                    showBlankTileDialog(this);
                    strip_tile_word[event.target.slot].letter = event.toElement.id;
                } else {
                    // add tile into strip slot
                    let special_value = $(event.toElement).attr('value'); // holds value of tile
                    if (strip_tile_word[event.target.slot].special === specials.double_letter)
                        special_value *= 2; // multiply value by 2 if tile is placed in special slot
                    
                    // append img element to scrabble strip
                    $(this).html(`<img class="placed_tile" id="${event.toElement.id}" value="${$(event.toElement).attr('value')}" special_value =${special_value} slot="${event.target.slot}" src="${event.toElement.src}"></img>`);
                    strip_tile_word[event.target.slot].letter = event.toElement.id; // set new letter data inside scrabble strip data structure
                    strip_tile_word[event.target.slot].value = parseInt(special_value); // set new value data inside scrabble strip data structure

                    // check if tile is placed inside a double word score tile and set flag if true
                    if (strip_tile_word[2].letter !== "" || strip_tile_word[12].letter !== "")
                        double_word_score = true;
                    else
                        double_word_score = false;
                    getCurrentWord(); // update word counter
                }
                setPlacedTileDraggable(); // set tiles inside scrabble strip to be draggable
            } else {
                // else put back tile in original position if scrabble strip slot is occupied
                ui.draggable.animate(ui.draggable.data().uiDraggable.originalPosition,"fast");
            }
        }
    });

    // adds drop events inside tile rack; basically put tiles back from being in scrabble strip
    $('#tile_holder').droppable({
        accept: ".placed_tile", // accept only tiles from the scrabble strip
        drop: function( event, ui ) {
            try {
                // clear data from scrabble strip slot
                strip_tile_word[event.toElement.slot].letter = '';
                strip_tile_word[event.toElement.slot].value = 0;

                $(event.toElement).remove(); // remove element being dragged

                // if a blank tile that was substituted is being added back to tile rack, add it back as a blank tile
                if ($(event.toElement).attr('blank') === 'true') {
                    $(this).children().append(`<img class="tile" id="Blank" slot="${event.target.slot}" value="${$(event.toElement).attr('value')}" src="img/characters/Scrabble_Tile_Blank.jpg"></img>`);    
                }
                else {
                    // else just put back the letter tile
                    $(this).children().append(`<img class="tile" id="${event.toElement.id}" value="${$(event.toElement).attr('value')}" src="${event.toElement.src}"></img>`);
                }
                getCurrentWord(); // update word counter
            } catch (e) {
                // do nothing in case of errors
            }
            makeTilesDraggable(); // make tiles inside tile rack draggable
        }
    });
}

/* calculate score and update score counter */
function calculateScore(current_word) {
    additional_score = 0; // reset additional score value

    // iterate strip_word_tile to get total value from letters in word
    for (let i = 0; i < strip_tile_word.length; i++)
        additional_score += strip_tile_word[i].value;
    if (double_word_score)
        additional_score *= 2; // multiply word score by 2 if tile was placed in a double word score tile
    
    // update score counter
    $('#score_counter').text('Score: ' + current_score.toString() + ' (+' + additional_score + ')');
}

/* checks to make sure if the word is valid within the dictionary */
function checkValidWord(current_word) {
    if (dictionary[current_word] === true) {
        is_valid_word = true; // set flag to true
        // enable submit button
        $('#submitBtn').prop('disabled', false);
        // calculate new score
        calculateScore(current_word);
        // update word counter
        $('#word_counter').text("Word: " + current_word + " (Valid)");
    } else {
        is_valid_word = false; // set flag to false
        // update score counter
        $('#score_counter').text('Score: ' + current_score.toString());
        // disable submit button
        $('#submitBtn').prop('disabled', true);
        // update word counter
        $('#word_counter').text("Word: " + current_word + " (Invalid)");
    }
}

/* get current word that user has made inside the scrabble strip */
function getCurrentWord() {
    var letter_found = false; // flag to check when to start counting and reading letters
    var current_word = ''; // current word user has made

    // iterate through scrabble strip to see wha the user has spelt
    for (var i = 0; i < strip_tile_word.length; i++) {
        if (letter_found) {
            if (strip_tile_word[i].letter !== '')
                current_word += strip_tile_word[i].letter; // append letter to current word
            else
                current_word += '-'; // append - to show that the space is empty
        }
        else if (strip_tile_word[i].letter !== '') {
            // statements hit once the loop encounters its first letter
            current_word += strip_tile_word[i].letter; // appends letter
            letter_found = true; // sets flag to true
        }
    }
    current_word = current_word.replace(/\-+$/g, ""); // replaces trailing dashes
    word_to_submit = current_word; // set word to submit to be current word
    checkValidWord(current_word); // validates the current word
}

// main function to run
$(function() {
    // initializes scrabble game
    initiateScrabble(false);
})