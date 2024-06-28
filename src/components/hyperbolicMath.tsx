/**
 * Calculates the inverse hyperbolic cosine of a number.
 * 
 * This function provides an implementation of acosh (inverse hyperbolic cosine)
 * for JavaScript environments that don't natively support Math.acosh.
 * 
 * @param {number} x - The number to calculate the inverse hyperbolic cosine for.
 *                     Should be greater than or equal to 1.
 * @returns {number} The inverse hyperbolic cosine of x.
 * 
 * @throws {Error} Implicitly throws if x is less than 1, resulting in NaN.
 */
export function acosh(x: number) {
    return Math.log(x + Math.sqrt(x * x - 1));
}


/**
 * Calculates the inverse hyperbolic sine of a number.
 * 
 * This function provides an implementation of asinh (inverse hyperbolic sine)
 * for JavaScript environments that don't natively support Math.asinh.
 * 
 * @param {number} x - The number to calculate the inverse hyperbolic sine for.
 * @returns {number} The inverse hyperbolic sine of x.
 */
export function asinh(x: number) {
    return Math.log(x + Math.sqrt(x * x + 1));
}


/**
 * Calculates the missing side of a hyperbolic right triangle given two known sides.
 * 
 * This function implements the hyperbolic Pythagorean theorem:
 * cosh(c) = cosh(a) * cosh(b), where c is the hypotenuse.
 * 
 * @param {number} chx - The length of one side of the triangle (usually the x-coordinate).
 * @param {number} chy - The length of another side of the triangle (usually the y-coordinate).
 * @param {number} chc - The length of the hypotenuse of the triangle.
 * 
 * @returns {Object|null} An object containing the updated values of chx, chy, and chc.
 *                        Returns null if an error occurs or if insufficient data is provided.
 * 
 * @throws {Error} May throw an error if the math operations result in invalid values.
 */
export function hyperbolicPythagorean(chx: number, chy: number, chc: number) {
    try {
        if (chx !== 0 && chy !== 0) {
            return [chx, chy, Math.acosh(Math.cosh(chy) * Math.cosh(chx))];
        } else if (chx !== 0 && chc !== 0) {
            return [chx, Math.acosh(Math.cosh(chc) / Math.cosh(chx)), chc];
        } else if (chy !== 0 && chc !== 0) {
            return [Math.acosh(Math.cosh(chc) / Math.cosh(chy)), chy, chc];
        } else {
            return [chx, chy, chc]
        }
    } catch (error) {
        console.error("An error occurred");
        throw error;
    }
}


/**
 * Calculates the area of a hyperbolic triangle.
 * 
 * This function uses the formula for the area of a hyperbolic triangle:
 * Area = k^2 * (π - A - B - C)
 * where k is the curvature constant and A, B, C are the angles of the triangle in radians.
 * 
 * @param {number} A - Angle A of the triangle in radians
 * @param {number} B - Angle B of the triangle in radians
 * @param {number} C - Angle C of the triangle in radians
 * @param {number} k - Curvature constant of the hyperbolic space
 * 
 * @returns {number} The area of the hyperbolic triangle
 * 
 * @global {number} Math.PI - The mathematical constant π (pi)
 */
export function square(A: number, B: number, C: number, k: number) {
    return k * k * (Math.PI - A - B - C);
}


/**
 * Calculates missing angles or sides in a hyperbolic triangle using the sine rule.
 * 
 * This function implements the hyperbolic sine rule:
 * sinh(a) / sin(A) = sinh(b) / sin(B) = sinh(c) / sin(C)
 * 
 * @param {number} sA - Angle A in radians
 * @param {number} sa - Side opposite to angle A
 * @param {number} sB - Angle B in radians
 * @param {number} sb - Side opposite to angle B
 * @param {number} sC - Angle C in radians
 * @param {number} sc - Side opposite to angle C
 * 
 * @returns {Array<number|null> |null} An object containing the updated values of all parameters.
 *                        Returns null if an error occurs or if insufficient data is provided.
 * 
 * @throws {Error} May throw an error if the math operations result in invalid values.
 */
