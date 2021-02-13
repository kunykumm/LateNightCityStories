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
var whatWordsWereFound;
var notFoundSum;

var firstEmotions;
var secondEmotions;
var thirdEmotions;
var allEmotions;
var sumOfOnes;
var sumOfOnesPN;
var averageEmos;
var emotionsStrings;
var fancySymbols;

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

var polaroidColour;
var polaroidText;
var isPolaroidPicked;

// PHASE I.

var maxHeight;
var pOneCameraMov;
var pOneCameraSlide;
var pOneSlideCounter;
var pOneCamCounter;
var pOneCamAngle;
var camInfo;
var planeRoadsTexture;

var cityCentreX;
var cityCentreY;
var cityCentreH;
var cityCentreFC;
var cityCentreSC;
var newColours;

var outskirtsX;
var outskirtsY;
var outskirtsH;
var outskirtsFC;
var outskirtsSC;

var scatteredBX;
var scatteredBY;
var scatteredBH;
var scatteredBA;

// PHASE II.

var isBTGenerated;
var pTwoCounter;

// PHASE III.

var defCamSpeed;
var camSpeed;
var isPaused;
var planeTextAngle;
var planeTextTexture;
var fW;
var sW;
var tW;
var errorSumText;
var showErrorText;


//---                                                                                        ---//
//------------------------------------------- SETUP --------------------------------------------//
//---                                                                                        ---//

/**
 * Loads json database of emotions.
 * This project makes use of the 'NRC Word-Emotion Association Lexicon', created by 'Saif M. Mohammad' at the National Research Council Canada.
 * Link to 'NRC Word-Emotion Association Lexicon': https://saifmohammad.com/WebPages/NRC-Emotion-Lexicon.htm
 * The 'NRC Word-Emotion Association Lexicon' mentioned above is used in this project for non-commercial research and educational purposes.
 */
function preload() {
  jsonEndIndices = [966, 1682, 3112, 4052, 4689, 5311, 5732, 6199, 6922, 7028, 7103, 7568, 8268,
                    8506, 8858, 10039, 10108, 10919, 12480, 13172, 13551, 13808, 14126, 14128,
                    14165, 14181];
  var jsonUrl = 'https://api.npoint.io/9e0b7a74e41f4a55ee5e';
  jsonData = loadJSON(jsonUrl /**, processJsonData**/);
}

/**
 * Sets up the canvas and all variables.
 */
function setup() {
  setupWindow();
  setupVariables();
  frameRate(30);
}

/**
 * Sets up the canvas.
 */
function setupWindow() {
  canvas = createCanvas(600, 600, WEBGL);
  canvas.position(345, 50);
  canvas.background(30);
}

/**
 * Sets up all variables.
 */
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
  sumOfOnesPN = 0;
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
  planeTextTexture = createGraphics(180, 180);
  averageEmos = [];
  emotionsStrings = ["positive", "negative", "anger", "anticipation", "disgust", "fear", "joy", "sadness", "surprise", "trust"];
  fancySymbols = ["°", "'", "''", "/", ",", ".", ";", ":"];
  fW = "";
  sW = "";
  tW = "";
  isPolaroidPicked = 0;
  whatWordsWereFound = [false, false, false];
  notFoundSum = 0;
  showErrorText = false;
  cityCentreX = [];
  cityCentreY = [];
  cityCentreH = [];
  cityCentreFC = [];
  cityCentreSC = [];
  scatteredBX = [];
  scatteredBY = [];
  scatteredBH = [];
  scatteredBA = [];
  newColours = false;
  calculateScatteredBuildings(-454, 458, -442, -200);
  calculateScatteredBuildings(-454, 458, 206, 425);
  calculateScatteredBuildings(-454, -200, -176, 182);
  calculateScatteredBuildings(194, 450, -176, 182);
}


//---                                                                                        ---//
//---------------------------------------- JSON PARSING ----------------------------------------//
//---                                                                                        ---//

