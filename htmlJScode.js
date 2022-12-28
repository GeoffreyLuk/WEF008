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
// Random initial states [doable] [done]
// Well-known patterns of Game of Life to select from (Examples: Gosper Glider Gun, Glider, Lightweight train). [doable] [done]
// Use Keyboard to control the cursor to place the life [forgo]
// Resize board on windows resize (Check out windowsResized) [done]
// Switching between different styles. [accomplished] [done]
// show iteration version [doable] add count at generate [done]
// Anything else that you could think of.
// only if I have time
// hover change color [doable] (opaciity) 
// change size of mouse press [doable] (mouse drag set change value range to +value - value of x & y) [done]
// impassable terrain (check impassable value at both generate and mouse drag. ) [done]


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
let userColor2 = '#DBC4AF'
let controlPanel = document.querySelector('#controlPanel')
let currentColor = 1;


//Initialize/reset the board state. Game mode query from radio. All box value must be set, must run normalInit / randomInit

function init() { //init is only called during setup and reset.
    document.querySelector('[id=pauseBtn]').setAttribute('aria-pressed', 'true')
    document.querySelector('[id=pauseBtn]').setAttribute('class', 'btn btn-primary active')
    count = 0 // for when reset button is clicked
    let midpointX = floor(rows / 2) //using midpoint to place game modes
    let midpointY = floor(columns / 2)

    //different game modes
    switch (document.querySelector('.whatAGame[checked="null"]').getAttribute('id')) {
        case "defaultGameMode": normalInit(); break;
        case "randomGameMode": randomInit(); break;
        case "beaconGameMode":
            normalInit()
            beaconInit(); break;
        case "gliderGameMode":
            normalInit()
            gliderInit(); break;
        case "spaceshipGameMode":
            normalInit()
            spaceshipInit(); break;
        case "GGG":
            normalInit()
            GGG(); break;
    }

    function normalInit() {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                currentBoard[i][j] = { value: 0, version: 0, stable: 0, impassable: false, specialValue: 0 };
                nextBoard[i][j] = { value: 0, version: 0, stable: 0, impassable: false, specialValue: 0 };
            }
        }
    }
    function randomInit() {
        for (let i = 0; i < columns; i++) {
            for (let j = 0; j < rows; j++) {
                currentBoard[i][j] = { value: (floor(Math.random() * 2)), version: 1, stable: 0, impassable: false, specialValue: 0 };
                nextBoard[i][j] = { value: 0, version: 0, stable: 0, impassable: false, specialValue: 0 };
            }
        }
    }
    function beaconInit() {
        let template = [[0, 0], [0, 1], [1, 0], [2, 3], [3, 2], [3, 3]]
        for (let unit of template) {
            currentBoard[midpointY + unit[0]][midpointX + unit[1]] = { value: 1, version: 1, stable: 0, impassable: false, specialValue: 0 };
        }
    }
    function gliderInit() {
        let template = [[0, 0], [1, -2], [1, 0], [2, -1], [2, 0]]
        for (let unit of template) {
            currentBoard[midpointY + unit[0]][midpointX + unit[1]] = { value: 1, version: 1, stable: 0, impassable: false, specialValue: 0 };
        }
    }
    function spaceshipInit() {
        let template = [[0, 0], [1, -2], [1, 2], [2, 3], [3, -2], [3, 3], [4, -1], [4, 0], [4, 1], [4, 2], [4, 3]]
        for (let unit of template) {
            currentBoard[midpointY + unit[0]][midpointX + unit[1]] = { value: 1, version: 1, stable: 0, impassable: false, specialValue: 0 };
        }
    }
    function GGG() {
        let template = [[0, 11], [1, 9], [1, 11], [2, -1], [2, 0], [2, 7], [2, 8], [2, 21], [2, 22], [3, -2], [3, 2], [3, 7], [3, 8], [3, 21], [3, 22],
        [4, -12], [4, -13], [4, -3], [4, 3], [4, 7], [4, 8], [5, -12], [5, -13], [5, -3], [5, 1], [5, 3], [5, 4], [5, 9], [5, 11], [6, -3], [6, 3], [6, 11], [7, -2], [7, 2], [8, -1], [8, 0]]
        for (let unit of template) {
            currentBoard[midpointY + unit[0]][midpointX - 5 + unit[1]] = { value: 1, version: 1, stable: 0, impassable: false, specialValue: 0 };
        }
    }
}

