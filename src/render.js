import { v4 as uuidv4 } from 'uuid'
import { IMAGE } from './type'

export default class Render{
    constructor(artworkList) {
        this.artworkList = artworkList
    }
    
    addToDom() {
        const target = document.getElementById("main")
        this.artworkList = this.artworkList.map(artwork => {
            const element = new DomElement()
            target.appendChild(element.create(artwork))
            return element
        })
    }

    getWidth() {
        return window.innerWidth / 2;
    }

    getHeight() {
        return window.innerHeight / 2;
    }

    firstRender() {
        let x = -this.getWidth()
        let y = -this.getHeight()
        
        this.artworkList.forEach(artwork => {
            artwork.x = x
            artwork.y = y
            x += this.getWidth()
            if (x > this.getWidth() * 2) {
                x = 0
                y += this.getHeight()
            }
        })
    }

    move({x, y }) {
        this.artworkList.forEach(artwork => {
            artwork.x += x
            artwork.y += y
        })
        
        this.assertChangePositions()
    }

    assertChangePositions() {
        
    }

    render() {
        this.artworkList.forEach(artwork => {
            artwork.getEl().style.left = `${artwork.x}px`
            artwork.getEl().style.top = `${artwork.y}px`
        })
    }
}

class DomElement{
    create(artwork) {
        const div = document.createElement("div")
        const uuid = uuidv4()
        this.uuid = uuid

        switch(artwork.config.type) {
            case IMAGE :
                div.classList.add('el')
                div.classList.add(`el-${uuid}`)
                div.classList.add('type-image')
                div.style.backgroundImage = `url(${artwork.config.thumbnail})`
                break
        }

        return div
    }

    getEl() {
        return document.getElementsByClassName(`el-${this.uuid}`)[0]
    }
}