/**
 * When button 'generate' is pressed, this function runs.
 * It checks all the text fields needed for generating the city.
 * If any is missed, an alert message is shown.
 * Secondly, this function finds the words in the lexicon and inicialize arrays of emotions for each word.
 */
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
  averageEmotions();
  generateErrorText();

  //Precalculate the city centre
  calculateCityCentreBuildingsPositions();
  calculateBaseColoursForCentreBuldings();

  generate = true;
  pOne = true;
}

/**
 * Calls function validateAWord for each word written in the text fields.
 */
function validateWords() {
  firstEmotions = validateAWord(firstWord, 1);
  secondEmotions = validateAWord(secondWord, 2);
  thirdEmotions = validateAWord(thirdWord, 3);
  print(whatWordsWereFound[0] + " " + whatWordsWereFound[1] + " " + whatWordsWereFound[2]);
}

/**
 * Put all emotions into one array to create a grid for the middle of the city.
 */
function fillAllEmotions() {
  allEmotions = [
    [firstEmotions[0], firstEmotions[1], firstEmotions[2], firstEmotions[3], firstEmotions[4], firstEmotions[5]],
    [firstEmotions[6], firstEmotions[7], firstEmotions[8], firstEmotions[9], secondEmotions[0], secondEmotions[1]],
    [secondEmotions[2], secondEmotions[3], secondEmotions[4], secondEmotions[5], secondEmotions[6], secondEmotions[7]],
    [secondEmotions[8], secondEmotions[9], thirdEmotions[0], thirdEmotions[1], thirdEmotions[2], thirdEmotions[3]],
    [thirdEmotions[4], thirdEmotions[5], thirdEmotions[6], thirdEmotions[7], thirdEmotions[8], thirdEmotions[9]]
  ]
}

/**
 * This function calls another three functions which find the word in the lexicon and load its emotional values.
 * @param word Word written in the text field.
 * Returns the array of emotions for current word.
 */
function validateAWord(word, wI) {
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
  if (wordIndex != -1) {
    if (wI == 1) {
      whatWordsWereFound[0] = true;
    } else if (wI == 2) {
      whatWordsWereFound[1] = true;
    } else if (wI == 3) {
      whatWordsWereFound[2] = true;
    }
  } else {
    notFoundSum++;
  }
  return findTheEmotions(wordIndex);
}

/**
 * Calculates the index of the first letter of the word.
 * Returns that index.
 * @param word Word written in the text field.
 */
function findFirstLetterIndexRange(word) {
  var index = word.charCodeAt(0) - "a".charCodeAt();
  print("FirstLetter: " + index);
  return index;
}

/**
 * Finds the index for the word in the lexicon.
 * @param word Word written in the text field.
 * @param start Starting index (from jsonEndIndices)
 * @param stop Exnding index (from jsonEndIndices)
 * Returns index in the lexicon.
 */
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

/**
 * Fills the emotions for the word
 * @param wordIndex Index of the word in the lexicon.
 * If the word was not found, index is -1 and the emotions are randomized.
 * Returns array of emotions.
 */
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

/**
 * Sum all ones in the array.
 */
function makeSumOfOnes() {
  for (i = 0; i < 2; ++i) {
    if (firstEmotions[i] == '1') sumOfOnesPN++;
    if (secondEmotions[i] == '1') sumOfOnesPN++;
    if (thirdEmotions[i] == '1') sumOfOnesPN++;
  }
  for (i = 2; i < 10; ++i) {
    if (firstEmotions[i] == '1') sumOfOnes++;
    if (secondEmotions[i] == '1') sumOfOnes++;
    if (thirdEmotions[i] == '1') sumOfOnes++;
  }
}

/**
 * Average all values for text.
 */
function averageEmotions() {
  var count = 0;
  for (i = 0; i < 10; ++i) {
    count = 0;
    if (firstEmotions[i] == '1') count++;
    if (secondEmotions[i] == '1') count++;
    if (thirdEmotions[i] == '1') count++;
    if (i < 2) {
      averageEmos.push(count / sumOfOnesPN);
    } else {
      averageEmos.push(count / sumOfOnes);
    }
  }
}


