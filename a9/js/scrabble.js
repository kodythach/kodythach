var distribution = [];

var specials = {
    'normal': 0,
    'double_word': 1,
    'double_letter': 2
};

var tiles = [];
var strip_tile_word = [];
var dictionary = {};
var current_score = 0;
var additional_score = 0;
var double_word_score = false;
var word_to_submit = '';
var is_valid_word = false;
var tiles_on_hand = 0;

function getNumberOfTiles() {
    var total_amount = 0;
    for (let tile = 0; tile < distribution.length; tile++) {
        total_amount += distribution[tile].amount;
    }
    return total_amount;
}

function generateTiles() {
    var total_amount = getNumberOfTiles();

    // generate 7 characters from 27 chars in distribution
    for (let i = tiles_on_hand; i < 7; i++) {
        if (total_amount < 0) {
            alert('Out of tiles');
            break;
        }
        let random = Math.floor(Math.random() * 27);
        while (distribution[random].amount <= 0) {
            random = Math.floor(Math.random() * 27);
        }
        total_amount -= 1;
        tiles_on_hand++;
        let letter = distribution[random].letter === '_' ? 'Blank' : distribution[random].letter;
        $("#tile_list").append("<img class='tile' id='" + letter + "' value=" + distribution[random].value + "\
                                src='img/characters/Scrabble_Tile_" + letter + ".jpg'></img>");
    }
}

function showBlankTileDialog(current_slot) {
    $('#dialog').append('<div id="blank_tile_dialog" title="Choose a character"> \
                    </div>');
    for (let i = 0; i < 26; i++) {
        let letter = distribution[i].letter;
        $("#blank_tile_dialog").append("<img class='sub_letter_tile' id='" + letter + "' value=" + distribution[i].value + " \
                                        src='img/characters/Scrabble_Tile_" + letter + ".jpg'></img>");
    }
    $('.sub_letter_tile').click(function(event) {
        // substitute blank character for letter
        let special_value = $(event.toElement).attr('value');
        $(current_slot).html(`<img class="placed_tile" id="${event.toElement.id}" slot="${$(current_slot).context.slot}" value="${$(event.toElement).attr('value')}" special_value =${special_value} blank="true" src="${event.toElement.src}"></img>`);
        $('#blank_tile_dialog').dialog('close');
        setPlacedTileDraggable();
        strip_tile_word[$(current_slot).context.slot].letter = event.toElement.id;
        strip_tile_word[$(current_slot).context.slot].value = parseInt(special_value);
        if (strip_tile_word[$(current_slot).context.slot].special === specials.double_letter)
            special_value *= 2;
        if (strip_tile_word[2].letter !== "" || strip_tile_word[12].letter !== "")
            double_word_score = true;
        else
            double_word_score = false;
        getCurrentWord();
    });
    $('#blank_tile_dialog').dialog({ 
        minWidth: 800,
        close: function(event, ui) 
        { 
            $(this).empty();
            $(this).remove();
        }
    });
}

function generateStripTiles() {
    $("#scrabble_strip").empty();

    // generate tile strips
    for (let i = 0; i < 15; i++) {
        strip_tile_word.push({ 'letter': '', 'special': specials.normal, 'value': 0 });
        var strip_tile_length = strip_tile_word.length;
        if (strip_tile_length  === 3)
            strip_tile_word[i].special = specials.double_word;
        else if (strip_tile_length === 7)
            strip_tile_word[i].special = specials.double_letter;
        else if (strip_tile_length === 9)
            strip_tile_word[i].special = specials.double_letter;
        else if (strip_tile_length === 13)
            strip_tile_word[i].special = specials.double_word;
        $("#scrabble_strip").append('<div class="strip_tile racked" \
                                     slot="' + i.toString() + '"></div>');
    }
}

function makeTilesDraggable() {
    $('.tile').draggable({
        revertDuration: 200,
        start: function(event, ui) {
            $(this).draggable("option", "revert", "invalid");
        },
        stop: function() {
            $(this).css("z-index", "");
        }
    });
}

