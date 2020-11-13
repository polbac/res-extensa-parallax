import { v4 as uuidv4 } from 'uuid'
import { VerticalDirection, HorizontalDirection } from './navigation'
import Viewport from './Viewport'
import { arrayToMatrix } from './utils'
import GridBlock from './grid-block'
const viewport = new Viewport()
const GRID_ELEMENTS = 4

export default class Render{
    constructor(artworkList) {
        this.grid = []
        this.matrix = []
        this.artworkList = artworkList
        this.target = document.getElementById("main")
        this.matrix = arrayToMatrix(this.artworkList)
        this.blocks = []
    }
    
    addToDom() {
        for (let index = 0; index < GRID_ELEMENTS; index++) {
            const gridElement = document.createElement("div")
                const uuid = uuidv4()
                gridElement.classList.add('grid-el')
                gridElement.classList.add(`grid-el-${uuid}`)
                this.target.append(gridElement)
                this.blocks.push(new GridBlock(this.matrix, gridElement))
        }
    }

    getBlockWidth() {
        return this.blocks[0].getWidth()
    }

    getBlockHeight() {
        return this.blocks[0].getHeight()
    }

    firstRender() {
        const width = this.getBlockWidth()
        const height = this.getBlockHeight()
        
        this.blocks[0].x = 0
        this.blocks[0].y = 0

        this.blocks[1].x = width
        this.blocks[1].y = 0

        this.blocks[2].x = 0
        this.blocks[2].y = height

        this.blocks[3].x = width
        this.blocks[3].y = height

    }

    move({ x, y, verticalDirection, horizontalDirection }) {
        this.blocks.forEach(block => {
            const speed = 0.5
            block.move(x * speed, y * speed)
        })
        
        this.assertMoveBlocks({ verticalDirection, horizontalDirection })
    }

    getTotalArea() {
        const area = { 
            x1: this.blocks[0].x,
            y1: this.blocks[0].y,
            x2: this.blocks[0].x,
            y2: this.blocks[0].y,
        }

        this.blocks.forEach(block => {
            if (block.x < area.x1) area.x1 = block.x
            if (block.y < area.y1) area.y1 = block.y
            if (block.x + this.getBlockWidth() > area.x2) area.x2 = block.x + this.getBlockWidth()
            if (block.y + this.getBlockHeight() > area.y2) area.y2 = block.y + this.getBlockHeight()
        })
        return area
    }

    render() {
        this.blocks.forEach(block => block.render())
    }

    getTopRow() {
        const area = this.getTotalArea()
        return this.blocks
            .filter(block => block.y === area.y1)

    }

    getBottomRow() {
        const area = this.getTotalArea()
        return this.blocks
            .filter(block => block.y + this.getBlockHeight() === area.y2)
    }

    getLeftColumn() {
        const area = this.getTotalArea()
        return this.blocks
            .filter(block => block.x === area.x1)
    }

    getRightColumn() {
        const area = this.getTotalArea()
        return this.blocks
            .filter(block => block.x + this.getBlockWidth() === area.x2)
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

    assertMoveBlocks({ verticalDirection, horizontalDirection }) {
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
                el.y = area.y1 - this.getBlockHeight()
                el.setInsidePositions()
            })
        }

        if (horizontalDirection === HorizontalDirection.LEFT && this.shouldFillHorizontalGap(HorizontalDirection.LEFT)) {
            const els = this.getLeftColumn()
            els.forEach(el => {
                el.x = area.x2
                el.setInsidePositions()
            })
        }

        if (horizontalDirection === HorizontalDirection.RIGHT && this.shouldFillHorizontalGap(HorizontalDirection.RIGHT)) {
            const els = this.getRightColumn()
            els.forEach(el => {
                el.x = area.x1 - this.getBlockWidth()
            })

        }
    }
}