//---                                                                                        ---//
//-------------------------------------- HTML INTERACTION --------------------------------------//
//---                                                                                        ---//

/**
 * Function called by slower, pause and faster button of the UI.
 * Adjusts the speed of the rotation in the Phase III.
 * @param value -1 to slow down, 0 to pause, +1 to speed it up
 */
function changeSpeedPThree(value) {
  if (!pThree) {
    alert("Wait for the image to generate.");
    return;
  }
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

/**
 * Function called by cold / warm buttons changed the colour mood of the scene
 * @param value -1 for cold colour (blue), 1 for hot colour (orange)
 */
function changeColourMood(value) {
  moodColour = value;
  if (value == -1) {
    pickedColour = coldColour;
  } 
  if (value == 1) {
    pickedColour = warmColour;
  }
}

/**
 * Function called by white / black buttons changing the colour of the polaroid
 * @param value -1 for white background and black text, 1 for inverse
 */
function pickPolaroidCol(value) {
  isPolaroidPicked = value;
  if (value == -1) {
    polaroidColour = 255;
    polaroidText = 0;
  } 
  if (value == 1) {
    polaroidColour = 0;
    polaroidText = 255;
  }
}

/**
 * Function called by save button.
 * Saves the render as a polaroid with chosen attributes.
 */
function saveImage() {
  if (!pThree) {
    alert("At first, generate an image.");
    return;
  }
  if (!isPaused) {
    alert("Pause to save the image.");
    return;
  }
  if (isPolaroidPicked == 0) {
    alert("Pick polaroid colour.");
    return;
  }
  createPolaroid();
}

/**
 * Creates polaroid for the save in the off-screen renderer.
 */
function createPolaroid() {
  polaroid = createGraphics(700, 840);
  polaroid.background(polaroidColour);
  push();
  polaroid.fill(0);
  polaroid.rect(50, 50, 600, 600);
  pop();
  polaroid.copy(canvas, 0, 0, 600, 600, 50, 50, 600, 600);

  polaroid.fill(polaroidText);
  polaroid.textFont("Courier New");
  polaroid.textSize(18);
  polaroid.textAlign(CENTER);
  polaroid.text(firstWord + ". " + secondWord + ". " + thirdWord + ".", 350, 730)

  save(polaroid, "late_night_city_stories_" + hour() + "_" + minute() + ".png");
  //polaroid.remove();
}

/**
 * Function called by restart button.
 * Restores application to the default state.
 */
function restartCity() {
  canvas.background(30);
  setupVariables();
}


//---                                                                                        ---//
//-------------------------------------------- DRAW --------------------------------------------//
//---                                                                                        ---//

/**
 * Draw function called every frame. 
 * Contains conditions for each phase.
 */
function draw() {
  if (!generate) return;
  
  canvas.background(0);
  lights();

  if (pOne) {
    phaseOne();
    generateCityNetPOnePTwo();
  }
  else if (pTwo) {
    phaseTwo();
    if (pTwoCounter < 80) generateCityNetPOnePTwo();
    else generateCityNetPThree();
  }
  else if (pThree) {
    phaseThree();
    generateCityNetPThree();
  }

  // THE CITY
  generateOutskirtsNet()

  // THE GROUND
  texture(planeRoadsTexture);
  plane(600, 600);

  // Beginning - sliding camera
  if (pOneCameraSlide) {
    slideCameraFade();
  }
}

/**
 * Phase I controlling function.
 */
function phaseOne() {
  if (!isBTGenerated) {
    createGroundTexture();
    isBTGenerated = true;
  }
  if (pOneCameraSlide) slideCameraAboveCity();
  if (pOneCameraMov) moveCameraPOne();
}

/**
 * Phase II controlling function.
 */
function phaseTwo() {
  if (pTwoCounter >= 20) {
    pointLight(pickedColour[0], pickedColour[1], pickedColour[2], 0, 0, maxHeight / 6);
    lightFalloff(1, 0, 0);
    createGroundTexture();
  }
  if (pTwoCounter >= 40) {
    lightFalloff(0.5, 0, 0);
    createGroundTexture();
  }
  if (pTwoCounter >= 60) {
    lightFalloff(0.25, 0, 0);
    createGroundTexture();
  }
  if (pTwoCounter >= 80) {
    if (pTwoCounter == 80) newColours = true;
    pTwo = false;
    pThree = true;
    createGroundTexture();
    if (newColours) {
      calculatePhaseThreeColoursForCentreBuildings();
      newColours = false;
    }
  }
  pTwoCounter += 1;
}

/**
 * Phase III controlling function.
 */
function phaseThree() {
  //lightFalloff(0.25, 0, 0);
  pointLight(pickedColour[0], pickedColour[1], pickedColour[2], 0, 0, maxHeight / 6);
  moveCameraPThree();
  showInfoFacingCamera();
}

/**
 * Phase I - Sliding camera.
 */
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

/**
 * Phase I - Fade from black to transparent.
 */
function slideCameraFade() {
  var val = 255 - (pOneSlideCounter * 255 / 300);
  fill(0, val);
  push();
  noStroke();
  translate(0, 0, maxHeight + 20);
  plane(width + 200, height + 200);
  pop();
}

/**
 * Phase I - Moving camera from up to the bottom-side.
 */
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

/**
 * City generation (Phase I and Phase II)
 * This code creates the middle block of buildings that reflect emotions from the words.
 */
function generateCityNetPOnePTwo() {
  var siz = cityCentreX.length;
  for (i = 0; i < siz; ++i) {
    push();
    translate(cityCentreX[i], cityCentreY[i], cityCentreH[i]/2);
    ambientMaterial(red(cityCentreFC[i]), green(cityCentreFC[i]), blue(cityCentreFC[i]));
    stroke(red(cityCentreSC[i]), green(cityCentreSC[i]), blue(cityCentreSC[i]));
    box(20, 20, cityCentreH[i]);
    pop();
  }
  noStroke();
}

/**
 * City generation (Phase III)
 * This code creates the middle block of buildings that reflect emotions from the words.
 */
function generateCityNetPThree() {
  var siz = cityCentreX.length;
  for (i = 0; i < siz; ++i) {
    push();
    stroke(red(cityCentreSC[i]), green(cityCentreSC[i]), blue(cityCentreSC[i]));
    if (alpha(cityCentreSC[i]) == 100) {
      ambientMaterial(red(cityCentreFC[i]), green(cityCentreFC[i]), blue(cityCentreFC[i]));
    } else {
      fill(red(cityCentreFC[i]), green(cityCentreFC[i]), blue(cityCentreFC[i]), alpha(cityCentreFC[i]));
    }
    translate(cityCentreX[i], cityCentreY[i], cityCentreH[i]/2);
    box(20, 20, cityCentreH[i]);
    pop();
  }
  noStroke();
}

/**
 * Calculates the positions of buildings in city centre.
 */
function calculateCityCentreBuildingsPositions() {
  var i = 0;
  var j = 0;

  for (y = -58; y < 60; y += 24) {
    for(x = -70; x < 70; x += 24) {
      
      var height = calculateHeightOfBuilding(x, y, i, j);

      cityCentreX.push(x);
      cityCentreY.push(y);
      cityCentreH.push(height);
      i += 1;
    }
    j += 1;
    i = 0; 
  }
}

/**
 * Calculates the height of buildings in city centre.
 * @param x global x coordinate
 * @param y global y coordinate
 * @param localX local x coordinate of the building in the grid
 * @param localY local y coordinate of the building in the grid
 */
function calculateHeightOfBuilding(x, y, localX, localY) {
  var height = maxHeight;
  if (allEmotions[localY][localX] == '0') {
    value = getValuesAroundBuilding(localX, localY);
    if (value == 0) {
      var h = abs(localX * 0.1 + x/100 - (localY * 0.1 + y/100));
      if (h > 0.65) h = abs(h - 1);
      height = height * h / 4;
    } else {
      height = height * value / 4;
    }
  }
  return height;
}

/**
 * Calculates colours for the city centre in Phase I and Phase II.
 */
function calculateBaseColoursForCentreBuldings() {
  var siz = cityCentreX.length;
  for (i = 0; i < siz; ++i) {
    cityCentreFC.push(color(40, 40, 40, 100));
    cityCentreSC.push(color(60, 60, 60, 100));
  }
}

/**
 * Calculates colours for the city centre in Phase III.
 */
function calculatePhaseThreeColoursForCentreBuildings() {
  cityCentreSC = [];
  cityCentreFC = [];

  var siz = cityCentreX.length;
  for (i = 0; i < siz; ++i) {

    var localy = int(i / 6);
    var localx = i - localy * 6;

    print(localy + " " + localx);

    var opa = setOpacityToBuilding(localx, localy);

    var ratio = cityCentreH[i] / maxHeight;
    var newCol = [pickedColour[0] + ratio * (255 - pickedColour[0]),
                  pickedColour[1] + ratio * (255 - pickedColour[1]),
                  pickedColour[2] + ratio * (255 - pickedColour[2])];
    if (opa == 100) {
      cityCentreSC.push(color(newCol[0], newCol[1], newCol[2], opa));
      newCol = [pickedColour[0] * ratio, pickedColour[1] * ratio, pickedColour[2] * ratio];
      cityCentreFC.push(color(newCol[0], newCol[1], newCol[2], opa));
    } else {
      cityCentreSC.push(color(newCol[0] - 80, newCol[1] - 80, newCol[2] - 80, opa));
      newCol = [pickedColour[0] * ratio, pickedColour[1] * ratio, pickedColour[2] * ratio];
      cityCentreFC.push(color(newCol[0], newCol[1], newCol[2], opa));
    }
  }
}

/**
 * Helper function for 'generateCityNet' to decide, what height the buildings should be, if they are not in a position of '1'
 * @param x X-coordinate of the current building.
 * @param y Y-coordinate of the current building.
 */
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

/**
 * If a word is not find, the building is semitransparent
 */
function setOpacityToBuilding(x, y) {
  var wI = int((y * 6 + x) / 10);
  if (whatWordsWereFound[wI] == false) {
    return 50;
  }
  return 100;
}

/**
 * Generate outskirts around the main city block.
 */
function generateOutskirtsNet() {

  // ABOVE
  generateOutskirtsParts(-214, 218, -202, -58);

  // MIDDLE LEFT
  generateOutskirtsParts(-214, -70, -58, 60);
  
  // MIDDLE RIGHT
  generateOutskirtsParts(74, 210, -58, 60);

  // BELOW
  generateOutskirtsParts(-214, 218, 62, 185);

  // VERY FAR, ALL DIRECTIONS (better effect when camera slide is active)
  drawScatteredBuildings();

  noStroke();
}

/**
 * Generates the outskirts around the main city block within given boundaries (coordinates)
 * @param xMin minimal X coordinate of the boundary
 * @param xMax maximal X coordinate of the boundary
 * @param yMin minimal Y coordinate of the boundary
 * @param yMax maximal Y coordinate of the boundary
 */
function generateOutskirtsParts(xMin, xMax, yMin, yMax) {

  for (y = yMin; y < yMax; y += 24) {
    for (x = xMin; x < xMax; x += 24) {
      
      var d = dist(0, 0, x, y);
      var h = calcuteOutskirtsBuildingsHeight(x, y, d);
      if (h == 0) continue;

      setStrokeColourBuildings(d);
      push();
      translate(x, y, h/2);
      fill(50, 150);
      box(20, 20, h);
      pop();
    }
  }
}

/**
 * Depending on the distance from the centre, the colour of stroke for outskirts buildings is set.
 * @param d distance from the origin (centre of the city)
 */
function setStrokeColourBuildings(d) {
  stroke(50);
  if ((pTwo && pTwoCounter >= 80) || pThree) {
    var strokeColour = [pickedColour[0] * ((width/2.5 - d) / (width/2.5)),
                        pickedColour[1] * ((width/2.5 - d) / (width/2.5)),
                        pickedColour[2] * ((width/2.5 - d) / (width/2.5))]

    stroke(strokeColour[0], strokeColour[1], strokeColour[2]);
  }
}

/**
 * Calculates the building height on given coordinates with sin and cos functions.
 * @param x X-coordinate of the building
 * @param y Y-coordinate of the building
 */
function calcuteOutskirtsBuildingsHeight(x, y, d) {
  var h = 0;
  if (d < 200) {
    if (noise(x * 0.02, y * 0.02) - 0.02 < 0.4) return h;
    d = d / 1000;
    var h = abs(sin(y * d) * x / 6 - (cos(x * d) * y / 6));
    if (h > 20) h = abs(h - 20);
  }
  return h;
}

/**
 * Calculates the scattered buildings around the city centre and outskirts.
 * @param xMin boundary.
 * @param xMax boundary.
 * @param yMin boundary.
 * @param yMax boundary.
 */
function calculateScatteredBuildings(xMin, xMax, yMin, yMax) {
  for (y = yMin; y < yMax; y += 24) {
    for (x = xMin; x < xMax; x += 24) {
      var d = dist(0, 0, x, y);
      var r = (sin(x) / cos(y) - 0.95);  //* cos(x) * sin(y);
      if (r < 0 || d > 400) continue;
      var h = 0;
      scatteredBA.push(150 - (d/400)*100);
      d = d / 1000;
      var h = abs(sin(y * d) * x / 6 - (cos(x * d) * y / 6));
      if (h > 20) h = 25;
      scatteredBX.push(x);
      scatteredBY.push(y);
      scatteredBH.push(h);
    }
  }
}

/**
 * Generates the scattered buildings.
 */
function drawScatteredBuildings() {
  var siz = scatteredBH.length;
  for (i = 0; i < siz; i++) {
    push();
    translate(scatteredBX[i], scatteredBY[i], scatteredBH[i]/2);
    stroke(30);
    fill(50, scatteredBA[i]);
    box(20, 20, scatteredBH[i]);
    pop();
  }
}

/**
 * Creates the ground texture beneath the city.
 * Generated once at the beginning of the Phase I, then few times during the Phase II, and it stays the same during the Phase III.
 */
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
                             ((100 - d) / 100) * 255 - 150);
      planeRoadsTexture.square(x, y, 10);
    }
  } 
}