export function updateBySineRule(sA: number, sa: number, sB: number, sb: number, sC: number, sc: number) {
    try {
        let G = 0, g = 0;
        if (sA !== 0 || sa !== 0 || sB !== 0 || sb !== 0 || sC !== 0 || sc !== 0) {
            if (sa !== 0 && sA !== 0) {
                G = Math.sin(sA);
                g = Math.sinh(sa);
            } else if (sb !== 0 && sB !== 0) {
                G = Math.sin(sB);
                g = Math.sinh(sb);
            } else if (sc !== 0 && sC !== 0) {
                G = Math.sin(sC);
                g = Math.sinh(sc);
            }

            if (G !== 0 && g !== 0) {
                if (sB !== 0 && sb === 0) {
                    sb = Math.asinh(Math.sin(sB) * g / G);
                } else if (sb !== 0 && sB === 0) {
                    if (Math.sinh(sb) * G / g > -1 && Math.sinh(sb) * G / g < 1) {
                        sB = Math.asin(Math.sinh(sb) * G / g);
                    } else {
                        throw new Error("Error");
                    }
                }

                if (sC !== 0 && sc === 0) {
                    sc = Math.asinh(Math.sin(sC) * g / G);
                } else if (sc !== 0 && sC === 0) {
                    if (Math.sinh(sc) * G / g > -1 && Math.sinh(sc) * G / g < 1) {
                        sC = Math.asin(Math.sinh(sc) * G / g);
                    } else {
                        throw new Error("Error");
                    }
                }

                if (sA !== 0 && sa === 0) {
                    sa = Math.asinh(Math.sin(sA) * g / G);
                } else if (sa !== 0 && sA === 0) {
                    if (Math.sinh(sa) * G / g > -1 && Math.sinh(sa) * G / g < 1) {
                        sA = Math.asin(Math.sinh(sa) * G / g);
                    } else {
                        throw new Error("Error");
                    }
                }
            }
        }
        return [sA, sa, sB, sb, sC, sc];
    } catch (error) {
        console.error("An error occurred");
        throw error;
    }
}


/**
 * Calculates missing angle or side in a hyperbolic triangle using the cosine rule.
 * 
 * This function implements one form of the hyperbolic cosine rule:
 * cosh(a) = cosh(b) * cosh(c) - sinh(b) * sinh(c) * cos(A)
 * 
 * @param {number} A - Angle A in radians
 * @param {number} a - Side opposite to angle A
 * @param {number} b - Another side of the triangle
 * @param {number} c - The third side of the triangle
 * 
 * @returns {Object|null} An object containing the updated values of A, a, b, and c.
 *                        Returns null if an error occurs.
 * 
 * @throws {Error} May throw an error if the math operations result in invalid values.
 */
export function updateByFirstCosineRule(A: number, a: number, b: number, c: number) {
    try {
        if (a !== 0 && A === 0) {
            A = Math.acos((Math.cosh(b) * Math.cosh(c) - Math.cosh(a)) / (Math.sinh(b) * Math.sinh(c)));
        } else if (a === 0 && A !== 0) {
            a = Math.acosh(Math.cosh(b) * Math.cosh(c) - Math.sinh(b) * Math.sinh(c) * Math.cos(A));
        }
        return [A, a, b, c];
    } catch (error) {
        console.error("An error occurred");
        throw error;
    }
}


/**
 * Calculates missing angle or side in a hyperbolic triangle using the second cosine rule.
 * 
 * This function implements the second form of the hyperbolic cosine rule:
 * cos(A) = -cos(B) * cos(C) + sin(B) * sin(C) * cosh(a)
 * 
 * @param {number} a - Side opposite to angle A
 * @param {number} A - Angle A in radians
 * @param {number} B - Angle B in radians
 * @param {number} C - Angle C in radians
 * 
 * @returns {Object|null} An object containing the updated values of a, A, B, and C.
 *                        Returns null if an error occurs or if the calculation is impossible.
 * 
 * @throws {Error} May throw an error if the math operations result in invalid values.
 */
