/* 								Extra Features Added to be marked


	- Added a easy mode feature 
		This mode allows the user to swap any piece to the empty space which makes the game way easier.
		
*/

window.onload = function()
{
	var puzzlearea;
	var squares;
	var shufflebutton;
	var validMoves=[];
	var emptySpaceX = '300px'; // Initial values for the empty space
	var emptySpaceY = '300px';
	var changePicChkBoxlabel;
	var changePicChkBox;
	var easyModeChkBoxlabel;
	var easyModeChkBox;

	setUpCheckboxes();

	puzzlearea = document.getElementById("puzzlearea");
	squares = puzzlearea.getElementsByTagName("div");
	shufflebutton = document.getElementById("shufflebutton");
	
	initializeGrid();
	shufflebutton.onclick = shufflePieces;
	


	// the function below is used to set up grid when the game first starts
	function initializeGrid()
	{
		for (var i=0; i<squares.length; i++)
		{
			// Assigns each of the div elements css class styling to each of the pieces in the grid game
			squares[i].className = "puzzlepiece";

			//setting up grid formation
			squares[i].style.left = (i % 4 * 100) + "px";
			
			squares[i].style.top = (parseInt(i / 4) * 100) + "px";

			// Evaluates to "-XXX px -YYY px" to position the image on the squares using X and Y coordinates
			squares[i].style.backgroundPosition = "-" + squares[i].style.left + " " + "-" + squares[i].style.top;
			
			
			// Assignment of event-handler functions to each of the pieces

			// Used to move a piece if it can be moved when clicked
			squares[i].onclick = function()
			{
				// If easy mode is enabled, then it allows the user to move 
				// any piece to the empty space 
				if (easyModeChkBox.checked) 
				{
					animatedSwitchPieces(parseInt(this.innerHTML-1));
				}
				else 
				{
					// Code to check if the piece can be moved
					if (isValidMove(this.style.left, this.style.top))
					{
						animatedSwitchPieces(parseInt(this.innerHTML-1));
					}				
				}
			};
			

			// Used to show the user if a piece can be moved when hovered
			// by changing the colour of the piece
			squares[i].onmouseover = function()
			{
				if (easyModeChkBox.checked) 
				{
					this.classList.add("movablepiece");
				}
				else 
				{
					// Code to check if the piece can be moved
					if (isValidMove(this.style.left, this.style.top))
					{
						this.classList.add("movablepiece");
					}
				}
			};

			// Used to revert the colour of the piece back to default 
			// when the user's cursor leaves the piece
			squares[i].onmouseout = function()
			{
				this.classList.remove("movablepiece");
			};
		}
	}

	// Function used to shuffle puzzle pieces 
	function shufflePieces() 
	{
		var rndNum;
		
		// Changes the picture before randomizing if changePicChkBox is true
		if (changePicChkBox.checked) 
			{
				changePic();
			}
		
		// This loop moves the pieces randomly 150 times when executed
		for (var i = 0; i < 150; i++) 
		{
			// Used to randomly select a piece to move from the valid moves array
			rndNum = Math.floor(Math.random() * validMoves.length);

			// Searches through the puzzle pieces array for the randomly selected piece above to move.
			// It searches based on the piece's X and Y coordinates through the puzzle pieces array.
			// When the correct piece is found, this for loop terminates and it goes back into the main 
			// for loop for another iteration until it completes enough random movements
			for (var x = 0; x < squares.length; x++)
			{
				if ((validMoves[rndNum][0] === parseInt(squares[x].style.left)) && 
					(validMoves[rndNum][1] === parseInt(squares[x].style.top)))
				{
					// When the piece is found, it is moved and the valid moves are
					// recalculated for another iteration of randomly selected movements
					switchPieces(parseInt(squares[x].innerHTML-1));
					calcValidMoves();

					//animatedSwitchPieces(parseInt(squares[x].innerHTML-1));
					//calcValidMoves();
					break; // Terminates this for loop when the piece has been moved
				}
			}
		}
	}

	// Animation for moving the pieces
	function animatedSwitchPieces(puzzlePiece)
	{
		var posX = squares[puzzlePiece].style.left;
	  	var posY = squares[puzzlePiece].style.top;	  	
	  	var xFinished = (squares[puzzlePiece].style.left === emptySpaceX); // Evaluates to either true or false
	  	var yFinished = (squares[puzzlePiece].style.top === emptySpaceY);
	  	
	  	var movement = setInterval(MovePiece, 1); // Executes the animation

	  	// Animation function to be used in setInterval. This functions works by incrementing or decrementing 
	  	// the X and Y coordinates by 10 pixels until they have reached their new coordinates at the empty 
	  	// space's X and Y coordinates. This function is used in the setInterval statement above which 
	  	// executes this program every 1 millisecond until it reaches the clearInterval(movement) statement
	  	// which signals the end of the loop and terminates the animation.
		function MovePiece() 
		{
			if ((xFinished) && (yFinished))
			{
				emptySpaceX = posX;
				emptySpaceY = posY;
				clearInterval(movement);
				calcValidMoves();
				checkWin();
			} 
			else 
			{
				// Move X 
				if (!(xFinished))
				{
					if (parseInt(squares[puzzlePiece].style.left) < parseInt(emptySpaceX))
					{
						squares[puzzlePiece].style.left = ((parseInt(squares[puzzlePiece].style.left) + 10) + 'px');
					}
					else
					{
						squares[puzzlePiece].style.left = ((parseInt(squares[puzzlePiece].style.left) - 10) + 'px');	
					}

					// Checks if the X coordinates have reached its destination
					if (squares[puzzlePiece].style.left === emptySpaceX)
					{
						xFinished = true;
					}
				}

				// Move Y 
				if (!(yFinished))
				{
					if (parseInt(squares[puzzlePiece].style.top) < parseInt(emptySpaceY))
					{
						squares[puzzlePiece].style.top = ((parseInt(squares[puzzlePiece].style.top) + 10) + 'px');
					}
					else
					{
						squares[puzzlePiece].style.top = ((parseInt(squares[puzzlePiece].style.top) - 10) + 'px');	
					}

					// Checks if the Y coordinates have reached its destination
					if (squares[puzzlePiece].style.top === emptySpaceY)
					{
						yFinished = true;
					}
				}
			}
		}
	}

	// This switches the pieces by swapping the X and Y coordinates 
	// between the empty space and the puzzle piece passed as an argument.
	// This was used in previous versions before the animated version of
	// this function was created. This function is still used in the shuffle
	// function however, so thats's why it's still here.
	function switchPieces(puzzlePiece)
	{
		// Swap X positions
		var temp = squares[puzzlePiece].style.left;
		squares[puzzlePiece].style.left = emptySpaceX;
		emptySpaceX = temp;

		// Swap Y positions
		temp = squares[puzzlePiece].style.top;
		squares[puzzlePiece].style.top = emptySpaceY;
		emptySpaceY = temp;
	}

	// Checks in a clockwise manner for all the valid moves
	// in relation to the position of the empty space and
	// stores the valid moves' X and Y coordinates in the
	// validMoves array for later use in the game
	function calcValidMoves()
	{
		// Converted the position of the empty space variables
		// to integers to be able to easily manipulate them later
		var tempX = parseInt(emptySpaceX);
		var tempY = parseInt(emptySpaceY);

		// Resets the array and clears the previous valid moves
		validMoves = [];

		// Check Up
		// Check if there's a piece above the empty space
		if (tempY != 0)
		{
			validMoves.push([tempX, tempY - 100]);
		}

		// Check Right
		// Check if there's a piece to the right of the empty space
		if (tempX != 300)
		{
			validMoves.push([tempX + 100, tempY]);
		}

		// Check Down 
		// Checks if there's a piece below the empty space
		if (tempY != 300)
		{
			validMoves.push([tempX, tempY + 100]);
		}

		// Check Left
		// Checks if there's a piece to the left of the empty space
		if (tempX != 0)
		{
			validMoves.push([tempX - 100, tempY]);
		}
	}

	// Checks the validMoves array for the puzzle piece's X and Y position passed 
	// as an argument and sees if the piece is a valid move then returns true or false
	function isValidMove(pieceX, pieceY)
	{
		pieceX = parseInt(pieceX);
		pieceY = parseInt(pieceY);

		for (var i = 0; i < validMoves.length; i++)
		{
			if ((validMoves[i][0] === pieceX) && (validMoves[i][1] === pieceY))
			{
				return true;
			}
		}
		return false;	
	}
	
	
	// Used to randomly change the applied background picture


	function setUpCheckboxes()
	{
		// Creates the text label for the checkbox
		changePicChkBoxlabel = document.createElement('label');
		changePicChkBoxlabel.htmlFor = "changePicChkBox1";
		changePicChkBoxlabel.appendChild(document.createTextNode('Change picture when shuffled'));

		//Creates the checkbox
		changePicChkBox = document.createElement("input");
	    changePicChkBox.type = "checkbox";
	    changePicChkBox.id = "changePicChkBox1";
	    
	    // Adds the label to the controls div in the html code before
	    // appending the checkbox so that the text instructions appear 
	    // before the checkbox control itself 		
		document.getElementById("controls").appendChild(changePicChkBoxlabel);
		document.getElementById("controls").appendChild(changePicChkBox);

		// Creates the text label for the checkbox
		easyModeChkBoxlabel = document.createElement('label');
		easyModeChkBoxlabel.htmlFor = "changePicChkBox1";
		easyModeChkBoxlabel.appendChild(document.createTextNode('Easy Mode'));

		//Creates the checkbox
		easyModeChkBox = document.createElement("input");
	    easyModeChkBox.type = "checkbox";
	    easyModeChkBox.id = "easyModeChkBox1";
	    
	    // Adds the label to the controls div in the html code before
	    // appending the checkbox so that the text instructions appear 
	    // before the checkbox control itself 		
		document.getElementById("controls").appendChild(easyModeChkBoxlabel);
		document.getElementById("controls").appendChild(easyModeChkBox);
	}
	
		function changePic() 
	{
		var listOfPics = ["tom&jerry.jpg","tom&jerry2.jpg"];
		var currentPic = squares[0].style.backgroundImage.slice(5, -2); // Sliced to remove 'url("")' from it
		var rndNum = Math.floor(Math.random() * listOfPics.length);

		// This if statement was added because when the program is first run and the 
		// puzzlepiece css class is applied to each of the squares, the background image
		// property is an empty string. So this if statement was added to prevent the changepic
		// function from changing it to the same default mario pic when you first hit shuffle. 
		if (currentPic.length === 0)
		{
			currentPic = "background.jpg";
		}
		
		// Used to prevent the random number from pointing
		// to the same pic that's already in use	
		if (currentPic === listOfPics[rndNum]) 
		{
			// Runs until the rndNum points to a different pic
			while (currentPic === listOfPics[rndNum]) 
			{
				rndNum = Math.floor(Math.random() * listOfPics.length);	
			}
		}

		// Applies the new pic to each square
		for (var x = 0; x < squares.length; x++)
		{
			squares[x].style.backgroundImage = "url('" + listOfPics[rndNum] +"')";
		}
		
	}
};