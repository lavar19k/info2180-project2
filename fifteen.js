	
/*
	 Extras Implemented
	 ** IF WIn
	 ** Change pic
	 

*/

window.onload = function()
{
	var puzzlearea;
	var squares;
	var shufflebutton;
	var validMoves=[];
	var emptySpaceX = '300px'; // Initial values for the empty space
	var emptySpaceY = '300px';
	var changePicButton;
	
	// Function Calling

	setUpButton();
	
	puzzlearea = document.getElementById("puzzlearea");
	squares = puzzlearea.getElementsByTagName("div");
	shufflebutton = document.getElementById("shufflebutton");
	
	initializeGrid();
	shufflebutton.onclick = shufflePieces;
	calcValidMoves();

	// All function definitions below


	function initializeGrid()
	{
		for (var i=0; i<squares.length; i++)
		{
			// Assigns the puzzlepiece css class styling to each of the pieces 
			squares[i].className = "puzzlepiece";

			// Used to arrange the pieces into a grid formation
			squares[i].style.left = (i % 4 * 100) + "px";
			squares[i].style.top = (parseInt(i / 4) * 100) + "px";

			// Evaluates to "-XXX px -YYY px" to position the image on the squares using X and Y coordinates
			squares[i].style.backgroundPosition = "-" + squares[i].style.left + " " + "-" + squares[i].style.top;
			
			
			// Assignment of event-handler functions to each of the pieces

			// Used to move a piece if it can be moved when clicked
			squares[i].onclick = function()
			{
				{
					if (isValidMove(this.style.left, this.style.top))
					{
						animatedSwitchPieces(parseInt(this.innerHTML-1));
					}				
				}
			};
			

            // function implemented to show movable piece by changing its color
			squares[i].onmouseover = function()
			{
				{
					// Code to check if the piece can be moved
					if (isValidMove(this.style.left, this.style.top))
					{
						this.classList.add("movablepiece");
					}
				}
			};

			// Used to return piece to default when mouse is not hovering
			squares[i].onmouseout = function()
			{
				this.classList.remove("movablepiece");
			};
		}
	}


	// Function used to shuffle pieces on the grid when called the shuffle button is clicked
	function shufflePieces() 
	{
		// declaring local variable
		var rndNum;
		
		// Changes the picture before randomizing if changePicChkBox is clicked
		// 	changePicButton.onclick = changePic();  
		//	{
		//		changePic();
		//	}
		
		// for loop implemented to move the pieces randomly 150 times when the shuffle button is clicked
		for (var i = 0; i < 150; i++) 
		{
			// Used to randomly select a piece to move from the valid moves array
			rndNum = Math.floor(Math.random() * validMoves.length);

			//Second for loop to runs until it completes maximum random movements
			for (var x = 0; x < squares.length; x++)
			{
				if ((validMoves[rndNum][0] === parseInt(squares[x].style.left)) && 
					(validMoves[rndNum][1] === parseInt(squares[x].style.top)))
				{

					switchPieces(parseInt(squares[x].innerHTML-1));
					calcValidMoves();

				// Terminates for loop when a specefic piece has been moved
					break; 
				}
			}
		}
	}


	// Animation for moving the pieces
	function animatedSwitchPieces(puzzlePiece)
	{
		var positionX = squares[puzzlePiece].style.left;
	  	var positionY = squares[puzzlePiece].style.top;	  	
	  	var xFinished = (squares[puzzlePiece].style.left === emptySpaceX); 
	  	var yFinished = (squares[puzzlePiece].style.top === emptySpaceY);
	  	
	  	var movement = setInterval(MovePiece, 1); 
	 
		function MovePiece() 
		{
			if ((xFinished) && (yFinished))
			{
				emptySpaceX = positionX;
				emptySpaceY = positionY;
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

	// Checks for valid moves and stores the valid moves' X and Y coordinates in an array
	function calcValidMoves()
	{
		// Converting empty space variables to integers for easy manilipulation
		var tempX = parseInt(emptySpaceX);
		var tempY = parseInt(emptySpaceY);

		validMoves = [];

		// Check if there's a piece above the empty space that can be moved
		if (tempY != 0)
		{
			validMoves.push([tempX, tempY - 100]);
		}

		// Check if there's a piece to the right of the empty space that can be moved
		if (tempX != 300)
		{
			validMoves.push([tempX + 100, tempY]);
		}
		// Checks if there's a piece below the empty space that can be moved
		if (tempY != 300)
		{
			validMoves.push([tempX, tempY + 100]);
		}

		// Checks if there's a piece to the left of the empty space that can be moved
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

	// Checks if the puzzle pieces are in the correct positions 
	// to prompt the user that they have won the game
	
	
	
	
	function setUpButton()
	{
		// Creates the text label for the checkbox
		changePicButton = document.createElement('button');
		changePicButton.htmlFor = "changePicChkBox1";
		changePicButton.appendChild(document.createTextNode('Click to Change picture'));

		document.getElementById("controls").appendChild(changePicButton);

	}
	
	
	function checkWin() 
	{
		var iswinner = true;


		if ((emptySpaceX === "300px") && (emptySpaceY === "300px")) 
		{
			for (var i = 0; i < squares.length; i++) 
			{
				if ((squares[i].style.left !== (parseInt((i % 4) * 100) + "px")) &&
					(squares[i].style.top !== (parseInt((i / 4) * 100) + "px")))
				{
					iswinner = false;
					break;
				}
			}
			if (iswinner) 
			
			{
				alert("You Win, Congrats! My Friend (-; ");
			}
		}
	}



	// Used to randomly change the applieFd background picture
	function changePic() 
	{
		var listOfPics = ["tom&jerry2.jpg","tom&jerry.jpg"];
		var currentPic = squares[0].style.backgroundImage.slice(5, -2); // Sliced to remove 'url("")' from it
		var rndNum = Math.floor(Math.random() * listOfPics.length);

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




