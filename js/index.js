// GUI ELEMENTS ------------------
const speedRange = document.getElementById('speedRange');
const radiusRange = document.getElementById('radiusRange');
const speedRadialProgress = document.getElementById('speedRadialProgress');
const radiusRadialProgress = document.getElementById('radiusRadialProgress');
const clockwiseButton = document.getElementById('clockwiseButton');
const playButton = document.getElementById('playButton');
const tableContainer = document.getElementById('tableContainer');
const checkTableButton = document.getElementById('checkTableButton');

// SOME CONSTANTS --------------------

const table = [
    {
        angleLabel: '2 PI',
        angle: 2 * Math.PI,
        time: 0.0,
        speed: 0.0,
    },
    {
        angleLabel: '4 PI',
        angle: 4 * Math.PI,
        time: 0.0,
        speed: 0.0,
    },
    {
        angleLabel: '6 PI',
        angle: 6 * Math.PI,
        time: 0.0,
        speed: 0.0,
    },
]


const playIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
`;

const pauseIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
`;


// VARIABLES ---------------------
let speedValue = 0.3;
let radiusValue = 0.8;
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


const renderTable = () => {
    const html = `
        <table class="table w-full">
            <thead>
                <tr>
                    <th>N</th>
                    <th>Ángulo</th>
                    <th>Tiempo</th>
                    <th>Rapidez</th>
                </tr>
            </thead>
            <tbody>
            ${table.map((row, i) =>(
                `
                <tr>
                    <th>${i}</th>
                    <th>${row.angleLabel}</th>
                    <th> <input value="${row.calculatedTime?.toFixed(2) ?? '0.0'}"  id="time${i}" type="text" placeholder="0.0" class="${row.timeCorrect ? 'border border-green-500': 'border border-orange-600' } input w-full max-w-xs" /> </th>
                    <th> <input value="${row.calculatedSpeed?.toFixed(2) ?? '0.0'}" id="speed${i}" type="text" placeholder="0.0" class="${row.speedCorrect ? 'border border-green-500': 'border border-orange-600' } input w-full max-w-xs" /></th>
                </tr>
                `
            ))}
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = html;
}

const evaluateAnswer = (reply, real, error=0.05) => {
    const limit1 = 1 - error;
    const limit2 = 1 + error;
    return reply >= real * limit1 && reply <= real * limit2;
}

const checkTable = () => {
    table.map((row, i) => {
        const calculatedTime = Number(document.getElementById(`time${i}`).value);
        const calculatedSpeed = Number(document.getElementById(`speed${i}`).value);
        row.calculatedSpeed = calculatedSpeed;
        row.calculatedTime = calculatedTime;
        row.timeCorrect = evaluateAnswer(calculatedTime, row.time);
        row.speedCorrect = evaluateAnswer(calculatedSpeed, row.speed);
    });
    renderTable();
    console.log(table);
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
const getRandomVariables = () => {
    speed = getRandomVariables()
}


// CANVAS SETTINGS -----------------

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
const canvasBackgroundColor = [255, 255, 255];

const lineColor = [235, 97, 52];
const enhanceColor = [80, 80, 80];
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

        // if(!playButton.classList.contains('paused'))
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


// RUNNING INITIAL FUNCTIONS

renderTable();
checkTableButton.addEventListener('click', checkTable)