// setup() Setting up the initial values
// It will only run exactly once.
function setup() {

    // Set the canvas to be under the element #canvas canvas size dependent on div[#canvas] width - 20px to offset missing columns
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

// draw() this will run many times. The number of time it runs is based on framerate() Will use this to return values that must be constantly checked
function draw() {

    // checks framerate and executes
    frameRate(parseInt(document.querySelector('#userFrameRate').innerHTML))
    background(color(backgroundColor));
    userColor1 = document.querySelector('#userColor1Input').value //changes mousepressed color
    userColor2 = document.querySelector('#userColor2Input').value

    //pause game on active button, by preventing generate() currentboard !> nextboard. still allows mouse press
    if (document.querySelector('[id=pauseBtn][aria-pressed*="false"]')) {
        generate()
        count++
    }
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            let e = currentBoard[i][j].version
            changeColor(e) //change color takes the version of each cell and changes boxColor to value
            if (currentBoard[i][j].value == 1 || currentBoard[i][j].specialValue == 1) {
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
                        case "i": ; //impassables are not counted as neighbour since value == 0
                            break;
                        case "s": // stasis have value == 1. counted even though they have different version as 1. Immigrants who have become stasis will become natives
                        case 1: natives += 1;
                            break;
                        case 2: immigrants += 1;
                            break;
                    }
                }
            }

            // Rules of Life
            if (currentBoard[x][y].impassable == true) {
                nextBoard[x][y] = { value: 0, version: "i", stable: 0, impassable: true, specialValue: 1 };
            } else if (currentBoard[x][y].value == 1) {
                if (neighbors < lonely) {
                    // Die of Loneliness
                    nextBoard[x][y] = { value: 0, version: 0, stable: 0, impassable: false, specialValue: 0 };
                } else if (neighbors > overpopulation) {
                    // Die of Overpopulation
                    nextBoard[x][y] = { value: 0, version: 0, stable: 0, impassable: false, specialValue: 0 }
                } else if (currentBoard[x][y].stable == 3) { //assign living cells who are alive after 3 cycles as stasis
                    nextBoard[x][y] = currentBoard[x][y];
                    nextBoard[x][y].version = "s"
                } else if (currentBoard[x][y]) { //normal filled box
                    nextBoard[x][y] = currentBoard[x][y];
                    nextBoard[x][y].stable ++
                }
            } else if (currentBoard[x][y].value == 0 && neighbors == reproduction) {
                // New life due to Reproduction
                if (natives >= immigrants) {
                    nextBoard[x][y] = { value: 1, version: 1, stable: 0, impassable: false, specialValue: 0 }
                } else { nextBoard[x][y] = { value: 1, version: 2, stable: 0, impassable: false, specialValue: 0 } }
                // nextBoard[x][y].value = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}

function mouseDragged() { //did not use delete and add on same keybind as it will trigger draw too many times
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    }
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    let e = currentBoard[x][y].version;
    if (mouseButton === LEFT) {
        let area = areaFilled(document.querySelector('.fillMyHole[checked="null"]').getAttribute('id'))
        for (let wide of area) {
            for (let high of area) {
                if (currentColor == "i") { //specialvalues when placing impassable guarantees it will not trigger neighbours and will be filled in draw
                    currentBoard[x + wide][y + high].specialValue = 1
                    currentBoard[x + wide][y + high].impassable = true
                } else { currentBoard[x + wide][y + high].value = 1; }
                changeColor(e)
                currentBoard[x + wide][y + high].version = currentColor
                fill(color(boxColor));
                stroke(color(strokeColor));
                rect(x * unitLength, y * unitLength, unitLength, unitLength);
            }
        }
    } else if (mouseButton === CENTER) { //deletes cells
        currentBoard[x][y] = { value: 0, version: 0, stable: 0, impassable: false, specialValue: 0 }
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

function buttonToggle(select) { //because I did not see class/attribute changing when I pressed normally. change all associated values to false, but activate selected button
    let toggling = document.querySelectorAll('.colorSelector')
    for (let buttons of toggling) {
        buttons.setAttribute('class', 'btn btn-primary col colorSelector')
        buttons.setAttribute('aria-pressed', 'false')
    }
    document.querySelector(select).setAttribute('class', 'btn btn-primary col colorSelector active')
    document.querySelector(select).setAttribute('aria-pressed', 'true')
}

controlPanel.addEventListener('click', function (event) {//what happens when you click on control panel
    if (event.target.matches('#reset-game')) {
        init()
    } else if (event.target.matches('#userColor1')) {
        buttonToggle('#userColor1')
        currentColor = 1
    } else if (event.target.matches('#userColor2')) {
        buttonToggle('#userColor2')
        currentColor = 2
    } else if (event.target.matches('#impassable')) {
        buttonToggle('#impassable')
        currentColor = "i"
    } else if (event.target.matches('#frameRateRange')) {
        document.querySelector('#userFrameRate').innerHTML = document.querySelector('#frameRateRange').value
    } else if (event.target.matches('#defaultColor')) {
        userColor1 = "#8f916b"
        userColor2 = "#DBC4AF"
        document.querySelector('#userColor1Input').value = userColor1
        document.querySelector('#userColor2Input').value = userColor2
    } else if (event.target.matches('[class*=whatAGame]')) {
        changeGameMode(event.target)
    } else if (event.target.matches('[class*=fillMyHole]')) {
        changeFilledHoles(event.target)
    }
})

function changeColor(color) { //changes color based on what is the version of the box. it can also be affected by colorSelector(user1 or user2)
    switch (color) {
        case "i": boxColor = "#000000";
            break;
        case "s": boxColor = stableLifeColor;
            break;
        case 1: boxColor = userColor1;
            break;
        case 2: boxColor = userColor2;
            break;
    }
}

function changeGameMode(game) {//same as button toggle
    for (let stuff of document.querySelectorAll('.whatAGame')) {
        stuff.removeAttribute('checked')
    }
    game.setAttribute('checked', null)
}

function changeFilledHoles(e) {//same as button toggle
    for (let stuff of document.querySelectorAll('.fillMyHole')) {
        stuff.removeAttribute('checked')
    }
    e.setAttribute('checked', null)
}

function areaFilled(num) {//placed in mouse pressed. returns array to fill in boxes with for^2 loops
    switch (num) {
        case "fillOne": return [0];
        case "fillTwo": return [-1, 0, 1];
        case "fillThree": return [-2, -1, 0, 1, 2];
    }
}
