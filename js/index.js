// GUI ELEMENTS <------------------
const speedRange = document.getElementById('speedRange');
const radiusRange = document.getElementById('radiusRange');
const speedRadialProgress = document.getElementById('speedRadialProgress');
const radiusRadialProgress = document.getElementById('radiusRadialProgress');
const clockwiseButton = document.getElementById('clockwiseButton');


// VARIABLES <---------------------
let speedValue = 1;
let radiusValue = 1;
let rpmValue = 1;
let clockwise = 1;

const updateSpeedRange = (e) => {
    rpmValue = e.target.value;
    speedValue = speedRange.value / 60;
    speedRadialProgress.innerHTML = `${rpmValue} rpm`;
    speedRadialProgress.style = `--value:${speedValue * 100}; --size:12rem;`
}


const updateRadiusRange = (e) => {
    radiusValue = radiusRange.value / 100;
    radiusRadialProgress.innerHTML = `${e.target.value} u`;
    radiusRadialProgress.style = `--value:${100 * radiusValue}; --size:8rem;`
}

const updateCloseWise = (e) => {
    clockwise = clockwiseButton.checked ? 1 : -1;
}

speedRange.addEventListener('input', updateSpeedRange);
radiusRange.addEventListener('input', updateRadiusRange);
clockwiseButton.addEventListener('click', updateCloseWise);

// CANVAS SETTINGS <-----------------
const circleCanvasContainer = document.getElementById('circleCanvasContainer');
const xSignalCanvasContainer = document.getElementById('xSignalCanvasContainer');
const ySignalCanvasContainer = document.getElementById('ySignalCanvasContainer');


// For graph
let x = 0;
let y = 0;
let t = 0;

let xv = []; // x vector
let yv = [];
let tv = [];

let phase = 0;
let frequency = 1;

const T = 4 * Math.PI;
const Fs = 150;
const N = T * Fs;
const dt = 1 / Fs;


const pointRadius = 10;
const canvasBackgroundColor = [17, 17, 17]; 
// const canvasBackgroundColor = [255, 255, 255];
const lineColor = [200, 238, 33];
const lineWeight = 4;


let circle = function( sketch ) {
    const width = circleCanvasContainer.clientWidth;
    const height = circleCanvasContainer.clientHeight;

    sketch.setup = function() {
      sketch.createCanvas(width, height);
    };
  
    sketch.draw = function() {
        sketch.background(...canvasBackgroundColor);
        sketch.translate(width /2, height /2);
        sketch.fill(...lineColor);
        sketch.stroke(...lineColor);
        sketch.beginShape();

        const error = 0.1;

        for (let i = 0; i < 1; i++) {

          x = radiusValue * sketch.map(sketch.cos(2 * Math.PI * speedValue * t * clockwise), -1, 1, -200, 200);
          y = radiusValue * sketch.map(sketch.sin(2 * Math.PI * speedValue * t * clockwise), -1, 1, -200, 200);
          
          const angle = - Math.atan2(y, x);

          if (angle >= Math.PI/2 - error && angle <= Math.PI/2 + error){
            sketch.stroke(206, 37, 123);
            sketch.fill(206, 37, 123);
          }

          sketch.strokeWeight(lineWeight);
          sketch.line(0, 0, x, y);
          sketch.circle(x, y, pointRadius);
          
          t += dt;

        }
        sketch.endShape();
    };
 };

let xsignal = (sketch) => {
    const width = xSignalCanvasContainer.clientWidth;
    const height = xSignalCanvasContainer.clientHeight;

    sketch.setup = function() {
        sketch.createCanvas(width, height);
    };

    sketch.draw = function() {
        sketch.background(...canvasBackgroundColor);
        sketch.translate(width /2, height /2);
        sketch.fill(...lineColor);
        sketch.stroke(...lineColor);
        sketch.beginShape();
        for(let i=0; i < 20; i++){
            x = sketch.map(x, -200, 200, -width/2, width/2);
            sketch.strokeWeight(lineWeight);
            sketch.circle(x, t, pointRadius);
        }
        sketch.endShape();
    }
}


let ysignal = (sketch) => {
    const width = ySignalCanvasContainer.clientWidth;
    const height = ySignalCanvasContainer.clientHeight;

    sketch.setup = function() {
        sketch.createCanvas(width, height);
    };

    sketch.draw = function() {
        sketch.background(...canvasBackgroundColor);
        sketch.translate(width /2, height /2);
        sketch.fill(...lineColor);
        sketch.stroke(...lineColor);
        sketch.beginShape();
        for(let i=0; i < 20; i++){
            y = sketch.map(y, -200, 200, -height/ 2, height/2);
            // y = sketch.map(y, -200, 200, -height/2, height/2);
            sketch.strokeWeight(lineWeight);
            // sketch.line(0, 0, x, t);
            sketch.circle(t, y, pointRadius);
        }
        sketch.endShape();
    }
}


let circleCanvas = new p5(circle, 'circleCanvasContainer');
// let xSignalCanvas = new p5(xsignal, 'xSignalCanvasContainer');
// let ySignalCanvas = new p5(ysignal, 'ySignalCanvasContainer');