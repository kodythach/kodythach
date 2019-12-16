// from Ramon Meza
var distribution = [
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

var clean_distribution = distribution;

var specials = {
    'normal': 0,
    'double_word': 1,
    'double_letter': 2
};

var tiles = [];
var strip_tile_word = [];

function generateTiles() {
    $("#tile_list").empty();

    // generate 7 characters from 27 chars in distribution
    for (let i = 0; i < 7; i++) {
        let random = Math.floor(Math.random() * 27);
        while (distribution[random].amount <= 0) {
            random = Math.floor(Math.random() * 27);
        }
        distribution[random].amount -= 1;
        let letter = distribution[random].letter === '_' ? 'Blank' : distribution[random].letter;
        $("#tile_list").append("<img class='tile' id='" + letter + "' \
                                src='img/characters/Scrabble_Tile_" + letter + ".jpg'></img>");
    }
}

function generateStripTiles() {
    $("#scrabble_strip").empty();

    // generate tile strips
    for (let i = 0; i < 15; i++) {
        strip_tile_word.push({ 'letter': '', 'special': specials.normal });
        var strip_tile_length = strip_tile_word.length;
        if (strip_tile_length  === 3)
            strip_tile_word[i].special = specials.double_word;
        else if (strip_tile_length === 7)
            strip_tile_word[i].special = specials.double_letter;
        else if (strip_tile_length === 9)
            strip_tile_word[i].special = specials.double_letter;
        else if (strip_tile_length === 13)
            strip_tile_word[i].special = specials.double_word;
        $("#scrabble_strip").append('<div class="strip_tile" \
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

function restart() {
    distribution = clean_distribution;
    initiateScrabble();
}

function initiateScrabble() {
    generateTiles();
    generateStripTiles();
    makeTilesDraggable();

    $('.strip_tile').droppable({
        drop: function( event, ui ) {
            $(event.toElement).remove();
            $(this).html(`<img class="placed_tile" id="${event.toElement.id}" slot="${event.target.slot}" src="${event.toElement.src}"></img>`);
            strip_tile_word[event.target.slot].letter = event.toElement.id;
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
    });
    $('#tile_holder').droppable({
        drop: function( event, ui ) {
            try {
                strip_tile_word[event.toElement.slot].letter = '';
                $(event.toElement).remove();
                $(this).children().append(`<img class="tile" id="${event.toElement.id}" src="${event.toElement.src}"></img>`);
            } catch (e) {
                // $(event.toElement).draggable('option','revert')();
            }
            makeTilesDraggable();
        }
    });
}

$(function() {
    initiateScrabble();
})