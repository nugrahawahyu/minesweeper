import { Node } from './node'

export class Minesweeper {
    constructor ({ row, column, totalMine }) {
        if (totalMine > row * column) throw new Error('totalMine must lest than row * column')
        this.row = row
        this.column = column
        this.totalMine = totalMine
        this.isLoss = false
        this.isWin = false
        this.flags = 0
        this.mineIndexes = []
        this.clickedMine = null
    }

    init () {
        this.board = this.initBoard(this.row, this.column, this.totalMine)
    }

    printBoard () {
        for (let row of this.board) {
            console.log(JSON.stringify(row.map(o => o.value))) // eslint-disable-line
        }
    }

    check () {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.column; j++) {
                const node = this.board[i][j]
                if (node.value === -1 && !node.flagged) {
                    return
                }
            }
        }

        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.column; j++) {
                const node = this.board[i][j]
                if (node.value != -1 && !node.visited) {
                    node.visited = true
                }
            }
        }

        this.isWin = true
    }

    toggleFlagged (row, column) {
        const node = this.board[row][column]
        node.toggleFlagged()
        if (node.flagged) {
            this.flags += 1
        } else {
            this.flags -= 1
        }
    }

    mark (row, column) {
        this.board[row][column].mark()
    }
    
    visit (row, column) {
        if (row < 0 || column < 0 || row >= this.row || column > this.column) return
        
        const node = this.board[row][column]

        if (node.flagged) {
            return
        }

        if (node.value === -1) {
            this.isLoss = true
            this.clickedMine = node
            return
        }

        node.visit()
        
        const neighbors = this.getNeighbor(row, column).filter((node) => node.value !== -1 && !node.visited)

        if (node.value === 0) {
            for (let neighbor of neighbors) {
                if (neighbor.flagged) {
                    this.flags -= 1
                    neighbor.toggleFlagged()
                }
                this.visit(neighbor.row, neighbor.column)
            }
        }
    }

    getMinesFromHelper (unvisitedNodes = [], mines = [], stackedNodes = []) {
        if (!unvisitedNodes.length) return mines

        const current = unvisitedNodes.shift()
        const row = current.row
        const column = current.column
        const neighbors = this.getNeighbor(row, column).filter((neighbor) => !stackedNodes.includes(neighbor) && !(neighbor.flagged && neighbor.value === -1))

        if (current.value === -1) {
            mines.push(current)
        }
        
        neighbors.forEach((neighbor) => {
            stackedNodes.push(neighbor)
            unvisitedNodes.push(neighbor)
        })

        return this.getMinesFromHelper(unvisitedNodes, mines, stackedNodes)
    }

    getMinesFrom (row, column) {
        const root = this.board[row][column]
        return this.getMinesFromHelper([root])
    }

    getNeighbor (row, column) {
        const neighbors = []
        
        for (let x = row - 1; x <= row + 1; x++) {
            for (let y = column - 1; y <= column + 1; y++) {
                if ((x === row && y === column) || 
                    (x < 0 || y < 0 || x >= this.row || y >= this.column)) {
                        continue
                    }
                const node = this.board[x][y]
                neighbors.push(node)
            }
        }

        return neighbors
    }

    initBoard (row, column, totalMine) {
        const mineIndexes = []
        const board = []
        let mineCounter = 0
        
        // generate mine indexes
        while (mineCounter < totalMine) {
            const mineRow = Math.floor(Math.random() * row)
            const mineColumn = Math.floor(Math.random() * column)
            const mineIndex = [mineRow, mineColumn]

            if (!mineIndexes.find(index => JSON.stringify(index) === JSON.stringify(mineIndex))) {
                mineIndexes.push(mineIndex)
                mineCounter += 1
            }
        }

        this.mineIndexes = mineIndexes

        // init nodes
        for (let i = 0; i < row; i++) {
            board[i] = []
            for (let j = 0; j < column; j++) {
                board[i][j] = new Node(i, j)
            }
        }

        // assign mines
        for (let index of mineIndexes) {
            const row = index[0]
            const column = index[1]

            board[row][column].setValue(-1)
        }

        // assign the rest tiles
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < column; j++) {
                if (board[i][j].value === -1) continue
                
                let mineNeighborCounter = 0

                for (let x = i - 1; x <= i + 1; x++) {
                    for (let y = j - 1; y <= j + 1; y++) {
                        if ((x === i && y === j) || x < 0 || y < 0 || x >= row || y >= column) continue
                        if (board[x][y].value === -1) {
                            mineNeighborCounter += 1
                        }
                    }
                }

                board[i][j].setValue(mineNeighborCounter)
            }
        }

        return board
    }

    markAllMines () {
        this.mineIndexes.forEach(([ row, column ]) => {
            this.board[row][column].mark()
        })
    }
}
