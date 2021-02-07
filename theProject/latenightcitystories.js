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

var cam;

// PHASE I.

var planeTexture;
var maxHeight;
var pOneCameraMov;
var pOneCamCounter;
var pOneCamAngle;
var camInfo;


// PHASE III.

var camAngle;
var camSpeed;


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
  setupVariables();
}

function setupWindow() {
  canvas = createCanvas(600, 600, WEBGL);
  canvas.position(260, 50);
  canvas.background(50);
}

function setupVariables() {
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
  planeTexture = createGraphics(width, height);
  maxHeight = 120;
  pOneCameraMov = false;
  pOneCamCounter = 0;
  pOneCamAngle = 0;
  cam = createCamera();
  cam.camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0)
  camAngle = 0;
  camSpeed = 0.01;
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
  
  canvas.background(50);
  lights();

  if (pOne) {
    if (pOneCameraMov) moveCameraPOne();
    phaseOne();
  }

  if (pTwo) {

  }

  if (pThree) {
    moveCameraPThree();
    generateBaseNet();
    //generate = false;
  }
}

function phaseOne() {
  generateBaseNet();
  pOneCameraMov = true;
}

function moveCameraPOne() {
  if (pOneCamCounter == 100) {
    pOneCameraMov = false;
    pOne = false;
    pThree = true;

    camInfo = [pOneCamAngle, pOneCamAngle, ((height/2) / tan(PI/6)) - (pOneCamAngle * 3/2), (maxHeight/9) * pOneCamAngle / 200, 0, (maxHeight/2) * pOneCamAngle / 200, 
               0, 1 - (pOneCamAngle / 200), - (pOneCamAngle / 200)];
    return;
  }
  pOneCamAngle += 2;

  cam.camera(pOneCamAngle, pOneCamAngle, ((height/2) / tan(PI/6)) - (pOneCamAngle * 3/2), 0, 0, 0, 0, 1 - (pOneCamAngle / 200), - (pOneCamAngle / 200));
  cam.lookAt((maxHeight/9) * pOneCamAngle / 200, 0, (maxHeight/2) * pOneCamAngle / 200);

  pOneCamCounter += 1;
}

function generateBaseNet() {
  stroke(255);
  for (y = -58; y < 60; y += 24) {
    for(x = -70; x < 70; x += 24) {
      push();
      translate(x, y, maxHeight/2);
      ambientMaterial(250);
      box(20, 20, maxHeight);
      pop();
    }
  }
}

function generateBuildingsNet() {
  
}

function generateAroundNet() { 


}

function moveCameraPThree() {

  var vec = createVector(camInfo[0], camInfo[1]).rotate(camAngle * camSpeed);
  cam.camera(vec.x, vec.y, camInfo[2], camInfo[3], camInfo[4], camInfo[5], camInfo[6], camInfo[7], camInfo[8]);

  camAngle += 1;
  if (camAngle >= (360 / camSpeed)) camAngle = 0;
}

