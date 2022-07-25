const boardHtml = document.getElementById('board')



class Board {
    constructor(board) {
        this.board = board
        this.tiles = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null]
        ]
        this.position = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null]
        ]
        this.init()
    }

    init() {
        this.tiles.forEach(row => {
            row.forEach(tile => {
                let index = row.indexOf(tile)
                const parent = document.createElement('div')
                parent.style = "width: 150px;height: 150px;background-color: #bbb;display: flex;justify-content: center; align-items: center"
                const child = document.createElement('div')
                child.style = "width: 110px;height: 110px;background-color: #ddd;border-radius: 50%;"
                parent.appendChild(child)
                parent.addEventListener('click', () => { this.place(index) })
                const img = document.createElement('img')
                img.style = "width: 100%;height: 100%;border: none;margin: 0;padding: 0"
                child.appendChild(img)

                row[index] = parent
                this.board.appendChild(parent)
            })
        })
    }

    place(i) {
        if (!gameOver) {
            let col = []
            let moveDone = false
            this.tiles.forEach(row => {
                row.forEach(tile => {
                    if (row.indexOf(tile) === i) col.unshift(tile)
                })
            })
            col.forEach(tile => {
                if (tile.firstChild.firstChild.src === '' && moveDone === false) {
                    tile.firstChild.firstChild.src = tokens[turn]; 
                    moveDone = true
                    this.update(i)   
                }
            })
        }      
    }

    update(i) {
        changeTurn()
        Moves.push(i)
        this.tiles.forEach(row => {
            row.forEach(tile => {
                let row_i = this.tiles.indexOf(row)
                let tile_i = row.indexOf(tile)
                if (tile.firstChild.firstChild.src === location.origin + '/connectfour/assets/jeton-rouge.png') this.position[row_i][tile_i] = 0 
                if (tile.firstChild.firstChild.src === location.origin + '/connectfour/assets/jeton-jaune.png') this.position[row_i][tile_i] = 1 
            })
        })
        if (Boolean(this.checkGameOver(this.position))) this.drawGameOver(this.checkGameOver(this.position))
        else if (!Boolean(this.checkGameOver(this.position)) && this.checkTileFull()) this.drawTie()
        if (botTurn == turn) {
            bot.calculateMove()
        }
    }

    checkTileFull() {
        let tileNotCompleted = 0
        this.tiles.forEach(row => {
            row.forEach(tile => {
                if (tile.firstChild.firstChild.src === '') tileNotCompleted += 1            
            })
        })
        if (tileNotCompleted === 0) return true
        else return false
    }

    checkGameOver(position) {
        let colorAnalyzed
        let winningTiles = []
        this.tiles.forEach(row => {
            row.forEach(tile => {
                let row_i = this.tiles.indexOf(row)
                let tile_i = row.indexOf(tile)
                if (tile.firstChild.firstChild.src === '') return 
                else {
                    if (tile.firstChild.firstChild.src === location.origin + '/connectfour/assets/jeton-rouge.png') colorAnalyzed = 0
                    else if (tile.firstChild.firstChild.src === location.origin + '/connectfour/assets/jeton-jaune.png') colorAnalyzed = 1
                    
                    if (position[row_i - 3] !== undefined) {
                        if ( // y axe win
                        position[row_i - 1][tile_i] === colorAnalyzed && position[row_i - 2][tile_i] === colorAnalyzed &&
                        position[row_i - 3][tile_i] === colorAnalyzed   
                    ) {
                        winningTiles = [
                            row_i.toString() + tile_i,
                            (row_i - 1).toString() + tile_i,
                            (row_i - 2).toString() + tile_i,
                            (row_i - 3).toString() + tile_i
                        ]
                        return true
                    } 
                    }
    
                    if ( // x axe win 
                        position[row_i][tile_i + 1] === colorAnalyzed && position[row_i][tile_i + 2] === colorAnalyzed &&
                        position[row_i][tile_i + 3] === colorAnalyzed   
                    ) {
                        winningTiles = [
                            row_i.toString() + tile_i,
                            row_i.toString() + (tile_i + 1),
                            row_i.toString() + (tile_i + 2),
                            row_i.toString() + (tile_i + 3)
                        ]
                        return true
                    }
                    
                    if (position[row_i + 3] !== undefined) {
                        if ( // xy axe left win 
                            position[row_i + 1][tile_i + 1] === colorAnalyzed && position[row_i + 2][tile_i + 2] === colorAnalyzed &&
                            position[row_i + 3][tile_i + 3] === colorAnalyzed   
                        ) {
                            winningTiles = [
                                row_i.toString() + tile_i,
                                (row_i + 1).toString() + (tile_i + 1),
                                (row_i + 2).toString() + (tile_i + 2),
                                (row_i + 3).toString() + (tile_i + 3),
                            ]
                            return true
                        } 
                    }
                    
                    if (position[row_i - 3] !== undefined) {
                        if ( // xy axe right win 
                            position[row_i - 1][tile_i + 1] === colorAnalyzed && position[row_i - 2][tile_i + 2] === colorAnalyzed &&
                            position[row_i - 3][tile_i + 3] === colorAnalyzed   
                        ) {
                            winningTiles = [
                                row_i.toString() + tile_i,
                                (row_i - 1).toString() + (tile_i + 1),
                                (row_i - 2).toString() + (tile_i + 2),
                                (row_i - 3).toString() + (tile_i + 3),
                            ]
                            return true
                        }

                    }
                }
            })
        })

        if (Boolean(winningTiles.length)) {
            gameOver = true
            return winningTiles;
        }         
        return false
    }

    drawGameOver(tiles) {
        let color = this.position[tiles[0][0]][tiles[0][1]]
        console.log(color + ' won');
    }

    drawTie() {
        console.log('Tie');
    }
}


