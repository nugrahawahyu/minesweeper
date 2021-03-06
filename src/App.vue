<template>
  <div id="app" :style="`max-width: ${config.maxWidth};`">
    <div class="game-header grid-container">
      <div class="grid-item align-left">
        <select name="size" v-model="config">
          <option v-for="(config, i) in configs" v-bind:value="config" :key="i" >
            {{ config.text }}
          </option>
        </select>
      </div>
      <div class="grid-item">
          <div class="game-stats grid-container-6-of-12">
            <div class="grid-item">
              <i class="fas fa-flag"></i>
              <span>{{ flagsLeft }}</span>
            </div>
            <div class="grid-item">
              <i class="fas fa-stopwatch"></i>
              <span>{{ timer }}</span>
            </div>
          </div>
      </div>
      <div class="grid-item">
        <div class="dark-mode-toggle align-right">
          <i class="fas fa-moon"></i>
          <input type="checkbox" v-model="isDarkMode" name="dark-mode-chooser" @change="toggleDarkMode()">
        </div>
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
        <template slot="header">
          <span v-if="isWin">🎉</span>
          <span v-else>😿</span>
        </template>
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
                    <span v-if="platform === 'desktop'">Left click</span>
                    <span v-else>Tap</span>
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
                    <span v-if="platform === 'desktop'">Right click</span>
                    <span v-else>Hold</span>
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
import MobileDetect from 'mobile-detect'

const md = new MobileDetect(window.navigator.userAgent);

const HIGHEST_SCORE_CACHE_KEY = 'highest_score'

const allPlatformConfigs = [
  {
    platform: 'desktop',
    maxWidth: '400px',
    text: 'Easy',
    level: 'easy',
    mines: 10,
    size: [10, 10]
  },
  {
    platform: 'desktop',
    maxWidth: '700px',
    text: 'Medium',
    level: 'medium',
    mines: 40,
    size: [18, 18]
  },
  {
    platform: 'desktop',
    maxWidth: '900px',
    text: 'Hard',
    level: 'hard',
    mines: 99,
    size: [24, 24]
  },
    {
    platform: 'mobile',
    maxWidth: '100%',
    text: 'Easy',
    level: 'easy',
    mines: 10,
    size: [10, 10]
  },
  {
    platform: 'mobile',
    maxWidth: '100%',
    text: 'Medium',
    level: 'medium',
    mines: 40,
    size: [27, 12]
  },
  {
    platform: 'mobile',
    maxWidth: '100%',
    text: 'Hard',
    level: 'hard',
    mines: 99,
    size: [48, 12]
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
      config: null,
      showModal: false,
      showOnBoarding: true,
      isDarkMode: false,
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
    platform () {
      return md.mobile() ? 'mobile' : 'desktop'
    },
    configs () {
      return allPlatformConfigs.filter(c => c.platform === this.platform)
    },
    backgroundAudio () {
      return new Audio('https://upload.wikimedia.org/wikipedia/commons/4/43/JOHN_MICHEL_CELLO-J_S_BACH_CELLO_SUITE_1_in_G_Prelude.ogg')
    }
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
        this.backgroundAudio.play()
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
        this.backgroundAudio.play()
        this.showModal = true
        this.timerInterval = null
      }
    }
  },
  created () {
    this.config = this.configs[0]
    this.readHighestScore()
    this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    this.toggleDarkMode()
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
      })
    },
    restart () {
      this.resetState()
      this.$refs.minesweeper.restart()
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
      this.resetTimer()
      if (this.backgroundAudio) {
        this.backgroundAudio.pause()
        this.backgroundAudio.currentTime = 0.0
      }
    },
    toggleDarkMode () {
      const bodyElement = document.body
      const className = "dark-mode"
      if (this.isDarkMode) {
        bodyElement.classList.add(className)
        bodyElement.style.background = "#000"
      } else {
        bodyElement.classList.remove(className)
        bodyElement.style.removeProperty("background")
      }
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
  max-width: 1000px;
  margin: 0 auto;
}

.game-header {
  padding: 10px;
  background-color: #ddd;
}

.dark-mode .game-header {
  background-color: #222;
  color: #fff;
}

.dark-mode-toggle .fas {
  padding-right: 5px;
}

.game-stats {
  font-size: 14px;
}

.game-stats .fas {
  padding-right: 10px;
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
    text-align: center;
}

.align-right {
  text-align: right
}

.align-left {
  text-align: left
}
</style>
