// JSON STUFF
// JSON file online: https://api.npoint.io/9e0b7a74e41f4a55ee5e
var jsonData;
var jsonEndIndices;

// HTML STUFF
var title;
var moodText;
var warmButton;
var coldButton;
var description;
var generateButton;

// PROCESSING STUFF
var firstWord;
var secondWord;
var thirdWord;

var firstEmotions;
var secondEmotions;
var thirdEmotions;

var generate;

function preload() {
  jsonEndIndices = [966, 1682, 3112, 4052, 4689, 5311, 5732, 6199, 6922, 7028, 7103, 7568, 8268,
                    8506, 8858, 10039, 10108, 10919, 12480, 13172, 13551, 13808, 14126, 14128,
                    14165, 14181];
  var jsonUrl = 'https://api.npoint.io/9e0b7a74e41f4a55ee5e';
  jsonData = loadJSON(jsonUrl /**, processJsonData**/);
}

// function processJsonData() {
//   //print(jsonData[0].En);
//   //print(jsonData[5268].En);
// }

function setup() {
  setupWindow();
  generate = false;
}

function setupWindow() {
  canvas = createCanvas(600, 600);
  canvas.position(260, 50);
  background(0);
}

function getWords() {
  if (generate) return;

  firstWord = document.forms["inputForm"]["firstW"].value;
  if (firstWord == "") {
    alert("The prologue is missing.");
    return;
  }

  secondWord = document.forms["inputForm"]["secondW"].value;
  if (secondWord == "") {
    alert("The interlude is missing.");
    return;
  }

  thirdWord = document.forms["inputForm"]["thirdW"].value;
  if (thirdWord == "") {
    alert("The epilogue is missing.");
    return;
  }

  validateWords();

  generate = true;
}

function validateWords() {
  validateAWord(firstWord, firstEmotions);
  validateAWord(secondWord, secondEmotions);
  validateAWord(thirdWord, thirdEmotions);
  print(firstWord);
  print(firstEmotions);
  print(secondWord);
  print(secondEmotions);
  print(thirdWord);
  print(thirdEmotions);
}

function validateAWord(word, emotions) {
  print("WordValidation START");
  word = word.toLowerCase();
  var index = findFirstLetterIndexRange(word);
  var start = 0;
  var stop = 0;
  
  if (index == 0) {
    start = 0;
  } else {
    start = jsonEndIndices[index - 1];
  }
  stop = jsonEndIndices[index];

  var wordIndex = findWordInJson(word, start, stop);
  findTheEmotions(emotions, wordIndex);
  print("WordValidation END")
}

function findFirstLetterIndexRange(word) {
  var index = word.charCodeAt(0) - "a".charCodeAt();
  print("FirstLetter: " + index);
  return index;
}

function findWordInJson(word, start, stop) {
  print(start);
  print(stop);
  for (i = start; i < stop; i++) {
    if (jsonData[i].En == word) {
      print("Word found: " + word)
      return i;
    }
  }
  print("Word not found.");
  return -1;
}

function findTheEmotions(emotions, wordIndex) {
  emotions = [
              jsonData[wordIndex].Positive,
              jsonData[wordIndex].Negative,
              jsonData[wordIndex].Anger,
              jsonData[wordIndex].Anticipation,
              jsonData[wordIndex].Disgust,
              jsonData[wordIndex].Fear,
              jsonData[wordIndex].Joy,
              jsonData[wordIndex].Sadness,
              jsonData[wordIndex].Surprise,
              jsonData[wordIndex].Trust
              ]
  print("Emotions filled.");
}
  
function draw() {
  if (!generate) return;
  
  fill(random(50, 255));
  circle(400, 200, random(50, 150));

  generate = false;
}