export class Node {
    constructor (row, column) {
        this.value = 0
        this.visited = false
        this.row = row
        this.column = column
        this.flagged = false
        this.marked = false
    }

    visit () {
        this.visited = true
    }

    toggleFlagged () {
        this.flagged = !this.flagged
    }

    mark () {
        this.marked = true
    }

    setValue (value) {
        this.value = value
    }
}