/**
 * Camera rotation around the city.
 */
function moveCameraPThree() {
  if (!isPaused) {
    var vec = createVector(camInfo[0], camInfo[1]).rotate(-camSpeed);
    cam.camera(vec.x, vec.y, camInfo[2], camInfo[3], camInfo[4], camInfo[5], camInfo[6], camInfo[7], camInfo[8]);
    camInfo[0] = vec.x;
    camInfo[1] = vec.y;
  }
}

/**
 * Renders a plane behind a city to show information about it. 
 * The plane rotates with the camera to show the same face of the plane every frame.
 */
function showInfoFacingCamera() {
  if (!isPaused) {
    planeTextAngle -= camSpeed;
    if (planeTextAngle < -(2 * PI)) {
      planeTextAngle += 2* PI;
    }
    createPlaneCameraTexture();
  }

  //from camera to origin (O - C)
  var vecDir = createVector(camInfo[3] - camInfo[0], camInfo[4] - camInfo[1], camInfo[5] - camInfo[2]).normalize();

  push();
  texture(planeTextTexture);
  translate(camInfo[0] + vecDir.x * 700, camInfo[1] + vecDir.y * 700, camInfo[2] + vecDir.z * 700);
  rotateZ(planeTextAngle - PI/4);
  rotateX(-58 * PI/180);
  plane(800, 800);
  pop();

}

