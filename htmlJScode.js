//  what game needs:
//  1. 2D plane that allows the game to run
//  2. Reset button that clears everything on the plane
//  3. allowing user to click and drag to add new lines manually.

// Here are some of the topics that you should attempt to work on:

// Control speed of the Game of Life. [accomplished] [done]
// Allow users to change the rules of survival. [accomplished]
// Allow users to change the rules of reproduction. [accomplished]
// Start/Stop the Game of life [accomplished] [done]
// Multiple colors of life on the same board. [accomplished] [done]
// Darken colors for stable life. [doable] [done]
// Random initial states [doable]
// Well-known patterns of Game of Life to select from (Examples: Gosper Glider Gun, Glider, Lightweight train). [doable]
// Use Keyboard to control the cursor to place the life [forgo]
// Resize board on windows resize (Check out windowsResized) [done]
// Switching between different styles. [accomplished]
// show iteration version [doable] add count at generate [done]
// Anything else that you could think of.
// only if I have time
// hover change color [doable] (opaciity) 
// change size of mouse press [doable] (mouse drag set change value range to +value - value of x & y)
// impassable terrain (check impassable value at both generate and mouse drag. )


const unitLength = 20;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let gameWidth = document.querySelector('#canvas')
let framePerSec = 10
let count = 0
let boxColor = '#8f916b';
const strokeColor = '#a45c40';
const backgroundColor = '#F6EEE0';
const stableLifeColor = '#a45c40'
let lonely = 2
let overpopulation = 3
let reproduction = 3
let userColor1 = '#8f916b'
let userColor2 = '#c61a09'
let controlPanel = document.querySelector('#controlPanel')
let currentColor = 1;


//Initialize/reset the board state

function init() {
    document.querySelector('[id=pauseBtn]').setAttribute('aria-pressed', 'true')
    document.querySelector('[id=pauseBtn]').setAttribute('class', 'btn btn-primary active')
    count = 0
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = { value: 0, version: 0, stable: 0 };
            nextBoard[i][j] = { value: 0, version: 0, stable: 0 };
        }
    }
}

// setup() Setting up the initial values
// It will only run exactly once.
function setup() {

    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas((gameWidth.offsetWidth - 20), displayHeight);
    canvas.parent(document.querySelector('#canvas'));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
}



// draw() this will run many times. run once per frame.
// if frame rate is 30, draw() will run 30 times per second.
function draw() {
    
    // checks framerate and executes
    frameRate(parseInt(document.querySelector('#userFrameRate').innerHTML))
    background(color(backgroundColor));

    //pause game on active button
    if (document.querySelector('[id=pauseBtn][aria-pressed*="false"]')) {
        generate()
        count++
    } else {
    }
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let e = currentBoard[i][j].version
            changeColor(e)
            if (currentBoard[i][j].value == 1) {
                fill(color(boxColor));
            } else {
                fill(color(backgroundColor));
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
    document.querySelector('#iterationCount').innerHTML = count
}

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            let natives = 0;
            let immigrants = 0;

            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows].value;
                    switch (currentBoard[(x + i + columns) % columns][(y + j + rows) % rows].version) {
                        case "s":
                        case 1: natives += 1;
                            break;
                        case 2: immigrants += 1;
                            break;
                    }
                }
            }

            // Rules of Life
            if (currentBoard[x][y].value == 1) {
                if (neighbors < lonely) {
                    // Die of Loneliness
                    nextBoard[x][y] = { value: 0, version: 0, stable: 0 };
                } else if (neighbors > overpopulation) {
                    // Die of Overpopulation
                    nextBoard[x][y] = { value: 0, version: 0, stable: 0 }
                } else if (currentBoard[x][y].stable == 0) {
                    nextBoard[x][y] = currentBoard[x][y];
                    nextBoard[x][y].stable = 1
                } else if (currentBoard[x][y].stable == 1) {
                    nextBoard[x][y].version = "s"
                }
            } else if (currentBoard[x][y].value == 0 && neighbors == reproduction) {
                // New life due to Reproduction
                if (natives >= immigrants) {
                    nextBoard[x][y] = { value: 1, version: 1, stable: 0 }
                } else { nextBoard[x][y] = { value: 1, version: 2, stable: 0 } }
                nextBoard[x][y].value = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}


/**
 * When mouse is dragged
 */
function mouseDragged() {
    /**
    * If the mouse coordinate is outside the board
    */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    let e = currentBoard[x][y].version;
    if (mouseButton === LEFT){
    currentBoard[x][y].value = 1;
    changeColor(e)
    currentBoard[x][y].version = currentColor
    fill(color(boxColor));
    stroke(color(strokeColor));
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
    }else if (mouseButton === CENTER){
        currentBoard[x][y] = { value: 0, version: 0, stable: 0 }
        fill(color(backgroundColor));
        stroke(color(strokeColor));
        rect(x * unitLength, y * unitLength, unitLength, unitLength);
    }
}

/**
* When mouse is pressed
*/
function mousePressed() {
    noLoop();
    mouseDragged()
}

/**
* When mouse is released
*/
function mouseReleased() {
    loop();
}

// document.querySelector('#reset-game')
//     .addEventListener('click', function () {
//         init();
//     });

function buttonToggle(select) {
    let toggling = document.querySelectorAll('.colorSelector')
    for (let buttons of toggling) {
        buttons.setAttribute('class', 'btn btn-primary col-2 colorSelector')
        buttons.setAttribute('aria-pressed', 'false')
    }
    document.querySelector(select).setAttribute('class', 'btn btn-primary col-2 colorSelector active')
    document.querySelector(select).setAttribute('aria-pressed', 'true')
}




controlPanel.addEventListener('click', function (event) {
    if (event.target.matches('#reset-game')) {
        init()
    } else if (event.target.matches('#userColor1')) {
        buttonToggle('#userColor1')
        currentColor = 1
    } else if (event.target.matches('#userColor2')) {
        buttonToggle('#userColor2')
        currentColor = 2
    }else if (event.target.matches('#frameRateRange')){
        document.querySelector('#userFrameRate').innerHTML = document.querySelector('#frameRateRange').value
    }
})


function changeColor(e) {
    switch (e) {
        case "s": boxColor = stableLifeColor;
            break;
        case 1: boxColor = userColor1;
            break;
        case 2: boxColor = userColor2;
            break;
    }
}

