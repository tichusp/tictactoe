/* Created by Kostas Tsolkas

	This is an unbeatable tic tac toe game.
	My original implementation featured the AI doing the same moves each game 
	in order to guarantee that AI would never lose but I decided that this approach was
	too	boring for the player so I had to change the solution to add a random pattern
	to the AI's moves while still guaranteeing that the AI will never lose.
	As a result sometimes the AI will not pick the MOST optimal move but instead
	it will pick an optimal enough move. This was intended as it makes the gameplay
	slightly more interesting. While as you can see below, the code itself is an
	weirdly implemented mess with TERRIBLE names for variables and lacking comments, 
	I am still able to explain every part of it. In my
	defence this was created in a weekend and at first it was intended to be just
	a test but as I worked more with it I decided to stick with it.
	
	TODO: Clean up the code and add comments
*/
$('document').ready(function() {
	var grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
	var moves = 0;
	var score = [0, 0, 0];
	var first = false;
	var playerMark = 'O';
	var computerMark = 'X';
	function computerMove() {
		var x, y;
		var strr = grid.join(' ').replace(/,/g, '')
		function check(regex, str) {
			var str2 = str.split(' ').join('');
			var str3;
			var randomResult = [];
			var helper = str.match(regex);
			if (helper) {
				if (helper[0].charAt(0) == 0) {
					randomResult.push([Math.floor(str2.indexOf(helper[0]) / 3), 0]);
				} else if (helper[0].charAt(1) == 0) {
					randomResult.push([Math.floor(str2.indexOf(helper[0]) / 3), 1]);
				} else {
					randomResult.push([Math.floor(str2.indexOf(helper[0]) / 3), 2]);
				}
			}
			str = '';
			for (var i = 0; i < 3; i++) {
				str = str + str2.charAt(0 + i) + str2.charAt(3 + i) + str2.charAt(6 + i) + ' ';
			}
			helper = str.match(regex);
			if (helper) {
				str3 = str.split(' ').join('');
				if (helper[0].charAt(0) == 0) {
					randomResult.push([0, Math.floor(str3.indexOf(helper[0]) / 3)]);
				} else if (helper[0].charAt(1) == 0) {
					randomResult.push([1, Math.floor(str3.indexOf(helper[0]) / 3)]);
				} else {
					randomResult.push([2, Math.floor(str3.indexOf(helper[0]) / 3)]);
				}
			}
			str = '' + str2.charAt(0) + str2.charAt(4) + str2.charAt(8);
			if (regex.test(str)) {
				if (str.charAt(0) == 0) {
					randomResult.push([0, 0]);
				} else if (str.charAt(1) == 0) {
					randomResult.push([1, 1]);
				} else {
					randomResult.push([2, 2]);
				}
			}
			str = '' + str2.charAt(2) + str2.charAt(4) + str2.charAt(6);
			if (regex.test(str)) {
				if (str.charAt(0) == 0) {
					randomResult.push([0, 2]);
				} else if (str.charAt(1) == 0) {
					randomResult.push([1, 1]);
				} else {
					randomResult.push([2, 0]);
				}
			}
			return randomResult;
		}
		function computerWinOrNotLose() {
			var y = check(/\b(0*20*){2}\b/g, strr);
			if (y.length) {
				return y;
			}
			return check(/\b(0*10*){2}\b/g, strr);
		}
		function findOptimalMove() {
			var kobold = '';
			var zeos, zeos2;
			var j, n;
			var found = false;
			var len = strr.match(/0/g).length;
			var ronin = [];
			var ronin2 = [];
			var ronin3 = [];
			var bill = [];
			var joko = [];
			var bolo = [];
			var pika = '';
			for (var i = 0; i < len; i++) {
				kobold = strr.slice(0);
				zeos = -1;
				j = 0;
				while (zeos < i) {
					if (strr.charAt(j) === '0' && zeos === i - 1) {
						kobold = strr.slice(0, j) + '2' + strr.slice(j + 1);
						break;
					} else if (strr.charAt(j) === '0') {
						zeos++;
					}
					j++;
				}
				var helper1000 = check(/\b(0*20*){2}\b/g, kobold);
				if (helper1000.length) {
					found = true;
					ronin.push(helper1000); 
					ronin[ronin.length - 1].push(j); 
				}
			}
			for (var i = 0; i < ronin.length; i++) {
				if (ronin[i].length > 2) {
					bill.push(ronin[i]);
				}
			}
			if (ronin.length) {
				ronin = ronin.filter(val => val.length === 2);
			}
			if (ronin.length) {
				if (ronin.length > 1) {
					var q = Math.floor(Math.random() * ronin.length);
					j = ronin[q][1];
				} else {
					j = ronin[0][1];
				}
			}
			if (moves === 3) {
				if ((grid[0][0] === 1 && grid[2][2] === 1) || (grid[0][2] === 1 && grid[2][0] ===1)) {
					var helpzor = Math.floor(Math.random() * 4);
					switch(helpzor) {
						case 1:
							j = 1;
							break;
						case 2:
							j = 4;
							break;
						case 3:
							j = 6;
							break;
						default:
							j = 9;
					}
				} else {
					if ((grid[0][0] === 1 && grid[1][1] === 1 && grid[2][2] === 2) ||
						 (grid[0][0] === 2 && grid[1][1] === 1 && grid[2][2] === 1)) {
						var helpzor = Math.floor(Math.random() * 2);
						switch(helpzor) {
							case 0:
								j = 2;
								break;
							case 1:
								j = 8;
						}
					} else if ((grid[0][2] === 1 && grid[1][1] === 1 && grid[2][0] === 2) || 
										(grid[0][2] === 2 && grid[1][1] === 1 && grid[2][0] === 1)) {
						var helpzor = Math.floor(Math.random() * 2);
						switch(helpzor) {
							case 0:
								j = 0;
								break;
							case 1:
								j = 10;
						}
					}
				}
			}
			if (bill.length) {
				if (bill.length > 1) {
					var q = Math.floor(Math.random() * bill.length);
					j = bill[q][bill[q].length - 1];
				} else {
					j = bill[0][bill[0].length - 1];
				}
			}
			if (found) {
				if (j > 2) {
					j--;
				}
				if (j > 5) {
					j--;
				}
				return [Math.floor(j / 3), j % 3];
			}
			return [];
		}
		var help = computerWinOrNotLose();
		var help2 = findOptimalMove();
		if (moves < 2) {
			if (moves === 0) {
				var pp = Math.floor(Math.random() * 5);
				switch(pp) {
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
					do {
						var pp = Math.floor(Math.random() * 4);
						switch(pp) {
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
					} while (grid[x][y] !== 0);
				}
			}
		}
		else if (help.length) {
			if (help.length > 1) {
				var pp = Math.floor(Math.random() * help.length);
				x = help[pp][0];
				y = help[pp][1];
			} else {
				x = help[0][0];
				y = help[0][1];
			}
		} else if (help2.length) {
				x = help2[0];
				y = help2[1];
		} else {
			do {
			x = Math.floor(Math.random() * 3);
			y = Math.floor(Math.random() * 3);
			} while (grid[x][y] !== 0);
		}
		var omfg = $('#g' + x + y);
		grid[x][y] = 2;
		omfg.text(computerMark);
		omfg.off('click');
		omfg.css({cursor: 'default'});
		moves++;
		checkWin();
	}

	function checkWin() {
		function endGame(value) {
			$('.col-xs-4').off('click');
			$('.col-xs-4').css({cursor: 'default'});
			//first = !first;
			switch(value){
				case 1:
					alert('Player Wins');
					score[0]++;
					$('#li1').text('Wins: ' + score[0]);
					break;
				case 2:
					alert('Computer Wins');
					score[1]++;
					$('#li2').text('Losses: ' + score[1]);
					break;
				default:
					alert('Draw');
					score[2]++;
					$('#li3').text('Draws: ' + score[2]);
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

	if (!first) {
		computerMove();
	}

	if (parseInt($('#grid').css("fontSize")) < 60) {
		$('#grid').css({"font-size": "60px"});   
	}

	$(window).resize(function() {
		var grid = $('#grid');
			if (parseInt($(this).width()) < 680) {
					grid.css({ "font-size": "60px" });   
			} else {
				grid.css({ "font-size": "9vw" });
			}
	});

	$(".col-xs-4").click(ora);

	function ora() {
		var id = $(this).attr('id');
		if (grid[id.charAt(1)][id.charAt(2)] === 0) {
			$(this).off('click');
			$(this).text(playerMark);
			$(this).css('cursor', 'default');
			grid[id.charAt(1)][id.charAt(2)] = 1;
			moves++;
			if (checkWin()) {
				computerMove();
			}
		}
	}

	$('#new').click(function () {
		grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
		moves = 0;
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var zaldin = $('#g' + i + j);
				zaldin.text('');
				zaldin.css({cursor:'pointer'});
				zaldin.on('click', ora)
			}
		}
		if (!first) {
			computerMove();
		}
	});

	$('#form2 input').on('change', function () {
		playerMark = $('input[name=opradio]:checked', '#form2').val();
		if (playerMark === 'X') {
			computerMark = 'O';
			first = true;
		} else {
			computerMark = 'X';
			first = false;
		}
		grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
		moves = 0;
		score = [0, 0, 0];
		$('#li1').text('Wins: 0');
		$('#li2').text('Losses: 0');
		$('#li3').text('Draws: 0');
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var zaldin = $('#g' + i + j);
				zaldin.text('');
				zaldin.css({cursor:'pointer'});
				zaldin.on('click', ora)
			}
		}
		if (!first) {
			computerMove();
		}	
	});

	$('#form1 input').on('change', function () {
		grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
		moves = 0;
		score = [0, 0, 0];
		$('#li1').text('Wins: 0');
		$('#li2').text('Losses: 0');
		$('#li3').text('Draws: 0');	
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				var zaldin = $('#g' + i + j);
				zaldin.text('');
				zaldin.css({cursor:'pointer'});
				zaldin.on('click', ora)
			}
		}
		if (!first) {
			computerMove();
		}	
	});
});