var width = 10
var height = 10
var mines = 10

var uncoveredTiles = 0;
var alive = true;
var victory = false;
var boardMatrix = []

function buildGame() {

    let area = document.getElementById('gamearea')
    uncoveredTiles = 0;
    alive = true;
    victory = false;
    boardMatrix = []
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
                    uncoverTile(j, i)
                }
            }
            boardMatrix[i].push(0)
        }
    }
    placeMines()
}

function placeMines() {
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

function uncoverTile(x, y) {
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
            case 9: el.style.backgroundColor = "#FF0000"; break;
            default: el.style.backgroundColor = "#00a2e8"; break;
        }
        if (boardMatrix[y][x] == 0) {
            discover(x, y)
        }
        if (boardMatrix[y][x] == 9) {
            alive = false
            document.getElementById('container').style.backgroundColor = "#ff0000";
            document.getElementById('message').innerHTML = "You lost!";
            el.innerHTML = "X"
        } else {
            uncoveredTiles++
            updateGameProgressMessage()

            if (uncoveredTiles == ((width*height)-mines)) {
                victory = true;
                document.getElementById('container').style.backgroundColor = "#00fc1c";
                document.getElementById('message').innerHTML = "You won!";
            }
        }
    }
}

function discover(x, y) {
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
    mines = 80
    buildGame();
}

document.getElementById('newgame4').onclick = function() {
    width = 30
    height = 20
    mines = 100
    buildGame();
}


buildGame()
