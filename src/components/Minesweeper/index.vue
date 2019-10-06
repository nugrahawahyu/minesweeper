<template>
    <div class="container" @click="skipAnimate">
        <div class="flex-grid white" v-for="(row, i) of board" :key="i">
            <div 
                v-for="(node, j) of row"
                :key="j"
                class="col" >
                <Tile
                    :value="node.value"
                    :row="i"
                    :column="j"
                    :visited="node.visited"
                    :flagged="node.flagged"
                    :marked="node.marked"
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
import { Boom } from './boom'
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
            oldMinesweeper: null,
            minesweeper: new Minesweeper({ 
                row: this.row,
                column: this.column,
                totalMine: this.mines
            }),
            disable: false,
            animating: false,
            boom: null,
            idleTimeout: null
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
        mineNodes () {
            const mineIndexes = this.minesweeper.mineIndexes
            const nodes = []

            mineIndexes.forEach((index) => {
                nodes.push(this.minesweeper.board[index[0]][index[1]])
            })

            return nodes
        }
    },
    watch: {
        isWin () {
            if (this.isWin) {
                this.disable = true
                this.$emit('win')
            }
        },
        async isLoss () {
            if (this.isLoss) {
                const { row, column } = this.minesweeper.clickedMine
                const mineNodes = this.minesweeper.getMinesFrom(row, column)
                const boom = new Boom()
                delete this.boom
                this.boom = boom
                this.disable = true
                this.$emit('stop')
                await boom.animate(mineNodes, () => {
                    if (!this.animating && !boom.skipped) this.animating = true
                    this.$forceUpdate()
                })
                this.animating = false
                if (boom.skipped) {
                    this.emitLoss()
                } else {
                    this.idleTimeout = setTimeout(() => {
                        this.emitLoss()
                    }, 3000)
                }
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
            this.oldMinesweeper = this.minesweeper
            this.minesweeper = new Minesweeper({ 
                row: this.row,
                column: this.column,
                totalMine: this.mines
            })
            delete this.oldMinesweeper
            this.disable = false
            this.init()
        },
        visit ({row, column}) {
            if (this.disable) return
            this.minesweeper.visit(row, column)
            this.minesweeper.check()
            this.$forceUpdate()
            this.$emit('toggle-flag', this.flagsLeft)
        },
        toggleFlagged ({row, column}) {
            if (this.disable || this.minesweeper.board[row][column].visited || this.flagsLeft <= 0) return
            this.minesweeper.toggleFlagged(row, column)
            this.$forceUpdate()
            this.minesweeper.check()
            this.$emit('toggle-flag', this.flagsLeft)
        },
        check () {
            this.minesweeper.check()
        },
        emitLoss () {
            clearTimeout(this.idleTimeout)
            this.boom = null
            this.idleTimeout = null
            this.$emit('loss')
        },
        skipAnimate () {
            if (this.idleTimeout) {
                this.emitLoss()
            }

            if (this.animating && this.boom) {
                this.boom.skip()
            }
        }
    }
}
</script>

<style scoped>
.container {
    margin: 0 auto;
}

.flex-grid {
    padding: 0;
    margin: 0;
    list-style: none;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    flex-flow: row;
    -webkit-flex-flow: row;
    justify-content: space-around;
   
    line-height:30px;
}

.col {
    font-weight: bold;
    font-size: 1.5em;
    text-align: center;
    flex: 1 0 auto;
    height:auto;
}

.col:before {
    content:'';
    float:left;
    padding-top:100%;
}
</style>