export function updateBySecondCosineRule(a: number, A: number, B: number, C: number) {
    try {
        if (a !== 0 && A === 0) {
            const cosA = -Math.cos(B) * Math.cos(C) + Math.sin(B) * Math.sin(C) * Math.cosh(a);
            if (cosA > -1 && cosA < 1) {
                A = Math.acos(cosA);
            } else {
                throw new Error("Error");
            }
        } else if (a === 0 && A !== 0 && C !== 0 && B !== 0) {
            a = Math.acosh((Math.cos(B) * Math.cos(C) + Math.cos(A)) / (Math.sin(B) * Math.sin(C)));
        }
        
        return [a, A, B, C];
    } catch (error) {
        console.error("An error occurred");
        throw error;
    }
}


/**
 * Calculates the maximum angle and side in a hyperbolic triangle.
 * 
 * This function uses hyperbolic trigonometry to calculate the maximum angle A
 * and the corresponding side a, given the other two sides b and c.
 * 
 * @param {number} A - The maximum angle of the triangle (in radians)
 * @param {number} a - The side opposite to the maximum angle
 * @param {number} b - One of the other sides of the triangle
 * @param {number} c - The other side of the triangle
 * 
 * @returns {Object|null} An object containing the calculated values of A and a,
 *                        along with the input values of b and c.
 *                        Returns null if the calculation is impossible.
 * 
 * @throws {Error} May throw an error if the math operations result in invalid values.
 */
export function calculateMaximumAngleAndSide(A: number, a: number, b: number, c: number) {
    try {
        const tanhProduct = Math.tanh(b / 2) * Math.tanh(c / 2);
        if (tanhProduct > -1 && tanhProduct < 1) {
            A = Math.acos(tanhProduct);
            a = 2 * Math.asinh(Math.sqrt(Math.sinh(b / 2) ** 2 + Math.sinh(c / 2) ** 2));
            return [A, a, b, c];
        } else {
            throw new Error("Error");
        }
    } catch (error) {
        console.error("An error occurred");
        throw error;
    }
}


/**
 * Converts an angle from degrees to radians.
 * 
 * @param {number} x - The angle in degrees
 * @returns {number} The angle converted to radians
 */
export function degrees2Radians(x: number) {
    return x * Math.PI / 180;
}


/**
 * Converts an angle from radians to degrees.
 * 
 * @param {number} x - The angle in radians
 * @returns {number} The angle converted to degrees
 */
export function radians2Degrees(x: number) {
    return 180 * x / Math.PI;
}


/**
 * Calculates missing angles and sides in a hyperbolic triangle.
 * 
 * This function uses various hyperbolic trigonometry formulas to calculate
 * unknown angles and sides of a hyperbolic triangle given partial information.
 * It applies multiple rules and formulas iteratively to derive as much information as possible.
 * 
 * @param {number} A - Angle A in radians
 * @param {number} a - Side opposite to angle A
 * @param {number} B - Angle B in radians
 * @param {number} b - Side opposite to angle B
 * @param {number} C - Angle C in radians
 * @param {number} c - Side opposite to angle C
 * 
 * @returns {Object|null} An object containing the calculated values of all angles and sides.
 *                        Returns null if an error occurs or if the calculation is impossible.
 * 
 * @throws {Error} May throw an error if the math operations result in invalid values.
 */
