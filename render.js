export function Draw(matrix, canvas, width, height) {
    let ctx = canvas.getContext("2d");
    for (let x = 0; x < matrix.length; x++) {
        for (let y = 0; y < matrix[x].length; y++) {
            ctx.fillStyle = 'white';

            if (matrix[x][y] != null) {
                let material = matrix[x][y].material;
                ctx.fillStyle = `rgba(${material.color.r}, ${material.color.g}, ${material.color.b}, ${material.color.a})`;
            }

            ctx.fillRect(x * (canvas.width / width), y * (canvas.height / height), canvas.width / width, canvas.height / height);
        }
    }
}
