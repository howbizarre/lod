const icons = {
  "bars":
    `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 24 24" style="enable-background:new 0 0 50 50;" xml:space="preserve">
          <rect x="0" y="0" width="4" height="7" fill="#333">
            <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0s" dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x="10" y="0" width="4" height="7" fill="#333">
            <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.2s" dur="0.6s" repeatCount="indefinite" />
          </rect>
          <rect x="20" y="0" width="4" height="7" fill="#333">
            <animateTransform attributeType="xml" attributeName="transform" type="scale" values="1,1; 1,3; 1,1" begin="0.4s" dur="0.6s" repeatCount="indefinite" />
          </rect>
        </svg>`,
  "plus":
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
          <path fill="none" d="M0 0h24v24H0z"/>
          <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
        </svg>`
};

const indexer = {
  1: { "x": 80, "y": 80 },
  2: { "x": 160, "y": 80 },
  3: { "x": 240, "y": 80 },
  4: { "x": 80, "y": 160 },
  5: { "x": 160, "y": 160 },
  6: { "x": 240, "y": 160 },
  7: { "x": 80, "y": 240 },
  8: { "x": 160, "y": 240 },
  9: { "x": 240, "y": 240 }
};

const DOM = {
  "calculateDate": document.querySelector("#calculate-date"),
  "calculate": document.querySelector("#calculate"),
  "enteredDate": document.querySelector("#birth-date"),
  "currentDate": document.querySelector("#current-date"),
  "canvas": document.querySelector("#canvas")
};

const ctx = (DOM.canvas).getContext("2d");

let currentPointIndex = 1;
let points = null;

ctx.lineCap = "square";
ctx.lineWidth = 5;
ctx.strokeStyle = "rgba(205, 92, 92, 0.25)";
ctx.fillStyle = "#000";

ctx.fillRect(75, 75, 10, 10);
ctx.fillRect(155, 75, 10, 10);
ctx.fillRect(235, 75, 10, 10);
ctx.fillRect(75, 155, 10, 10);
ctx.fillRect(155, 155, 10, 10);
ctx.fillRect(235, 155, 10, 10);
ctx.fillRect(75, 235, 10, 10);
ctx.fillRect(155, 235, 10, 10);
ctx.fillRect(235, 235, 10, 10);

(DOM.currentDate).value = getTodayDateInISOFormat();

(DOM.calculate).addEventListener("click", function () {
  // Split the date values into arrays
  const currentDateArray = (DOM.currentDate).value.split("-");
  const enteredDateArray = (DOM.enteredDate).value.split("-");

  // Reverse and join the date arrays
  const currentDate = arrayFromIterable(currentDateArray).reverse().join("");
  const enteredDate = arrayFromIterable(enteredDateArray).reverse().join("");
  const sumOfDates = (parseInt(currentDate) + parseInt(enteredDate)).toString();

  let waypointIndices = [];
  let sumLength = sumOfDates.length;
  let previousDigit = "0";

  (DOM.calculateDate).innerHTML = sumOfDates;
  (DOM.calculateDate).classList.remove("hidden");

  currentPointIndex = 1;
  points = null;

  (DOM.calculate).disabled = true;
  (DOM.calculate).innerHTML = icons.bars;

  while (sumLength--) {
    let currentDigit = sumOfDates.charAt(sumLength);

    if (currentDigit !== "0" && currentDigit !== previousDigit) {
      waypointIndices.push(indexer[currentDigit]);
      previousDigit = currentDigit;
    }
  }

  points = calculateWaypoints(waypointIndices);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillRect(75, 75, 10, 10);
  ctx.fillRect(155, 75, 10, 10);
  ctx.fillRect(235, 75, 10, 10);
  ctx.fillRect(75, 155, 10, 10);
  ctx.fillRect(155, 155, 10, 10);
  ctx.fillRect(235, 155, 10, 10);
  ctx.fillRect(75, 235, 10, 10);
  ctx.fillRect(155, 235, 10, 10);
  ctx.fillRect(235, 235, 10, 10);

  animateDrawing();
});

function animateDrawing() {
  // Start a new path for the line
  ctx.beginPath();

  // Move the drawing cursor to the current point
  ctx.moveTo(points[currentPointIndex - 1].x, points[currentPointIndex - 1].y);

  // Draw a line to the next point
  ctx.lineTo(points[currentPointIndex].x, points[currentPointIndex].y);

  // Apply the stroke to the path, which will make the line visible
  ctx.stroke();

  // Move to the next point
  currentPointIndex += 1;

  // If there are more points, request the next animation frame
  // Otherwise, enable the calculate button
  if (currentPointIndex < points.length - 1) {
    window.requestAnimationFrame(animateDrawing);
  } else {
    (DOM.calculate).innerHTML = icons.plus;
    (DOM.calculate).disabled = false;
  }
}

function makeItIterable(a) { return a[Symbol.iterator].call(a); }
function arrayFromIterable(a) { return convertIteratorToArray(makeItIterable(a)); }

function convertIteratorToArray(iterator) {
  const resultArray = [];
  let iteratorResult = iterator.next();

  // Loop until the iterator is done
  while (!iteratorResult.done) {
    // Add the current value to the result array
    resultArray.push(iteratorResult.value);

    // Move to the next item in the iterator
    iteratorResult = iterator.next();
  }

  return resultArray;
}

function getTodayDateInISOFormat() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // Months are zero-based in JavaScript

  // Pad the day and month with a leading zero if they are less than 10
  const paddedDay = day < 10 ? "0" + day : day;
  const paddedMonth = month < 10 ? "0" + month : month;

  return `${today.getFullYear()}-${paddedMonth}-${paddedDay}`;
}

function calculateWaypoints(points) {
  const waypoints = [];

  for (let i = 1; i < points.length; i++) {
    const currentPoint = points[i];
    const previousPoint = points[i - 1];

    const xDifference = currentPoint.x - previousPoint.x;
    const yDifference = currentPoint.y - previousPoint.y;

    for (let j = 0; j < 100; j++) {
      waypoints.push({
        x: previousPoint.x + xDifference * j / 100,
        y: previousPoint.y + yDifference * j / 100
      });
    }
  }

  return waypoints;
}