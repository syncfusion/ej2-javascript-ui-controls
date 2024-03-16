/* eslint-disable max-len */
/* eslint-disable no-constant-condition */
/* eslint-disable no-useless-escape */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/tslint/config */
/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable valid-jsdoc */

import { PathAttributes, SVGCanvasAttributes, Size, measureText } from '@syncfusion/ej2-svg-base';
import { appendChildElement, colorNameToHex } from '../../common/utils/helper';
import { CircularChart3DBasicTransform, CircularChart3DColorFormat, CircularChart3DDataElement, CircularChart3DLabelElement, CircularChart3DLocation, CircularChart3DPathOptions, CircularChart3DPolyAttributes, CircularChart3DPolyCollections, CircularChart3DPolygon, CircularChart3DStringBuilder, CircularChart3DVector } from '../model/circular3d-base';
import { CircularChart3D } from '../circularchart3d';
import { FontModel } from '../../common/model/base-model';
import { CircularChart3DSeries } from './series';

/**
 * Represents a 3D rendering configuration for the EJ 3D rendering engine.
 *
 */
export class CircularChart3DRender {
    transform: CircularChart3DBasicTransform = null; // Chart3DBasicTransform
    tree: CircularChart3DBspNode[]; // Binary Space Partitioning tree
}

const circular3DRender: CircularChart3DRender = new CircularChart3DRender();

/**
 * Represents a node in a Binary Space Partitioning (BSP) tree.
 *
 * @interface
 */
interface CircularChart3DBspNode {
    /** The front subtree of the BSP tree. */
    front: CircularChart3DBspNode;
    /** The back subtree of the BSP tree. */
    back: CircularChart3DBspNode;
    /** The splitting plane associated with the node. */
    plane: CircularChart3DPolygon;
}

/**
 * Represents a circular 3D vector in space.
 */
export class CircularChart3DVectorModule {
    /** The x-coordinate of the vector. */
    public x: number = 0;
    /** The y-coordinate of the vector. */
    public y: number = 0;
    /** The z-coordinate of the vector. */
    public z: number = 0;
    /** A small value used for epsilon comparisons to handle floating-point inaccuracies.*/
    private epsilon: number = 0.00001;

    /**
     * Checks if a vector is valid (not NaN for any component).
     *
     * @param {CircularChart3DVector} point - The vector to check.
     * @returns {boolean} - True if the vector is valid, false otherwise.
     */
    public isValid(point: CircularChart3DVector ): boolean {
        return !isNaN(point.x) && !isNaN(point.y) && !isNaN(point.z);
    }

    /**
     * Constructs a new Vector3D instance.
     *
     * @constructor
     * @param {number | { x: number, y: number }} pointX - Either an object with x and y properties or the x-coordinate.
     * @param {number} [vy] - The y-coordinate (if the first parameter is a number).
     * @param {number} [vz] - The z-coordinate (if the first parameter is a number).
     */
    constructor(pointX: { x: number; y: number } | number, vy?: number, vz?: number) {
        this.x = pointX as number;
        this.y = vy || 0;
        this.z = vz || 0;
    }

    /**
     * Creates a new Vector3D instance from provided coordinates.
     *
     * @param {number | { x: number, y: number }} vx - Either an object with x and y properties or the x-coordinate.
     * @param {number} vy - The y-coordinate.
     * @param {number} vz - The z-coordinate.
     * @returns {CircularChart3DVector} - The new Vector3D instance.
     */
    public vector3D(vx: { x: number; y: number } | number, vy: number, vz: number): CircularChart3DVector{
        this.x = vx as number;
        this.y = vy;
        this.z = vz;
        return { x: this.x, y: this.y, z: this.z };
    }

