import * as HyperbolicMath from '@/components/hyperbolicMath';

export class HyperbolicDrawler {
    private ctx: CanvasRenderingContext2D | null;
    private canvas: HTMLCanvasElement;
    private X: number;
    private Y: number;
    private R: number;

    
    constructor(canvasRef: React.RefObject<HTMLCanvasElement>) {
        const canvas = canvasRef.current;
        if (canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.X = canvas.width / 2;
            this.Y = this.X;
            this.R = this.X * 0.95;
        } else {
            throw new Error("Canvas not found");
        }
    }


    /**
     * Clears the canvas.
     */
    clearCanvas(): void {
        if (this.ctx) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    

    /**
        * Sets the Poincaré disk model on the canvas.
    */
    setEmptyPoincareDisk(): void {
        if (this.ctx) {
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Draw the Poincare disk model
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.arc(this.X, this.Y, this.R, 0, 2 * Math.PI);
            this.ctx.strokeStyle = 'blue';
            this.ctx.stroke();
        }
    }


    /**
     * Draws a curved or straight line in hyperbolic geometry.
     * 
     * @param {number} A - Angle A in radians
     * @param {number} B - Angle B in radians
     * @param {number} C - Angle C in radians
     * @param {number} One - Rotation angle in radians
     * @param {number} aung - Parameter related to side a
     * @param {number} bung - Parameter related to side b
     */
    drawCurvature(A: number, B: number, C: number, One: number, aung: number, bung: number): void {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        let r_kriv = 0;

        if (Math.cos(Math.PI - (A + B + C)) !== 1) {
            // Calculate radius of curvature
            r_kriv = Math.sqrt(
                ((Math.sin(C) * bung * this.R) ** 2 + (bung * this.R * Math.cos(C) - aung * this.R) ** 2) /
                (2 * (1 - Math.cos(Math.PI - A - B - C)))
            );

            // Calculate arc parameters
            let centerX = this.X + r_kriv * Math.cos(B) * Math.cos(One) + (aung * this.R + r_kriv * Math.sin(B)) * Math.sin(One);
            let centerY = this.Y + (aung * this.R + r_kriv * Math.sin(B)) * Math.cos(One) - r_kriv * Math.cos(B) * Math.sin(One);
            let startX = this.X + aung * this.R * Math.sin(One);
            let startY = this.Y + aung * this.R * Math.cos(One);
            let endX = this.X + Math.sin(One + C) * bung * this.R;
            let endY = this.Y + bung * this.R * Math.cos(C + One);

            // Calculate start and end angles
            let startAngle = Math.atan2(startY - centerY, startX - centerX);
            let endAngle = Math.atan2(endY - centerY, endX - centerX);

            // Draw the arc
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, r_kriv, startAngle, endAngle);
            this.ctx.stroke();
        } else {
            // Draw a straight line
            let startX = this.X + this.R * Math.cos(One + Math.PI / 2);
            let startY = this.Y - this.R * Math.sin(One + Math.PI / 2);
            let endX = this.X + this.R * Math.cos(One + 1.5 * Math.PI);
            let endY = this.Y - this.R * Math.sin(One + 1.5 * Math.PI);

            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            this.ctx.lineTo(endX, endY);
            this.ctx.stroke();
        }
    }


    /**
     * Creates and draws a hyperbolic triangle on the canvas.
     * 
     * @param {number} A - Angle A in radians
     * @param {number} a - Side length a
     * @param {number} B - Angle B in radians
     * @param {number} b - Side length b
     * @param {number} C - Angle C in radians
     * @param {number} c - Side length c
     * @param {number} One - Rotation angle in radians
     */
    createTrangle(A: number, a: number, B: number, b: number, C: number, c: number, One: number): void {
        let aung = 0, bung = 0;
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        // Convert side length a to Poincaré disk model
        aung = HyperbolicMath.calculatePoincareAndGyrovectorRadius(0, a)[0];

        // Draw first side of the triangle
        this.ctx.beginPath();
        this.ctx.moveTo(this.X, this.Y);
        this.ctx.lineTo(this.X + aung * this.R * Math.sin(One), this.Y + aung * this.R * Math.cos(One));
        this.ctx.stroke();

        // Convert side length b to Poincaré disk model
        bung = HyperbolicMath.calculatePoincareAndGyrovectorRadius(0, b)[0];

        // Draw second side of the triangle
        this.ctx.beginPath();
        this.ctx.moveTo(this.X, this.Y);
        this.ctx.lineTo(this.X + Math.sin(One + C) * bung * this.R, this.Y + bung * this.R * Math.cos(C + One));
        this.ctx.stroke();

        // Draw the third side (arc) of the triangle
       this.drawCurvature(A, B, C, One, aung, bung);
    }


