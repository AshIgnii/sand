import { shuffle, square, createMatrix, getMouse } from "./utils.js";
import { Draw } from "./render.js";
import { updateGravity } from "./physics.js";
import { sand } from "./types.js";

const width = 100;
const height = 100;
const strokeSize = 10;

let matrix = createMatrix(width, height);

function update() {
    let newMatrix = createMatrix(width, height);
    let fragments = [];

    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] != null) {
                fragments.push(matrix[x][y]);
            }
        }
    }

    shuffle(fragments);

    for (let frag of fragments) {
        let material = frag.material;

        frag.mX = frag.mX || 0;
        frag.mY = frag.mY || 0;

        frag.mX = Math.max(Math.min(frag.mX + material.mass * material.gravDir.x, material.maxSpeed), -material.maxSpeed); //Desired X Position
        frag.mY = Math.max(Math.min(frag.mY + material.mass * material.gravDir.y, material.maxSpeed), -material.maxSpeed); //Desired Y Position

        let nextX = frag.x + frag.mX;
        let nextY = frag.y + frag.mY;


        // Check diagonal collision
        if (matrix[nextX] != null && matrix[nextX][nextY] != null) {
            /*
            if (Math.random() > 0.5) {
                nextX = frag.x;
                frag.mX = 0;
            } else {
                nextY = frag.y;
                frag.mY = 0;
            }
            */
            nextX = frag.x;
            frag.mX = 0;
            nextY = frag.y;
            frag.mY = 0;
        }

        let oldX = frag.x;
        let oldY = frag.y;

        // Check X collision
        if (nextX >= width || nextX < 0 || (matrix[nextX] && matrix[nextX][oldY] != null)) {
            nextX = frag.x;
            frag.mX = 0;
        } else {
            frag.x = nextX;
        }

        // Check Y collision
        if (nextY >= height || nextY < 0 || (matrix[oldX] && matrix[oldX][nextY] != null)) {
            nextY = frag.y;
            frag.mY = 0;
        } else {
            frag.y = nextY;
        }


        frag.x = Math.max(Math.min(nextX, width - 1), 0);
        frag.y = Math.max(Math.min(nextY, height - 1), 0);

        if (newMatrix [frag.x] && newMatrix[frag.x][frag.y] == null) {
            newMatrix[frag.x][frag.y] = frag;
        } else {
            frag.x = oldX;
            frag.y = oldY;
            newMatrix[oldX][oldY] = frag;
        }
    }

    matrix = newMatrix;

    //Draw
    Draw(matrix, canvas, width, height);
}

// Canvas click event
canvas.addEventListener('click', (e) => {
    let [mX, mY] = getMouse(canvas, e);

    // Normalize to set width x height
    mX = Math.min(Math.round((mX / canvas.width) * width), width - 1);
    mY = Math.min(Math.round((mY / canvas.height) * height), height - 1);

    square(mX, mY, strokeSize, matrix, width, height, sand);
})

// Keyboard
export let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        switch (e.key) {
            case 'ArrowUp':
                if (keys.ArrowDown) {
                    keys.ArrowDown = false;
                    keys.ArrowUp = false;
                } else {
                    keys.ArrowUp = true;
                }
                break;
            case 'ArrowDown':
                if (keys.ArrowUp) {
                    keys.ArrowUp = false;
                    keys.ArrowDown = false;
                } else {
                    keys.ArrowDown = true;
                }
                break;
            case 'ArrowLeft':
                if (keys.ArrowRight) {
                    keys.ArrowRight = false;
                    keys.ArrowLeft = false;
                } else {
                    keys.ArrowLeft = true;
                }
                break;
            case 'ArrowRight':
                if (keys.ArrowLeft) {
                    keys.ArrowLeft = false;
                    keys.ArrowRight = false;
                } else {
                    keys.ArrowRight = true;
                }
                break;
        }
    }
});

// Loop
window.requestAnimationFrame(gameLoop);

function gameLoop() {
    setTimeout(() => {
        updateGravity(matrix, keys);
        update();
        window.requestAnimationFrame(gameLoop);
    }, 20);
}
