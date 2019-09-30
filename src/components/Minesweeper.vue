<template>
    <div class="container">
        <div class="flex-grid white" v-for="(row, i) of board" :key="i">
            <div 
                v-for="(node, j) of row"
                :key="j"
                class="col board-tile"
                :class="{ visited: node.visited }"
                @click="visit(i, j)"
                @click.right.prevent="toggleFlagged(i, j)">
                <template v-if="node.flagged">
                    <span>F</span>
                </template>
                <template v-else-if="(isWin || isLoss) && node.value === -1">
                    <span>B</span>
                </template>
                <template v-else-if="node.visited">
                    <span :class="{gray: node.value === 0}">{{ node.value }}</span>
                </template>
                <template v-else>
                    <span class="blue">-</span>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { Minesweeper } from '../modules/Minesweeper'

export default {
    props: {
        row: {
            type: Number,
            required: true
        },
        column: {
            type: Number,
            required: true
        },
        mines: {
            type: Number,
            required: true
        }
    },
    data () {
        return {
            minesweeper: new Minesweeper({ 
                row: this.row,
                column: this.column,
                totalMine: this.mines
            }),
            disable: false
        }
    },
    computed: {
        board () {
            return this.minesweeper.board
        },
        isWin () {
            return this.minesweeper.isWin
        },
        isLoss () {
            return this.minesweeper.isLoss
        },
        flagsLeft () {
            return this.mines - this.minesweeper.flags
        }
    },
    watch: {
        isWin () {
            if (this.isWin) {
                this.disable = true
                this.$emit('win')
            }
        },
        isLoss () {
            if (this.isLoss) {
                this.disable = true
                this.$emit('loss')
            }
        }
    },
    created () {
        this.init()
    },
    methods: {
        init () {
            this.minesweeper.init()
        },
        restart () {
            this.minesweeper = new Minesweeper({ 
                row: this.row,
                column: this.column,
                totalMine: this.mines
            })
            this.disable = false
            this.init()
        },
        visit (x, y) {
            if (this.disable) return
            this.minesweeper.visit(x, y)
            this.minesweeper.check()
            this.$forceUpdate()
        },
        toggleFlagged (x, y) {
            if (this.minesweeper.board[x][y].visited) return
            this.minesweeper.toggleFlagged(x, y)
            this.$forceUpdate()
            this.minesweeper.check()
            this.$emit('toggle-flag', this.flagsLeft)
        },
        check () {
            this.minesweeper.check()
        }
    }
}
</script>

<style scoped>
.container {
    margin: 0 auto;
}

.flex-grid {
    display: flex;
}

.col {
    flex: 1;
}

.board-tile {
    background-color: blue;
    padding: 20px;
    border: solid 1px lightblue;
}

.white {
    color: white;
}

.blue {
    color: blue;
}

.gray {
    color: #eee;
}

.visited {
    background-color: #eee;
    color: black; 
}
</style>