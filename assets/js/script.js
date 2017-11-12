console.log("is js working?");

//this is the canvas we've defined in our html
var gameCanvas1 = $("#gameCanvas1")[0];

//we now give that canvas a 'context' and save it in a variable. 
var context1 = gameCanvas1.getContext("2d");
var width1 = gameCanvas1.width;
var height1 = gameCanvas1.height;

//initialize the grid
var grid = girdInit(20,20,20,'#0b175b',"#2b43c6");
//draw the gird
drawGrid(context1, grid, true);

//this captures the clicks on the canvas and turns on cells. 
$("body").click(gameCanvas1,function(e){
	var mousePos = getMousePos(gameCanvas1, e);
	console.log(mousePos.x+":"+mousePos.y);
	var foundCell = findCellAt(grid, mousePos.x, mousePos.y);
	//check to make sure we're not off the canvas...
	if(foundCell != undefined){
		foundCell.fillColor = "#fff";
		drawGrid(context1, grid, true);
	}
});

async function gameOfLife(grid, runs, deadColor, liveColor){
	
	/* //this runs the simulation forward 'runs' times.
	for(var j=0;j<runs;j++){ */
		
		//first we make a temp grid and copy the living or dead status from the real grid
		//this way, we can change the temp grid later on, without disrupting the real grid and skewing neighbor counts. 
		//and then make the real grid match the temp grid's changes.
		var tempGrid = grid;
		console.log(grid);
		
		for(var i =0;i<grid.length;i++){
			for(var k=0;k<grid[i].length;k++){
					var liveNeighbors = 0;
					//first we find the live neighbors
				
					 if(k-1 >= 0){//check the north neighbor, if he exists
						if(grid[i][k-1].fillColor == liveColor){liveNeighbors++};
					}
					if(i-1 >= 0 && k-1 >= 0){ //check the north western neighbor, if he exists. 
						if(grid[i-1][k-1].fillColor == liveColor){liveNeighbors++};
					}
					if(i+1 <= grid.length-1 && k-1 >= 0){ //check the north eastern neighbor, if he exists
						if(grid[i+1][k-1].fillColor == liveColor){liveNeighbors++};
					}
					if(k+1 <= grid[i].length-1){ //check the south neighbor if he exists
						if(grid[i][k+1].fillColor == liveColor){liveNeighbors++};
					}
					if(k+1 <= grid[i].length-1 && i-1 >= 0){ //check the south western neighbor, if he exists. same as north west.
						if(grid[i-1][k+1].fillColor == liveColor){liveNeighbors++};
					}
					if(k+1 <= grid[i].length-1 && i+1 <= grid.length-1){ //check the south eastern neighbor if he exists
						if(grid[i+1][k+1].fillColor == liveColor){liveNeighbors++};
					}
					if(i-1 >= 0){ //check the west neighbor if he exists
						if(grid[i-1][k].fillColor == liveColor){liveNeighbors++};
					}
					if(i+1 <= grid.length-1){ //check the east neighbor if he exists
						if(grid[i+1][k].fillColor == liveColor){liveNeighbors++};
					}
					
					//depending on the number of live neighbors we turn this cell on or off: TODO - this is broken. check rules and verify conditionals
					if(grid[i][k].fillColor == liveColor && liveNeighbors < 2){
						//Any live cell with fewer than two live neighbours dies, as if caused by underpopulation.
						tempGrid[i][k].fillColor = deadColor;
					}
					else if(grid[i][k].fillColor == liveColor && (liveNeighbors == 3 || liveNeighbors == 2)){
						//Any live cell with two or three live neighbours lives on to the next generation.
						tempGrid[i][k].fillColor = liveColor;
					}
					else if(grid[i][k].fillColor == liveColor && liveNeighbors > 3){
						//Any live cell with more than three live neighbours dies, as if by overpopulation.
						tempGrid[i][k].fillColor = deadColor;
					}	
					else if(liveNeighbors == 3 && grid[i][k].fillColor == deadColor){
						//Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
						tempGrid[i][k].fillColor = liveColor;
					}
			}//end y for loop
		}//end x for loop
		
		//now we make the real grid match the changes in the temp grid. 
		grid = tempGrid;
		/* for(var i =0;i<grid.length;i++){
			for(var k=0;k<grid[i].length;k++){
				grid[i][k].fillColor = tempGrid[i][k].fillColor;
			}
		} */
		
		//and redraw the real grid with all the new changes. 
		await drawGrid(context1, grid, true);
		
	//}//end runs loop
};


//initializes a grid for drawing. 
function girdInit(size, cellsX, cellsY, fillColor, edgeColor)
{//size is the width and height of the square cells
 //cellsx is the number of horizontal cells in the grid
 //cellsy is the number of vertical cells in the grid
 //fillcolor is the color to fill each cell with (can represent cell states too)
 //edgecolor is the color of the cell's walls. 
 console.log("initializing grid...");
  var gameGrid=[];//initializes the grid array

  for(var i=0; i<cellsX; i++)
  {
    //console.log("building col: "+i);
    gameGrid[i]=[]; //initializes each column in the grid array
    for(var f=0; f<cellsY; f++)
    {
      //console.log("building cell: "+"["+i+","+f+"]");
      gameGrid[i][f] = new Cell(size*i, size*f, size, size, i, f, fillColor, edgeColor);
      //console.log(gameGrid[i][f]);
    }//end x for loop
  }//end y for loop

  return gameGrid;
}//end gridInit