    /**
     * Handles the calculation and creation of a hyperbolic triangle in the Poincaré disk model.
     * 
     * @param {number} A - Angle A in degrees
     * @param {number} a - Side length opposite to angle A
     * @param {number} B - Angle B in degrees
     * @param {number} b - Side length opposite to angle B
     * @param {number} C - Angle C in degrees
     * @param {number} c - Side length opposite to angle C
     * @param {number} One - Rotation angle in degrees
     * @throws {Error} If the input parameters are invalid or insufficient to define a valid hyperbolic triangle
     */
    handleTriangleDrawing(A: number, a: number, B: number, b: number, C: number, c: number, One: number): void {
        A = HyperbolicMath.degrees2Radians(A);
        B = HyperbolicMath.degrees2Radians(B);
        C = HyperbolicMath.degrees2Radians(C);
        One = HyperbolicMath.degrees2Radians(One);

        const validInputs = [A, B, C, a, b, c].filter(val => val !== 0).length;
        if (validInputs < 2 || validInputs > 3) {
            throw new Error(validInputs > 3 ? "Too many inputs" : "Insufficient data");
        }

        if ((c >= a + b || a >= c + b || b >= a + c) && a && b && c) {
            throw new Error("Invalid triangle");
        }

        if ((A === Math.PI || B === Math.PI || C === Math.PI) && A && B && C) {
            throw new Error("Invalid triangle");
        }

        if ((A + B + C >= Math.PI) && A && B && C) {
            throw new Error("Invalid triangle");
        }

        if (A < 0 || B < 0 || C < 0) {
            throw new Error("Invalid triangle");
        }

        const result = HyperbolicMath.completeTriangle(A, a, B, b, C, c);
        [A, a, B, b, C, c] = [result.A, result.a, result.B, result.b, result.C, result.c];

        if (((A !== 0 && B !== 0 && C === 0 && a !== 0 && b !== 0 && c === 0) ||
            (A !== 0 && C !== 0 && B === 0 && a !== 0 && b === 0 && c !== 0) ||
            (A === 0 && B !== 0 && C !== 0 && a === 0 && b !== 0 && c !== 0))) {
                throw new Error("Insufficient data");
        }

        if (c >= a + b || a >= c + b || b >= a + c) {
            throw new Error("Invalid triangle");
        }

        this.createTrangle(A, a, B, b, C, c, One + Math.PI / 2);

    }


    /**
     * Creates a regular hyperbolic polygon.
     * 
     * @param {number} x - Number of sides of the polygon
     * @param {number} U - Angle parameter (possibly related to the internal angle)
     * @param {number} One - Rotation angle in radians
     */
    createPolygon(x: number, U: number, One: number): void {
        let A, B, C, a = 0, aung = 0, b = 0;

        if (x < 1) throw new Error("Invalid number of elements");

        // Check if all necessary parameters are provided
        if (x === 0 || U === 0) {
            throw new Error("Enter all parameters");
        }

        // Check if the number of sides is at least 3
        if (x < 3) {
            throw new Error("Number of sides must be at least three");
        }

        // Check if the polygon is valid in hyperbolic geometry
        if ((x * U) >= (x - 2) * 180) {
            throw new Error("Not possible in hyperbolic geometry");
        }

        // Calculate angles
        C = 2 * Math.PI / x;
        A = U / 2;
        B = U / 2;
        
        // Calculate side length
        a = HyperbolicMath.updateBySecondCosineRule(0, A, C, B)[0];
        
        // Convert side length to Poincaré disk model
        aung = HyperbolicMath.calculatePoincareAndGyrovectorRadius(0, a)[0];

        // Draw all sides of the polygon
        for (let i = 1; i <= x; i++) {
            this.drawCurvature(A, B, C, -(C / 2) + (i - 1) * C + One, aung, aung);
        }
        
        HyperbolicMath.completeTriangle(A, a, A, a, C, b);
    }