export function completeTriangle(A: number, a: number, B: number, b: number, C: number, c: number) {
    let A1 = 0, a1 = 0, B1 = 0, b1 = 0, C1 = 0, c1 = 0;

    try {
        [A, a, B, b, C, c] = updateBySineRule(A, a, B, b, C, c);

        [A1, a1, B1, b1, C1, c1] = [A, a, B, b, C, c].map(val => val !== 0 ? 1 : 0);

        if (A === degrees2Radians(90)) [a, b, c] = hyperbolicPythagorean(c, b, a);
        if (B === degrees2Radians(90)) [a, b, c] = hyperbolicPythagorean(c, a, b);
        if (C === degrees2Radians(90)) [a, b, c] = hyperbolicPythagorean(a, b, c);

        if (A1 && c1 && B1) [c, C, B, A] = updateBySecondCosineRule(c, C, B, A);
        else if (A1 && b1 && C1) [b, B, A, C] = updateBySecondCosineRule(b, B, A, C);
        else if (B1 && a1 && C1) [a, A, B, C] = updateBySecondCosineRule(a, A, B, C);
        else if (C1 && a1 && b1) [C, c, b, a] = updateByFirstCosineRule(C, c, b, a);
        else if (A1 && c1 && b1) [A, a, b, c] = updateByFirstCosineRule(A, a, b, c);
        else if (B1 && a1 && c1) [B, b, a, c] = updateByFirstCosineRule(B, b, a, c);

        [A1, a1, B1, b1, C1, c1] = [A, a, B, b, C, c].map(val => val !== 0 ? 1 : 0);

        if (a1 && b1 && c1) {
            [B, b, a, c] = updateByFirstCosineRule(B, b, a, c);
            [A, a, b, c] = updateByFirstCosineRule(A, a, b, c);
            [C, c, b, a] = updateByFirstCosineRule(C, c, b, a);
        }

        [A, a, B, b, C, c] = updateBySineRule(A, a, B, b, C, c);

        if (A1 && B1 && C1 && !a1 && !b1 && !c1) {
            [a, A, B, C] = updateBySecondCosineRule(a, A, B, C);
            [c, C, B, A] = updateBySecondCosineRule(c, C, B, A);
            [b, B, A, C] = updateBySecondCosineRule(b, B, A, C);
        }

        [A1, a1, B1, b1, C1, c1] = [A, a, B, b, C, c].map(val => val !== 0 ? 1 : 0);

        if (a1 && b1 && !(a1 && b1 && C1) && !A1 && !C1 && !B1) [C, c, b, a] = calculateMaximumAngleAndSide(C, c, b, a);
        if (a1 && c1 && !(a1 && c1 && B1) && !A1 && !C1 && !B1) [B, b, a, c] = calculateMaximumAngleAndSide(B, b, a, c);
        if (c1 && b1 && !(c1 && b1 && A1) && !A1 && !C1 && !B1) [A, a, b, c] = calculateMaximumAngleAndSide(A, a, b, c);

        [A, a, B, b, C, c] = updateBySineRule(A, a, B, b, C, c);

        return { A, a, B, b, C, c };
    } catch (error) {
        console.error("An error occurred");
    }
}


/**
 * Calculates a specific function value in hyperbolic geometry.
 * 
 * This function computes x = 2 * atan(exp(-b/k)), which is related to
 * the distance function in hyperbolic geometry.
 * 
 * @param {number} b - A parameter, possibly related to a distance or coordinate
 * @param {number} k - A scaling factor, possibly related to the curvature of the space
 * 
 * @returns {number|null} The calculated value of x, or null if an error occurs
 */
export function hyperbolicDistance(b: number, k: number) {
    try {
        const y = -b / k;
        const x = 2 * Math.atan(Math.exp(y));
        return x;
    } catch (error) {
        console.error("An error occurred");
        return null;
    }
}


/**
 * Converts between two representations of circle radius in hyperbolic geometry.
 * 
 * This function converts between the Poincaré disk model radius (r) and 
 * the gyrovector space radius (rg) in hyperbolic geometry.
 * 
 * @param {number} r - Radius in the Poincaré disk model (0 ≤ r < 1)
 * @param {number} rg - Radius in the gyrovector space model
 * 
 * @returns {Object} An object containing the updated values of r and rg
 * 
 * @throws {Error} May throw an error if the math operations result in invalid values
 */