//this function just draws the grid, wall by wall
//it takes the canvas you want to draw on, a grid to draw (generated by grid init) and a boolean indicating if you want walls drawn or not. 
function drawGrid(canvas, grid, drawWalls)
{//grid is a grid array generated by the gridInit function.
	return new Promise((resolve, reject) => {
		  canvas.clearRect(0, 0, width1, height1);//clear the grid
		  //console.log("drawing grid...");
		  canvas.strokeStyle = '#ffffff';

		  for(var i=0; i<grid.length; i++)
		  {
			for(var f=0; f<grid[i].length; f++)
			{
			  //draw a background for this cell.
			  //console.log("drawing the regular background");
			  canvas.fillStyle = grid[i][f].fillColor;
			  canvas.fillRect(grid[i][f].x, grid[i][f].y, grid[i][f].w, grid[i][f].h);

			  var wallSTruth = grid[i][f].wallS;
			  var wallNTruth = grid[i][f].wallN;
			  var wallETruth = grid[i][f].wallE;
			  var wallWTruth = grid[i][f].wallW;

			 if(drawWalls){
			  //draw northwall
			  //console.log("drawing north wall of cell: ["+i+","+f+"]");
			  if(wallNTruth)
			  { canvas.strokeStyle = grid[i][f].edgeColor;
				canvas.beginPath();
				canvas.moveTo(grid[i][f].x, grid[i][f].y);
				canvas.lineTo((grid[i][f].x+grid[i][f].w),grid[i][f].y);
				canvas.stroke();
				canvas.closePath();
			  }//end draw north wall

			  //draw eastwall
			  //console.log("drawing east wall of cell: ["+i+","+f+"]");
			  if(wallETruth)
			  {
				//console.log("wallE: "+grid[i][f].wallE);
				canvas.strokeStyle = grid[i][f].edgeColor;
				canvas.beginPath();
				canvas.moveTo((grid[i][f].x+grid[i][f].w), grid[i][f].y);
				canvas.lineTo((grid[i][f].x+grid[i][f].w),(grid[i][f].y+grid[i][f].h));
				canvas.stroke();
				canvas.closePath();
			  }//end draw east wall

			  //draw southwall
			  //console.log("drawing south wall of cell: ["+i+","+f+"]");
			  if(wallSTruth)
			  { canvas.strokeStyle = grid[i][f].edgeColor;
				canvas.beginPath();
				canvas.moveTo((grid[i][f].x+grid[i][f].w),(grid[i][f].y+grid[i][f].h));
				canvas.lineTo(grid[i][f].x,(grid[i][f].y+grid[i][f].h));
				canvas.stroke();
				canvas.closePath();
			  }//end draw south wall

			  //draw westwall
			  //console.log("drawing west wall of cell: ["+i+","+f+"]");
			  if(wallWTruth)
			  {
				//console.log("wallW: "+grid[i][f].wallW);
				canvas.strokeStyle = grid[i][f].edgeColor;
				canvas.beginPath();
				canvas.moveTo(grid[i][f].x,(grid[i][f].y+grid[i][f].h));
				canvas.lineTo(grid[i][f].x,grid[i][f].y);
				canvas.stroke();
				canvas.closePath();
			  }//end draw west wall
			 }//end drawWalls check.
			}//end x for loop
		  }//end y for loop
		 resolve(true);
		 console.log("grid drawn. promise resolved");
	});//end promise
	
}//end drawGrid

//this is the cell constructor. it represents the info for each cell on our grid.
function Cell(x, y, h, w, indexX, indexY, fillColor, edgeColor)
{
  this.x = x; //this is the x pixel location of the top left corner of this cell on the canvas object
  this.y = y; //this is the y pixel location of the top left corner of this cell on the canvas object
  this.h = h; //how tall the cell is
  this.w = w; // how wide the cell is
  this.indexY = indexY; //this is the Y index of this cell on the grid
  this.indexX = indexX; //this is the X index of this cell on the Grid

  this.wallN = true; //is this cell's north wall up?
  this.wallE = true; //is this cell's east wall up?
  this.wallS = true; //is this cell's south wall up?
  this.wallW = true; //is this cell's west wall up?
  this.beenTo = false; //have we been to this cell before?
  this.fillColor = fillColor;
  this.edgeColor = edgeColor;
}//end constructor

//this function finds the grid cell at an x y position on the canvas 
function findCellAt(grid, x, y){
	for(var i =0;i<grid.length;i++){
		for(var k=0;k<grid[i].length;k++){
			//here we find this cells max boundries 
			var cellXmin = grid[i][k].x;
			var cellXmax = grid[i][k].x + grid[i][k].w;
			var cellYmin = grid[i][k].y;
			var cellYmax = grid[i][k].y + grid[i][k].h;
			
			//if the passed in x and y are within the height and width of this cell's x and y, its a match.
			if((x >= cellXmin && x <= cellXmax) && (y >= cellYmin && y <= cellYmax)){
				console.log(grid[i][k]);
				return grid[i][k];
			}
		}
	}
};

//this function finds the position of the mouse on the canvas
//in order to find the position of the mouse on the canvas, we have to subtract the position of the canvas from the global position of the mouse on the screen
function getMousePos(canvas, e){
	var rect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	}
};
