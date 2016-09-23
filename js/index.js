/* Kostas Tsolkas TicTacToe version 1.1

This is a responsive designed, unbeatable TicTacToe game.
In this version I decided to rewrite most of the AI logic since version 1.0 was poorly written. 
It features 3 difficulty levels and it gives the player the option to choose his mark.
In the game 'X' plays first every time.

The AI on unbeatable level will randomly pick one of the most optimal moves in order to
ensure that every game feels at least somewhat different while still being unbeatable.

TODO: Add more comments.*/


$('document').ready(function() {
	var grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
	moves = 0,
	score = [0, 0, 0],
	first = false,
	playerMark = 'O',
	computerMark = 'X',
	difficultyLevel = '2';
	function computerMove() {
		var x, y, randomCell, randomCell2, gridBox;
		function checkPossibleWinningOutcomes(whatGrid, forWhom) {
			var regex, winningCombinations = [];
			/*regexp that will help us determine if there is a possible winning outcome. Specifically
			we are going to test that regex against every horizontal, vertical and diagonal areas 
			of our grid. Here is an example: assuming whatGrid = [[2, 1, 0], [2, 0, 1], [0, 0, 0]]
			these are the horizontal areas in string form : 210, 201, 000
			these are the vertical areas in string form : 220, 100, 010
			these are the diagonal areas in string form : 200, 000
			if forWhom equals 2(checking for the computer) we can see that the first vertical area
			is a winning area if the computer puts the mark on x:2 y:0 */
			regex = new RegExp('^' + ('0*' + forWhom).repeat(2) + '0*$');
			/*checkHorizontal, checkVertical and checkDiagonal check if there is such an empty space on the grid
			that putting a mark there will produce a winning outcome and if such empty space exists it returns its
			coordinates, otherwise it returns nothing */
			function checkHorizontal() {
				var x, y;
				whatGrid.forEach((val, index) => {
					let valToString = val.join('');
					if (regex.test(valToString)) {
						x = index;
						y = valToString.indexOf('0');
					}
				});
				if (x !== undefined) {
					return [x, y];
				}
			}
			function checkVertical() {
				var x, y;
				for (var i = 0; i < 3; i++) {
					let verticalAreaToString = '' + whatGrid[0][i] + whatGrid[1][i] + whatGrid[2][i];
					if (regex.test(verticalAreaToString)) {
						x = verticalAreaToString.indexOf('0');
						y = i;
					}
				}
				if (x !== undefined) {
					return [x, y];
				}
			}
			function checkDiagonal() {
				var x, y, firstDiagonal, secondDiagonal;
				firstDiagonal = '' + whatGrid[0][0] + whatGrid[1][1] + whatGrid[2][2];
				secondDiagonal = '' + whatGrid[0][2] + whatGrid[1][1] + whatGrid[2][0];
				if (regex.test(firstDiagonal)) {
					x = y = firstDiagonal.indexOf('0');
				}
				if (regex.test(secondDiagonal)) {
					x = secondDiagonal.indexOf('0');
					y = 2 - x;
				}
				if (x !== undefined) {
					return [x, y];
				}
			}
			winningCombinations.push(checkHorizontal(), checkVertical(), checkDiagonal());
			return winningCombinations.filter(val => val);
		}
		/* first we call this function with a passed value of 2 to determine if the
		computer can find a cell that will give it the win. If there are multiple cells
		that give the computer the win, the computer chooses one randomly. Then we call
		it with a passed value of 1 to determine if the computer needs to fill a cell with
		its mark in order to not lose */
		function tryToWinOrNotLoseThisTurn(forWhom) {
			var outcomes = checkPossibleWinningOutcomes(grid, forWhom);
			return outcomes.length ? outcomes[Math.floor(Math.random() * outcomes.length)] : null;
		}
		/* this function checks the grid to find the amount of empty cells, then creates
		that many copies of the original grid each with a changed '0' to forWhom to
		represent future possible grids. For example if the grid looks like this
		2 | 1 | 1
		2 | 0 | 0
		1 | 0 | 0
		and forWhom = 2 the copies will be the following
		2 | 1 | 1     2 | 1 | 1    2 | 1 | 1    2 | 1 | 1
		2 | 2 | 0     2 | 0 | 2    2 | 0 | 0    2 | 0 | 0
		1 | 0 | 0     1 | 0 | 0    1 | 2 | 0    1 | 0 | 2
		then we call the checkPossibleOutcomes function for each of those possible grids
		if one of the returned values has a length of 2, then that move is the most optimal
		and we immediately track the original cell that allowed this possible grid to be 
		made and return that cell, else if all the returned values are empty arrays then
		it means that there are zero good moves, else we randomly select one of the good
		moves and track down the cell that allowed that possible grid to be made and we 
		return it */
		function tryToWinOrNotLoseNextTurn() {
			var computerOutcomes = [],
				playerOutcomes = [],
				indexArray = [],
				countOfZeroes = 0,
				index,
				count,
				critical = true,
				forComputer = 2,
				forPlayer = 1;
			function calculateOutcomes(forWhom, zeroes) {
				var outcomes = [];
				for (var i = 0; i < zeroes; i++) {
					let copy = grid.map(val => val.slice(0));
					let count = 0;
					copy.forEach((arr, index, array) => {
						arr.forEach((val, index2) => {
							if (val === 0) {
								if (count === i) {
									array[index][index2] = forWhom;
								}
								count++;
							}
						});
					});
					outcomes.push(checkPossibleWinningOutcomes(copy, forWhom));
				}
				return outcomes;
			}
			function extractCell(index) {
				var count = 0;
				for (var i = 0; i < 3; i++) {
					for (var j = 0; j < 3; j++) {
						if (grid[i][j] === 0) {
							if (index === count) {
								return [i, j];
							}
							count++;
						}
					}
				}
			}
			grid.forEach(val => {
				val.forEach(val2 => {
					if (val2 === 0) {
						countOfZeroes++;
					}
				});
			});
			computerOutcomes = calculateOutcomes(2, countOfZeroes);
			playerOutcomes = calculateOutcomes(1, countOfZeroes);
			index = computerOutcomes.findIndex(val => val.length > 1);
			if (~index) {
				return extractCell(index);
			}
			index = playerOutcomes.findIndex(val => val.length > 1);
			if (~index) {
				if (computerOutcomes.some(val => !val.length)) {
					playerOutcomes.forEach((val, index) => {
						if (val.length > 1 && computerOutcomes[index].length === 1) {
							indexArray.push(index);
						}
					});
				} else {
					playerOutcomes.forEach((val, index) => {
						if (val.length === 1 && computerOutcomes[index].length === 1) {
							indexArray.push(index);
						}
					});
				}
				index = indexArray[Math.floor(Math.random() * indexArray.length)];
				return index ? extractCell(index) : null;
			}
			if (computerOutcomes.every(val => !val.length)) {
				return null;
			}
			do {
				index = Math.floor(Math.random() * countOfZeroes);
			} while (computerOutcomes[index].length !== 1);
			return extractCell(index);
		}		
		/*if the AI plays first, it will place its mark either in the middle or in one of the corners randomly,
		if it plays second it will try to place its mark in the middle. If the middle is unavailable it will place
		its mark in one of the corners randomly */
		if (moves < 2 && difficultyLevel !== '0') {
			if (moves === 0) {
				randomCell = Math.floor(Math.random() * 5);
				switch(randomCell) {
					case 0:
						x = 0;
						y = 0;
						break;
					case 1:
						x = 0;
						y = 2;
						break;
					case 2:
						x = 1;
						y = 1;
						break;
					case 3:
						x = 2;
						y = 0;
						break;
					default:
						x = 2;
						y = 2;
				}
			} else {
				if (grid[1][1] === 0) {
					x = 1;
					y = 1;
				}
				else {
					randomCell = Math.floor(Math.random() * 4);
					switch(randomCell) {
						case 0:
							x = 0;
							y = 0;
							break;
						case 1:
							x = 0;
							y = 2;
							break;
						case 2:
							x = 2;
							y = 0;
							break;
						default:
							x = 2;
							y = 2;
					}
				}
			}
		} else {
			/* first we check if the computer can win this turn. If not we check if 
			the computer needs to pick a cell in order to not lose. If there are no
			such cells we check if there is an optimal move to setup for next turn.
			If not we check if there is a move that will allow the computer to 
			ensure that it will not lose next turn. If no such move exists
			the computer randomly selects one of the remaining cells. Finally
			some parts of the process above might be skipped depending on
			difficulty level.*/
			randomCell = tryToWinOrNotLoseThisTurn(2);
			if (randomCell === null && difficultyLevel !== '0') {
				randomCell = tryToWinOrNotLoseThisTurn(1);
			}
			if (randomCell === null && difficultyLevel === '2') {
				randomCell = tryToWinOrNotLoseNextTurn();
			}	
			if (randomCell === null) {
				randomCell = [];
				do {
					randomCell[0] = Math.floor(Math.random() * 3);
					randomCell[1] = Math.floor(Math.random() * 3);
				} while (grid[randomCell[0]][randomCell[1]] !== 0);
			}
			x = randomCell[0];
			y = randomCell[1];
		}
		grid[x][y] = 2;
		gridBox = $('.grid-box').eq(3 * x + y);
		gridBox.text(computerMark);
		gridBox.off('click');
		gridBox.css({cursor: 'default'});
		moves++;
		checkWin();
	}

	function checkWin() {
		function endGame(value) {
			$('.col-xs-4').off('click');
			$('.col-xs-4').css({cursor: 'default'});
			switch(value){
				case 1:
					$('#endgameModal').find('span').text('Player Wins!');
					jQuery('#endgameModal').modal('toggle');
					score[0]++;
					$('.list-group-item').eq(0).text('Wins: ' + score[0]);
					break;
				case 2:
					$('#endgameModal').find('span').text('Computer Wins!');
					jQuery('#endgameModal').modal('toggle');
					score[1]++;
					$('.list-group-item').eq(1).text('Losses: ' + score[1]);
					break;
				default:
					$('#endgameModal').find('span').text('Draw!');
					jQuery('#endgameModal').modal('toggle');
					score[2]++;
					$('.list-group-item').eq(2).text('Draws: ' + score[2]);
			}
		}
		for (var i = 0; i < 3; i++) {
			if (grid[i].every(val => val === 1) ||
				(grid[0][i] === 1 && grid[1][i] === 1 && grid[2][i] === 1)) {
				endGame(1);
				return 0;
			}
			if (grid[i].every(val => val === 2) ||
				(grid[0][i] === 2 && grid[1][i] === 2 && grid[2][i] === 2)) {
				endGame(2);
				return 0;
			}
		}
		if (grid[0][0] === 1 && grid[1][1] === 1 && grid[2][2] === 1) {
			endGame(1);
			return 0;
		}
		if (grid[0][0] === 2 && grid[1][1] === 2 && grid[2][2] === 2) {
			endGame(2);
			return 0;
		}
		if (grid[2][0] === 1 && grid[1][1] === 1 && grid[0][2] === 1) {
			endGame(1);
			return 0;
		}
		if (grid[2][0] === 2 && grid[1][1] === 2 && grid[0][2] === 2) {
			endGame(2);
			return 0;
		}	
		if (grid.every(function(val) {
			return val.every(value => value !== 0);
		})) {
			endGame(3);
			return 0;
		}
		return 1;
	}
	function reset() {
		grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
		moves = 0;
		$('.grid-box').each(function(index) {
			$(this).text('');
			$(this).css({'cursor': 'pointer'});
			$(this).on('click', clickOnCell);
		});
		if (!first) {
			computerMove();
		}
	}
	function clickOnCell() {
		var gridno = Array.prototype.indexOf.call($('.grid-box'), this);
		if (grid[Math.floor(gridno / 3)][gridno % 3] === 0) {
			$(this).off('click');
			$(this).text(playerMark);
			$(this).css('cursor', 'default');
			grid[Math.floor(gridno / 3)][gridno % 3] = 1;
			moves++;
			if (checkWin()) {
				computerMove();
			}
		}
	}

	$(".col-xs-4").click(clickOnCell);
	$('#new').click(reset);
	$('#form2 input').on('change', function () {
		playerMark = $('input[name=mark]:checked', '#form2').val();
		if (playerMark === 'X') {
			computerMark = 'O';
			first = true;
		} else {
			computerMark = 'X';
			first = false;
		}
		reset();	
	});
	$('#form1 input').on('change', function () {
		difficultyLevel = $('input[name=difficulty]:checked', '#form1').val();
		reset();
	});
	if (!first) {
		computerMove();
	}
});