    /**
     * Subtracts one vector from another and returns the result.
     *
     * @param {CircularChart3DVector} v1 - The first vector.
     * @param {CircularChart3DVector} v2 - The second vector to subtract from the first.
     * @returns {CircularChart3DVector} - The resulting vector.
     */
    public vector3DMinus(v1: CircularChart3DVector, v2: CircularChart3DVector): CircularChart3DVector{
        return this.vector3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    /**
     * Adds two vectors and returns the result.
     *
     * @param {CircularChart3DVector} v1 - The first vector.
     * @param {CircularChart3DVector} v2 - The second vector to add to the first.
     * @returns {CircularChart3DVector} - The resulting vector.
     */
    public vector3DPlus(v1: CircularChart3DVector, v2: CircularChart3DVector): CircularChart3DVector {
        return this.vector3D(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * Multiplies two vectors using the cross product and returns the result.
     *
     * @param {CircularChart3DVector} v1 - The first vector.
     * @param {CircularChart3DVector} v2 - The second vector.
     * @returns {CircularChart3DVector} - The resulting vector.
     */
    public vector3DMultiply(v1: CircularChart3DVector, v2: CircularChart3DVector): CircularChart3DVector {
        const x: number = v1.y * v2.z - v2.y * v1.z;
        const y: number = v1.z * v2.x - v2.z * v1.x;
        const z: number = v1.x * v2.y - v2.x * v1.y;
        return this.vector3D(x, y, z);
    }

    /**
     * Calculates the dot product of two vectors.
     *
     * @param {CircularChart3DVector} v1 - The first vector.
     * @param {CircularChart3DVector} v2 - The second vector.
     * @returns {number} - The dot product.
     */
    public vector3DAdd(v1: CircularChart3DVector, v2: CircularChart3DVector): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /**
     * Multiplies a vector by a scalar value.
     *
     * @param {CircularChart3DVector} v1 - The vector to multiply.
     * @param {number} value - The scalar value.
     * @returns {CircularChart3DVector} - The resulting vector.
     */
    public vector3DStarMultiply(v1: CircularChart3DVector, value: number): CircularChart3DVector {
        const x: number = v1.x * value;
        const y: number = v1.y * value;
        const z: number = v1.z * value;
        return this.vector3D(x, y, z);
    }

    /**
     * Calculates the length of a vector.
     *
     * @param {CircularChart3DVector} vector - The vector to calculate the length of.
     * @returns {number} - The length of the vector.
     */
    public getLength(vector: CircularChart3DVector): number {
        const sqt: number = this.vector3DAdd(vector, vector);
        return Math.sqrt(sqt);
    }

    /**
     * Calculates the normal vector of a triangle defined by three vectors.
     *
     * @param {CircularChart3DVector} v1 - The first vertex of the triangle.
     * @param {CircularChart3DVector} v2 - The second vertex of the triangle.
     * @param {CircularChart3DVector} v3 - The third vertex of the triangle.
     * @returns {CircularChart3DVector} - The normal vector of the triangle.
     */
    public getNormal(v1: CircularChart3DVector , v2: CircularChart3DVector , v3: CircularChart3DVector ): CircularChart3DVector {
        const vector4: CircularChart3DVector = this.vector3DMinus(v1, v2);
        const vector5: CircularChart3DVector = this.vector3DMinus(v3, v2);
        const n: CircularChart3DVector = this.vector3DMultiply(vector4, vector5);
        const length: number = this.getLength(n);
        if (length < this.epsilon) {
            return this.vector3D(0, 0, 0);
        }
        return this.vector3D(n.x / length, n.y / length, n.z / length);
    }
}

/**
 * Represents a 3x3 or 4x4 matrix in 3D space and provides various matrix operations.
 *
 */
export class CircularChart3DMatrix {

    /** The size of the matrix, which is set to 4 by default. */
    private matrixSize: number = 4;

    /**
     * Generates a 3D matrix of the specified size.
     *
     * @param {number} size - The size of the 3D matrix.
     * @returns {number[][]} - The generated 3D matrix.
     * @private
     */
    public matrix3D(size: number): number[][] {
        const matrixData: number[][] = [];
        for (let i: number = 0; i < size; i++) {
            matrixData[i as number] = this.createArray(size);
        }
        return matrixData;
    }

    /**
     * Checks if a matrix is an affine matrix.
     *
     * @param {number[][]} matrixData - The matrix to check.
     * @returns {boolean} - True if the matrix is an affine matrix, false otherwise.
     */
    public isAffine(matrixData: number[][]): boolean {
        return matrixData[0][3] === 0 && matrixData[1][3] === 0 && matrixData[2][3] === 0 && matrixData[3][3] === 1;
    }

    /**
     * Creates a new array with zeros.
     *
     * @param {number} initialSize - The size of the array.
     * @returns {number[]} - The created array.
     */
    public createArray(initialSize: number): number[] {
        const matrixData: number[] = [];
        for (let index: number = 0; index < initialSize; ++index) {
            matrixData[index as number] = 0;
        }
        return matrixData;
    }

    /**
     * Gets the identity matrix.
     *
     * @returns {number[][]} - The identity matrix.
     */
    public getIdentity(): number[][] {
        const matrixData: number[][] = this.matrix3D(this.matrixSize);
        for (let i: number = 0; i < this.matrixSize; i++) {
            matrixData[i as number][i as number] = 1.0;
        }
        return matrixData;
    }

    /**
     * Gets the interval of a matrix.
     *
     * @param {number[][]} matrix - The matrix to get the interval for.
     * @returns {number[][]} - The interval matrix.
     */
    public getInterval(matrix: number[][]): number[][] {
        let matrixData: number[][] = this.getIdentity();
        for (let i: number = 0; i < this.matrixSize; i++) {
            for (let j: number = 0; j < this.matrixSize; j++) {
                matrixData[i as number][j as number] = this.getMinor(matrix, i, j);
            }
        }
        matrixData = this.transposed(matrixData);
        matrixData = this.getMatrixMultiple(1 / this.getDeterminant(matrix), matrixData);
        return matrixData;
    }

    /**
     * Multiplies all elements of a matrix by a factor.
     *
     * @param {number} factor - The factor to multiply with.
     * @param {number[][]} matrix - The matrix to multiply.
     * @returns {number[][]} - The resulting matrix.
     */
    public getMatrixMultiple(factor: number, matrix: number[][]): number[][] {
        for (let i: number = 0; i < matrix.length; i++) {
            for (let j: number = 0; j < matrix[i as number].length; j++) {
                matrix[i as number][j as number] = matrix[i as number][j as number] * factor;
            }
        }
        return matrix;
    }

    /**
     * Multiplies a matrix by a vector.
     *
     * @param {number[][]} matrix - The matrix.
     * @param {CircularChart3DVector} point - The vector to multiply with.
     * @returns {CircularChart3DVector} - The resulting vector.
     */
    public getMatrixVectorMultiple(matrix: number[][], point: CircularChart3DVector): CircularChart3DVector {
        let x: number =
            matrix[0][0] * point.x +
            matrix[1][0] * point.y +
            matrix[2][0] * point.z +
            matrix[3][0];
        let y: number =
            matrix[0][1] * point.x +
            matrix[1][1] * point.y +
            matrix[2][1] * point.z +
            matrix[3][1];
        let z: number =
            matrix[0][2] * point.x +
            matrix[1][2] * point.y +
            matrix[2][2] * point.z +
            matrix[3][2];
        if (!this.isAffine(matrix)) {
            const c: number = 1 / (matrix[0][3] * point.x + matrix[1][3] * point.y + matrix[2][3] * point.z + matrix[3][3]);
            x *= c;
            y *= c;
            z *= c;
        }
        return { x, y, z };
    }

    /**
     * Multiplies two matrices.
     *
     * @param {number[][]} matrix1 - The first matrix.
     * @param {number[][]} matrix2 - The second matrix.
     * @returns {number[][]} - The resulting matrix.
     */
    public getMatrixMultiplication(matrix1: number[][], matrix2: number[][]): number[][] {
        const result: number[][] = this.getIdentity();
        for (let i: number = 0; i < this.matrixSize; i++) {
            for (let j: number = 0; j < this.matrixSize; j++) {
                let value: number = 0;

                for (let k: number = 0; k < this.matrixSize; k++) {
                    value += matrix1[k as number][j as number] * matrix2[i as number][k as number];
                }

                result[i as number][j as number] = value;
            }
        }
        return result;
    }

    /**
     * Gets the minor of a matrix.
     *
     * @param {number[][]} matrix - The matrix.
     * @param {number} columnIndex - The column index.
     * @param {number} rowIndex - The row index.
     * @returns {number} - The minor of the matrix.
     * @private
     */
    public getMinor(matrix: number[][], columnIndex: number, rowIndex: number): number {
        return ((columnIndex + rowIndex) % 2 === 0 ? 1 : -1) * this.getDeterminant(this.getMatrix(matrix, columnIndex, rowIndex));
    }

    /**
     * Gets a submatrix of a matrix.
     *
     * @param {number[][]} matrix - The matrix.
     * @param {number} columnIndex - The column index.
     * @param {number} rowIndex - The row index.
     * @returns {number[][]} - The submatrix.
     */
    public getMatrix(matrix: number[][], columnIndex: number, rowIndex: number): number[][] {
        const count: number = matrix.length - 1;
        const subMatrix: any = this.createArray(count);
        for (let i: number = 0; i < count; i++) {
            const matrixColumn: number = i >= columnIndex ? i + 1 : i;
            subMatrix[i as number] = this.createArray(count);
            for (let j: number = 0; j < count; j++) {
                const matrixRow: number = j >= rowIndex ? j + 1 : j;
                subMatrix[i as number][j as number] = matrix[matrixColumn as number][matrixRow as number];
            }
        }
        return subMatrix;
    }

    /**
     * Gets the determinant of a matrix.
     *
     * @param {number[][]} matrix - The matrix.
     * @returns {number} - The determinant of the matrix.
     */
    public getDeterminant(matrix: number[][]): number {
        const count: number = matrix.length;
        let determinant: number = 0;
        if (count < 2) {
            determinant = matrix[0][0];
        } else {
            let k: number = 1;
            for (let i: number = 0; i < count; i++) {
                const submatrix: number[][] = this.getMatrix(matrix, i, 0);
                determinant += k * matrix[i as number][0] * this.getDeterminant(submatrix);
                k = k > 0 ? -1 : 1;
            }
        }
        return determinant;
    }

    /**
     * Transforms a matrix by translation.
     *
     * @param {number} x - The x-coordinate of the translation.
     * @param {number} y - The y-coordinate of the translation.
     * @param {number} z - The z-coordinate of the translation.
     * @returns {number[][]} - The transformed matrix.
     */
    public transform(x: number, y: number, z: number): number[][] {
        const transformedMatrix: number[][] = this.getIdentity();
        transformedMatrix[3][0] = x;
        transformedMatrix[3][1] = y;
        transformedMatrix[3][2] = z;
        return transformedMatrix;
    }

    /**
     * Creates a matrix for rotation around the y-axis.
     *
     * @param {number} angle - The angle of rotation.
     * @returns {number[][]} - The rotation matrix.
     * @private
     */
    public turn(angle: number): number[][] {
        const rotatedMatrix: number[][] = this.getIdentity();
        rotatedMatrix[0][0] = Math.cos(angle);
        rotatedMatrix[2][0] = -Math.sin(angle);
        rotatedMatrix[0][2] = Math.sin(angle);
        rotatedMatrix[2][2] = Math.cos(angle);
        return rotatedMatrix;
    }

    /**
     * Creates a matrix for rotation around the x-axis.
     *
     * @param {number} angle - The angle of rotation.
     * @returns {number[][]} - The rotation matrix.
     */
    public tilt(angle: number): number[][] {
        const rotatedMatrix: number[][] = this.getIdentity();
        rotatedMatrix[1][1] = Math.cos(angle);
        rotatedMatrix[2][1] = Math.sin(angle);
        rotatedMatrix[1][2] = -Math.sin(angle);
        rotatedMatrix[2][2] = Math.cos(angle);
        return rotatedMatrix;
    }

    /**
     * Transposes a matrix.
     *
     * @param {number[][]} matrix3D - The matrix to transpose.
     * @returns {number[][]} - The transposed matrix.
     */
    public transposed(matrix3D: number[][]): number[][] {
        const transposedMatrix: number[][] = this.getIdentity();
        for (let i: number = 0; i < this.matrixSize; i++) {
            for (let j: number = 0; j < this.matrixSize; j++) {
                transposedMatrix[i as number][j as number] = matrix3D[j as number][i as number];
            }
        }
        return transposedMatrix;
    }
}

/**
 * Represents a 3D chart transformation utility that provides methods for transforming
 * and projecting 3D coordinates onto a 2D screen.
 *
 */
export class CircularChart3DTransform {
    /** Represents the angle conversion factor from degrees to radians. */
    private toRadial: number = Math.PI / 180;
    /** Represents a 3D vector for performing vector operations. */
    private vector: CircularChart3DVectorModule;
    /** Represents a 3D matrix for performing matrix operations. */
    private matrixObj: CircularChart3DMatrix;

    /**
     * Initializes a new instance of the `ChartTransform` class.
     */
    constructor() {
        this.vector = new CircularChart3DVectorModule(0, 0, 0);
        this.matrixObj = new CircularChart3DMatrix();
    }

    /**
     * Creates a 3D transformation based on the specified size.
     *
     * @param {Size} size - The size of the viewing area.
     * @returns {CircularChart3DBasicTransform} - The 3D transformation.
     */
    public transform3D(size: Size): CircularChart3DBasicTransform {
        return {
            viewingArea: size,
            rotation: 0,
            tilt: 0,
            depth: 0,
            perspectiveAngle: 0,
            needUpdate: true,
            centeredMatrix: this.matrixObj.getIdentity(),
            perspective: this.matrixObj.getIdentity(),
            resultMatrix: this.matrixObj.getIdentity(),
            viewMatrix: this.matrixObj.getIdentity()
        };
    }

    /**
     * Applies the specified 3D transformation to the current state.
     *
     * @param {CircularChart3DBasicTransform} transform - The 3D transformation to apply.
     * @returns {void} - The 3D transformation.
     */
    public transform(transform: CircularChart3DBasicTransform): void {
        this.setCenter(this.vector.vector3D(transform.viewingArea.width / 2,
                                            transform.viewingArea.height / 2, transform.depth / 2), transform);
        this.setViewMatrix(this.matrixObj.transform(0, 0, transform.depth), transform);
        this.setViewMatrix(this.matrixObj.getMatrixMultiplication(transform.viewMatrix,
                                                                  this.matrixObj.turn(-this.toRadial * transform.rotation)), transform);
        this.setViewMatrix(this.matrixObj.getMatrixMultiplication(transform.viewMatrix,
                                                                  this.matrixObj.tilt(-this.toRadial * transform.tilt)), transform);
        this.updatePerspective(transform.perspectiveAngle, transform);
        transform.needUpdate = true;
    }

    /**
     * Updates the perspective matrix based on the specified angle.
     *
     * @param {number} angle - The perspective angle.
     * @param {CircularChart3DBasicTransform} transform - The 3D transformation.
     * @returns {void}
     */
    private updatePerspective(angle: number, transform: CircularChart3DBasicTransform): void {
        const width: number = (((transform.viewingArea.width + transform.viewingArea.height) *
            Math.tan(this.degreeToRadianConverter((180 - Math.abs(angle % 181)) / 2.0))) + (transform.depth * 2) / 2);
        transform.perspective[0][0] = width;
        transform.perspective[1][1] = width;
        transform.perspective[2][3] = 1;
        transform.perspective[3][3] = width;
    }

    /**
     * Converts degrees to radians.
     *
     * @param {number} angle - The angle in degrees.
     * @returns {number} - The angle in radians.
     * @private
     */
    private degreeToRadianConverter(angle: number): number {
        return angle * Math.PI / 180;
    }

    /**
     * Transforms a 3D vector to screen coordinates based on the current state.
     *
     * @param {CircularChart3DVector} vector3D - The 3D vector to transform.
     * @param {CircularChart3DBasicTransform} transform - The 3D transformation.
     * @param {CircularChart3DMatrix} chartObj - Optional custom matrix object for transformation.
     * @returns {CircularChart3DLocation} - The screen coordinates.
     */
    public toScreen(vector3D: CircularChart3DVector, transform: CircularChart3DBasicTransform, chartObj?: CircularChart3DMatrix): CircularChart3DLocation {
        if (!chartObj) {
            transform.chartObj = this.matrixObj;
            vector3D = this.matrixObj.getMatrixVectorMultiple(this.result(transform), vector3D);
        } else {
            this.matrixObj = chartObj;
            vector3D = chartObj.getMatrixVectorMultiple(this.result(transform, chartObj), vector3D);
        }
        return { x: vector3D.x, y: vector3D.y };
    }

    /**
     * Sets the view matrix in the transformation state.
     *
     * @param {number[][]} matrix - The new view matrix.
     * @param {CircularChart3DBasicTransform} transform - The 3D transformation.
     * @returns {void}
     */
    private setViewMatrix(matrix: number[][], transform: CircularChart3DBasicTransform): void {
        if (transform.viewMatrix === matrix) {
            return;
        }
        transform.viewMatrix = matrix;
        transform.needUpdate = true;
    }

    /**
     * Calculates the final result matrix based on the current state.
     *
     * @param {CircularChart3DBasicTransform} transform - The 3D transformation.
     * @param {CircularChart3DMatrix} matrixobj - Optional custom matrix object for transformation.
     * @returns {number[][]} - The final result matrix.
     */
    public result(transform: CircularChart3DBasicTransform, matrixobj?: CircularChart3DMatrix): number[][] {
        let chartObj: CircularChart3DMatrix = transform.chartObj ? transform.chartObj : this.matrixObj;
        if (!chartObj) {
            chartObj = matrixobj;
        }
        if (!transform.needUpdate) {
            return transform.resultMatrix;
        }
        const matrixObj: CircularChart3DMatrix = this.matrixObj;
        transform.resultMatrix = chartObj.getMatrixMultiplication(matrixObj.getInterval(transform.centeredMatrix), transform.perspective);
        transform.resultMatrix = chartObj.getMatrixMultiplication(transform.resultMatrix, transform.viewMatrix);
        transform.resultMatrix = chartObj.getMatrixMultiplication(transform.resultMatrix, transform.centeredMatrix);
        transform.needUpdate = false;
        return transform.resultMatrix;
    }

    /**
     * Sets the center in the transformation state.
     *
     * @param {CircularChart3DVector} center - The new center vector.
     * @param {CircularChart3DBasicTransform} transform - The 3D transformation.
     * @returns {void}
     */
    private setCenter(center: CircularChart3DVector, transform: CircularChart3DBasicTransform): void {
        transform.centeredMatrix = this.matrixObj.transform(-center.x, -center.y, -center.z);
        transform.needUpdate = true;
    }
}

/**
 * Represents a 3D graphics rendering utility for drawing and managing 3D elements in a chart.
 *
 * @class
 */
export class CircularChart3DGraphics {
    /** The vector class. */
    private vector: CircularChart3DVectorModule = new CircularChart3DVectorModule(0, 0, 0);

    /**
     * Prepares the view for rendering based on specified parameters.
     *
     * @param {number} perspectiveAngle - The perspective angle.
     * @param {number} depth - The depth of the view.
     * @param {number} rotation - The rotation angle.
     * @param {number} tilt - The tilt angle.
     * @param {Size} size - The size of the viewing area.
     * @param {CircularChart3D} chart - The instance of the circular 3D chart.
     * @returns {void}
     */
    public prepareView(perspectiveAngle: number, depth: number, rotation: number, tilt: number, size: Size, chart: CircularChart3D): void {
        if (arguments.length === 0) {
            bspTreeObj.build(null, chart);
        } else {
            if (circular3DRender.transform == null) {
                circular3DRender.transform = chart.transform3D.transform3D(size);
            }
            else {
                circular3DRender.transform.viewingArea = size;
            }
            if (!circular3DRender.tree) {
                circular3DRender.tree = [];
            }
            circular3DRender.transform.rotation = rotation;
            circular3DRender.transform.tilt = tilt;
            circular3DRender.transform.depth = depth;
            circular3DRender.transform.perspectiveAngle = perspectiveAngle;
            chart.transform3D.transform(circular3DRender.transform);
            circular3DRender.tree[chart.groupElement.id] = bspTreeObj.build(null, chart);
        }
    }

    /**
     * Renders the 3D view on the specified panel element.
     *
     * @param {Element} panel - The panel element to render the view on.
     * @param {CircularChart3D} chart - The instance of the circular 3D chart.
     * @param {number} rotation - The rotation angle.
     * @param {number} tilt - The tilt angle.
     * @param {Size} size - The size of the viewing area.
     * @param {number} perspectiveAngle - The perspective angle.
     * @param {number} depth - The depth of the view.
     * @returns {void}
     */
    public view(panel?: Element, chart?: CircularChart3D, rotation?: number, tilt?: number, size?: Size,
                perspectiveAngle?: number, depth?: number): void {
        const MaxValue: number = 32767;
        if (arguments.length === 2) {
            if (panel == null) {
                return;
            }
            const eyeVector: CircularChart3DVector = this.vector.vector3D(0, 0, MaxValue);
            this.drawNode3D(circular3DRender.tree[chart.groupElement.id], eyeVector, panel, chart);
        } else {
            if (panel == null) {
                return;
            }
            if (circular3DRender.transform == null) {
                circular3DRender.transform = chart.transform3D.transform3D(size);
            } else {
                circular3DRender.transform.viewingArea = size;
            }

            circular3DRender.transform.rotation = rotation;
            circular3DRender.transform.tilt = tilt;
            circular3DRender.transform.depth = depth;
            circular3DRender.transform.perspectiveAngle = perspectiveAngle;
            chart.transform3D.transform(circular3DRender.transform);
            const eye: CircularChart3DVector = this.vector.vector3D(0, 0, MaxValue);
            this.drawNode3D(circular3DRender.tree[chart.groupElement.id], eye, panel, chart);
        }
    }

    /**
     * Draws a 3D element based on the specified Binary Space Partitioning Node.
     *
     * @param {CircularChart3DBspNode} bspElement - The Binary Space Partitioning Node representing the 3D element.
     * @param {CircularChart3D} chart - The instance of the circular 3D chart.
     * @returns {void}
     */
    public draw3DElement(bspElement: CircularChart3DBspNode, chart: CircularChart3D): void {
        if (bspElement.plane.element) {
            if (bspElement.plane.element.tag === 'text' || bspElement.plane.element.tag === 'dataLabel') {
                polygonObj.drawText(bspElement.plane, chart);
            } else if (bspElement.plane.element.tag === 'polyline') {
                polygonObj.drawPolyLine(bspElement.plane, chart);
            } else if (bspElement.plane.element.tag === 'template') {
                polygonObj.drawTemplate(bspElement.plane, chart);
            }
        } else {
            polygonObj.draw(bspElement.plane, chart);
        }
    }

    /**
     * Draws the 3D nodes starting from the root based on the eye vector.
     *
     * @param {CircularChart3DBspNode} bspElement - The root Binary Space Partitioning Node.
     * @param {CircularChart3DVector} eyeVector - The eye vector.
     * @param {Element} panel - The panel element to render the view on.
     * @param {CircularChart3D} chart - The instance of the circular 3D chart.
     * @returns {void}
     */
    public drawNode3D(bspElement: CircularChart3DBspNode, eyeVector: CircularChart3DVector, panel: Element, chart: CircularChart3D): void {
        if (bspElement === null || circular3DRender.transform == null) {
            return;
        }
        while (true) {
            const r: number = vector.vector3DAdd(
                polygonObj.getNormal(chart.transform3D.result(circular3DRender.transform), bspElement.plane.vectorPoints),
                eyeVector
            );
            if (r > bspElement.plane.d) {
                if (bspElement.front != null) {
                    this.drawNode3D(bspElement.front, eyeVector, panel, chart);
                }
                this.draw3DElement(bspElement, chart);
                if (bspElement.back != null) {
                    bspElement = bspElement.back;
                    continue;
                }
            } else {
                if (bspElement.back != null) {
                    this.drawNode3D(bspElement.back, eyeVector, panel, chart);
                }
                this.draw3DElement(bspElement, chart);
                if (bspElement.front != null) {
                    bspElement = bspElement.front;
                    continue;
                }
            }
            break;
        }
    }
}

/**
 * Represents a binary tree builder for 3D polygons in a circular 3D chart.
 *
 */
export class CircularChart3DBinaryTreeBuilder {
    /** A small value used for epsilon comparisons to handle floating-point inaccuracies.*/
    private epsilon: number = 0.0005;
    /** The circular 3D chart. */
    private chart: CircularChart3D;

    constructor(chart?: CircularChart3D) {
        this.chart = chart;
    }

    /**
     * Gets the next index considering the array length and the current index.
     *
     * @param {number} index - The current index.
     * @param {number} count - The length of the array.
     * @returns {number} - The next index.
     */
    public getNext(index: number, count: number): number {
        if (index >= count) {
            return index - count;
        }
        if (index < 0) {
            return index + count;
        }
        return index;
    }

    /**
     * Creates a PolyAttributes object based on the vector, index, and result.
     *
     * @param {CircularChart3DVector} point - The vector representing the point.
     * @param {number} index - The index of the point.
     * @param {string} result - The result classification.
     * @returns {CircularChart3DPolyAttributes} - The created PolyAttributes object.
     */
    public vector3DIndexClassification(point: CircularChart3DVector, index: number, result: string): CircularChart3DPolyAttributes {
        return {
            index: index,
            result: result,
            vector: point,
            isCuttingBackPoint: false,
            cuttingBackPairIndex: null,
            alreadyCutBack: false,
            isCuttingFrontPoint: false,
            cuttingFrontPairIndex: null,
            alreadyCutFront: false
        };
    }

    /**
     * Classifies a point relative to a polygon.
     *
     * @param {CircularChart3DVector} point - The point to classify.
     * @param {CircularChart3DPolygon} polygon - The polygon for classification.
     * @returns {string} - The classification result ('OnPlane', 'OnBack', 'OnFront').
     */
    public classifyPoint(point: CircularChart3DVector, polygon: CircularChart3DPolygon): string {
        let result: string = 'OnPlane';
        const signedDistance: number = -polygon.d - vector.vector3DAdd(point, polygon.normal);

        if (signedDistance > this.epsilon) {
            result = 'OnBack';
        } else if (signedDistance < -this.epsilon) {
            result = 'OnFront';
        }
        return result;
    }

    /**
     * Classifies a polygon relative to another polygon.
     *
     * @param {CircularChart3DPolygon} refPolygon - The reference polygon.
     * @param {CircularChart3DPolygon} classPolygon - The polygon to classify.
     * @returns {string} - The classification result ('OnPlane', 'ToRight', 'ToLeft', 'Unknown').
     */
    public classifyPolygon(refPolygon: CircularChart3DPolygon, classPolygon: CircularChart3DPolygon): string {
        let result: string = 'Unknown';
        const points: CircularChart3DVector[] = classPolygon.points;
        if (points == null) {
            return result;
        }
        let onBack: number = 0;
        let onFront: number = 0;
        let onPlane: number = 0;
        const normal: CircularChart3DVector = refPolygon.normal;
        const polygonValue: number = refPolygon.d;

        for (let i: number = 0, len: number = points.length; i < len; i++) {
            const value: number = -polygonValue - vector.vector3DAdd(points[i as number], normal);

            if (value > this.epsilon) {
                onBack++;
            } else if (value < -this.epsilon) {
                onFront++;
            } else {
                onPlane++;
            }

            if (onBack > 0 && onFront > 0) {
                break;
            }
        }
        if (onPlane === points.length) {
            result = 'OnPlane';
        } else if (onFront + onPlane === points.length) {
            result = 'ToRight';
        } else if (onBack + onPlane === points.length) {
            result = 'ToLeft';
        } else {
            result = 'Unknown';
        }
        return result;
    }

    /**
     * Splits a polygon into two parts based on another polygon.
     *
     * @param {CircularChart3DPolygon} splitPolygon - The polygon to split.
     * @param {CircularChart3DPolygon} refPolygon - The reference polygon for splitting.
     * @returns {CircularChart3DPolyCollections} - The resulting back and front parts.
     */
    private splitPolygon(splitPolygon: CircularChart3DPolygon, refPolygon: CircularChart3DPolygon): CircularChart3DPolyCollections {
        const backPoint: CircularChart3DPolygon[] = [];
        const frontPoint: CircularChart3DPolygon[] = [];

        if (splitPolygon.points != null) {
            const polyPoints: CircularChart3DPolyAttributes[] = [];
            const backPartPoints: CircularChart3DPolyAttributes[] = [];
            const frontPartPoints: CircularChart3DPolyAttributes[] = [];

            let outputs: CircularChart3DVector[];
            let inputs: CircularChart3DVector[];

            const count: number = splitPolygon.points.length;
            for (let i: number = 0; i < count; i++) {
                const pointB: CircularChart3DVector = splitPolygon.points[i as number];
                const pointC: CircularChart3DVector = splitPolygon.points[this.getNext(i + 1, count)];
                const sideB: string = this.classifyPoint(pointB, refPolygon);
                const sideC: string = this.classifyPoint(pointC, refPolygon);
                const attributeB: CircularChart3DPolyAttributes = this.vector3DIndexClassification(pointB, polyPoints.length, sideB);
                polyPoints.push(attributeB);
                if (sideB !== sideC && sideB !== 'OnPlane' && sideC !== 'OnPlane') {
                    const vectorValue: CircularChart3DVector = vector.vector3DMinus(pointB, pointC);
                    const direction: CircularChart3DVector = vector.vector3DMinus(vector.vector3DStarMultiply(
                        refPolygon.normal, -refPolygon.d), pointC);

                    const signedDistance: number = vector.vector3DAdd(direction, refPolygon.normal);
                    const intersectionParameter: number = signedDistance / vector.vector3DAdd(refPolygon.normal, vectorValue);
                    const intersectionPoint: CircularChart3DVector = vector.vector3DPlus(
                        pointC, vector.vector3DStarMultiply(vectorValue, intersectionParameter));
                    const attributeIntersection: CircularChart3DPolyAttributes = this.vector3DIndexClassification(intersectionPoint, polyPoints.length, 'OnPlane');

                    polyPoints.push(attributeIntersection);
                    backPartPoints.push(attributeIntersection);
                    frontPartPoints.push(attributeIntersection);
                }
            }

            if (frontPartPoints.length !== 0 || backPartPoints.length !== 0) {
                for (let i: number = 0; i < backPartPoints.length - 1; i += 2) {
                    const backAttribute1: CircularChart3DPolyAttributes = backPartPoints[i as number];
                    const backAttribute2: CircularChart3DPolyAttributes = backPartPoints[i + 1];
                    backAttribute1.cuttingBackPoint = true;
                    backAttribute2.cuttingBackPoint = true;
                    backAttribute1.alterCuttingBackPairIndex = backAttribute2.index;
                    backAttribute2.alterCuttingBackPairIndex = backAttribute1.index;
                }

                for (let i: number = 0; i < frontPartPoints.length - 1; i += 2) {
                    const frontAttribute1: CircularChart3DPolyAttributes  = frontPartPoints[i as number];
                    const frontAttribute2: CircularChart3DPolyAttributes = frontPartPoints[i + 1];
                    frontAttribute1.cuttingFrontPoint = true;
                    frontAttribute2.cuttingFrontPoint = true;
                    frontAttribute1.alterCuttingFrontPairIndex = frontAttribute2.index;
                    frontAttribute2.alterCuttingFrontPairIndex = frontAttribute1.index;
                }

                for (let i: number = 0; i < backPartPoints.length - 1; i++) {
                    const backAttribute1: CircularChart3DPolyAttributes = backPartPoints[i as number];
                    if (backAttribute1.alreadyCutBack) {
                        continue;
                    }
                    outputs = this.cutOutBackPolygon(polyPoints, backAttribute1);

                    if (outputs.length > 2) {
                        const polygon1: CircularChart3DPolygon = polygonObj.polygon3D(outputs, splitPolygon);
                        backPoint.push({ ...polygon1 });
                    }
                }

                for (let i: number = 0; i < frontPartPoints.length - 1; i++) {
                    const backAttribute2: CircularChart3DPolyAttributes = frontPartPoints[i as number];
                    if (backAttribute2.alreadyCutFront) {
                        continue;
                    }
                    inputs = this.cutOutFrontPolygon(polyPoints, backAttribute2);
                    if (inputs.length > 2) {
                        const polygon2: CircularChart3DPolygon = polygonObj.polygon3D(inputs, splitPolygon);
                        frontPoint.push({ ...polygon2 });
                    }
                }
            }
        }
        else {
            backPoint.push(splitPolygon);
            frontPoint.push(splitPolygon);
        }

        return { backPolygon: backPoint, frontPolygon: frontPoint };
    }

    /**
     * Cuts out the front part of a polygon based on the PolyAttributes.
     *
     * @param {CircularChart3DPolyAttributes[]} polyPoints - The polyAttributes array of the polygon.
     * @param {CircularChart3DPolyAttributes} initialVertex - The polyAttributes representing the cutting point.
     * @returns {CircularChart3DVector[]} - The resulting points of the front part.
     */
    private cutOutFrontPolygon(
        polyPoints: CircularChart3DPolyAttributes[], initialVertex: CircularChart3DPolyAttributes): CircularChart3DVector[] {
        const points: CircularChart3DVector[] = [];
        let currentVertex: CircularChart3DPolyAttributes = initialVertex;

        while (true) {
            currentVertex.alreadyCutFront = true;
            points.push(currentVertex.vector);

            const currentVertexPair: CircularChart3DPolyAttributes = polyPoints[currentVertex.alterCuttingFrontPairIndex];

            if (currentVertex.cuttingFrontPoint) {
                if (!currentVertexPair.alreadyCutFront) {
                    currentVertex = currentVertexPair;
                } else {
                    const previousVertexOnBack: CircularChart3DPolyAttributes = polyPoints[this.getNext(
                        currentVertex.index - 1, polyPoints.length)];
                    const nextVertexOnBack: CircularChart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index + 1, polyPoints.length)];

                    if (previousVertexOnBack.result === 'OnFront' && !previousVertexOnBack.alreadyCutFront) {
                        currentVertex = previousVertexOnBack;
                    } else if (nextVertexOnBack.result === 'OnFront' && !nextVertexOnBack.alreadyCutFront) {
                        currentVertex = nextVertexOnBack;
                    } else {
                        return points;
                    }
                }
            } else {
                const previousVertexOnBack: CircularChart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index - 1, polyPoints.length)];
                const nextVertexOnBack: CircularChart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index + 1, polyPoints.length)];

