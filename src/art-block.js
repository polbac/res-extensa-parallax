import { v4 as uuidv4 } from 'uuid'
import { IMAGE, IFRAME } from './type'

const inViewport = require('in-viewport')

export default class ArtElement{
    constructor(x, y) {
        this.x = x
        this.y = y
        this.offsetX = 0
        this.offsetY = 0
    }

    getWidth() {
        return window.innerWidth *.9;
    }

    getHeight() {
        return window.innerHeight *.9;
    }

    create(artwork) {
        let el
        const uuid = uuidv4()
        this.uuid = uuid

        switch(artwork.config.type) {
            case IMAGE :
                el = document.createElement("div")
                el.classList.add('type-image')
                el.style.backgroundImage = `url(${artwork.config.thumbnail})`
                break
            case IFRAME:
                el = document.createElement("iframe")
                el.classList.add('type-iframe')
                el.src = artwork.config.src
                el.scrolling = 'no'
                break
        }

        el.classList.add('el')
        el.classList.add(`el-${uuid}`)
        return el
    }

    getEl() {
        return document.getElementsByClassName(`el-${this.uuid}`)[0]
    }

    resetPosition() {
        this.getEl().style.left = (this.x * this.getWidth()) + 'px'
        this.getEl().style.top = (this.y * this.getHeight()) + 'px'
        this.getEl().style.zIndex = 0 -this.z
        
        this.offsetY = -10 + (Math.random() * 20)
        this.offsetX = -10 + (Math.random() * 20)
        this.z = Math.random() * 50

        const backgroundSize = 50 + (50 * (this.z/100))
        this.getEl().style.backgroundSize = `auto ${backgroundSize}%`
        
    }

    move(x, y) {
        this.getEl().style.transform = `translate(${this.offsetY}px, ${this.offsetX}px)`

        if (inViewport(this.getEl())) {
            this.offsetX += (x * this.z) / 50
            this.offsetY += (y * this.z) / 50
            this.getEl().style.transform = `translate(${this.offsetX}px, ${this.offsetY}px)`
        }
    }
}