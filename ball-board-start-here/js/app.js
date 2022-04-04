var SICK = 'SICK'
var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE'
var GLUE_IMG = '<img src="img/candy.png" />'
var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var SICK_IMG = '<img src="img/gamer-purple.png"/>'
var glueI ;
var glueJ;
var glueIntervalId;
var isSick = false;

var gBoard;
var gGamerPos;
var gIntervalId;
var gBallCounted = 0;
var gBallsLefts = 2;
var elModal;

function initGame() {
	gBallCounted = 0;
	elModal = document.querySelector('.modal');
	elModal.style.display = 'none';
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard(gBoard);
 	gIntervalId = setInterval(addBall,5000);
	glueIntervalId = setInterval(addGlue,5000);
}


function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)


	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}

			// Add created cell to The game board
			board[i][j] = cell;
		}
	}
	board[0][4].type = FLOOR;
	board[board.length - 1][4].type = FLOOR;
	board[5][0].type = FLOOR;
	board[5][board[0].length -1].type = FLOOR

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {

	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			// if (currCell.type === FLOOR) cellClass += ' floor';
			// else if (currCell.type === WALL) cellClass += ' wall';
			cellClass += (currCell.type === FLOOR) ?  ' floor' : ' wall';

			//TODO - Change To template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}

			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}

	console.log('strHTML is:');
	console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if(isSick) return 
	
	if (i < 0) i = 9;
	if(i > 9) i = 0;
	if(j<0) j = 11;
	if(j>11) j=0;

	var targetCell = gBoard[i][j];
	console.log(targetCell);
	if (targetCell.type === WALL) return;
	
	
	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) || (iAbsDiff === 9) || (jAbsDiff === 11)) {

		
		if (targetCell.gameElement === BALL) {
			console.log('Collecting!');
			var audio = new Audio('sound/SPRTField_Ball kicked (ID 1044)_BSB.wav');
			//audio.play();
			gBallCounted++
			gBallsLefts--
			if(gBallsLefts === 0) {
				clearInterval(gIntervalId)
				elModal = document.querySelector('.modal');
				elModal.style.display = 'block';
			}
			var elScore = document.querySelector('.score') ;
			elScore.innerText = gBallCounted;
			
		}

		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		if(targetCell.gameElement === GLUE) {
			isSick = true
			
		//	targetCell.gameElement = SICK;
			
			renderCell({i:i, j:j},SICK_IMG);
			gGamerPos.i = i;
			gGamerPos.j = j;
			gBoard[gGamerPos.i][gGamerPos.j].gameElement = SICK;
			setTimeout(()=>{

				isSick = false
				gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
				renderCell({i:i,j:j},GAMER_IMG)
			},3000)
			return
		}
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);

	} // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
	if(value === GLUE_IMG){
		var gGlueTimeout= setTimeout(removeGlue, 3000)	
	}
}

// Move the player by keyboard arrows
function handleKey(event) {

	var i = gGamerPos.i;
	var j = gGamerPos.j;


	switch (event.key) {
		case 'ArrowLeft':
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function addBall(){
	
	var randomI = getRandomInt(1,10);
	var randomJ = getRandomInt(1,12);
	var targetRandom = gBoard[randomI][randomJ];
	if(isEmpty({i: randomI, j: randomJ})){
		targetRandom.gameElement = BALL;
		renderCell({i: randomI, j: randomJ}, BALL_IMG)
		gBallsLefts++;
	} else {
		addBall()
	}

}

function isEmpty(location){
	var target = gBoard[location.i][location.j];
	return (target.gameElement === null && target.type === FLOOR);
}


function addGlue(){
	glueI = getRandomInt(1,10);
	glueJ = getRandomInt(1,12);
	var targetRandom = gBoard[glueI][glueJ];
	if(isEmpty({i: glueI, j: glueJ})){
		targetRandom.gameElement = GLUE;
		renderCell({i: glueI, j: glueJ}, GLUE_IMG)
	} else {
		addGlue()
	}

}

function removeGlue(){
	gBoard[glueI][glueJ].gameElement = FLOOR;
	renderCell({i: glueI, j: glueJ},'') 
}