                if (previousVertexOnBack.result !== 'OnBack' && !previousVertexOnBack.alreadyCutFront) {
                    currentVertex = previousVertexOnBack;
                } else if (nextVertexOnBack.result !== 'OnBack' && !nextVertexOnBack.alreadyCutFront) {
                    currentVertex = nextVertexOnBack;
                } else {
                    return points;
                }
            }
        }
    }

    /**
     * Cuts out the back part of a polygon based on the PolyAttributes.
     *
     * @param {CircularChart3DPolyAttributes[]} polyPoints - The PolyAttributes array of the polygon.
     * @param {CircularChart3DPolyAttributes} initialVertex - The PolyAttributes representing the cutting point.
     * @returns {CircularChart3DVector[]} - The resulting points of the back part.
     */
    private cutOutBackPolygon(polyPoints: CircularChart3DPolyAttributes[], initialVertex: CircularChart3DPolyAttributes): CircularChart3DVector[] {
        const points: CircularChart3DVector[] = [];
        let currentVertex: CircularChart3DPolyAttributes = initialVertex;

        while (true) {
            currentVertex.alreadyCutBack = true;
            points.push(currentVertex.vector);

            const currentVertexPair: CircularChart3DPolyAttributes = polyPoints[currentVertex.alterCuttingBackPairIndex];

            if (currentVertex.cuttingBackPoint) {
                if (!currentVertexPair.alreadyCutBack) {
                    currentVertex = currentVertexPair;
                } else {
                    const previousVertexOnBack: CircularChart3DPolyAttributes = polyPoints[this.getNext(
                        currentVertex.index - 1, polyPoints.length)];
                    const nextVertexOnBack: CircularChart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index + 1, polyPoints.length)];

                    if (previousVertexOnBack.result === 'OnBack' && !previousVertexOnBack.alreadyCutBack) {
                        currentVertex = previousVertexOnBack;
                    } else if (nextVertexOnBack.result === 'OnBack' && !nextVertexOnBack.alreadyCutBack) {
                        currentVertex = nextVertexOnBack;
                    } else {
                        return points;
                    }
                }
            } else {
                const previousVertexOnBack: CircularChart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index - 1, polyPoints.length)];
                const nextVertexOnBack: CircularChart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index + 1, polyPoints.length)];

                if (previousVertexOnBack.result !== 'OnFront' && !previousVertexOnBack.alreadyCutBack) {
                    currentVertex = previousVertexOnBack;
                } else if (nextVertexOnBack.result !== 'OnFront' && !nextVertexOnBack.alreadyCutBack) {
                    currentVertex = nextVertexOnBack;
                } else {
                    return points;
                }
            }
        }
    }

    /**
     * Builds a binary space partitioning from a list of polygons.
     *
     * @param {CircularChart3DPolygon[]} [points] - The list of polygons to build the tree from.
     * @param {CircularChart3D} [chart] - The circular 3D chart.
     * @returns {CircularChart3DBspNode} - The root node of the Binary Space Partitioning tree.
     */
    public build(points?: CircularChart3DPolygon[], chart?: CircularChart3D): CircularChart3DBspNode {
        if (!arguments[0]) {
            return this.build(chart.circular3DPolygon);
        } else {
            const inputPolygons: CircularChart3DPolygon[] = arguments[0];
            if (inputPolygons.length < 1) {
                return null;
            }
            const bspNode: CircularChart3DBspNode = { back: null, front: null, plane: null };
            const plane: CircularChart3DPolygon = inputPolygons[0];
            bspNode.plane = plane;
            const polygonsToLeft: CircularChart3DPolygon[] = [];
            const polygonsToRight: CircularChart3DPolygon[] = [];

            for (let i: number = 1, len: number = inputPolygons.length; i < len; i++) {
                const currentPolygon: CircularChart3DPolygon = inputPolygons[i as number];

                if (currentPolygon === plane) {
                    continue;
                }
                const classificationResult: string = this.classifyPolygon(plane, currentPolygon);

                switch (classificationResult) {
                case 'OnPlane':
                case 'ToRight':
                    polygonsToRight.push(currentPolygon);
                    break;

                case 'ToLeft':
                    polygonsToLeft.push(currentPolygon);
                    break;

                case 'Unknown':
                    if (currentPolygon.element) {
                        polygonsToLeft.push(currentPolygon);
                    } else {
                        const result: CircularChart3DPolyCollections = this.splitPolygon(currentPolygon, plane);
                        for (let k: number = 0; k < result.backPolygon.length; k++) {
                            result.backPolygon[k as number].name = result.backPolygon[k as number].name + '-back';
                            polygonsToLeft.push(result.backPolygon[k as number]);
                        }
                        for (let j: number = 0; j < result.frontPolygon.length; j++) {
                            result.frontPolygon[j as number].name = result.frontPolygon[j as number].name + '-front';
                            polygonsToRight.push(result.frontPolygon[j as number]);
                        }
                    }
                    break;
                }
            }

            if (polygonsToLeft.length > 0) {
                bspNode.back = this.build(polygonsToLeft);
            }

            if (polygonsToRight.length > 0) {
                bspNode.front = this.build(polygonsToRight);
            }

            return bspNode;
        }
    }
}

