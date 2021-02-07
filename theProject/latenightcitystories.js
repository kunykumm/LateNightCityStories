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
var majorMonoFont;

// PHASE I.

var planeTexture;
var maxHeight;
var pOneCameraMov;
var pOneCamCounter;
var pOneCamAngle;
var camInfo;


// PHASE III.

var defCamSpeed;
var camSpeed;
var isPaused;


//---                                                                                        ---//
//------------------------------------------- SETUP --------------------------------------------//
//---                                                                                        ---//

function preload() {
  jsonEndIndices = [966, 1682, 3112, 4052, 4689, 5311, 5732, 6199, 6922, 7028, 7103, 7568, 8268,
                    8506, 8858, 10039, 10108, 10919, 12480, 13172, 13551, 13808, 14126, 14128,
                    14165, 14181];
  var jsonUrl = 'https://api.npoint.io/9e0b7a74e41f4a55ee5e';
  jsonData = loadJSON(jsonUrl /**, processJsonData**/);

  majorMonoFont = loadFont("https://github.com/googlefonts/majormono/blob/master/fonts/MajorMonoDisplay-Regular.ttf");
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
  defCamSpeed = 0.005;
  camSpeed = 0.005;
  isPaused = false;
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
//-------------------------------------- HTML INTERACTION --------------------------------------//
//---                                                                                        ---//

function changeSpeedPThree(value) {
  if (pThree) {
    if (value == 0) {
      isPaused = !isPaused;
    }
    else {
      camSpeed = camSpeed + 0.001 * value;
      if (camSpeed < 0.001) camSpeed = 0.001;
      if (camSpeed > 0.020) camSpeed = 0.020;

    }
  }
}

function changeColourMood(value) {

}

function saveImage() {
  if (!pThree) {
    alert("At first, generate an image.");
    return;
  }
  if (!isPaused) {
    alert("Pause to save the image.");
    return;
  }
  createPolaroid();
}

function createPolaroid() {
  polaroid = createGraphics(700, 840);
  polaroid.background(0);
  polaroid.copy(canvas, 0, 0, 600, 600, 50, 50, 600, 600);

  polaroid.fill(255);
  polaroid.textFont(majorMonoFont);
  polaroid.textSize(15);
  polaroid.textAlign(CENTER);
  polaroid.text(firstWord + ". " + secondWord + ". " + thirdWord + ".", 350, 720)

  save(polaroid, "late_night_city_stories_" + hour() + "_" + minute() + ".png");
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
    generateCityNet();
    generateOutskirtsNet()
    //generate = false;
  }
}

function phaseOne() {
  generateCityNet();
  generateOutskirtsNet()
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

function generateCityNet() {
  var i = 0;
  var j = 0;
  stroke(255);
  for (y = -58; y < 60; y += 24) {
    for(x = -70; x < 70; x += 24) {
      
      var height = maxHeight;
      if (allEmotions[j][i] == '0') {
        value = getValuesAroundBuilding(i, j);
        if (value == 0) {
          var h = abs(i * 0.1 + x/100 - (j * 0.1 + y/100));
          if (h > 0.65) h = abs(h - 1);
          height = height * h / 4;
        } else {
          height = height * value / 4;
        }
      }

      push();
      translate(x, y, height/2);
      ambientMaterial(250);
      box(20, 20, height);
      pop();
      i += 1;
    }
    j += 1;
    i = 0; 
  }
  noStroke();
}

function getValuesAroundBuilding(x, y) {
  var val = 0;
  if (x - 1 >= 0) {
    if (allEmotions[y][x - 1] == '1') val += 1;
  }
  if (x + 1 < 6) {
    if (allEmotions[y][x + 1] == '1') val += 1;
  }
  if (y - 1 >= 0) {
    if (allEmotions[y - 1][x] == '1') val += 1;
  }
  if (y + 1 < 5) {
    if (allEmotions[y + 1][x] == '1') val += 1;
  }
  return val;
}

function generateOutskirtsNet() {

  stroke(255);

  // ABOVE
  generateOutskirtsParts(-214, 218, -202, -58);

  // MIDDLE LEFT
  generateOutskirtsParts(-214, -70, -58, 60);
  
  // MIDDLE RIGHT
  generateOutskirtsParts(74, 210, -58, 60);

  // BELOW
  generateOutskirtsParts(-214, 218, 62, 185);

  noStroke();
}

function generateOutskirtsParts(xMin, xMax, yMin, yMax) {

  for (y = yMin; y < yMax; y += 24) {
    for (x = xMin; x < xMax; x += 24) {

      var h = calcuteOutskirtsBuildingsHeight(x, y);
      if (h == 0) continue;

      push();
      translate(x, y, h/2);
      fill(250, 150);
      box(20, 20, h);
      pop();
    }
  }
}

function calcuteOutskirtsBuildingsHeight(x, y) {
  var h = 0;
  var d = dist(0, 0, x, y);
  if (d < 200) {
    if (noise(x * 0.02, y * 0.02) - 0.02 < 0.4) return h;
    d = d / 1000;
    var h = abs(sin(y * d) * x / 6 - (cos(x * d) * y / 6));
    if (h > 20) h = abs(h - 20);
  }
  return h;
}


function moveCameraPThree() {
  if (!isPaused) {
    var vec = createVector(camInfo[0], camInfo[1]).rotate(camSpeed);
    cam.camera(vec.x, vec.y, camInfo[2], camInfo[3], camInfo[4], camInfo[5], camInfo[6], camInfo[7], camInfo[8]);
    camInfo[0] = vec.x;
    camInfo[1] = vec.y;
  }
}

