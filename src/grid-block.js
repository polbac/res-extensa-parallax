import ArtElement from './art-block'

export default class GridBlock {
    constructor(matrix, gridElement) {
        this.x = 0
        this.y = 0
        this.gridElement = gridElement
        this.matrix = matrix.map((row, y) => {
            return row.map((col, x) => {
                const element = new ArtElement(x, y)
                gridElement.appendChild(element.create(col))
                element.resetPosition()
                return element
            })
        })

        this.setInsidePositions()
        this.render()
    }

    getWidth() {
        const artWidth = this.matrix[0][0].getWidth()
        return this.matrix[0].length * artWidth
    }

    getHeight() {
        const artHeight = this.matrix[0][0].getHeight()
        return this.matrix.length * artHeight
    }

    setInsidePositions() {
        this.matrix.forEach(row => {
            row.forEach(col => {
                col.resetPosition()
            })
        })
    }
    move(x, y) {
        this.x += x
        this.y += y
        this.matrix.forEach(row => {
            row.forEach(col => {
                col.move(x, y)
            })
        })
    }

    render() {
        this.gridElement.style.left = `${this.x}px`
        this.gridElement.style.top = `${this.y}px`

    }
}