/**
 * The CircularChart3DSvgRenderer class provides methods for rendering SVG graphics in a 3D context.
 */
export class CircularChart3DSvgRenderer {
    /**
     * Gets a CircularChart3DStringBuilder instance for constructing strings.
     *
     * @returns {CircularChart3DStringBuilder} - The StringBuilder instance.
     */
    public getStringBuilder(): CircularChart3DStringBuilder{
        const data: string[] = [];
        let counter: number = 0;

        return {
            append: function (text: string): CircularChart3DStringBuilder{
                data[counter++] = text;
                return this;
            },
            toString: function (text?: string): string {
                return data.join(text || '');
            }
        };
    }

    /**
     * Parses a hex color code and returns its Red green Blue values.
     *
     * @param {string} hexColorCode - The hex color code.
     * @returns {CircularChart3DColorFormat | null} - The parsed color format (Red green Blue) or null if parsing fails.
     */
    public hexToValue(hexColorCode: string): CircularChart3DColorFormat | null {
        const rgbRegex: boolean = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.test(hexColorCode);
        let result: RegExpExecArray | null;

        if (rgbRegex === true) {
            result = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/.exec(hexColorCode);
            return result
                ? {
                    red: parseInt(result[1], 10),
                    green: parseInt(result[2], 10),
                    blue: parseInt(result[3], 10),
                    alpha: result[4]
                }
                : null;
        } else {
            result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColorCode);
            return result
                ? {
                    red: parseInt(result[1], 16),
                    green: parseInt(result[2], 16),
                    blue: parseInt(result[3], 16)
                }
                : null;
        }
    }

    /**
     * Draws text on an SVG element.
     *
     * @param {SVGCanvasAttributes} options - The options for drawing the text.
     * @param {string | string[]} label - The text label.
     * @param {FontModel} font - The font settings for the text.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     * @returns {Element} - The created SVG text element.
     */
    public drawText(options: SVGCanvasAttributes, label: string | string[], font: FontModel, chart: CircularChart3D): Element {
        let text: Element = document.getElementById(options.id) || chart.groupElement.querySelector('#' + options.id);
        if (text === null) {
            text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        }
        text.textContent = label as string;
        text = chart.renderer.setElementAttributes(options, text);
        return text;
    }

    /**
     * Converts a CircularChart3DColorFormat object to its corresponding color string.
     *
     * @param {CircularChart3DColorFormat} color - The color in CircularChart3DColorFormat.
     * @returns {string} - The color string representation.
     */
    public hexColor(color: CircularChart3DColorFormat): string {
        const redValue: number = color.red;
        const greenValue: number = color.green;
        const blueValue: number = color.blue;
        if (color.alpha) {
            const returnColor: string = `rgba(${redValue.toString()},${greenValue.toString()},${blueValue.toString()},${color.alpha})`;
            return returnColor;
        } else {
            const hex: string[] = [redValue.toString(16), greenValue.toString(16), blueValue.toString(16)];
            hex.forEach((val: string, nr: number) => {
                if (val.length === 1) {
                    hex[nr as number] = '0' + val;
                }
            });
            return '#' + hex.join('').toUpperCase();
        }
    }

    /**
     * Checks if a given color string is in a valid format (hex or rgba).
     *
     * @param {string} color - The color string to check.
     * @returns {boolean} - True if the color string is valid, otherwise false.
     */
    public checkColorFormat(color: string): boolean {
        const regex: boolean = /(rgba?\((?:\d{1,3}[,\)]){3}(?:\d+\.\d+\))?)|(^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$)/gmi.test(color);
        return regex;
    }

}

