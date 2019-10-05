function animateHelper (index, length, mineNodes, duration, beforeNextCallback, resolve) {
    if (index >= length) {
        resolve()
        return
    }

    const mineNode = mineNodes[index]
    const wait = duration / (mineNodes.length)

    setTimeout(() => {
        mineNode.mark()
        beforeNextCallback()
        animateHelper(index+1, length, mineNodes, duration, beforeNextCallback, resolve)
    }, wait)
}

export class Boom {
    static animate (mineNodes, duration, beforeNextCallback = () => {}) {
        return new Promise((resolve) => {
            animateHelper(0, mineNodes.length, mineNodes, duration, beforeNextCallback, resolve)
        })
    }
}

