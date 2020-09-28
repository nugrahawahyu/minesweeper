<template>
    <div
        class="board-tile noselect"
        :class="containerClass"
        @click="$emit('visit', { row, column })"
        @click.right.prevent="$emit('toggle-flagged', { row, column })" >
        <template v-if="flagged">
            <div class="tile-container">
                <template v-if="isLoss && value !== -1">
                    <div class="tile-content">X</div>
                </template>
                <template v-else>
                    <div class="tile-content">F</div>
                </template>
            </div>
        </template>
        <template v-else-if="(isWin || isLoss) && value === -1">
            <div class="tile-container">
            </div>
        </template>
        <template v-else-if="visited">
            <div class="tile-container">
                <div class="tile-content" :class="{ [`tile-${value}`]: true }">{{ value }}</div>
            </div>
        </template>
        <template v-else>
            <div class="tile-container">
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            required: true
        },
        flagged: {
            type: Boolean,
            required: true
        },
        visited: {
            type: Boolean,
            required: true
        },
        isWin: {
            type: Boolean,
            required: true
        },
        isLoss: {
            type: Boolean,
            required: true
        },
        row: {
            type: Number,
            required: true
        },
        column: {
            type: Number,
            required: true
        },
        marked: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        containerClass () {
            return {
                flagged: this.flagged,
                visited: this.visited,
                marked: this.marked,
                empty: this.value === 0
            }
        }
    }
}
</script>

<style scoped>
.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
}

.tile-container {
    position: relative;
    height: 100%;
}

.tile-content {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 14px;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
}

.board-tile {
    height: 100%;
    color: blue;
    background-color: blue;
    border: solid 1px lightblue;
}

.board-tile.visited {
    background-color: #eee !important;
    color: black;
}

.board-tile.marked {
    background-color: red;
    color: red;
}

.board-tile.empty {
    color: #eee;
}

.tile-1 {
    color: blue;
}

.tile-2 {
    color: green;
}

.tile-3 {
    color: red;
}

.tile-4 {
    color: purple;
}

.tile-5 {
    color: purple;
}

.tile-6 {
    color: purple;
}

.tile-7 {
    color: purple;
}

.tile-8 {
    color: purple;
}

.dark-mode .board-tile {
  border-color: #333;
  color: darkblue;
  background-color: darkblue;
}

.dark-mode .board-tile.visited {
  background-color: #111 !important;
  color: #111;
}

.dark-mode .board-tile.marked {
  background-color: darkred;
  color: darkred;
}

.board-tile.flagged {
  color: white;
}
</style>
