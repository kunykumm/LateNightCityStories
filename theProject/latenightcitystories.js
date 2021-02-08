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

var moodColour;
var warmColour;
var coldColour;
var pickedColour;

// PHASE I.

var maxHeight;
var pOneCameraMov;
var pOneCameraSlide;
var pOneSlideCounter;
var pOneCamCounter;
var pOneCamAngle;
var camInfo;
var planeRoadsTexture;

// PHASE II.

var isBTGenerated;
var pTwoCounter;

// PHASE III.

var defCamSpeed;
var camSpeed;
var isPaused;
var planeTextAngle;


//---                                                                                        ---//
//------------------------------------------- SETUP --------------------------------------------//
//---                                                                                        ---//

function preload() {
  jsonEndIndices = [966, 1682, 3112, 4052, 4689, 5311, 5732, 6199, 6922, 7028, 7103, 7568, 8268,
                    8506, 8858, 10039, 10108, 10919, 12480, 13172, 13551, 13808, 14126, 14128,
                    14165, 14181];
  var jsonUrl = 'https://api.npoint.io/9e0b7a74e41f4a55ee5e';
  jsonData = loadJSON(jsonUrl /**, processJsonData**/);

  //majorMonoFont = loadFont('https://fonts.googleapis.com/css2?family=Major+Mono+Display&display=swap');
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
  canvas.background(30);
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
  maxHeight = 120;
  pOneCameraMov = false;
  pOneCamCounter = 0;
  pOneSlideCounter = 0;
  pOneCamAngle = 0;
  cam = createCamera();
  cam.camera(-200, -200, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
  defCamSpeed = 0.005;
  camSpeed = 0.005;
  isPaused = false;
  planeRoadsTexture = createGraphics(150, 150);
  isBTGenerated = false;
  pOneCameraSlide = true;
  pTwoCounter = 0;
  moodColour = 0;
  warmColour = [252, 144, 3];
  coldColour = [3, 75, 252];
  pickedColour = [];
  planeTextAngle = 0;
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

  if (moodColour == 0) {
    alert("Choose mood of your city.");
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
  moodColour = value;
  if (value == -1) {
    pickedColour = coldColour;
  } 
  if (value == 1) {
    pickedColour = warmColour;
  }
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
  polaroid.textFont("Courier New");
  polaroid.textSize(18);
  polaroid.textAlign(CENTER);
  polaroid.text(firstWord + ". " + secondWord + ". " + thirdWord + ".", 350, 730)

  save(polaroid, "late_night_city_stories_" + hour() + "_" + minute() + ".png");
}

//---                                                                                        ---//
//-------------------------------------------- DRAW --------------------------------------------//
//---                                                                                        ---//
  
function draw() {
  if (!generate) return;
  
  canvas.background(0);
  lights();

  if (!isBTGenerated) {
    createGroundTexture();
    isBTGenerated = true;
  }

  if (pOne) {
    if (pOneCameraSlide) slideCameraAboveCity();
    if (pOneCameraMov) moveCameraPOne();
  }
  if (pTwo || pThree) {

    if (pTwo) {
      if (pTwoCounter >= 20) {
        pointLight(pickedColour[0], pickedColour[1], pickedColour[2], 0, 0, maxHeight / 6);
        createGroundTexture();
      }
      if (pTwoCounter >= 40) {
        pointLight(pickedColour[0], pickedColour[1], pickedColour[2], 0, 0, maxHeight / 6);
        createGroundTexture();
      }
      if (pTwoCounter >= 60) {
        pointLight(pickedColour[0], pickedColour[1], pickedColour[2], 0, 0, maxHeight / 6);
        createGroundTexture();
      }
      phaseTwo();
      pTwoCounter += 1;
    }
  
    if (pThree) {
      pointLight(pickedColour[0], pickedColour[1], pickedColour[2], 0, 0, maxHeight / 6);
      pointLight(pickedColour[0], pickedColour[1], pickedColour[2], 0, 0, maxHeight / 6);
      pointLight(pickedColour[0], pickedColour[1], pickedColour[2], 0, 0, maxHeight / 6);
      moveCameraPThree();
      showInfoFacingCamera();
    }
  }

  // THE CITY
  generateCityNet();
  generateOutskirtsNet()

  //fill(255, 150, 0, 50);
  //sphere(80);
  texture(planeRoadsTexture);
  plane(600, 600);

  if (pOneCameraSlide) {
    slideCameraFade();
  }
}

function phaseTwo() {
  if (pTwoCounter >= 80) {
    pTwo = false;
    pThree = true;
    createGroundTexture();
  }
}

function slideCameraAboveCity() {
  if (pOneSlideCounter == 300) {
    pOneCameraSlide = false;
    pOneCameraMov = true;
    cam.camera(0, 0, (height/2) / tan(PI/6), 0, 0, 0, 0, 1, 0);
    return;
  } else {
    var cur = -200 + pOneSlideCounter * 200 / 300;
    cam.camera(cur, cur, (height/2) / tan(PI/6), cur, cur, 0, 0, 1, 0);
    pOneSlideCounter += 1;
  }
}

function slideCameraFade() {
  var val = 255 - (pOneSlideCounter * 255 / 300);
  fill(0, val);
  push();
  noStroke();
  translate(0, 0, maxHeight + 20);
  plane(width, height);
  pop();
}

function moveCameraPOne() {
  if (pOneCamCounter == 100) {
    pOneCameraMov = false;
    pOne = false;
    pTwo = true;

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
  stroke(60)
  if ((pTwo && pTwoCounter >= 80) || pThree) {
    stroke(pickedColour[0], pickedColour[1], pickedColour[2]);
  }
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
      ambientMaterial(40);
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

  //stroke(50);

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

      stroke(50);
      if ((pTwo && pTwoCounter >= 80) || pThree) {
        var d = dist(0, 0, x, y);
        var strokeColour = [pickedColour[0] * ((width/2.5 - d) / (width/2.5)),
                            pickedColour[1] * ((width/2.5 - d) / (width/2.5)),
                            pickedColour[2] * ((width/2.5 - d) / (width/2.5))]

        stroke(strokeColour[0], strokeColour[1], strokeColour[2]);
        //print(strokeColour);
      }

      push();
      translate(x, y, h/2);
      fill(50, 150);
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

function createGroundTexture() {
  var ratio = pTwoCounter / 20;
  planeRoadsTexture.noStroke();
  planeRoadsTexture.background(0);
  for(y = 5; y < 150 - 5; y += 10){
    for(x = 5; x < 150 - 5; x += 10){
      var d = dist(x, y, 150 / 2, 150 / 2);
      var newCol = [255 - (((255 - pickedColour[0]) * ratio) / 4), 255 - (((255 - pickedColour[1]) * ratio) / 4), 255 - (((255 - pickedColour[2]) * ratio) / 4)]
      planeRoadsTexture.fill(newCol[0], 
                             newCol[1],
                             newCol[2],
                             ((100 - d) / 100) * 255 - 137);
      planeRoadsTexture.square(x, y, 10);
    }
  } 
}

function moveCameraPThree() {
  if (!isPaused) {
    var vec = createVector(camInfo[0], camInfo[1]).rotate(-camSpeed);
    cam.camera(vec.x, vec.y, camInfo[2], camInfo[3], camInfo[4], camInfo[5], camInfo[6], camInfo[7], camInfo[8]);
    camInfo[0] = vec.x;
    camInfo[1] = vec.y;
  }
}

function showInfoFacingCamera() {
  if (!isPaused) {
    push();
    //from camera to origin (O - C)
    var vec = createVector(camInfo[3] - camInfo[0], camInfo[4] - camInfo[1], camInfo[5] - camInfo[2]).normalize();
    var camVec = createVector(camInfo[0], camInfo[1]).normalize();
    var planeVec = createVector(vec.x, vec.y);

    var angle = degrees(planeVec.angleBetween(camVec));
    print("angle: " + angle);
    planeTextAngle -= angle;
    if (abs(planeTextAngle) > 360) {
      planeTextAngle += 360;
    }
    print(planeTextAngle);

    stroke(255);
    noFill();
    translate(camInfo[0] + vec.x * 100, camInfo[1] + vec.y * 100, camInfo[2] + vec.z * 100);
    rotate(planeTextAngle);
    plane(100, 100);
    pop();
  }
}

