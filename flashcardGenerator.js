var inquirer = require('inquirer');
var fs = require("fs");

function cardsOptions() {
  inquirer.prompt([{
    type: 'list',
    name: "choices",
    message: "What would you like to do?",
    choices: [
      'Make a basic flashcard',
      'Make a cloze-deleted flashcard',
      'View cards'
    ],
  }]).then(function(answers) {
    if (answers.choices === 'Make a basic flashcard') {
      makeCards();

    } else if (answers.choices === 'Make a cloze-deleted flashcard') {
      makeCloze();
    } else {
      inquirer.prompt([{
		type: 'list',
		name: "choices",
		message: "Which cards?",
		choices: [
		  'Basic flashcard',
		  'Cloze-deleted flashcard'
		],
	  }]).then(function(answers) {
	  	if (answers.choices === 'Basic flashcard') {
	      readCards('basic.txt');
	    } else if (answers.choices === 'Cloze-deleted flashcard') {
	      readCards('cloze.txt');
	    }
	  });
    }
  });
}
cardsOptions();

function BasicFlashcard(front, back) {
  this.front = front;
  this.back = back;
  // add text to file
  this.appendBasic = function() {
  	fs.appendFile('basic.txt', 'front: ' + front + ', back: ' + back + '\n', function (err) {
  		if (err) return console.log(err);
	});
  }
}

function ClozeFlashcard(text, cloze) {
  this.text = text;
  this.cloze = cloze;
  var partialText = text.replace(cloze, '[cloze]').trim();
  // add text to file
  this.appendCloze = function() {
  	fs.appendFile('cloze.txt', 'text: ' + partialText + ', cloze: ' + cloze + '\n', function (err) {
  		if (err) return console.log(err);
	});
  };
}

var makeCards = function() {
  inquirer.prompt([{
    name: 'front',
    message: "Enter a question: "
  }, {
    name: 'back',
    message: 'Enter the answer: '
  }]).then(function(answers) {
    var newCard = new BasicFlashcard(answers.front, answers.back);
    newCard.appendBasic();
  });
}

var makeCloze = function() {
  var text, cloze;
  inquirer.prompt([{
    name: 'text',
    message: "Enter full text: "
  }]).then(function(answers) {
  	console.log('Your full text: ' + answers.text);
  	text = answers.text;
  	inquirer.prompt([{
    	name: 'cloze',
    	message: 'Enter portion of text to hide: '
    }]).then(function(answers) {
      cloze = answers.cloze;
      var newCard = new ClozeFlashcard(text, cloze);
      newCard.appendCloze();
	});
  });
}

function readCards(file) {
    fs.readFile(file, 'utf8', function(err, data) {
        if (err) return console.log(err);

        var output = data.split('\n');
      
        for (var i = 0; i < output.length-1; i++) {
            console.log(output[i]);
 		};
 	});
}