/**
 * Creates texture for the plane behind the city always facing the camera.
 */
function createPlaneCameraTexture() {
  planeTextTexture.clear();
  planeTextTexture.noStroke();
  planeTextTexture.background(0, 0);
  drawBuildingsNetInfo();
  drawInfoEmotions();
  drawCoordinates();
  drawPotentialErrorText();
}

/**
 * Draws minimalistic grid of buildings in the upper left corner. 
 * Buildings with full height are shown in lighter colour.
 * Small dot is drawn after each 10 squares (in rows), to show where the words end.
 */
function drawBuildingsNetInfo() {
  for (j = 0; j < 5; ++j) {
    for (i = 0; i < 6; ++i) {
      if (allEmotions[j][i] == '1') {
        planeTextTexture.fill(180 + random(-30, 30));
      } else {
        planeTextTexture.fill(35 + random(-10, 10));
      }
      planeTextTexture.square(10 + i * 6, 7 + j * 6, 3);

      var v = (i + j * 6);
      if (v % 10 == 0 && v != 0) {
        push();
        planeTextTexture.fill(200 + random(-30, 30));
        planeTextTexture.rect(10 - 2 + i * 6, 7 + 1 + j * 6, 1, 1);
        pop();
      }
    }
  }
}

/**
 * Draws textual information about the percentage of each emotion contained within the city.
 */
