export class Node {
    constructor (row, column) {
        this.value = 0
        this.visited = false
        this.row = row
        this.column = column
        this.flagged = false
    }

    visit () {
        this.visited = true
    }

    toggleFlagged () {
        this.flagged = !this.flagged
    }

    setValue (value) {
        this.value = value
    }
}
