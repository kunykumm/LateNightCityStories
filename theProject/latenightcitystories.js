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
var allEmotions;
var sumOfOnes;

var generate;
var pOne;
var pTwo;
var pThree;


//---                                                                                        ---//
//------------------------------------------- SETUP --------------------------------------------//
//---                                                                                        ---//

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
  pOne = false;
  pTwo = false;
  pThree = false;
  pOneCounter = 0;
  timeBezier = 0;
  xCity = 0;
  yCity = 0;
  xCitySign = 1;
  yCitySign = 1;
  xShift = random(0, 100);
  yShift = random(0, 100);
  sumOfOnes = 0;
}

function setupWindow() {
  canvas = createCanvas(600, 600, WEBGL);
  canvas.position(260, 50);
}

//---                                                                                        ---//
//---------------------------------------- JSON PARSING ----------------------------------------//
//---                                                                                        ---//

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
  fillAllEmotions();
  print(allEmotions);
  makeSumOfOnes();

  generate = true;
  pOne = true;
}

function validateWords() {
  firstEmotions = validateAWord(firstWord);
  secondEmotions = validateAWord(secondWord);
  thirdEmotions = validateAWord(thirdWord);
}

function fillAllEmotions() {
  allEmotions = [
    [firstEmotions[0], firstEmotions[1], firstEmotions[2], firstEmotions[3], firstEmotions[4], firstEmotions[5]],
    [firstEmotions[6], firstEmotions[7], firstEmotions[8], firstEmotions[9], secondEmotions[0], secondEmotions[1]],
    [secondEmotions[2], secondEmotions[3], secondEmotions[4], secondEmotions[5], secondEmotions[6], secondEmotions[7]],
    [secondEmotions[8], secondEmotions[9], thirdEmotions[0], thirdEmotions[1], thirdEmotions[2], thirdEmotions[3]],
    [thirdEmotions[4], thirdEmotions[5], thirdEmotions[6], thirdEmotions[7], thirdEmotions[8], thirdEmotions[9]]
  ]
}

function validateAWord(word) {
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
  return findTheEmotions(wordIndex);
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

function findTheEmotions(wordIndex) {
  if (wordIndex == -1) {

    var options = ['0', '1'];
    emotions = [];
    for (i = 0; i < 10; ++i) {
      emotions.push(random(options));
    }

  } else {

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
  }

  print(emotions);
  print("Emotions filled.");
  return emotions;
}

function makeSumOfOnes() {
  for (i = 0; i < 10; ++i) {
    if (firstEmotions[i] == '1') sumOfOnes++;
    if (secondEmotions[i] == '1') sumOfOnes++;
    if (thirdEmotions[i] == '1') sumOfOnes++;
  }
}

//---                                                                                        ---//
//-------------------------------------------- DRAW --------------------------------------------//
//---                                                                                        ---//
  
function draw() {
  if (!generate) return;
  
  if (pOne) {
    phaseOne();
  }

  if (pTwo) {

  }

  if (pThree) {
    
    generate = false;
  }
}

function phaseOne() {

}

function generateBaseNet() {
  

}

function generateAroundNet() { 


}

