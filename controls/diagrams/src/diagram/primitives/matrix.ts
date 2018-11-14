import { PointModel } from './point-model';
/**
 * Matrix module is used to transform points based on offsets, angle
 */
/** @private */
export enum MatrixTypes {
    Identity = 0,
    Translation = 1,
    Scaling = 2,
    Unknown = 4
}

/** @private */
export class Matrix {
    /**   @private  */
    public m11: number;
    /**   @private  */
    public m12: number;
    /**   @private  */
    public m21: number;
    /**   @private  */
    public m22: number;
    /**   @private  */
    public offsetX: number;
    /**   @private  */
    public offsetY: number;
    /**   @private  */
    public type: MatrixTypes;

    constructor(m11: number, m12: number, m21: number, m22: number, offsetX: number, offsetY: number, type?: MatrixTypes) {
        this.m11 = m11;
        this.m12 = m12;
        this.m21 = m21;
        this.m22 = m22;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        // if (type === undefined) {
        //     this.type = MatrixTypes.Unknown;
        // } else {
        //     this.type = type;
        // }
        this.type = type;
    }
}

/** @private */
export function identityMatrix(): Matrix {
    return new Matrix(1, 0, 0, 1, 0, 0, MatrixTypes.Identity);
}

/** @private */
export function transformPointByMatrix(matrix: Matrix, point: PointModel): PointModel {
    let pt: PointModel = multiplyPoint(matrix, point.x, point.y);
    return { x: Math.round(pt.x * 100) / 100, y: Math.round(pt.y * 100) / 100 };
}

/** @private */
export function transformPointsByMatrix(matrix: Matrix, points: PointModel[]): PointModel[] {
    let transformedPoints: PointModel[] = [];
    for (let point of points) {
        transformedPoints.push(transformPointByMatrix(matrix, point));
    }
    return transformedPoints;
}

/** @private */
export function rotateMatrix(matrix: Matrix, angle: number, centerX: number, centerY: number): void {
    angle %= 360.0;
    multiplyMatrix(matrix, createRotationRadians(angle * 0.017453292519943295, centerX ? centerX : 0, centerY ? centerY : 0));
}

/** @private */
export function scaleMatrix(
    matrix: Matrix, scaleX: number, scaleY: number, centerX: number = 0, centerY: number = 0): void {
    multiplyMatrix(matrix, createScaling(scaleX, scaleY, centerX, centerY));
}

/** @private */
export function translateMatrix(matrix: Matrix, offsetX: number, offsetY: number): void {
    if (matrix.type & MatrixTypes.Identity) {
        matrix.type = MatrixTypes.Translation;
        setMatrix(matrix, 1.0, 0.0, 0.0, 1.0, offsetX, offsetY);
        return;
    }
    if (matrix.type & MatrixTypes.Unknown) {
        matrix.offsetX += offsetX;
        matrix.offsetY += offsetY;
        return;
    }
    matrix.offsetX += offsetX;
    matrix.offsetY += offsetY;
    matrix.type |= MatrixTypes.Translation;
}

/** @private */
function createScaling(scaleX: number, scaleY: number, centerX: number, centerY: number): Matrix {
    let result: Matrix = identityMatrix();
    result.type = !(centerX || centerY) ? MatrixTypes.Scaling : MatrixTypes.Scaling | MatrixTypes.Translation;
    setMatrix(result, scaleX, 0.0, 0.0, scaleY, centerX - scaleX * centerX, centerY - scaleY * centerY);
    return result;
}

/** @private */
function createRotationRadians(angle: number, centerX: number, centerY: number): Matrix {
    let result: Matrix = identityMatrix();
    let num: number = Math.sin(angle);
    let num2: number = Math.cos(angle);
    let offsetX: number = centerX * (1.0 - num2) + centerY * num;
    let offsetY: number = centerY * (1.0 - num2) - centerX * num;
    result.type = MatrixTypes.Unknown;
    setMatrix(result, num2, num, -num, num2, offsetX, offsetY);
    return result;
}

/** @private */
function multiplyPoint(matrix: Matrix, x: number, y: number): PointModel {
    switch (matrix.type) {
        case MatrixTypes.Identity: break;
        case MatrixTypes.Translation:
            x += matrix.offsetX;
            y += matrix.offsetY;
            break;
        case MatrixTypes.Scaling:
            x *= matrix.m11;
            y *= matrix.m22;
            break;
        case MatrixTypes.Translation | MatrixTypes.Scaling:
            x *= matrix.m11;
            x += matrix.offsetX;
            y *= matrix.m22;
            y += matrix.offsetY;
            break;
        default:
            let num: number = y * matrix.m21 + matrix.offsetX;
            let num2: number = x * matrix.m12 + matrix.offsetY;
            x *= matrix.m11;
            x += num;
            y *= matrix.m22;
            y += num2;
            break;
    }
    return { x: x, y: y };
}