function initialize_distribution() {
    // from Ramon Meza
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

function submit() {
    if (is_valid_word) {
        current_score += additional_score;
        strip_tile_word = [];
        $('#word_counter').text("Word: ");
        try {
            $('#blank_tile_dialog').dialog('close');
        } catch(e) {}
        $('#score_counter').text('Score: ' + current_score.toString());
        double_word_score = false;
        tiles_on_hand -= word_to_submit.length;
        for (let w = 0; w < word_to_submit.length; w++) {
            var current_char = word_to_submit[w];
            for (let d = 0; d < distribution.length; d++) {
                if (distribution[d].letter === current_char)
                    distribution[d].amount--;
            }
        }
        $('#submitBtn').prop('disabled', true);
        initiateScrabble(true);
    }
}

function restart() {
    $('#tile_list').empty();
    tiles_on_hand = 0;
    current_score = 0;
    strip_tile_word = [];
    $('#word_counter').text("Word: ");
    try {
        $('#blank_tile_dialog').dialog('close');
    } catch(e) {}
    $('#score_counter').text('Score: ' + current_score.toString());
    double_word_score = false;
    $('#submitBtn').prop('disabled', true);
    initiateScrabble(false);
}

function setPlacedTileDraggable() {
    $('.placed_tile').draggable({
        revertDuration: 200,
        start: function(event, ui) {
            $(this).css("z-index", 100);
            $(this).draggable("option", "revert", "invalid");
        },
        stop: function() {
            $(this).css("z-index", "");
        }
    });
}

function getDictionary() {
    $.ajax({
        url: "https://raw.githubusercontent.com/redbo/scrabble/master/dictionary.txt",
        success: function(result) {
          // Get an array of all the words.
          var words = result.split("\n");
      
          // Add them as properties to the dictionary lookup object.
          // This will allow for fast lookups later. All words are converted to capital letters
          // to make things simple since Scrabble is case insensitive.
          for (var i = 0; i < words.length; ++i) {
            dictionary[words[i].toUpperCase()] = true;
          }
        }
      });
}

function initiateScrabble(wasSubmit) {
    if (!wasSubmit)
        initialize_distribution();
    getDictionary();
    generateTiles();
    generateStripTiles();
    makeTilesDraggable();
    $('#tile_counter').text('Tiles left: ' + getNumberOfTiles().toString());

    $('.strip_tile').droppable({
        drop: function( event, ui ) {
            if (strip_tile_word[event.target.slot].letter === "") {
                if (event.toElement.className.startsWith('placed_tile')) {
                    strip_tile_word[event.toElement.slot].letter = '';
                    strip_tile_word[event.toElement.slot].value = 0;
                }
                $(event.toElement).remove();
                if (event.toElement.id === "Blank") {
                    showBlankTileDialog(this);
                    strip_tile_word[event.target.slot].letter = event.toElement.id;
                } else {
                    let special_value = $(event.toElement).attr('value');
                    if (strip_tile_word[event.target.slot].special === specials.double_letter)
                        special_value *= 2;
                    $(this).html(`<img class="placed_tile" id="${event.toElement.id}" value="${$(event.toElement).attr('value')}" special_value =${special_value} slot="${event.target.slot}" src="${event.toElement.src}"></img>`);
                    strip_tile_word[event.target.slot].letter = event.toElement.id;
                    strip_tile_word[event.target.slot].value = parseInt(special_value);
                    if (strip_tile_word[2].letter !== "" || strip_tile_word[12].letter !== "")
                        double_word_score = true;
                    else
                        double_word_score = false;
                    getCurrentWord();
                }
                setPlacedTileDraggable();
            } else {
                ui.draggable.animate(ui.draggable.data().uiDraggable.originalPosition,"fast");
            }
        }
    });
    $('#tile_holder').droppable({
        accept: ".placed_tile",
        drop: function( event, ui ) {
            try {
                strip_tile_word[event.toElement.slot].letter = '';
                strip_tile_word[event.toElement.slot].value = 0;
                $(event.toElement).remove();
                if ($(event.toElement).attr('blank') === 'true') {
                    $(this).children().append(`<img class="tile" id="Blank" slot="${event.target.slot}" value="${$(event.toElement).attr('value')}" src="img/characters/Scrabble_Tile_Blank.jpg"></img>`);    
                }
                else {
                    $(this).children().append(`<img class="tile" id="${event.toElement.id}" value="${$(event.toElement).attr('value')}" src="${event.toElement.src}"></img>`);
                }
                getCurrentWord();
            } catch (e) {
                // $(event.toElement).draggable('option','revert')();
            }
            makeTilesDraggable();
        }
    });
}

function calculateScore(current_word) {
    additional_score = 0;
    // iterate strip_word_tile to get values
    for (let i = 0; i < strip_tile_word.length; i++)
        additional_score += strip_tile_word[i].value;
    if (double_word_score)
        additional_score *= 2;
    $('#score_counter').text('Score: ' + current_score.toString() + ' (+' + additional_score + ')');
}

function checkValidWord(current_word) {
    if (dictionary[current_word] === true) {
        is_valid_word = true;
        $('#submitBtn').prop('disabled', false);
        calculateScore(current_word);
    } else {
        is_valid_word = false;
        $('#score_counter').text('Score: ' + current_score.toString());
        $('#submitBtn').prop('disabled', true);
    }
}

function getCurrentWord() {
    var letter_found = false;
    var current_word = '';
    for (var i = 0; i < strip_tile_word.length; i++) {
        if (letter_found) {
            if (strip_tile_word[i].letter !== '')
                current_word += strip_tile_word[i].letter;
            else
                current_word += '-';
        }
        else if (strip_tile_word[i].letter !== '') {
            current_word += strip_tile_word[i].letter;
            letter_found = true;
        }
    }
    current_word = current_word.replace(/\-+$/g, "");
    word_to_submit = current_word;
    $('#word_counter').text("Word: " + current_word);
    checkValidWord(current_word);
}

$(function() {
    initiateScrabble(false);
})