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

let skip = false

function animateHelper (index, length, mineNodes, beforeNextCallback, resolve) {
    if (index >= length || skip) {
        skip = false
        resolve()
        return
    }

    const mineNode = mineNodes[index]
    const wait = waits[Math.floor(Math.random() * waits.length)]

    mineNode.mark()
    
    // play sound here

    setTimeout(() => {
        beforeNextCallback()
        animateHelper(index+1, length, mineNodes, beforeNextCallback, resolve)
    }, wait.duration)
}

export class Boom {
    static animate (mineNodes, beforeNextCallback = () => {}) {
        return new Promise((resolve) => {

            animateHelper(0, mineNodes.length, mineNodes, beforeNextCallback, resolve)
        })
    }

    static skip () {
        skip = true
    }
}