/** @private */
export function multiplyMatrix(matrix1: Matrix, matrix2: Matrix): void {
    let type: MatrixTypes = matrix1.type;
    let type2: MatrixTypes = matrix2.type;
    if (type2 === MatrixTypes.Identity) {
        return;
    }
    if (type === MatrixTypes.Identity) {
        assignMatrix(matrix1, matrix2);
        matrix1.type = matrix2.type;
        return;
    }
    if (type2 === MatrixTypes.Translation) {
        matrix1.offsetX += matrix2.offsetX;
        matrix1.offsetY += matrix2.offsetY;
        if (type !== MatrixTypes.Unknown) {
            matrix1.type |= MatrixTypes.Translation;
        }
        return;
    }
    if (type !== MatrixTypes.Translation) {
        let num: number = type << 4 | type2;
        switch (num) {
            case 34:
                matrix1.m11 *= matrix2.m11;
                matrix1.m22 *= matrix2.m22;
                return;
            case 35:
                matrix1.m11 *= matrix2.m11;
                matrix1.m22 *= matrix2.m22;
                matrix1.offsetX = matrix2.offsetX;
                matrix1.offsetY = matrix2.offsetY;
                matrix1.type = (MatrixTypes.Translation | MatrixTypes.Scaling);
                return;
            case 36: break;
            default:
                {
                    switch (num) {
                        case 50:
                            matrix1.m11 *= matrix2.m11;
                            matrix1.m22 *= matrix2.m22;
                            matrix1.offsetX *= matrix2.m11;
                            matrix1.offsetY *= matrix2.m22;
                            return;
                        case 51:
                            matrix1.m11 *= matrix2.m11;
                            matrix1.m22 *= matrix2.m22;
                            matrix1.offsetX = matrix2.m11 * matrix1.offsetX + matrix2.offsetX;
                            matrix1.offsetY = matrix2.m22 * matrix1.offsetY + matrix2.offsetY;
                            return;
                        case 52: break;
                        default:
                            switch (num) {
                                case 66:
                                case 67:
                                case 68: break;
                                default: return;
                            }
                            break;
                    }
                    break;
                }
        }
        let result: Matrix = identityMatrix();
        let m11New: number = matrix1.m11 * matrix2.m11 + matrix1.m12 * matrix2.m21;
        let m12New: number = matrix1.m11 * matrix2.m12 + matrix1.m12 * matrix2.m22;
        let m21New: number = matrix1.m21 * matrix2.m11 + matrix1.m22 * matrix2.m21;
        let m22New: number = matrix1.m21 * matrix2.m12 + matrix1.m22 * matrix2.m22;
        let offsetX: number = matrix1.offsetX * matrix2.m11 + matrix1.offsetY * matrix2.m21 + matrix2.offsetX;
        let offsetY: number = matrix1.offsetX * matrix2.m12 + matrix1.offsetY * matrix2.m22 + matrix2.offsetY;
        setMatrix(result, m11New, m12New, m21New, m22New, offsetX, offsetY);
        if (result.m21 || result.m12) {
            result.type = MatrixTypes.Unknown;
        } else {
            if (result.m11 && result.m11 !== 1.0 || result.m22 && result.m22 !== 1.0) {
                result.type = MatrixTypes.Scaling;
            }
            if (result.offsetX || result.offsetY) {
                result.type |= MatrixTypes.Translation;
            }
            if ((result.type & (MatrixTypes.Translation | MatrixTypes.Scaling)) === MatrixTypes.Identity) {
                result.type = MatrixTypes.Identity;
            }
            result.type = MatrixTypes.Scaling | MatrixTypes.Translation;
        }
        assignMatrix(matrix1, result);
        matrix1.type = result.type;
        return;
    }
    let offsetX: number = matrix1.offsetX;
    let offsetY: number = matrix1.offsetY;
    matrix1.offsetX = offsetX * matrix2.m11 + offsetY * matrix2.m21 + matrix2.offsetX;
    matrix1.offsetY = offsetX * matrix2.m12 + offsetY * matrix2.m22 + matrix2.offsetY;
    if (type2 === MatrixTypes.Unknown) {
        matrix1.type = MatrixTypes.Unknown;
        return;
    }
    matrix1.type = (MatrixTypes.Translation | MatrixTypes.Scaling);
}

/** @private */
function setMatrix(mat: Matrix, m11: number, m12: number, m21: number, m22: number, x: number, y: number): void {
    mat.m11 = m11;
    mat.m12 = m12;
    mat.m21 = m21;
    mat.m22 = m22;
    mat.offsetX = x;
    mat.offsetY = y;
}

/** @private */
function assignMatrix(matrix1: Matrix, matrix2: Matrix): void {
    matrix1.m11 = matrix2.m11;
    matrix1.m12 = matrix2.m12;
    matrix1.m21 = matrix2.m21;
    matrix1.m22 = matrix2.m22;
    matrix1.offsetX = matrix2.offsetX;
    matrix1.offsetY = matrix2.offsetY;
    matrix1.type = matrix2.type;
}