    /**
     * Creates a hyperbolic rectangle.
     * 
     * @param {number} A - Angle A in radians
     * @param {number} B - Angle B in radians (input/output parameter)
     * @param {number} a - Side length a
     * @param {number} b - Side length b
     * @param {number} One - Rotation angle in radians
     * @returns {number} Updated value of angle B
     */
    createRectangle(A: number, B: number, a: number, b: number, One: number): void {
        let l1 = 0, l2 = 0, A1 = 0, B1 = 0, C1 = 0, bung = 0, l1ung = 0, aung = 0;

        if (A == B) throw new Error("Starting and ending angles must be different!")

        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        // Calculate triangle parameters
        let result = HyperbolicMath.completeTriangle(B1, a, A, l1, C1, b);
        B1 = result.A;
        l1 = result.b;
        C1 = result.C;

        // Convert lengths to Poincaré disk model
        aung = HyperbolicMath.calculatePoincareAndGyrovectorRadius(0, a)[0];
        l1ung = HyperbolicMath.calculatePoincareAndGyrovectorRadius(0, l1)[0];
        bung = HyperbolicMath.calculatePoincareAndGyrovectorRadius(0, b)[0];

        // Draw first side
        this.ctx.beginPath();
        this.ctx.moveTo(this.X, this.Y);
        this.ctx.lineTo(this.X + aung * this.R * Math.sin(One + C1 + B1), this.Y + aung * this.R * Math.cos(One + C1 + B1));
        this.ctx.stroke();

        // Draw second side
        this.ctx.beginPath();
        this.ctx.moveTo(this.X, this.Y);
        this.ctx.lineTo(this.X + bung * this.R * Math.sin(One - B1 + B1), this.Y + bung * this.R * Math.cos(One - B1 + B1));
        this.ctx.stroke();

        // Draw third side (arc)
        this.drawCurvature(C1, A, B1, One - B1 + B1, bung, l1ung);

        // Draw fourth side (arc)
        this.drawCurvature(A, B1, C1, One + B1, l1ung, aung);

    }


