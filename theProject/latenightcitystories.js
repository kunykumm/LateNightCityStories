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
var bgCity;

var firstWord;
var secondWord;
var thirdWord;

var firstEmotions;
var secondEmotions;
var thirdEmotions;
var sumOfOnes;
var positionVector;

var generate;
var pOne;
var pTwo;
var pThree;

var pOneCounter;
var xCity;
var yCity;
var xCitySign;
var yCitySign;
var xShift;
var yShift;
var timeBezier;

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
  positionVector = [];
}

function setupWindow() {
  canvas = createCanvas(600, 600, WEBGL);
  canvas.position(260, 50);
  //background(0);
  bgCity = createGraphics(width, height);
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
  makeSumOfOnes();
  calculateCityCentre();
  //print("PosVec" + positionVector);

  generate = true;
  pOne = true;
}

function validateWords() {
  firstEmotions = validateAWord(firstWord);
  secondEmotions = validateAWord(secondWord);
  thirdEmotions = validateAWord(thirdWord);
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
    emotions = ['1', '0', '0', '0', '0', '0', '1', '0', '0', '0'];
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
  
function draw() {
  if (!generate) return;
  
  if (pOne) {
    print("phaseOne");
    phaseOne();
  }

  if (pTwo) {

  }

  if (pThree) {
    
    generate = false;
  }
}

function phaseOne() {
  generateNoise();
  generateCentreNoise();
  pOneCounter++;
  if (pOneCounter == 10) {
    pOne = false;
    pTwo = true;
  }
  bgCity = createGraphics(width, height);
}

function calculateCityCentre() {

  print("CalculateCityCentre");
  for (i = 0; i < 5; ++i) {

    if (firstEmotions[i] == '1') xCity++;
    if (secondEmotions[i] == '1') xCity++;
    if (thirdEmotions[i] == '1') xCity++;

    if (firstEmotions[i + 5] == '1') yCity++;
    if (secondEmotions[i + 5] == '1') yCity++;
    if (thirdEmotions[i + 5] == '1') yCity++;

  }
  xCity = xCity / 6;
  yCity = yCity / 6;

  if (xCity < 1) xCitySign = -1;
  if (yCity < 1) yCitySign = -1;

}

function makeSumOfOnes() {
  for (i = 0; i < 10; ++i) {
    if (firstEmotions[i] == '1') sumOfOnes++;
    if (secondEmotions[i] == '1') sumOfOnes++;
    if (thirdEmotions[i] == '1') sumOfOnes++;
  }
}

function generateNoise() {
  
  var allowF = false;
  print("noise");
  
  stroke(255, random(150, 170), 26);
  fill(0);

  n_range = 10;
  step = 4;
  treshold = .98;

  fillBackground = 0;

  num = firstEmotions[pOneCounter] + secondEmotions[pOneCounter] + thirdEmotions[pOneCounter];
  if (num > 0) {
    n_range = random(10, 40);
    fillBackground = 80;
  }

  for (x = -width/2; x < width/2; x += step) {
    for (y = -height/2; y < height/2; y += step) {

      nx = map(x, -width/2, width/2, 0, n_range);
      ny = map(y, -height/2, height/2, 0, n_range);

      n_value = noise(nx, ny) * (220 - fillBackground);
      
      if (n_value  < 100 && random(1) > treshold) {
        strokeWeight(random(0.4));
        square(x + random(2), y + random(2), random(3, 5));
      }
    }
  }

  noStroke();
  fill(0, 10);
  rect(-width/2, -height/2, width, height);
}

function generateCentreNoise() {        //Poincare Disk Model

  print("generateCity");

  stroke(255, random(150, 170), 25);
  fill(0, 75);

  for (let i = 0; i < 1000; i++) {      //sumOfOnes * 800

    let theta = random(0, TWO_PI);
    var g = random(xCity * (-5), yCity * 5);
    let h = randomGaussian(g);

    let r = (exp(h) - 1) / (exp(h) + 1);
    let x = width / (random(0, 4)) * r * cos(theta);
    let y = height / (random(0, 4)) * r * sin(theta);

    if (i % sumOfOnes != 0) {

      for (j = 0; j < sumOfOnes; j++) {
        var xPos = x + xCitySign * xCity * (width/20) * random(5, 10);
        var yPos = y + yCitySign * yCity * (height/20) * random(5, 10);

        var dis = int(dist(xPos, yPos, x, y));

        if (dis > width/6) {
          if (random(10) < 7) continue;
        }

        if (i % j == 0) {
          stroke(255, random(150, 170), 25);
          strokeWeight(random(0.5));
          square(xPos, yPos, random(3, 5));
        }
      }
    }

    // if (i % 40 == 0) {
    //   stroke(255, random(150, 170), 25);
    //   strokeWeight(random(0.4));
    //   line(xCity + random(-100, 100), yCity + random (-100, 100), xPos, yPos);
    // } else if (i % 20 == 0) {
    //     stroke(0, 50);
    //     strokeWeight(random(0.4));
    //     line(xCity + random(-100, 100), yCity + random (-100, 100), xPos, yPos);
    // }

    if (i % 40 == 0) {

    } 
    else if (i % 20 == 0) {
      
    }
  }
}

function generateBuildings() {
  push();
  scale(1, 5, 1);
  box();
  pop();
  translate(100,100,-100);
  box();
}
