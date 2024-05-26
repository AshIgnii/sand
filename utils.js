export function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
}

export function createMatrix(width, height) {
    let matrix = new Array(width);
    for (let i = 0; i < width; i++) {
        let collumn = new Array(height);

        for (let j = 0; j < collumn.length; j++) {
            collumn[j] = null;
        }

        matrix[i] = collumn;
    }

    return matrix;
}

export function getMouse(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
}
// Spawn square
export function square(x, y, size, matrix, width, height, material) {
    let cornerX = x - size / 2;
    let cornerY = y - size / 2;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let coordX = Math.max(Math.min(Math.round(cornerX + i), width - 1), 0);
            let coordY = Math.max(Math.min(Math.round(cornerY + j), height - 1), 0);

            matrix[coordX][coordY] = new material(coordX, coordY);
        }
    }
}

