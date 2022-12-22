//  what game needs:
//  1. 2D plane that allows the game to run
//  2. Reset button that clears everything on the plane
//  3. allowing user to click and drag to add new lines manually.

const unitLength  = 20;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let gameWidth = document.querySelector('#canvas')
console.log("Game width =" + gameWidth.offsetWidth)




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
function setup(){
    /* Set the canvas to be under the element #canvas*/
	const canvas = createCanvas((gameWidth.offsetWidth - 20),displayHeight);
	canvas.parent(document.querySelector('#canvas'));

	/*Calculate the number of columns and rows */
	columns = floor(width  / unitLength);
	rows    = floor(height / unitLength);
	
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
 function draw(){
    const boxColor    = color('#8f916b');
    const strokeColor = color('#a45c40');
    const backgroundColor = color('#F6EEE0');
   
background(backgroundColor);
   generate();
   for (let i = 0; i < columns; i++) {
       for (let j = 0; j < rows; j++) {
           if (currentBoard[i][j] == 1){
               fill(boxColor);  
           } else {
               fill(backgroundColor);
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
                   if( i == 0 && j == 0 ){
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
    const boxColor    = color('#8f916b');
    const strokeColor = color('#a45c40');
    /**
    * If the mouse coordinate is outside the board
    */
   if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
       return;
   }
   const x = Math.floor(mouseX / unitLength);
   const y = Math.floor(mouseY / unitLength);
   currentBoard[x][y] = 1;
   fill(boxColor);
   stroke(strokeColor);
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
	.addEventListener('click', function() {
		init();
	});