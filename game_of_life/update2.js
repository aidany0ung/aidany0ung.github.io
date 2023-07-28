// Generate an empty n x n table in 'table'
function generateTable(table,n) {
    for (let i = 0; i < n; i++) {
        let row = document.createElement("tr");
        for (let j = 0; j < n; j++) {
            let cell = document.createElement("td");
            cell.setAttribute("id", i + "-" + j);
            cell.setAttribute("class", "dead");
            cell.innerText = "";
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

// Create a 2D array of size n x n
function create2DArray(n) {
    let arr = new Array(n);
    for (let i = 0; i < n; i++) {
        arr[i] = new Array(n);
    }
    return arr;
}

// Set all cells to dead
function setDead(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length; j++) {
            array[i][j] = 0;
        }
    }
}

// Randomly set cells to alive, randomize by species (red and blue) n/2 of each species
function setAlive() {
    let count = 0;
    while (count < soup) {
        let i = Math.floor(Math.random() * n);
        let j = Math.floor(Math.random() * n);
        if (array[i][j] === 0) {
            if (count < soup/2) {
                array[i][j] = 1;
            } else {
                array[i][j] = 2;
            }
            count++;
        }
    }
}

// Create render function that updates the colors of the cells
function render() {
    let table = document.getElementById("griddy");
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length; j++) {
            let cell = document.getElementById(i + "-" + j);
            if (array[i][j] === 0) {
                cell.setAttribute("class", "dead");
            } else if (array[i][j] == 1) {
                cell.setAttribute("class", "red");
            } else if (array[i][j] == 2) {
                cell.setAttribute("class", "blue");
            } else if (array[i][j] == -1) {
                cell.setAttribute("class", "rot");
            }
        }
    }
}

// Create a function that runs the game
function run() {
    update();
    render();
}

// Reset the game
function reset() {
    setDead(array);
    setAlive();
    render();
}

// Create update function that updates the state of the cells
function update() {
    let next = create2DArray(n);
    setDead(next);
    // Loop through every spot in our 2D array and check spots neighbors
    for (let x = 1; x < array.length - 1; x++) {
        for (let y = 1; y < array.length - 1; y++) {
            // Add up all the states in a 3x3 surrounding grid
            let neighbors = new Array(4).fill(0);
            if (array[x][y] >-1) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (array[x + i][y + j] < 0) {
                            neighbors[0] += 1;
                        } else if (array[x+i][y + j] == 0) {
                            neighbors[1] += 1;
                        } else if (array[x+i][y + j] == 1) {
                            neighbors[2] += 1;
                        } else if (array[x+i][y + j] == 2) {
                            neighbors[3] += 1;
                        }
                    }
                }
            } 
            // Subtract the current cell's state since we added it in the above loop
            neighbors[array[x][y]+1] -= 1;
            // Rules of Life
            if ((array[x][y] === 1) && (neighbors[2] < 2)) {
                next[x][y] = -1;
            } else if ((array[x][y] === 1) && (neighbors[2] > 3)) {
                next[x][y] = -1;
            } else if ((array[x][y] === 2) && (neighbors[3] < 2)) {
                next[x][y] = -1;
            } else if ((array[x][y] === 2) && (neighbors[3] > 3)) {
                next[x][y] = -1;
            }
            else if ((array[x][y] === 0) && (Math.abs(neighbors[2]-neighbors[3]) > 2)) {
                if (neighbors[2] > neighbors[3]) { next[x][y] = 1; } 
                else { next[x][y] = 2; }
            } else {
                next[x][y] = array[x][y];
            }
            if (array[x][y] < 0) { next[x][y] = array[x][y] + 1;}
        }
    }
    array = next;
}

var n = 100;
var time = 2**document.getElementById("timeRange").value;
document.getElementById("timetitle").innerText = "Time - " + time+"ms";
var soup = document.getElementById("soupRange").value * ((n**2)/10);
document.getElementById("souptitle").innerText = "Soup - " + 100*parseInt(soup)/(n**2)+"%";

var intervalId;

let table = document.getElementById("griddy");
generateTable(table,n);
array = create2DArray(n);
setDead(array);
setAlive();
render();

// Get the slider values
let timeSlider = document.getElementById("timeRange");
let soupSlider = document.getElementById("soupRange");

// Run the game
setInterval(run, time);

// Change soup size
timeSlider.addEventListener('input', function() {
    // Clear the previous interval
    clearInterval(intervalId);
    timetitle = document.getElementById("timetitle");
    timetitle.innerText = "Time - " + 2**parseInt(this.value)+"ms";
  
    // Start a new interval with the updated timeSlider value
    var time = 2**parseInt(timeSlider.value);
    intervalId = setInterval(run, time);
  });

soupSlider.oninput = function() {
    soup = this.value * ((n**2)/10);
    souptitle = document.getElementById("souptitle");
    souptitle.innerText = "Soup - " + 100*parseInt(soup)/(n**2)+"%";
    reset();
}
