// GUI ELEMENTS <------------------
const speedRange = document.getElementById('speedRange');
const radiusRange = document.getElementById('radiusRange');
const speedRadialProgress = document.getElementById('speedRadialProgress');
const radiusRadialProgress = document.getElementById('radiusRadialProgress');
const clockwiseButton = document.getElementById('clockwiseButton');
const playButton = document.getElementById('playButton');


const playIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>

`;

const pauseIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
`;


// VARIABLES <---------------------
let speedValue = 1;
let radiusValue = 1;
let clockwise = 1;


const updateSpeedRange = (e) => {
    speedValue = speedRange.value / 60;
    speedRadialProgress.innerHTML = `${speedRange.value} rpm`;
    speedRadialProgress.style = `--value:${speedValue * 100}; --size:12rem;`
}


const updateRadiusRange = (e) => {
    radiusValue = radiusRange.value / 100;
    radiusRadialProgress.innerHTML = `${radiusRange.value} u`;
    radiusRadialProgress.style = `--value:${100 * radiusValue}; --size:8rem;`
}

const updateCloseWise = (e) => {
    clockwise = clockwiseButton.checked ? 1 : -1;
}

const togglePlayState = (e) => {
    playButton.classList.toggle('paused');
    playButton.innerHTML = playButton.classList.contains('paused') ? pauseIcon : playIcon;
}

speedRange.addEventListener('input', updateSpeedRange);
radiusRange.addEventListener('input', updateRadiusRange);
clockwiseButton.addEventListener('click', updateCloseWise);
playButton.addEventListener('click', togglePlayState);

// CANVAS SETTINGS <-----------------
const circleCanvasContainer = document.getElementById('circleCanvasContainer');

// For graph
let x = 0;
let y = 0;
let t = 0;


let phase = 0;


const Fs = 30;
const dt = 1 / Fs;
const FPS = 30;


const pointRadius = 20;
const canvasBackgroundColor = [17, 17, 17]; 
// const canvasBackgroundColor = [255, 255, 255];

const lineColor = [200, 238, 33];
const enhanceColor = [206, 37, 123];
const lineWeight = 4;


let circle = function( sketch ) {

    let width = circleCanvasContainer.clientWidth;
    let height = circleCanvasContainer.clientHeight;

    sketch.setup = function() {
      circleCanvas = sketch.createCanvas(width, height);
      sketch.frameRate(FPS);
    };
  
    sketch.draw = function() {

        const error = 0.1;

        sketch.background(...canvasBackgroundColor);
        sketch.translate(width /2, height /2);
        sketch.fill(...lineColor);
        sketch.stroke(...lineColor);
        sketch.beginShape();

        x = radiusValue * sketch.map(sketch.cos(2 * Math.PI * speedValue * t * clockwise), -1, 1, -height / 2, height/ 2);
        y = radiusValue * sketch.map(sketch.sin(2 * Math.PI * speedValue * t * clockwise), -1, 1, -height / 2, height/ 2);
        
        const angle = - Math.atan2(y, x);

        sketch.strokeWeight(lineWeight);
        sketch.line(0, 0, x, y);
        sketch.circle(x, y, pointRadius);
        
        if (angle >= Math.PI/2 - error && angle <= Math.PI/2 + error){
            sketch.fill(...enhanceColor);
            sketch.stroke(...enhanceColor);
            sketch.circle(x, y, pointRadius);
        }

        if(!playButton.classList.contains('paused'))
            t += dt;

        sketch.endShape();
    };

    sketch.windowResized = function () {
        width = circleCanvasContainer.clientWidth;
        height = circleCanvasContainer.clientHeight;  
        sketch.resizeCanvas(width, height);
    }
};


let circleCanvas = new p5(circle, 'circleCanvasContainer');

updateSpeedRange();
updateRadiusRange();