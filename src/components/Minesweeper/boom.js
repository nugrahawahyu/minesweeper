const T = 1000

const waits = [
    {
        duration: T / 2,
        sound: null
    },
    {
        duration: T / 4,
        sound: null
    },
    {
        duration: T / 8,
        sound: null
    },
    {
        duration: T / 16,
        sound: null
    },
    {
        duration: T / 32,
        sound: null
    },
]

function animateHelper (index, length, mineNodes, beforeNextCallback, resolve, boom) {
    if (boom.skipped) {
        resolve()
    }

    if (index >= length) {
        if (!boom.skipped) {
            resolve()
        }
        return
    }

    const mineNode = mineNodes[index]
    const wait = waits[Math.floor(Math.random() * waits.length)]

    mineNode.mark()
    
    // play sound here

    setTimeout(() => {
        beforeNextCallback()
        animateHelper(index+1, length, mineNodes, beforeNextCallback, resolve, boom)
    }, wait.duration)
}

export class Boom {
    constructor () {
        this.skipped = false
    }

    animate (mineNodes, beforeNextCallback = () => {}) {
        return new Promise((resolve) => {
            animateHelper(0, mineNodes.length, mineNodes, beforeNextCallback, resolve, this)
        })
    }

    skip () {
        this.skipped = true
    }
}