/**
 * Represents a 3D polygon in a circular 3D chart.
 *
 */
export class CircularChart3DPolygonModule {
    private epsilon: number = 0.00001;
    private normal: CircularChart3DVector = { x: 0, y: 0, z: 0 };
    private vector: CircularChart3DVectorModule = new CircularChart3DVectorModule(0, 0, 0);
    private vectorPoints: CircularChart3DVector[] = [];
    private d: number;
    private matrixObj: CircularChart3DMatrix = new CircularChart3DMatrix();

    /**
     * Creates a 3D polygon.
     *
     * @param {CircularChart3DVector[]} [points] - An array of 3D vectors representing points on the polygon.
     * @param {CircularChart3DPolygon} [tag] - Additional information or metadata for the polygon.
     * @param {number} [index] - An index associated with the polygon.
     * @param {string} [stroke] - The stroke color of the polygon.
     * @param {number} [strokeThickness] - The thickness of the polygon's stroke.
     * @param {number} [opacity] - The opacity of the polygon.
     * @param {string} [fill] - The fill color of the polygon.
     * @param {string} [name] - The name or identifier of the polygon.
     * @param {Element} [parent] - The parent element to which the polygon belongs.
     * @param {string} [text] - Additional text associated with the polygon.
     * @returns {CircularChart3DPolygon} - Returns the created polygon.
     */
    public polygon3D(points?: CircularChart3DVector[], tag?: CircularChart3DPolygon, index?: number, stroke?: string, strokeThickness?: number,
                     opacity?: number, fill?: string, name?: string, parent?: Element, text?: string ): CircularChart3DPolygon {

        if (arguments.length === 2) {
            points = arguments[0];
            this.calculateNormal(points[0], points[1], points[2]);
            this.vectorPoints = points;
            this.calculateNormal(this.vectorPoints);
            const polygon: CircularChart3DPolygon = arguments[1];
            polygon.normal = this.normal;
            polygon.points = points;
            polygon.vectorPoints = this.vectorPoints;
            polygon.isSplit = true;
            polygon.d = this.d;
            return polygon;
        } else {
            this.calculateNormal(points[0], points[1], points[2]);
            this.vectorPoints = points;
            this.calculateNormal(this.vectorPoints);
            const element: { tag: string, parent: Element } = { tag: 'path', parent: parent };
            const polygon: CircularChart3DPolygon = {
                normal: this.normal,
                points: points,
                vectorPoints: this.vectorPoints,
                index: index,
                tag: tag,
                name: name ? name : null,
                strokeThickness: strokeThickness,
                opacity: opacity,
                fill: fill,
                d: this.d,
                text: text ? text : '',
                polygonElement: element
            };
            if (arguments.length !== 1) {
                polygon.polygonElement = element;
            }
            return polygon;
        }
    }

