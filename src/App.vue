<template>
  <div id="app">
    <div class="grid-container">
      <div class="grid-item">
        <select name="size" v-model="config">
          <option v-for="(config, i) in configs" v-bind:value="config" :key="i" >
            {{ config.text }}
          </option>
        </select>
      </div>
      <div class="grid-item">
          <div class="grid-container-6-of-12">
            <div class="grid-item">
              {{ flagsLeft }}
            </div>
            <div class="grid-item">
              {{ timer }}
            </div>
          </div>
      </div>
      <div class="grid-item">

      </div>  
    </div>
    
    <template v-if="gameReady" >
      <Minesweeper
        ref="minesweeper"
        @stop="timerInterval = null"
        @win="isWin = true"
        @loss="isLoss = true"
        @toggle-flag="flagsLeft = $event"
        :row="row" 
        :column="column" 
        :mines="mines" />
    </template>

    <Modal v-if="showModal">
        <template slot="body">
          <div class="flex-grid" style="padding: 32px 0;">
            <div class="col">
                <div class="flex-grid">
                  <div class="col">
                    Time:
                  </div>
                  <div class="col">
                    <span v-if="isWin">{{ timer }}</span>
                    <span v-else>---</span>
                  </div>
                </div>
            </div>
            <div class="col">
                <div class="flex-grid">
                  <div class="col">
                    Top:
                  </div>
                  <div class="col">
                    {{ highestScore[config.level] }}
                  </div>
                </div>
            </div>
          </div>
        </template>
        <template slot="footer">
          <div class="flex-grid">
            <div class="col">
                <button @click="restart">Try again</button>
            </div>
          </div>
        </template>
    </Modal>
    <Modal v-if="showOnBoarding">
      <template slot="body">
        <div class="container">
          <div class="flex-grid">
            <div class="col">
                <div class="flex-grid">
                  <div class="col align-right">
                    Open a tile:
                  </div>
                  <div class="col align-left" style="margin-left: 10px;">
                    Left click
                  </div>
                </div>
            </div>
          </div>
          <div class="flex-grid">
            <div class="col">
                <div class="flex-grid">
                  <div class="col align-right">
                    Toggle a flag:
                  </div>
                  <div class="col align-left" style="margin-left: 10px;">
                    Right click
                  </div>
                </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div>
          <button @click="completeOnBoarding">Got It</button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import Minesweeper from './components/Minesweeper'
import Modal from './components/Modal.vue'
import { setImmediate } from 'timers'

const HIGHEST_SCORE_CACHE_KEY = 'highest_score'

const configs = [
  {
    text: 'Easy',
    level: 'easy',
    mines: 10,
    size: [10, 10]
  },
  {
    text: 'Medium',
    level: 'medium',
    mines: 40,
    size: [18, 18]
  },
  {
    text: 'Hard',
    level: 'hard',
    mines: 99,
    size: [24, 24]
  },
]
    
export default {
  name: 'app',
  components: {
    Minesweeper,
    Modal
  },
  data () {
    return {
      timer: 0,
      highestScore: {
        easy: Infinity,
        medium: Infinity,
        hard: Infinity
      },
      timerInterval: null,
      isWin: false,
      isLoss: false,
      flagsLeft: 0,
      started: false,
      config: configs[0],
      configs,
      showModal: false,
      showOnBoarding: true
    }
  },
  computed: {
    row () {
      return this.config.size[0]
    },
    column () {
      return this.config.size[1]
    },
    mines () {
      return this.config.mines
    },
    gameReady () {
      return this.started || this.showOnBoarding
    },
  },
  watch: {
    config () {
      if (this.showOnBoarding) return
      this.startGame()
    },
    timerInterval (interval, old) {
      clearInterval(old)
      return interval
    },
    isWin () {
      if (this.isWin) {
        if (this.timer < this.highestScore[this.config.level]) {
          this.highestScore[this.config.level] = this.timer
          this.writeHighestScore()
        }
        this.showModal = true
        this.timerInterval = null
      }
    },
    isLoss () {
      if (this.isLoss) {
        this.showModal = true
        this.timerInterval = null
      }
    }
  },
  created () {
    this.readHighestScore()
  },
  methods: {
    readHighestScore () {
      let highestScore = this.highestScore
      
      const cached = localStorage.getItem(HIGHEST_SCORE_CACHE_KEY)

      if (cached) {
        try {
          const parsedCache = JSON.parse(cached)
          highestScore = parsedCache
        } catch (e) {
          //
        }
      }

      this.highestScore = highestScore
    },
    writeHighestScore () {
      localStorage.setItem(HIGHEST_SCORE_CACHE_KEY, JSON.stringify(this.highestScore))
    },
    completeOnBoarding () {
      this.showOnBoarding = false
      this.startGame()
    },
    startGame () {
      this.started = false
      setImmediate(() => {
        this.started = true
        this.resetState()
        this.resetTimer()
      })
    },
    restart () {
      this.resetState()      
      this.$refs.minesweeper.restart()
      this.resetTimer()
    },
    resetTimer () {
      this.timerInterval = setInterval(() => {
        this.timer += 1
      }, 1000)
    },
    resetState () {
      this.flagsLeft = this.mines
      this.isWin = false
      this.isLoss = false
      this.showModal = false
      this.timer = 0
    }
  },
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.container {
  padding: 32px;
}

.input-container {
  text-align: left;
  width: 300px;
}

.flex-grid {
    display: flex;
}

.col {
    flex: 1;
}

.grid-container {
    display: grid;
    grid-template-columns: 33.33% 33.33% 33.33%;
}

.grid-container-6-of-12 {
    display: grid;
    grid-template-columns: 50% 50%;
}

.bordered {
    border: 1px solid rgba(0, 0, 0, 0.8);
}

.grid-item {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 20px;
    font-size: 30px;
    text-align: center;
}

.align-right {
  text-align: right
}

.align-left {
  text-align: left
}
</style>
