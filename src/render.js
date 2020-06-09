import { v4 as uuidv4 } from 'uuid'
import { IMAGE } from './type'
import { VerticalDirection, HorizontalDirection } from './navigation'
import Viewport from './Viewport'

const viewport = new Viewport()

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
        return window.innerWidth *.9;
    }

    getHeight() {
        return window.innerHeight *.9;
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

    move({ x, y, verticalDirection, horizontalDirection }) {
        this.artworkList.forEach(artwork => {
            artwork.x += x
            artwork.y += y
        })
        
        this.assertChangePositions({ verticalDirection, horizontalDirection })
    }

    getTotalArea() {
        const area = { 
            x1: this.artworkList[0].x,
            y1: this.artworkList[0].y,
            x2: this.artworkList[0].x,
            y2: this.artworkList[0].y,
        }

        this.artworkList.forEach(artwork => {
            if (artwork.x < area.x1) area.x1 = artwork.x
            if (artwork.y < area.y1) area.y1 = artwork.y
            if (artwork.x + this.getWidth() > area.x2) area.x2 = artwork.x + this.getWidth()
            if (artwork.y + this.getHeight() > area.y2) area.y2 = artwork.y + this.getHeight()
        })

        return area
    }

    getTopRow() {
        const area = this.getTotalArea()
        return this.artworkList
            .filter(artwork => artwork.y === area.y1)

    }

    getBottomRow() {
        const area = this.getTotalArea()
        return this.artworkList
            .filter(artwork => artwork.y + this.getHeight() === area.y2)
    }

    getLeftColumn() {
        const area = this.getTotalArea()
        return this.artworkList
            .filter(artwork => artwork.x === area.x1)
    }

    getRightColumn() {
        const area = this.getTotalArea()
        return this.artworkList
            .filter(artwork => artwork.x + this.getWidth() === area.x2)
    }

    shouldFillVerticalGap(verticalDirection) {
        const area = this.getTotalArea()
        const viewportSize = viewport.getSize()

        if (verticalDirection === VerticalDirection.TOP) {
            return area.y2  <= viewportSize.height
        }

        if (verticalDirection === VerticalDirection.BOTTOM) {
            return area.y1 >= 0
        }

        return false
    }

    shouldFillHorizontalGap(horizontalDirection) {
        const area = this.getTotalArea()
        const viewportSize = viewport.getSize()

        if (horizontalDirection === HorizontalDirection.LEFT) {
            return area.x2  <= viewportSize.width
        }

        if (horizontalDirection === HorizontalDirection.RIGHT) {
            return area.x1 >= 0
        }

        return false
    }

    assertChangePositions({ verticalDirection, horizontalDirection }) {
        const area = this.getTotalArea()

        if (verticalDirection === VerticalDirection.TOP && this.shouldFillVerticalGap(VerticalDirection.TOP)) {
            const els = this.getTopRow()
            els.forEach(el => {
                el.y = area.y2
            })
        }

        if (verticalDirection === VerticalDirection.BOTTOM && this.shouldFillVerticalGap(VerticalDirection.BOTTOM)) {
            const els = this.getBottomRow()
            els.forEach(el => {
                el.y = area.y1 - this.getHeight()
            })
        }

        if (horizontalDirection === HorizontalDirection.LEFT && this.shouldFillHorizontalGap(HorizontalDirection.LEFT)) {
            const els = this.getLeftColumn()
            els.forEach(el => {
                el.x = area.x2
            })
        }

        if (horizontalDirection === HorizontalDirection.RIGHT && this.shouldFillHorizontalGap(HorizontalDirection.RIGHT)) {
            const els = this.getRightColumn()
            els.forEach(el => {
                el.x = area.x1 - this.getWidth()
            })

        }
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