function drawInfoEmotions() {
  var curF = int(frameCount / 20) % 10;
  push();
  planeTextTexture.fill(125 + random(-15, 15));
  planeTextTexture.textFont("Courier New");
  planeTextTexture.textSize(5);
  planeTextTexture.textAlign(LEFT);
  var cur = int(averageEmos[curF] * 100);
  planeTextTexture.text(cur + "% " + emotionsStrings[curF], 10, 40);   //+ i * 5
  pop();
}

/**
 * Draws textual information in the form of 'coordinates' changing every few frames.
 * The coordinates are randomized representations of the words written in the text fields.
 * Either a letter from the word is written or its ASCII value, to gether with randomized symbols.
 * This resembles real coordinates system. 
 */
function drawCoordinates() {
  var curF = int(frameCount / 10) % 10;

  if (curF == 0) {
    showErrorText = true;
    fW = generateWordCoordinates(firstWord);
    sW = generateWordCoordinates(secondWord);
    tW = generateWordCoordinates(thirdWord);
  }

  push();
  planeTextTexture.fill(125 + random(-15, 15));
  planeTextTexture.textFont("Courier New");
  planeTextTexture.textSize(5);
  planeTextTexture.textAlign(RIGHT);
  planeTextTexture.text(fW, 174, 12);
  planeTextTexture.text(sW, 174, 19);
  planeTextTexture.text(tW, 174, 26);
  pop();
}

/**
 * Randomizes the characters of the words to 'coordinates-like' line of text.
 * @param originalW Original word from the text field. 
 */
function generateWordCoordinates(originalW) {
  newW = "";
  for (i = 0; i < originalW.length; ++i) {
    var val = random(0, 10);
    if (val < 5) {
      newW += originalW[i];
    } else {
      newW += unchar(originalW[i]);
    }
    newW += random(fancySymbols);
    newW += " "; 
  }
  return newW;
}

/**
 * Generates the text for the number of not found words.
 */
function generateErrorText() {
  if (notFoundSum == 0) {
    errorSumText = "all words found. "
  } else if (notFoundSum == 1) {
    errorSumText = "error: 1 word not found. "
  } else {
    errorSumText = "error: " + notFoundSum + " words not found. "
  }
}

/**
 * Shows the potential error message about not found words.
 */
function drawPotentialErrorText() {
  if (showErrorText) {
    push();
    planeTextTexture.fill(90 + random(-15, 15));
    planeTextTexture.textFont("Courier New");
    planeTextTexture.textSize(5);
    planeTextTexture.textAlign(RIGHT);
    planeTextTexture.text(errorSumText, 174, 40);
    pop();
  }
}