    /**
     * Calculates the normal vector for a 3D polygon based on the provided points.
     *
     * @param {...CircularChart3DVector} args - Variable number of vector3D arguments representing points of the polygon.
     * @returns {void}
     */
    public calculateNormal(...args: any[]): void {
        if (args.length >= 3) {
            // Relative information of the points
            const vector1: CircularChart3DVector = args[0];
            const vector2: CircularChart3DVector = args[1];
            const vector3: CircularChart3DVector = args[2];
            const vector4: CircularChart3DVector = this.vector.vector3DMinus(vector1, vector2);
            const vector5: CircularChart3DVector = this.vector.vector3DMinus(vector3, vector2);
            const normal: CircularChart3DVector = this.vector.vector3DMultiply(vector4, vector5);

            let length: number = this.vector.getLength(normal); // Get length of the vector

            if (length < this.epsilon) {
                length = 1;
            }

            this.normal = this.vector.vector3D(normal.x / length, normal.y / length, normal.z / length); // Calculate normalization of the vector
            this.d = -(this.normal.x * vector1.x + this.normal.y * vector1.y + this.normal.z * vector1.z); // Normalized values * 1st coordinates Coordinates - Depth of the plan

            if (args[3]) {
                args[3].normal = this.normal;
                args[3].d = this.d;
            }
        } else {
            const points: CircularChart3DVector[] = args[0];
            this.calculateNormal(points[0], points[1], points[2], arguments[1]);
            for (let i: number = 3; (i < points.length) && (this.test()); i++) {
                this.calculateNormal(points[i as number], points[0], points[i / 2]);
            }
        }
    }

    /**
     * Tests whether the calculated normal vector is valid.
     *
     * @returns {boolean} - Returns true if the normal vector is valid, false otherwise.
     */
    public test(): boolean {
        return !this.vector.isValid(this.normal);
    }

