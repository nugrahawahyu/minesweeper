<template>
    <div class="container">
        <div class="flex-grid white" v-for="(row, i) of board" :key="i">
            <div 
                v-for="(node, j) of row"
                :key="j"
                class="col" >
                <Tile
                    :ref="`tile_${i}_${j}`"
                    :value="node.value"
                    :row="i"
                    :column="j"
                    :visited="node.visited"
                    :flagged="node.flagged"
                    :is-win="isWin"
                    :is-loss="isLoss"
                    @visit="visit"
                    @toggle-flagged="toggleFlagged" />
            </div>
        </div>
    </div>
</template>

<script>
import Tile from './Tile'
import { Minesweeper } from '../../modules/Minesweeper'

export default {
    components: {
        Tile
    },
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
        },
        mineTiles () {
            const mineIndexes = this.minesweeper.mineIndexes
            const tiles = []

            mineIndexes.forEach((index) => {
                tiles.push(this.$refs[`tile_${index[0]}_${index[1]}`][0])
            })

            return tiles
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
                const mineIndexes = this.minesweeper.mineIndexes
                this.disable = true
                this.mineTiles.forEach((tile) => {
                    tile.markMine()
                })
                this.$emit('loss', mineIndexes)
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
        visit ({row, column}) {
            if (this.disable) return
            this.minesweeper.visit(row, column)
            this.minesweeper.check()
            this.$forceUpdate()
        },
        toggleFlagged ({row, column}) {
            if (this.minesweeper.board[row][column].visited) return
            this.minesweeper.toggleFlagged(row, column)
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
</style>