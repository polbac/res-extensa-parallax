function getSizeCols(arr) {
    const length = arr.length
    const mod2 = length % 2
    const mod3 = length % 3
    if (mod2 === 0) {
        return length / 2
    }

    if (mod3 === 0) {
        return length / 3
    }

    return mod2 < mod3 ?
        mod3 : mod2
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

export function arrayToMatrix(arr) {
    const sizeCols = getSizeCols(arr)
    const matrix = []
    let y = 0
    let x = 0

    arr.forEach(element => {
        if (!matrix[y]) {
            matrix.push([])
        }
        
        matrix[y].push(element)

        if(x === sizeCols - 1) {
            x = 0
            y++
        } else {
            x++
        }

        
    })

    const last = matrix[matrix.length - 1][sizeCols - 1]
    if (!last) {
        matrix[matrix.length - 1][sizeCols - 1] = getRandomElement(arr)
 0    }

    return matrix
}