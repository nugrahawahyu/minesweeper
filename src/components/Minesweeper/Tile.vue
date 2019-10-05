<template>
    <div 
        class="board-tile"
        :class="{ visited }"
        @click="$emit('visit', { row, column })"
        @click.right.prevent="$emit('toggle-flagged', { row, column })" >
        <template v-if="flagged">
            <span class="white">F</span>
        </template>
        <template v-else-if="(isWin || isLoss) && value === -1">
            <span>B</span>
        </template>
        <template v-else-if="visited">
            <span :class="{gray: value === 0}">{{ value }}</span>
        </template>
        <template v-else>
            <span class="blue">-</span>
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
        }
    }
}
</script>

<style scoped>
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
    background-color: #eee !important;
    color: black; 
}

.board-tile {
    background-color: blue;
    padding: 20px;
    border: solid 1px lightblue;
}
</style>