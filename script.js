var width = 10
var height = 10
var mines = 10

var uncoveredTiles = 0;
var alive = true;
var victory = false;
var boardMatrix = []
var flags = []

function buildGame() {
    //Builds both the visual elements and the matrix that stores board information
    //Also inserts the events for each cell of the board
    let area = document.getElementById('gamearea')
    uncoveredTiles = 0;
    alive = true;
    victory = false;
    boardMatrix = []
    flags = []
    document.getElementById('container').style.backgroundColor = "";
    document.getElementById('message').innerHTML = "Minesweeper";

    while (area.hasChildNodes()) {
        area.removeChild(area.lastChild);
    }

    for (let i = 0; i < height; i++) {
        let new_row = document.createElement('div')
        new_row.classList.add('row');
        document.getElementById('gamearea').appendChild(new_row)
        boardMatrix.push([])
        for (let j = 0; j < width; j++) {
            new_tile = document.createElement('div')
            new_tile.classList.add('tile')
            new_tile.innerHTML = "?"
            new_row.appendChild(new_tile)
            new_tile.onclick = function() {
                if (alive && !victory) {
                    if (isNaN(flagIndex(j, i))){
                        uncoverTile(j, i)
                    }
                }
            }
            new_tile.oncontextmenu = function(e) {
                e.preventDefault();
                if (alive && !victory) {
                    flagTile(j, i)
                }
            }
            boardMatrix[i].push(0)
        }
    }
    placeMines()
}

function placeMines() {
    //Places mines by randomly picking coordinates within the matrix
    let placedMines = 0;
    while (placedMines < mines) {
        let tryX = Math.floor(Math.random()*height)
        let tryY = Math.floor(Math.random()*width)
        if (boardMatrix[tryX][tryY] != 9) {
            boardMatrix[tryX][tryY] = 9
            placedMines++
        }
    }
    calcNeighbors()
}

