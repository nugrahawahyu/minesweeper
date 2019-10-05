<template>
    <div 
        class="board-tile"
        :class="containerClass"
        @click="$emit('visit', { row, column })"
        @click.right.prevent="$emit('toggle-flagged', { row, column })" >
        <template v-if="flagged">
            <div class="tile-container">
                <div class="tile-content">F</div>
            </div>
        </template>
        <template v-else-if="(isWin || isLoss) && value === -1">
            <div class="tile-container">
            </div>
        </template>
        <template v-else-if="visited">
            <div class="tile-container">
                <div class="tile-content">{{ value }}</div>
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

.board-tile.flagged {
    color: white;
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
</style>