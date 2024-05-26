export function updateGravity(matrix, keys) {
    let x = 0, y = 0;
    if (keys.ArrowUp) y = -1;
    if (keys.ArrowDown) y = 1;
    if (keys.ArrowLeft) x = -1;
    if (keys.ArrowRight) x = 1;

    let arrow = document.getElementById('gravityArrow').children[2];
    let circle = document.getElementById('gravityArrow').children[1];

    if (x === 0 && y === 0) {
        circle.style.display = '';
        arrow.style.display = 'none';
    } else {
        circle.style.display = 'none';
        arrow.style.display = '';

        let angle = (Math.atan2(y, x) * 180 / Math.PI) + 90;
        arrow.setAttribute('transform', `rotate(${angle}, 25, 25)`);
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] != null) {
                let frag = matrix[i][j];
                frag.material.gravDir = { x: x, y: y };
                frag.mX = 0;
                frag.mY = 0;
            }
        }
    }
}