    /**
     * Creates a line (or arc) in the Poincaré disk model between two angles.
     * 
     * @param {number} a1 - Starting angle in radians
     * @param {number} a2 - Ending angle in radians
     */
    createHyperbolicLine(a1: number, a2: number): void {
        let a = 0, A = 0, B = 0, aung = 0.999, c = 0, C = 0;

        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        // Check if angles are within valid range
        if (a1 > 360 || a2 > 360) {
            throw new Error("Angles must be less than or equal to 360 degrees");
        }

        // Check if angles are different
        if (a1 === a2) {
            throw new Error("Enter different angles");
        }

        // Adjust angles if they cross the 0/2π boundary
        if ((a2 - a1) > Math.PI) a1 = 2 * Math.PI + a1;
        if ((a1 - a2) > Math.PI) a2 = 2 * Math.PI + a2;

        // Calculate the angle between a1 and a2
        C = a2 > a1 ? a2 - a1 : a1 - a2;

        // If the angles are opposite (difference is π), draw a straight line
        if (Math.abs(a1 - a2) === Math.PI) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.X + this.R * Math.cos(a1), this.Y - this.R * Math.sin(a1));
            this.ctx.lineTo(this.X + this.R * Math.cos(a2), this.Y - this.R * Math.sin(a2));
            this.ctx.stroke();
            return;
        }
        // Convert aung to Poincaré disk model
        a = HyperbolicMath.calculatePoincareAndGyrovectorRadius(aung, 0)[1];

        // Calculate the chord length c
        c = HyperbolicMath.updateByFirstCosineRule(C, a, a, a)[3];

        // Calculate angles A and B
        let result = HyperbolicMath.updateBySineRule(A, aung, B, aung, C, c);
        A = result[0]
        B = result[2]

        // Draw the hyperbolic line (arc)
        this.drawCurvature(A, B, C, (a1 + a2) / 2 + Math.PI / 2 - C / 2, aung, aung);
    }


    /**
     * Creates concentric circles (orbits) around the center of the Poincaré disk.
     * 
     * @param {number} n - Number of concentric circles to draw
     * @param {number} a - Angle in radians, determining the position of the circles
     */
    createOricycle(n: number, a: number): void {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        if (n < 1) throw new Error("Invalid number of elements");

        for (let i = 1; i <= n; i++) {
            let r = i * this.R / (n + 1);
            let x = this.X + (this.R - r) * Math.cos(a);
            let y = this.Y - (this.R - r) * Math.sin(a);
            
            // Draw circle
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    }


    /**
     * Creates a series of lines (perpendiculars) in the Poincaré disk.
     * 
     * @param {number} n - Number of lines to draw
     * @param {number} a - Central angle in radians
     */
    createPerpendiculars(n: number, a: number): void {
        let o = Math.PI / (n + 1);

        if (a > 360) {
            throw new Error("Angle must be less than or equal to 360 degrees");
        }

        if (n === 0) {
            throw new Error("Enter the number of lines");
        } 

        for (let i = 1; i <= n; i++) {
            this.createHyperbolicLine(a - o * i, a + o * i);
        }
    }


    /**
     * Creates a set of parallel lines in the Poincaré disk model.
     * 
     * @param {number} k - Number of lines to create
     * @param {number} a1 - Starting angle in radians
     */
    createParallels(k: number, a1: number): void {
        let g = 2 * Math.PI / (k + 1);

        if (a1 > 360) {
            throw new Error("Angle must be less than or equal to 360 degrees");
        }

        if (k === 0) {
            throw new Error("Enter the number of lines");
        } 

        if (k % 2 === 1) {
            // Odd number of lines
            for (let i = 1; i <= (k - 1) / 2; i++) {
                this.createHyperbolicLine(a1, a1 + i * g);
            }
            this.createHyperbolicLine(a1, a1 + HyperbolicMath.degrees2Radians(179));
            for (let i = 1; i <= (k - 1) / 2; i++) {
                this.createHyperbolicLine(a1, a1 - i * g);
            }
        } else {
            // Even number of lines
            for (let i = 1; i <= k / 2; i++) {
                this.createHyperbolicLine(a1, a1 + i * g);
            }
            for (let i = 1; i <= k / 2; i++) {
                this.createHyperbolicLine(a1, a1 - i * g);
            }
        }
    }


    /**
     * Handles the calculation and drawing of a circle in the Poincaré disk model.
     * 
     * @param {number} R1 - The Poincaré disk radius (should be less than 1)
     * @param {number} RG - The gyrovector space radius
     * @throws {Error} If input parameters are invalid or if the resulting radius is too large
     */
    handleCircleDrawing(R1: number, RG: number): void {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        if ((R1 !== 0 && RG !== 0) || (R1 === 0 && RG === 0)) {
            throw new Error("Enter only one parameter");
        }

        if (R1 < 1) {
            const result = HyperbolicMath.calculatePoincareAndGyrovectorRadius(R1, RG);
            R1 = result[0];
            RG = result[1];

            if (RG > 35) {
                throw new Error("Radius is too large");
            }

            // Draw the circle
            this.ctx.beginPath();
            this.ctx.arc(this.X, this.Y, R1 * this.R, 0, 2 * Math.PI);
            this.ctx.stroke();
        } else {
            throw new Error("Poincare radius must be less than 1");
        }

    }


    /**
     * Handles the calculation and drawing of a series of concentric circles in the Poincaré disk model.
     * 
     * @param {number} n - Number of circles
     * @param {number} r1 - Inner radius
     * @param {number} r2 - Outer radius
     * @throws {Error} If input parameters are invalid
     */
    handleCircleSeriesDrawing(n: number, r1: number, r2: number): void {
        if (!this.ctx) {
            throw new Error("Canvas context not initialized");
        }

        if (n === 0) {
            return;
        }
        if (r2 <= r1) {
            throw new Error("Outer radius should be greater than inner radius");
        }
        if (n === 1) {
            this.handleCircleDrawing(0, (r1 + r2) / 8);
            return
        }
        const p = (r2 - r1) / (n - 1);
        
        this.ctx.lineWidth = 2;    
        for (let i = 0; i < n; i++) {
            let rg = r1 + i * p;
            let r = 0;
            [r, rg] = HyperbolicMath.calculatePoincareAndGyrovectorRadius(r, rg);
            
            this.ctx.beginPath();
            this.ctx.arc(this.X, this.Y, r * this.R, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    }



    /**
     * Draws a complex pattern of lines on a canvas.
     */
    drawComplexPattern() {
        const pi = Math.PI;
        const a = 2 * pi / 8;

        // Main pattern
        this.createHyperbolicLine(-1.5 * a, 1.5 * a);
        this.createHyperbolicLine(-2.5 * a, 2.5 * a);
        this.createHyperbolicLine(-1.5 * a, 1.5 * a);
        this.createHyperbolicLine(-2.5 * a + Math.PI / 2, 2.5 * a + Math.PI / 2);
        this.createHyperbolicLine(-2.5 * a - Math.PI / 2, 2.5 * a - Math.PI / 2);

        // Additional patterns
        this.createHyperbolicLine(-1.5 * a - 0.66 * a + Math.PI / 2, -1.5 * a + 0.33 * a + Math.PI / 2);
        this.createHyperbolicLine(-1.5 * a - 0.66 * a + Math.PI / 2 - 0.66 * a, -1.5 * a + 0.33 * a + Math.PI / 2 - 0.66 * a);
        this.createHyperbolicLine(-1.5 * a - 0.66 * a + Math.PI / 2 + Math.PI, -1.5 * a + 0.33 * a + Math.PI / 2 + Math.PI);
        this.createHyperbolicLine(-1.5 * a - 0.66 * a + Math.PI / 2 - 0.66 * a + Math.PI, -1.5 * a + 0.33 * a + Math.PI / 2 - 0.66 * a + Math.PI);

        this.createHyperbolicLine(-1.5 * a - 0.66 * a + Math.PI, -1.5 * a + 0.33 * a + Math.PI);
        this.createHyperbolicLine(-1.5 * a - 0.66 * a + Math.PI - 0.66 * a, -1.5 * a + 0.33 * a + Math.PI - 0.66 * a);
        this.createHyperbolicLine(-1.5 * a - 0.66 * a + Math.PI + Math.PI, -1.5 * a + 0.33 * a + Math.PI + Math.PI);
        this.createHyperbolicLine(-1.5 * a - 0.66 * a + Math.PI - 0.66 * a + Math.PI, -1.5 * a + 0.33 * a + Math.PI - 0.66 * a + Math.PI);
    }
}

// TESTS
// // Triangle
// // handleTriangleDrawing(30, 0, 10, 0, 120, 0, 0);
// // handleTriangleDrawing(10, 0, 30, 0, 120, 0, 120);
// // handleTriangleDrawing(10, 0, 10, 0, 120, 0, 240);
// // Circle
// // handleCircleDrawing(0.5, 0);
// // handleCircleSeriesDrawing(20, 0.1, 4.0, this.ctx, X, Y, R);
// // Complex pattern
// drawComplexPattern();
// // 5-agle poligon
// // createPolygon(5,HyperbolicMath.degrees2Radians(50),HyperbolicMath.degrees2Radians(20));
// // Rectangle
// // createRectangle(HyperbolicMath.degrees2Radians(30),0,5,2,HyperbolicMath.degrees2Radians(10)+Math.PI/2);
// // Line
// // createHyperbolicLine(0, Math.PI / 2);
// // Oricycle
// // createOricycle(100, HyperbolicMath.degrees2Radians(0));
// // The perpendiculars
// // createPerpendiculars(100, HyperbolicMath.degrees2Radians(0));
// // cicle perpendiculars to fille the plane every 30 degrees
// // for (let i = 0; i < 12; i++) {
// //     createPerpendiculars(21, HyperbolicMath.degrees2Radians(30 * i));
// // }
// // Parallel lines
// // createParallels(10, HyperbolicMath.degrees2Radians(0));
// // Equidistant curves
// // CreatEkv(10, HyperbolicMath.degrees2Radians(0));
// }
