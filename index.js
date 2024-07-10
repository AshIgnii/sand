let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");
let densityInput = document.getElementById('density');
let strokeSizeInput = document.getElementById('stroke');
let strokeNumber = document.getElementById('strokeNumber');

let height = 100;
let width = 100;
let strokeSize = 20;
let gravity = { x: 1, y: 1 };

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
    let newMatrix = createMatrix(width, height);
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            if (matrix[x][y] === 1) {
                let newX = x + gravity.x;
                let newY = y + gravity.y;

                if (newX >= 0 && newX < width && newY >= 0 && newY < height && matrix[newX][newY] === 0) {
                    newMatrix[newX][newY] = 1;
                } else {
                    newMatrix[x][y] = 1;
                }
            }
        }
    }

    matrix = newMatrix;

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

function getMouse(element, e) {
    var rect = element.getBoundingClientRect();
    return [e.clientX - rect.left, e.clientY - rect.top];
}

canvas.addEventListener('click', (e) => {
    let [mX, mY] = getMouse(canvas, e);

    mX = Math.min(Math.round((mX / canvas.width) * width), width - 1);
    mY = Math.min(Math.round((mY / canvas.width) * height), height - 1);

    square(mX, mY, strokeSize);
})

canvas.addEventListener('mousemove', (e) => {
    let mX = e.clientX;
    let mY = e.clientY;
    
    mX -= strokeSize * (canvas.width / width) / 2;
    mY -= strokeSize * (canvas.height / height) / 2;

    let strokeIndicators = document.getElementsByClassName('strokeIndicator');
    for (let i = 0; i < strokeIndicators.length; i++) {
        strokeIndicators[i].style.display = 'block';
        strokeIndicators[i].style.left = mX + 'px';
        strokeIndicators[i].style.top = mY + 'px';
        strokeIndicators[i].style.width = (strokeSize * (canvas.width / width)) + 'px';
        strokeIndicators[i].style.height = (strokeSize * (canvas.height / height)) + 'px';
    }
})

canvas.addEventListener('mouseleave', (e) => {
    let strokeIndicators = document.getElementsByClassName('strokeIndicator');
    for (let i = 0; i < strokeIndicators.length; i++) {
        strokeIndicators[i].style.display = 'none';
    }
})

canvas.addEventListener('wheel', (e) => {
    strokeSize += Math.sign(e.deltaY);
    strokeSize = Math.max(1, strokeSize);
    strokeSize = Math.min(height, strokeSize);

    let mX = e.clientX;
    let mY = e.clientY;
    
    mX -= strokeSize * (canvas.width / width) / 2;
    mY -= strokeSize * (canvas.height / height) / 2;

    let strokeIndicators = document.getElementsByClassName('strokeIndicator');
    for (let i = 0; i < strokeIndicators.length; i++) {
        strokeIndicators[i].style.display = 'block';
        strokeIndicators[i].style.left = mX + 'px';
        strokeIndicators[i].style.top = mY + 'px';
        strokeIndicators[i].style.width = (strokeSize * (canvas.width / width)) + 'px';
        strokeIndicators[i].style.height = (strokeSize * (canvas.height / height)) + 'px';
    }
})

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (gravity.y > -1) {
                gravity.y--;
            }
            break;
        case 'ArrowDown':
            if (gravity.y < 1) {
                gravity.y++;
            }
            break;
        case 'ArrowLeft':
            if (gravity.x > -1) {
                gravity.x--;
            }
            break;
        case 'ArrowRight':
            if (gravity.x < 1) {
                gravity.x++;
            }
            break;
    }

    updateGravArrow();
})

densityInput.addEventListener('input', updateDensity);

function updateGravArrow() {
    let arrow = document.getElementById('gravityArrow').children[2];
    let circle = document.getElementById('gravityArrow').children[1];
    if (gravity.x === 0 && gravity.y === 0) {
        circle.style.display = '';
        arrow.style.display = 'none';
    } else {
        circle.style.display = 'none';
        arrow.style.display = '';

        let angle = (Math.atan2(gravity.y, gravity.x) * 180 / Math.PI) + 90;
        arrow.setAttribute('transform', `rotate(${angle}, 25, 25)`);
    }
}

function updateDensity() {
    height = parseInt(densityInput.value);
    width = parseInt(densityInput.value);

    matrix = createMatrix(width, height);
}


//Loop
updateGravArrow();
window.requestAnimationFrame(gameLoop);

function gameLoop() {
    update();
    window.requestAnimationFrame(gameLoop);
}