export function calculatePoincareAndGyrovectorRadius(r: number, rg: number) {
    try {
        if (r !== 0 && rg === 0) {
            rg = Math.log((1 + r) / (1 - r));
            console.log(rg);
        } else if (rg !== 0 && r === 0) {
            r = Math.tanh(rg / 2);
        }
        return [r, rg];
    } catch (error) {
        console.error("An error occurred in calculatePoincareAndGyrovectorRadius");
        throw error;
    }
}


/**
 * Converts between different representations of a circle in hyperbolic geometry.
 * 
 * This function handles conversions between Poincaré disk model and upper half-plane model
 * parameters for a circle in hyperbolic geometry.
 * 
 * @param {number} x - x-coordinate in Poincaré disk model
 * @param {number} y - y-coordinate in Poincaré disk model
 * @param {number} r - radius in Poincaré disk model
 * @param {number} l - circumference in Poincaré disk model
 * @param {number} xg - x-coordinate in upper half-plane model
 * @param {number} yg - y-coordinate in upper half-plane model
 * @param {number} rg - radius parameter in upper half-plane model
 * @param {number} lg - circumference in upper half-plane model
 * 
 * @returns {Object} An object containing the updated values of all parameters
 * 
 * @throws {Error} May throw an error if the math operations result in invalid values
 */
export function calculatePoincareAndHalfPlaneParameters(x: number, y: number, r: number, l: number, xg: number, yg: number, rg: number, lg: number) {
    try {
        if (x !== 0) xg = x;
        if (xg !== 0) x = xg;

        if (y !== 0 && r !== 0) {
            yg = Math.sqrt(y * y - r * r);
            rg = Math.acosh(y / yg);
            l = 2 * Math.PI * r;
            lg = 2 * Math.PI * Math.sinh(rg);
        } else if (y !== 0 && l !== 0) {
            r = l / (2 * Math.PI);
            yg = Math.sqrt(y * y - r * r);
            rg = Math.acosh(y / yg);
            lg = 2 * Math.PI * Math.sinh(rg);
        } else if (yg !== 0 && rg !== 0) {
            r = yg * Math.sqrt(Math.cosh(rg) * Math.cosh(rg) - 1);
            y = yg * Math.cosh(rg);
            l = 2 * Math.PI * r;
            lg = 2 * Math.PI * Math.sinh(rg);
        } else if (yg !== 0 && lg !== 0) {
            rg = Math.asinh(lg / (2 * Math.PI));
            r = yg * Math.sqrt(Math.cosh(rg) * Math.cosh(rg) - 1);
            y = yg * Math.cosh(rg);
            l = 2 * Math.PI * r;
        } else if (y !== 0 && yg !== 0) {
            rg = Math.acosh(y / yg);
            r = yg * Math.sqrt(Math.cosh(rg) * Math.cosh(rg) - 1);
            l = 2 * Math.PI * r;
            lg = 2 * Math.PI * Math.sinh(rg);
        } else if (lg !== 0 && l !== 0) {
            r = l / (2 * Math.PI);
            rg = Math.asinh(l / (2 * Math.PI));
            yg = r / (Math.sqrt(Math.cosh(rg) * Math.cosh(rg) - 1));
            y = yg * Math.cosh(rg);
        } else if (rg !== 0 && r !== 0) {
            yg = r / (Math.sqrt(Math.cosh(rg) * Math.cosh(rg) - 1));
            y = yg * Math.cosh(rg);
            l = 2 * Math.PI * r;
            lg = 2 * Math.PI * Math.sinh(rg);
        }

        return [x, y, r, l, xg, yg, rg, lg];
    } catch (error) {
        console.error("An error occurred in calculatePoincareAndHalfPlaneParameters");
        throw error;
    }
}