    /**
     * Gets the normal vector based on the transformed points using the specified transformation matrix.
     *
     * @param {number[][]} transform - The transformation matrix.
     * @param {CircularChart3DVector[]} [vectorPoints] - The vector points.
     * @returns {CircularChart3DVector} - Returns the normal vector.
     * @private
     */
    public getNormal(transform: number[][], vectorPoints?: CircularChart3DVector[]): CircularChart3DVector {
        let normal: CircularChart3DVector;
        if (vectorPoints != null) {
            normal = this.vector.getNormal(this.matrixObj.getMatrixVectorMultiple(transform, vectorPoints[0]),
                                           matrixObj.getMatrixVectorMultiple(transform, vectorPoints[1]),
                                           this.matrixObj.getMatrixVectorMultiple(transform, vectorPoints[2]));
            for (let i: number = 3; (i < vectorPoints.length) && !this.vector.isValid(normal) && vectorPoints[i / 2]; i++) {
                const v1: CircularChart3DVector = matrixObj.getMatrixVectorMultiple(transform, vectorPoints[i as number]);
                const v2: CircularChart3DVector = matrixObj.getMatrixVectorMultiple(transform, vectorPoints[0]);
                const v3: CircularChart3DVector = matrixObj.getMatrixVectorMultiple(transform, vectorPoints[i / 2]);
                normal = this.vector.getNormal(v1, v2, v3);
            }
        }
        return normal;
    }

    /**
     * Creates a text element in the context of a circular 3D chart.
     *
     * @param {CircularChart3DVector} position - The position of the text.
     * @param {CircularChart3DLabelElement} element - The text element to be created.
     * @param {number} xLength - The x value for the text element.
     * @param {number} yLength - The y value for the text element.
     * @returns {CircularChart3DPolygon} - Returns the polygon representing the created text element.
     */
    public createTextElement(position: CircularChart3DVector,
                             element: CircularChart3DLabelElement, xLength: number, yLength: number): CircularChart3DPolygon {
        const vectorCollection: CircularChart3DVector[] = [];
        const x: number = position.x;
        const y: number = position.y;
        const desiredWidth: number = element.width;
        const desiredHeight: number = element.height;
        vectorCollection[0] = this.vector.vector3D(x, y, position.z);
        vectorCollection[1] = this.vector.vector3D(x + desiredWidth, y + desiredHeight + yLength, position.z);
        vectorCollection[2] = this.vector.vector3D(x + desiredWidth + xLength, y + desiredHeight + yLength, position.z);
        return this.text3D(element, vectorCollection);
    }

    /**
     * Creates a 3D polyline by connecting a series of points in 3D space.
     *
     * @param {Array<{ x: number; y: number; z?: number }>} points - An array of points in 3D space, specified by their x, y, and optional z coordinates.
     * @param {CircularChart3DLabelElement} element - The circular 3D label element associated with the polyline.
     * @returns {CircularChart3DPolygon} - The resulting 3D polyline with the specified circular 3D label element and vertices.
     */
    public createPolyline(points: { x: number; y: number; z?: number }[], element: CircularChart3DLabelElement): CircularChart3DPolygon {
        if (points.length === 2) {
            const prePoint = points[1];
            points.push({ x: prePoint.x, y: prePoint.y, z: prePoint.z });
        }
        return this.polyLine3D(element, points);
    }

    /**
     * Creates a 3D polygon by connecting a series of points in 3D space.
     *
     * @param {CircularChart3DLabelElement} element - The circular 3D label element associated with the polygon.
     * @param {Array<{ x: number; y: number; z?: number }>} points - An array of points in 3D space, specified by their x, y, and optional z coordinates.
     * @returns {CircularChart3DPolygon} - The resulting 3D polygon with the specified circular 3D label element and vertices.
     */
    private polyLine3D(element: CircularChart3DLabelElement, points: { x: number; y: number; z?: number }[]): CircularChart3DPolygon {
        const plane = this.polygon3D(points);
        plane.element = element;
        return plane;
    }

    /**
     * Creates a 3D text polygon based on the given label element and points.
     *
     * @param {CircularChart3DLabelElement} element - The label element associated with the text.
     * @param {CircularChart3DVector[]} points - The array of 3D vector points defining the position of the text in 3D space.
     * @returns {CircularChart3DPolygon} - Returns the created 3D text polygon.
     */
    public text3D(element: CircularChart3DLabelElement, points: CircularChart3DVector[]): CircularChart3DPolygon {
        const plane: CircularChart3DPolygon = this.polygon3D(points);
        plane.element = element;
        return plane;
    }

    /**
     * Draws a polyline on the circular 3D chart panel.
     *
     * @param {CircularChart3DPolygon} panel - The polygon panel on which to draw the polyline.
     * @param {CircularChart3D} chart - The circular 3D chart instance.
     */
    public drawPolyLine(panel: CircularChart3DPolygon, chart: CircularChart3D): void {
        const transform: CircularChart3DBasicTransform = circular3DRender.transform;
        const pathDirection: CircularChart3DStringBuilder = chart.svg3DRenderer.getStringBuilder();
        const startPoint = chart.transform3D.toScreen(panel.vectorPoints[0], transform);
        pathDirection.append(`M ${startPoint.x} ${startPoint.y} `);

        const lineSegment1: CircularChart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[1], transform);
        pathDirection.append(`L ${lineSegment1.x} ${lineSegment1.y} `);
        pathDirection.append(`M ${lineSegment1.x} ${lineSegment1.y} `);

