//  what game needs:
//  1. 2D plane that allows the game to run
//  2. Reset button that clears everything on the plane
//  3. allowing user to click and drag to add new lines manually.

// Here are some of the topics that you should attempt to work on:

// Control speed of the Game of Life. [accomplished]
// Allow users to change the rules of survival. [accomplished]
// Allow users to change the rules of reproduction. [accomplished]
// Start/Stop the Game of life [accomplished]
// Multiple colors of life on the same board. [accomplished]
// Darken colors for stable life. [doable]
// Random initial states [doable]
// Well-known patterns of Game of Life to select from (Examples: Gosper Glider Gun, Glider, Lightweight train). [doable]
// Use Keyboard to control the cursor to place the life
// Resize board on windows resize (Check out windowsResized)
// Switching between different styles. [accomplished]
// show iteration version [doable] add count at generate
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
console.log("Game width =" + gameWidth.offsetWidth)

const boxColor = '#8f916b';
const strokeColor = '#a45c40';
const backgroundColor = '#F6EEE0';



//Initialize/reset the board state

function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
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
frameRate(parseInt(document.querySelector('#userFrameRate').innerHTML))


    background(color(backgroundColor));
    generate();
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                fill(color(boxColor));
            } else {
                fill(color(backgroundColor));
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
}

function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }

            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < 2) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > 3) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == 3) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
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
    currentBoard[x][y] = 1;
    fill(color(boxColor));
    stroke(color(strokeColor));
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}

/**
* When mouse is pressed
*/
function mousePressed() {
    noLoop();
    mouseDragged();
}

/**
* When mouse is released
*/
function mouseReleased() {
    loop();
}

document.querySelector('#reset-game')
    .addEventListener('click', function () {
        init();
    });