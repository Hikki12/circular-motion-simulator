// GUI ELEMENTS ------------------
const speedRange = document.getElementById('speedRange');
const radiusRange = document.getElementById('radiusRange');
const speedRadialProgress = document.getElementById('speedRadialProgress');
const radiusRadialProgress = document.getElementById('radiusRadialProgress');
const clockwiseButton = document.getElementById('clockwiseButton');
const playButton = document.getElementById('playButton');
const tableContainer = document.getElementById('tableContainer');
const checkTableButton = document.getElementById('checkTableButton');

const speedLabel = document.getElementById('speedLabel');
const radiusLabel = document.getElementById('radiusLabel');

// SOME CONSTANTS --------------------

const playIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
`;

const pauseIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
`;

// VARIABLES ---------------------
let speedValue = 0.25;
let radiusValue = 0.8;
let clockwise = 1;


const table = [
    {
        angleLabel: '2',
        angle: 2 * Math.PI,
        laps: 4,
        speed: 0,
        time: 0.0,
    },
    {
        angleLabel: '4',
        angle: 4 * Math.PI,
        laps: 8,
        speed: 0,
        time: 0.0,
    },
    {
        angleLabel: '6',
        angle: 6 * Math.PI,
        laps: 16,
        speed: 0,
        time: 0.0,
    },
]



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
     <table class="tw-table tw-w-full tw-text-center">
            <thead>
                <tr>
                    <th>Vueltas</th>
                    <th>Tiempo</th>
                    <th>Período</th>
                    <th>Frecuencia</th>
                </tr>
            </thead>
            <tbody>
            ${table.map((row, i) =>(
                `<tr>
                    <th>${row.laps}</th>
                    <th> <input value="${row.calculatedTime?.toFixed(2) ?? '0.0'}"  id="time${i}" type="text" placeholder="0.0" class="${row.timeCorrect ? 'border border-green-500': 'border border-orange-600' } tw-input tw-w-full tw-max-w-xs" /> </th>
                    <th> <input value="${row.calculatedTime?.toFixed(2) ?? '0.0'}"  id="time${i}" type="text" placeholder="0.0" class="${row.timeCorrect ? 'border border-green-500': 'border border-orange-600' } tw-input tw-w-full tw-max-w-xs" /> </th>
                    <th> <input value="${row.calculatedSpeed?.toFixed(2) ?? '0.0'}" id="speed${i}" type="text" placeholder="0.0" class="${row.speedCorrect ? 'border border-green-500': 'border border-orange-600' } tw-input tw-w-full tw-max-w-xs" /></th>
                </tr>`
            ))}
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = html;
}

const updateTable = () => {
    table.map((row, i) =>{
        row.speed = 2 * Math.PI * speedValue;
        row.time = row.laps / speedValue;
    });
}

const evaluateAnswer = (reply, real, error=0.05) => {
    const limit1 = 1 - error;
    const limit2 = 1 + error;
    return reply >= real * limit1 && reply <= real * limit2;
}

const checkTable = () => {
    // T: tiempo medición
    // N: número de vueltas
    // Period = T / N
    table.map((row, i) => {
        const calculatedTime = Number(document.getElementById(`time${i}`).value);
        const calculatedSpeed = Number(document.getElementById(`speed${i}`).value);
        row.calculatedSpeed = calculatedSpeed;
        row.calculatedTime = calculatedTime;
        row.timeCorrect = evaluateAnswer(calculatedTime, row.time);
        row.speedCorrect = evaluateAnswer(calculatedSpeed, row.speed);
    });
    renderTable();
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

const getRandomVariables = () => {
    speedValue = getRandomArbitrary(0.3, 0.8);
    clockwise = Math.random() < 0.5 ? 1 : -1;
}

const displayVariables = () => {
    speedLabel.innerHTML = `<b>Speed:</b>  ${(speedValue * 60).toFixed(2)} rpm | ${speedValue.toFixed(2)} Hz`;
    radiusLabel.innerHTML = `<b>Radius:</b>  ${radiusValue * 100} u`;
}


// CANVAS SETTINGS -----------------

const circleCanvasContainer = document.getElementById('circleCanvasContainer');

// For graph
let x = 0;
let y = 0;
let t = 0;


let phase = 0;

const FPS = 40;


const pointRadius = 20;
const canvasBackgroundColor = [255, 255, 255];

const lineColor = [235, 97, 52];
const enhanceColor = [80, 80, 80];
const lineWeight = 4;

let lastTime = Date.now();

const sampleTime = () => {
    const elapsed = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();
    return elapsed;
}


let circle = function( sketch ) {

    let width = circleCanvasContainer.clientWidth;
    let height = circleCanvasContainer.clientHeight;

    sketch.setup = function() {
      circleCanvas = sketch.createCanvas(width, height);
      sketch.frameRate(FPS);
    };
  
    sketch.draw = function() {

        const error = 0.2;
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
        
        if (angle >= Math.PI / 2 - error && angle <= Math.PI / 2 + error){
            sketch.fill(...enhanceColor);
            sketch.stroke(...enhanceColor);
            sketch.circle(x, y, pointRadius);
        }
        t += sampleTime();
    
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

getRandomVariables();
updateTable();
renderTable();
displayVariables();
checkTableButton.addEventListener('click', checkTable)