function calcNeighbors() {
    //Calculates how many neighboring tiles of each cell are mines
    //if the current cell is a mine, it's skipped
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (boardMatrix[i][j] != 9) {
                for (let ii = -1; ii <= 1; ii++) {
                    for (let jj = -1; jj <= 1; jj++) {
                        if (i+ii >= 0 && j + jj >= 0) {
                            if (i+ii <= height-1 && j + jj <= width-1) {
                                if (boardMatrix[i+ii][j+jj] == 9) {
                                    boardMatrix[i][j]++
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    updateGameProgressMessage()
}

function flagIndex(x, y) {
    //Returns the index of the flag if the specified coordinates
    //are those of a flag
    //Otherwise returns NaN
    if (flags.length > 0) {
        for (let i = 0; i < flags.length; i++) {
            if (flags[i][0] == x && flags[i][1] == y) {
                return i
            }
        }
    }
    return NaN
}

function flagTile(x, y) {
    //Toggles flag for the specified coordinate
    el = document.getElementById('gamearea').childNodes[y].childNodes[x]
    if (!el.classList.contains('uncovered')) {
        if (isNaN(flagIndex(x, y))) {
            el.innerHTML = "!"
            el.style.color = "#FF0000";
            flags.push([x, y])
        } else {
            el.innerHTML = "?"
            el.style.color = "";
            flags.splice(flagIndex(x,y), 1)
        }
    }

}

function uncoverTile(x, y) {
    //Responsible for revealing the value of a cell to the player
    //as well as setting victory or defeat states depending on
    //the cell that has been clicked
    //This is an absolute mess and I deeply apologize.
    el = document.getElementById('gamearea').childNodes[y].childNodes[x]
    if (!el.classList.contains('uncovered')) {
        el.classList.add('uncovered')
        el.innerHTML = boardMatrix[y][x]
        el.style.color = "#FFFFFF";
        switch (boardMatrix[y][x]) {
            case 0: el.style.backgroundColor = "#a2a2a2"; el.style.color = "#a2a2a2"; break;
            case 1: el.style.backgroundColor = "#00007f"; break;
            case 2: el.style.backgroundColor = "#007f00"; break;
            case 3: el.style.backgroundColor = "#007f7f"; break;
            case 4: el.style.backgroundColor = "#7f0000"; break;
            case 9:
                el.style.backgroundColor = (isNaN(flagIndex(x, y)) && !victory) ? "#FF0000" : "#000000";
                el.style.color = (isNaN(flagIndex(x, y)) && !victory) ? "#FFFFFF" : "#00fc1c";
                break;
            default: el.style.backgroundColor = "#00a2e8"; break;
        }
        if (boardMatrix[y][x] == 0) {
            discover(x, y)
        }
        if (boardMatrix[y][x] == 9) {
            alive = false
            if (!victory) {
                document.getElementById('container').style.backgroundColor = "#ff0000";
                document.getElementById('message').innerHTML = "You lost!";
            }
            el.innerHTML = (isNaN(flagIndex(x, y)) && !victory) ? "X" : "!"
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (boardMatrix[i][j] == 9) {
                        uncoverTile(j, i)
                    }
                }
            }
        } else {
            uncoveredTiles++
            updateGameProgressMessage()

            if (uncoveredTiles == ((width*height)-mines)) {
                victory = true;
                document.getElementById('container').style.backgroundColor = "#00fc1c";
                document.getElementById('message').innerHTML = "You won!";
                for (let i = 0; i < height; i++) {
                    for (let j = 0; j < width; j++) {
                        if (boardMatrix[i][j] == 9) {
                            uncoverTile(j, i)
                        }
                    }
                }
            }
        }
    }
}

function discover(x, y) {
    //Usually called when the player uncovers a cell with no
    //neighboring tiles.
    //This reveals all neighboring tiles to a cell, regardless
    //of whether they actually contain mines
    for (let ii = -1; ii <= 1; ii++) {
        for (let jj = -1; jj <= 1; jj++) {
            if (x+ii >= 0 && y + jj >= 0) {
                if (x+ii <= width-1 && y + jj <= height-1) {
                    uncoverTile(x+ii, y+jj)
                }
            }
        }
    }
}

function updateGameProgressMessage() {
    document.getElementById('numtiles').innerHTML = uncoveredTiles + "/" + ((width*height)-mines);
}

function toggleCustomGameMenu() {
    let menu_custom = document.getElementById('customgamemenu')
    if (menu_custom.style.display == "") {
        menu_custom.style.display = "block"
    } else {
        menu_custom.style.display = ""
    }
}


document.getElementById('newgame1').onclick = function() {
    width = 10
    height = 10
    mines = 10
    buildGame();
}

document.getElementById('newgame2').onclick = function() {
    width = 16
    height = 16
    mines = 20
    buildGame();
}

document.getElementById('newgame3').onclick = function() {
    width = 25
    height = 20
    mines = 40
    buildGame();
}

document.getElementById('newgame4').onclick = function() {
    width = 30
    height = 20
    mines = 80
    buildGame();
}

document.getElementById('restartgame').onclick = function() {
    buildGame();
}

document.getElementById('customgame').onclick = function() {
    toggleCustomGameMenu()
}

document.getElementById('resetcustom').onclick = function() {
    document.getElementById('customwidth').value = 10
    document.getElementById('customheight').value = 10
    document.getElementById('custommines').value = 10
}

document.getElementById('newgamecustom').onclick = function() {
    width = document.getElementById('customwidth').value
    height = document.getElementById('customheight').value
    mines = document.getElementById('custommines').value
    if (width * height > mines) {
        buildGame();
        toggleCustomGameMenu()
    } else {
        if (mines > width * height) {
            alert("You want a game with " + mines + " mines, but there are only " + (width * height) + " tiles. Try again.")
        } else {
            alert("You want a game with " + mines + " mines, that's the same amount of tiles you'd get, making the game impossible. Try again.")
        }
    }
}


buildGame()