class Bot {
    constructor() {
        this.isEnabled = botEnabled
        if (botEnabled) this.start = botStart
        this.turn = botTurn
        if (this.start) this.calculateMove();
    }

    calculateMove() {
        if (Moves.length === 0) {
            board.place(3) // place in middle if first to move
        } else  {
            if (this.canWin().boolean) board.place(this.canWin().place) // if ai can win it'll win
            else {
                board.place(Math.floor(Math.random() * 7))
            }
        }
    }

    canWin() {
        // check if 3 of his color are align
        let colorAnalyzed = this.turn 
        let winningTiles = []
        let diffWinningTiles
        let canPlace
        let returnBool = false
        let returnPlace = null
        board.tiles.forEach(row => {
            row.forEach(tile => {
                let row_i = board.tiles.indexOf(row)
                let tile_i = row.indexOf(tile)
                if (tile.firstChild.firstChild.src === '') return 
                else {
                    if (board.position[row_i][tile_i] !== colorAnalyzed) return
                    
                    if (board.position[row_i - 2] !== undefined) {
                        if (board.position[row_i - 1][tile_i] === colorAnalyzed && board.position[row_i - 2][tile_i] === colorAnalyzed) { // y axe win 
                        winningTiles = [
                            row_i.toString() + tile_i,
                            (row_i - 1).toString() + tile_i,
                            (row_i - 2).toString() + tile_i
                        ]
                        diffWinningTiles = [-1, 0]
                    } 
                    }
    
                    if (board.position[row_i][tile_i + 1] === colorAnalyzed && board.position[row_i][tile_i + 2] === colorAnalyzed) { // x axe win 
                        winningTiles = [
                            row_i.toString() + tile_i,
                            row_i.toString() + (tile_i + 1),
                            row_i.toString() + (tile_i + 2)
                        ]
                        diffWinningTiles = [0, 1]
                    }
                    
                    if (board.position[row_i + 2] !== undefined) {
                        if (board.position[row_i + 1][tile_i + 1] === colorAnalyzed && board.position[row_i + 2][tile_i + 2] === colorAnalyzed) { 
                            winningTiles = [
                                row_i.toString() + tile_i,
                                (row_i + 1).toString() + (tile_i + 1),
                                (row_i + 2).toString() + (tile_i + 2)
                            ]
                            diffWinningTiles = [1, 1]
                        } 
                    }
                    
                    if (board.position[row_i - 2] !== undefined) {
                        if (board.position[row_i - 1][tile_i + 1] === colorAnalyzed && board.position[row_i - 2][tile_i + 2] === colorAnalyzed) { // xy axe right win
                            winningTiles = [
                                row_i.toString() + tile_i,
                                (row_i - 1).toString() + (tile_i + 1),
                                (row_i - 2).toString() + (tile_i + 2)
                            ]
                            diffWinningTiles = [-1, 1]
                        }

                    }
                }
            })
        })
        // if yes check if can place to win
        if (Boolean(winningTiles.length)) {
            let testPos = board.position
            let posTarget = [
                [winningTiles[0][0] - diffWinningTiles[0], winningTiles[0][1] - diffWinningTiles[1]],
                [parseInt(winningTiles[2][0]) + diffWinningTiles[0], parseInt(winningTiles[2][1]) + diffWinningTiles[1]]
            ]
            if (testPos[posTarget[0][0]] === undefined || testPos[posTarget[1][0]] === undefined) return (
                {
                    boolean: returnBool,
                    place: returnPlace
                },
                console.warn('undefined found')
            )
            let firstTargetPosition = testPos[posTarget[0][0]][posTarget[0][1]]
            let secondTargetPosition = testPos[posTarget[1][0]][posTarget[1][1]]

            if (firstTargetPosition === null) {
                if (testPos[posTarget[0][0] + 1] === undefined) return (
                    {
                        boolean: returnBool,
                        place: returnPlace
                    },
                    console.warn('undefined found')
                )
                if (testPos[posTarget[0][0] + 1][posTarget[0][1]] !== null) {
                    returnBool = true
                    returnPlace = posTarget[0][1]
                }
            } else if (secondTargetPosition === null) {
                if (testPos[posTarget[1][0] + 1] === undefined) return (
                    {
                        boolean: returnBool,
                        place: returnPlace
                    },
                    console.warn('undefined found')
                )
                if (testPos[posTarget[1][0] + 1][posTarget[1][1]] !== null) {
                    returnBool = true
                    returnPlace = posTarget[1][1]
                }
            }
            
        } else return {
            boolean: returnBool,
            place: returnPlace
        }

        // if yes place it
        return {
            boolean: returnBool,
            place: returnPlace
        }
    }
}

document.addEventListener('DOMContentLoaded', init)

let board
let tokens = [
    "./assets/jeton-rouge.png",
    "./assets/jeton-jaune.png",
    "RED TOKEN WIN",
    "YELLOW TOKEN WIN"
]
let turn = 0
let bot
let Moves = []
let botEnabled
let botStart
let botTurn
let gameOver = false

function init() {
    botEnabled = confirm('Do you wanna play against a bot ?')
    if (botEnabled) {
        botStart = !confirm('Do you want to start in first ?')
        botTurn = Number(!botStart)
    }
    board = new Board(boardHtml)
    bot = new Bot()
}

function changeTurn() {
    if (turn === 0) turn = 1
    else turn = 0;
}
