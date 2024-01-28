let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

let height = 500;
let width = 500;
let strokeSize = 100;

function createMatrix(width, height) {
    let matrix = new Array(width);
    for (let i = 0; i < height; i++) {
        let collumn = new Array(height);

        for (let i = 0; i < collumn.length; i++) {
            collumn[i] = 0;
        }

        matrix[i] = collumn;
    }

    return matrix;
}

let matrix = createMatrix(width, height);

function update() {
    //Physics
    let newMatrix = createMatrix(width, height); //Create new matrix to apply the new cordinates
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === 1) {
                //Check if theres empty space below
                if (matrix[x][y + 1] === 0) {
                    newMatrix[x][y + 1] = 1;
                } else {

                    //Check if a collection of frags are in midair, if not, slide to the side
                    let slide = false;
                    for (let i = y; i < height; i++) {
                        if (matrix[x][i] === 0) {
                            slide = false;
                            break;
                        }
                        if (i === height - 1) {
                            slide = true;
                        }
                    }

                    let left = 0;
                    let right = 0;
                    if (slide === true) {
                        //Check if theres empty space to the right
                        right = 0;
                        if (x + 1 <= width - 1) {
                            if (matrix[x + 1][y + 1] === 0) {
                                right = 1;
                            }
                        }

                        //Check if theres empty space to the left
                        left = 0;
                        if (x - 1 >= 0) {
                            if (matrix[x - 1][y + 1] === 0) {
                                left = 1;
                            }
                        }

                        if (left === 1 && right === 1) { //if both sides are available, choose randomly
                            if (Math.random() > 0.5) {
                                left = 1;
                                right = 0;
                            } else {
                                left = 0;
                                right = 1;
                            }
                        }
                    }

                    if (left === 1) {
                        newMatrix[x - 1][y + 1] = 1;
                    } else if (right === 1) {
                        newMatrix[x + 1][y + 1] = 1;
                    } else {
                        newMatrix[x][y] = 1;
                    }
                }
            }
        }
    }

    matrix = newMatrix;

    //Draw
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            switch (matrix[x][y]) {
                case 0:
                    ctx.fillStyle = 'white';
                    break;
                case 1:
                    ctx.fillStyle = 'black';
                    break;
            }

            ctx.fillRect(x * (canvas.width / width), y * (canvas.height / height), canvas.width / width, canvas.height / height);
        }
    }
}

//Spawn square
function square(x, y, size) {
    let cornerX = x - size / 2;
    let cornerY = y - size / 2;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let coordX = Math.max(Math.min(Math.round(cornerX + i), width - 1), 0);
            let coordY = Math.max(Math.min(Math.round(cornerY + j), height - 1), 0);

            matrix[coordX][coordY] = 1;
        }
    }
}

//Get mouse pos in canvas
function getMouse(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
}

//Canvas click event
canvas.addEventListener('click', (e) => {
    let [mX, mY] = getMouse(canvas, e);

    //Normalize to set width x height
    mX = Math.min(Math.round((mX / canvas.width) * width), width - 1);
    mY = Math.min(Math.round((mY / canvas.width) * height), height - 1);

    square(mX, mY, strokeSize);
})

//Loop
window.requestAnimationFrame(gameLoop);

function gameLoop() {
    update();
    window.requestAnimationFrame(gameLoop);
}