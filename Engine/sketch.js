
//this complete algorithm is been implemented in javascript,and the reference is in wikipedia,search(a* implementation wiki);
//the drawing has been done using p5.js ,https://p5js.org/


//a* is nothing but dijkstra's algorithm with a brain in it;



//f(n)=g(n)+h(n),the formula for a star algorithm, where
//f(n)->total cost of this  road from start to end,if i pursue this path oviously;
//g(n)->this is the cost to react this cell from the start position
//h(n)->this is the heruistic value of this cell to the end cell;
//most often this value is taken using euclidean distance; d(p,q) = sqrt((p1-q1)^2 - (p2-q2)^2);



//class def//
let w = 0;
let h = 0;
class Cell
{
    constructor(i,j,f=0, g=0, h=0)
    {
        this.i = i;//row of this ele;
        this.j = j;//col of this ele;
        this.f = f;//f value
        this.g = g;//g value
        this.h = h;//h value
        this.prev = null;
        this.wall = false;
    }

    

    show = (color) => { 
        fill(color);
        stroke(1);
        rect(this.i*w, this.j*h, w, h);
        
    }
}
/////////////
//useFull function//

function isPresent(set, cell)
{
    
    let len = set.length;

    for (let i = len; i >=0; i--)
    {
        if (set[i]?.i=== cell.i&& set[i]?.j === cell.j)
        {
            // console.log("equals");
            return true;
        }
    }

    return false;
}

function getHeuristic(src, des)
{
    return dist(src.i, src.j, des.i, des.j);
}

//all the eight successor for a cell;
let successors = [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]];
//this array will help me to make eight directions call,to find all the valid neighbours of a cell;




// dimensions of the grid//
const rows = 85;
const cols =85;
/////////////////////////////

//this is the src ,from where i will start//
const srcX = 0;
const srcY = 0;
/////////////////////////////////////////////

//this is the target destination,where i am trying to reach//
const tarX = rows-1;
const tarY = cols-1;
/////////////////////////////////////////////////////////////////
//start and end in grid//
let start = 0;
let end = 0;
/////////////////////////

//creating the 2D array as my grid,or a city structure//
let grid = new Array(rows);
let visited = new Array(rows);
let itr;
let currentCell;
//set to hold the data
//minheap priority Queue is recommended for utmost efficiency;
let closedSet = [];
let openSet = [];
let path = [];
////////////////////////////////////////////////////////////
//work//
function setup()
{

    //this setup() is given by p5.js framework,
    createCanvas(400, 400);
    console.log("a*");
    w = width / cols;
    h = height / rows;
    for (let i = 0; i < rows; i++)
    {
        grid[i] = new Array(cols);
        visited[i] = new Array(cols);
    }
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            grid[i][j] = new Cell(i, j);//filling up every cell with an object to store the data,the default value is set to 0 for f,g,h;
            if (random(1) < 0.5)
            {
                grid[i][j].wall = true;    
                grid[i][j].show(0);
            }
        }
    }

    start = grid[srcX][srcY];//setting up the src;
    end = grid[tarX][tarY];//setting up the des;
    start.wall = false;
    end.wall = false;
    openSet.push(start);


    
}

function draw()
{
    //the draw() function continuously executes the lines of code contained inside its block until the program is stopped or noLoop() is called;It is a sort of loop
    let lowestFvalueIndex = 0;
    let openSetLength = openSet.length;
    let closeSetLength = closedSet.length;
    if (openSetLength > 0)//there is some elements present;
    {
        //the idea is to find the  cell which has the lowest "f" value;
        //among other cell belonging to open set;
        //we need to store the index in variable for letter uses;

        for (var i = 0; i < openSetLength; i++)
        {
            if (openSet[i].f < openSet[lowestFvalueIndex].f)
            {
                lowestFvalueIndex = i;
            }    
        }
        
        let currentCell = openSet[lowestFvalueIndex];
        
        

       
        if (currentCell == end)
        {
            console.log("destination reached");
            itr = currentCell;
            while (itr != null)
            {
                path.push(itr);    
                itr = itr.prev;
            }
            
            noLoop();
            
        }
        
        openSet.splice(lowestFvalueIndex, 1);
        closedSet.push(currentCell);

        let currI = currentCell.i;
        let currJ = currentCell.j;
        for (let i = 0; i < 8; i++) {
            let successor = successors[i];
            let newI = currI + successor[0];
            let newJ = currJ + successor[1];

            if (newI < 0 || newJ < 0 || newI >= rows || newJ >= cols||grid[newI][newJ].wall) continue;
            if (closedSet.includes(grid[newI][newJ]) == false)
            {
                let tempG = currentCell.g + 1;
                let neigh = grid[newI][newJ];
                let np = false;
                if (openSet.includes(neigh) )
                {
                    if (tempG < neigh.g)
                    {
                        np = true;
                        neigh.g = tempG;
                    }
                }
                else
                {
                    np = true;
                    neigh.g = tempG;
                    openSet.push(neigh);
                }
                if (np)
                {
                    
                    neigh.h = getHeuristic(neigh, end);
                    neigh.f = neigh.g + neigh.h;
                    neigh.prev = currentCell;
                }
            }

        }
    }
    else//all the elements are processed,and either we are in our destination,or there is not path present;
    {
        
        console.log("NO VALID PATH EXISTED")
    }
    background(0);
    for (let i = 0; i < rows; i++)
    {
        for (let j = 0; j < cols; j++)
        {
            if (grid[i][j].wall == false)
            {
                grid[i][j].show(255);// red->closed, green->open,blue->path      
                
            }
        }
    }

    openSetLength = openSet.length;
    closeSetLength = closedSet.length;

    for (let i = 0; i < openSetLength; i++)
    {
        openSet[i].show(color(0,255,0))//all the open set elements will be shown in green color;
    }
    for (let i = 0; i < closeSetLength; i++)
    {
        closedSet[i].show(color(255, 0, 0));//all the close set elements will be shown in red color;
    }
    
    path.forEach(ele => { 
        ele.show(color(0,0,255))
    })

}