        const lineSegment2: CircularChart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[2], transform);

        pathDirection.append(`L ${lineSegment2.x} ${lineSegment2.y} `);

        const direction = pathDirection.toString();

        const optionsLine = {
            id: panel.element.id,
            'stroke-dasharray': panel.element.dashArray,
            'stroke-width': panel.element.width,
            stroke: panel.element.stroke,
            d: direction
        };
        const element: Element = chart.renderer.drawPath(optionsLine);
        appendChildElement(false, chart.groupElement, element, chart.redraw, true, 'x', 'y', null, direction);
    }

    /**
     * Draws a data label symbol for a specific data point in a circular 3D series.
     *
     * @param {CircularChart3DPolygon} panel - The 3D polygon representing the panel on which the text will be drawn.
     * @param {CircularChart3D} chart - The 3D chart to which the panel belongs.
     * @returns {void}
     */
    public drawText(panel: CircularChart3DPolygon, chart: CircularChart3D): void {
        const element: CircularChart3DLabelElement = panel.element;
        const transform: CircularChart3DBasicTransform = circular3DRender.transform;
        if (transform == null) {
            return;
        }
        const actual3DPosition: CircularChart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[0], transform);
        const x: number = actual3DPosition.x;
        const y: number = actual3DPosition.y;
        if (element.tag === 'text') {
            const options: any = {
                'id': element.id,
                'x': x,
                'y': y,
                'fill': element.font.color || element.fill,
                'font-size': element.font.size,
                'font-family': element.font.fontFamily || chart.themeStyle.datalabelFont.fontFamily,
                'font-style': element.font.fontStyle,
                'font-weight': element.font.fontWeight,
                'opacity': element.font.opacity,
                'text-anchor': element.textAnchor,
                'cursor': 'default',
                'transform': element.angle ? 'rotate(' + element.angle + ',' + (x) + ',' + y + ')' : ''
            };
            const textElement: Element = chart.svg3DRenderer.drawText(
                options, element.label.text, panel.element.font, chart);
            if (element.id.indexOf('text') > -1) {
                textElement.setAttribute('aria-hidden', 'true');
            }
            chart.groupElement.append(textElement);
            if (chart.previousID && chart.isTouch) {
                const previousElement: HTMLElement = document.getElementById(chart.previousID);
                const currentElement: HTMLElement = document.getElementById(options.id);
                if (previousElement && currentElement) {
                    currentElement.parentNode.insertBefore(currentElement, previousElement.nextSibling);
                }
            }
            chart.previousID = options.id;
        }
        else {
            const series: CircularChart3DSeries = element.series;
            const pointText: string = element.point.argsData.text;
            const textOffset: Size = measureText(pointText, element.point.argsData.font, chart.themeStyle.datalabelFont);
            const padding: number = 10;
            const width: number = textOffset.width + padding + padding;
            const height: number = textOffset.height + padding + padding;
            const location: CircularChart3DLocation = { x: actual3DPosition.x, y: actual3DPosition.y };
            const xXalue: number = location.x - (padding) / 2 + (padding) / 2;
            const yValue: number = location.y - (padding) / 2 - (height / padding) + (padding) / 2;
            const seriesIndex: number = series.index;

            this.dataLabelSymbol(seriesIndex, series, element, xXalue, yValue, width, height, chart);
        }
    }

    /**
     * Draws a data label symbol for a specific data point in a circular 3D series.
     *
     * @param {number} seriesIndex - The index of the series to which the data point belongs.
     * @param {CircularChart3DSeries} series - The circular 3D series containing the data point.
     * @param {CircularChart3DLabelElement} dataElement - The index of the data point within the series.
     * @param {number} x - The x-coordinate of the center of the symbol.
     * @param {number} y - The y-coordinate of the center of the symbol.
     * @param {number} width - The width of the symbol.
     * @param {number} height - The height of the symbol.
     * @param {CircularChart3D} chart - The circular 3D chart containing the series.
     * @returns {void}
     */
    private dataLabelSymbol(seriesIndex: number, series: CircularChart3DSeries, dataElement: CircularChart3DLabelElement, x: number,
                            y: number, width: number, height: number, chart: CircularChart3D): void {
        const path: string = 'M' + ' ' + (x + (-width / 2)) + ' ' +
            (y + (-height / 2)) + ' ' + 'L' + ' ' + (x + (width / 2)) +
            ' ' + (y + (-height / 2)) + ' ' + 'L' + ' ' + (x + (width / 2)) +
            ' ' + (y + (height / 2)) + ' ' + 'L' + ' ' + (x + (-width / 2)) +
            ' ' + (y + (height / 2)) + ' ' + 'L' + ' ' + (x + (-width / 2)) +
            ' ' + (y + (-height / 2)) + ' z';

        let transform = '';
        if (series.dataLabel.enableRotation) {
            let degree: number;
            let angle = degree = series.dataLabel.angle;
            if (angle === 0) {
                const toDegrees = (angle: number) => angle * (180 / Math.PI);
                const midAngle = toDegrees(dataElement.point.symbolLocation.angle);
                if (series.dataLabel.position === 'Outside') {
                    degree = 0;
                }
                else if (midAngle >= 90 && midAngle <= 260) {
                    degree = midAngle + 180;
                } else {
                    degree = midAngle;
                }
            } else {
                degree = (angle > 360) ? angle - 360 : (angle < -360) ? angle + 360 : angle;
            }
            transform = 'rotate(' + degree + ',' + (x) + ',' + (y) + ')';
        }
        const rectOptions: PathAttributes = {
            id: chart.element.id + '-svg' + '-data-label-series-' + seriesIndex + '-shape-' + dataElement.pointIndex,
            fill: dataElement.point.argsData.color,
            'stroke-width': dataElement.point.argsData.border.width,
            stroke: dataElement.point.argsData.border.color,
            "stroke-dasharray": dataElement.point.argsData.border.dashArray,
            opacity: 1,
            visibility: '',
            transform: transform,
            d: path
        };
        const element: Element = chart.renderer.drawPath(rectOptions);
        chart.groupElement.append(element);
        if (chart.previousID && chart.isTouch) {
            const previousElement: HTMLElement = document.getElementById(chart.previousID);
            const currentElement: HTMLElement = document.getElementById(rectOptions.id);
            if (previousElement && currentElement) {
                currentElement.parentNode.insertBefore(currentElement, previousElement.nextSibling);
            }
        }
        chart.previousID = rectOptions.id;
    }

    /**
     * Draws a circular 3D polygon on the specified chart.
     *
     * @param {CircularChart3DPolygon} panel - The polygon to be drawn.
     * @param {CircularChart3D} chart - The circular 3D chart on which the polygon is to be drawn.
     * @returns {void}
     */
    public draw(panel: CircularChart3DPolygon, chart: CircularChart3D): void {
        if (panel.vectorPoints == null || panel.vectorPoints.length <= 0) {
            return;
        }
        const transform: CircularChart3DBasicTransform = circular3DRender.transform;
        const pathDirection: CircularChart3DStringBuilder = chart.svg3DRenderer.getStringBuilder();
        let color: string = panel.fill;
        const format: boolean = chart.svg3DRenderer.checkColorFormat(color);
        if (!format) {
            color = colorNameToHex(color);
        }
        const figure: { StartPoint: CircularChart3DLocation} = { StartPoint: null };
        if (transform != null) {
            figure.StartPoint = chart.transform3D.toScreen(panel.vectorPoints[0], transform);
            pathDirection.append('M' + ' ' + (figure.StartPoint.x) + ' ' + (figure.StartPoint.y) + ' ');
            for (let i: number = 0; i < panel.vectorPoints.length; i++) {
                const lineSegment: CircularChart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[i as number], transform);
                pathDirection.append('L' + ' ' + (lineSegment.x) + ' ' + (lineSegment.y) + ' ');

            }
        }
        const direction: string = pathDirection.toString();
        let name: string = 'Light';
        const lightCoefficientZ: number = (2 * (Math.abs(this.vector.vector3DAdd(panel.normal, this.vector.vector3D(0, 0, 1))) - 1));
        const lightCoefficientY: number = (2 * (Math.abs(this.vector.vector3DAdd(panel.normal, this.vector.vector3D(0, 1, 0))) - 1));
        const lightCoefficientX: number = (2 * (Math.abs(this.vector.vector3DAdd(panel.normal, this.vector.vector3D(1, 0, 0))) - 1));
        if (panel.name && !(panel.name.indexOf('-wall-brush') > -1)) {
            if (lightCoefficientZ === lightCoefficientX) {
                name = 'ZLight';
                color = this.applyZLight(color, chart);
            }
            else if (((lightCoefficientY === lightCoefficientZ) || (lightCoefficientZ !== 0 && lightCoefficientY < lightCoefficientZ))) {
                name = 'XLight';
                color = this.applyXLight(color, chart);
            }
            else if (lightCoefficientZ < 0) {
                name = 'ZLight';
                color = this.applyZLight(color, chart);
            }
            else {
                name = 'Light';
            }
        }
        const options: CircularChart3DPathOptions = {
            'id': chart.element.id + '-svg-' + panel.name,
            'name': name,
            'fill': color,
            'stroke': '',
            'stroke-width': panel.strokeThickness,
            'opacity': panel.opacity,
            'd': direction
        };
        const element: Element = chart.renderer.drawPath(options);
        if (panel.text) {
            element.setAttribute('aria-label', panel.text);
            element.setAttribute('role', 'img');
        }
        appendChildElement(false, panel.polygonElement.parent, element, chart.redraw, true, 'x', 'y', null, direction);
        if (chart.previousID && chart.isTouch) {
            const previousElement: HTMLElement = document.getElementById(chart.previousID);
            const currentElement: HTMLElement = document.getElementById(options.id);

            if (previousElement && currentElement) {
                currentElement.parentNode.insertBefore(currentElement, previousElement.nextSibling);
            }
        }
        chart.previousID = options.id;
    }

    /**
     * Draws text on the specified circular 3D chart panel.
     *
     * @param {CircularChart3DPolygon} panel - The circular 3D polygon representing the panel on which the text will be drawn.
     * @param {CircularChart3D} chart - The circular 3D chart to which the panel belongs.
     * @returns {void}
     */
    public drawTemplate(panel: CircularChart3DPolygon, chart: CircularChart3D): void {
        const element: CircularChart3DLabelElement = panel.element;
        const transform: CircularChart3DBasicTransform = circular3DRender.transform;
        if (transform == null) {
            return;
        }
        const label: CircularChart3DDataElement  = element.label ;
        const actual3DPosition: CircularChart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[0], transform);
        chart.circularChartDataLabel3DModule.createDataLabelTemplate(
            label.series.dataLabelElement, label.series, label.series.dataLabel,
            label.series.points[label.pointIndex],
            label.series.points[label.pointIndex].argsData,
            label.pointIndex, false, actual3DPosition, chart);
    }

    /**
     * Applies a lightening effect to the given color by reducing its red, green, and blue components.
     *
     * @param {string} color - The input color in hexadecimal format.
     * @param {CircularChart3D} chart - The circular 3D chart associated with the color.
     * @returns {string} - The lightened color in hexadecimal format.
     */
    public applyXLight(color: string, chart: CircularChart3D): string {
        const RGB: CircularChart3DColorFormat = chart.svg3DRenderer.hexToValue(color);
        RGB.red = parseInt((RGB.red * 0.7).toString(), 10);
        RGB.green = parseInt((RGB.green * 0.7).toString(), 10);
        RGB.blue = parseInt((RGB.blue * 0.7).toString(), 10);
        return chart.svg3DRenderer.hexColor(RGB);
    }

    /**
     * Applies a lightening effect to the given color by reducing its red, green, and blue components with a focus on the Z-axis.
     *
     * @param {string} color - The input color in hexadecimal format.
     * @param {CircularChart3D} chart - The circular 3D chart associated with the color.
     * @returns {string} - The lightened color in hexadecimal format.
     */
    public applyZLight(color: string, chart: CircularChart3D): string {
        const RGB: CircularChart3DColorFormat =  chart.svg3DRenderer.hexToValue(color);
        RGB.red = parseInt((RGB.red * 0.9).toString(), 10);
        RGB.green = parseInt((RGB.green * 0.9).toString(), 10);
        RGB.blue = parseInt((RGB.blue * 0.9).toString(), 10);
        return chart.svg3DRenderer.hexColor(RGB);
    }
}

const vector: CircularChart3DVectorModule = new CircularChart3DVectorModule(0, 0, 0);
const matrixObj: CircularChart3DMatrix = new CircularChart3DMatrix();
const bspTreeObj: CircularChart3DBinaryTreeBuilder = new CircularChart3DBinaryTreeBuilder();
const polygonObj: CircularChart3DPolygonModule = new CircularChart3DPolygonModule();

