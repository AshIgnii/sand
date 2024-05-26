const sandMaterial = {
    color: { r: 0, g: 0, b: 0, a: 1 }, 
    gravDir: { x: 1, y: 1 },
    mass: 1,
    maxSpeed: 1,
}

export class materialObj {
    constructor(material = sandMaterial, x = 0, y = 0, mass = 1, mX = 0, mY = 0) {
        this.material = sandMaterial;
        this.color = material.color;

        this.x = x
        this.y = y

        this.mass = 1;

        this.mX = mX;
        this.mY = mY;
    }
}

export class sand extends materialObj {
    constructor(x = 0, y = 0) {
        super(sandMaterial, x, y);
    }
}