import { PathAttributes, SVGCanvasAttributes, Size, measureText } from '@syncfusion/ej2-svg-base';
import { Chart3DPathOptions , Chart3DColorFormat, Chart3DStringBuilder, Chart3DVector, Chart3DLocation, Chart3DPolygon, Chart3DTickElement, Chart3DPolyAttributes, Chart3DPolyCollections, Chart3DLabelElement, Chart3DTextOption, Chart3DDataElement, Chart3DBasicTransform, Chart3DLineAttributes } from '../model/chart3d-Interface';
import { appendChildElement, colorNameToHex } from '../../common/utils/helper';
import { Chart3DPoint, Chart3DSeries } from '../series/chart-series';
import { FontModel, MarginModel } from '../../common/model/base-model';
import { Chart3D } from '../chart3D';
import { Chart3DAxis} from '../axis/axis';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { VisibleRangeModel } from '../../common/model/interface';

/**
 * Represents a 3D rendering configuration for the EJ3D rendering engine.
 *
 */
export class Chart3DRender {
    transform: Chart3DBasicTransform = null; // Chart3DBasicTransform
    tree: Chart3DBspNode[]; // Binary Space Partitioning tree
}

const chart3DRender: Chart3DRender = new Chart3DRender();

/**
 * Represents a node in a Binary Space Partitioning (BSP) tree.
 *
 * @interface
 */
interface Chart3DBspNode {
    /** The front subtree of the BSP tree. */
    front: Chart3DBspNode;
    /** The back subtree of the BSP tree. */
    back: Chart3DBspNode;
    /** The splitting plane associated with the node. */
    plane: Chart3DPolygon;
}

/**
 * Represents a three-dimensional vector in space.
 */
export class Vector3D {
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
     * @param {Chart3DVector} point - The vector to check.
     * @returns {boolean} - True if the vector is valid, false otherwise.
     */
    public isValid(point: Chart3DVector ): boolean {
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
     * @returns {Chart3DVector} - The new Vector3D instance.
     */
    public vector3D(vx: { x: number; y: number } | number, vy: number, vz: number): Chart3DVector{
        this.x = vx as number;
        this.y = vy;
        this.z = vz;
        return { x: this.x, y: this.y, z: this.z };
    }

    /**
     * Subtracts one vector from another and returns the result.
     *
     * @param {Chart3DVector} v1 - The first vector.
     * @param {Chart3DVector} v2 - The second vector to subtract from the first.
     * @returns {Chart3DVector} - The resulting vector.
     */
    public vector3DMinus(v1: Chart3DVector, v2: Chart3DVector): Chart3DVector{
        return this.vector3D(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    /**
     * Adds two vectors and returns the result.
     *
     * @param {Chart3DVector} v1 - The first vector.
     * @param {Chart3DVector} v2 - The second vector to add to the first.
     * @returns {Chart3DVector} - The resulting vector.
     */
    public vector3DPlus(v1: Chart3DVector, v2: Chart3DVector): Chart3DVector {
        return this.vector3D(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    /**
     * Multiplies two vectors using the cross product and returns the result.
     *
     * @param {Chart3DVector} v1 - The first vector.
     * @param {Chart3DVector} v2 - The second vector.
     * @returns {Chart3DVector} - The resulting vector.
     */
    public vector3DMultiply(v1: Chart3DVector, v2: Chart3DVector): Chart3DVector {
        const x: number = v1.y * v2.z - v2.y * v1.z;
        const y: number = v1.z * v2.x - v2.z * v1.x;
        const z: number = v1.x * v2.y - v2.x * v1.y;
        return this.vector3D(x, y, z);
    }

    /**
     * Calculates the dot product of two vectors.
     *
     * @param {Chart3DVector} v1 - The first vector.
     * @param {Chart3DVector} v2 - The second vector.
     * @returns {number} - The dot product.
     */
    public vector3DAdd(v1: Chart3DVector, v2: Chart3DVector): number {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }

    /**
     * Multiplies a vector by a scalar value.
     *
     * @param {Chart3DVector} v1 - The vector to multiply.
     * @param {number} value - The scalar value.
     * @returns {Chart3DVector} - The resulting vector.
     */
    public vector3DStarMultiply(v1: Chart3DVector, value: number): Chart3DVector {
        const x: number = v1.x * value;
        const y: number = v1.y * value;
        const z: number = v1.z * value;
        return this.vector3D(x, y, z);
    }

    /**
     * Calculates the length of a vector.
     *
     * @param {Chart3DVector} vector - The vector to calculate the length of.
     * @returns {number} - The length of the vector.
     */
    public getLength(vector: Chart3DVector): number {
        const sqt: number = this.vector3DAdd(vector, vector);
        return Math.sqrt(sqt);
    }

    /**
     * Normalizes the vector to have a length of 1.
     *
     * @returns {void}
     */
    public normalize(): void {
        const length: number = this.getLength(this);
        this.x /= length;
        this.y /= length;
        this.z /= length;
    }

    /**
     * Calculates the normal vector of a triangle defined by three vectors.
     *
     * @param {Chart3DVector} v1 - The first vertex of the triangle.
     * @param {Chart3DVector} v2 - The second vertex of the triangle.
     * @param {Chart3DVector} v3 - The third vertex of the triangle.
     * @returns {Chart3DVector} - The normal vector of the triangle.
     */
    public getNormal(v1: Chart3DVector , v2: Chart3DVector , v3: Chart3DVector ): Chart3DVector {
        const vector4: Chart3DVector = this.vector3DMinus(v1, v2);
        const vector5: Chart3DVector = this.vector3DMinus(v3, v2);
        const n: Chart3DVector = this.vector3DMultiply(vector4, vector5);
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
export class Matrix3D {
    /** The size of the matrix, which is set to 4 by default. */
    private matrixSize: number = 4;

    /**
     * Creates a 3D matrix with the specified size.
     *
     * @param {number} size - The size of the matrix.
     * @returns {number[][]} - The created 3D matrix.
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
     * @returns {number[][]} -The identity matrix.
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
     * @param {Chart3DVector} point - The vector to multiply with.
     * @returns {Chart3DVector} - The resulting vector.
     */

    public getMatrixVectorMultiple(matrix: number[][], point: Chart3DVector): Chart3DVector {
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
     * Multiplies a matrix by a vector and applies translation.
     *
     * @param {number[][]} matrix - The matrix.
     * @param {Chart3DVector} vector - The vector to multiply with.
     * @returns {Vector3D} - The resulting vector.
     */

    public getMatrixVectorAnd(matrix: number[][], vector?: Chart3DVector): { x: number; y: number; z: number } {
        const x: number =
            matrix[0][0] * vector.x +
            matrix[1][0] * vector.y +
            matrix[2][0] * vector.z;
        const y: number =
            matrix[0][1] * vector.x +
            matrix[1][1] * vector.y +
            matrix[2][1] * vector.z;
        const z: number =
            matrix[0][2] * vector.x +
            matrix[1][2] * vector.y +
            matrix[2][2] * vector.z;
        return new Vector3D(x, y, z);
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
export class ChartTransform3D {
    /** Represents the angle conversion factor from degrees to radians. */
    private toRadial: number = Math.PI / 180;
    /** Represents a 3D vector for performing vector operations. */
    private vector: Vector3D;
    /** Represents a 3D matrix for performing matrix operations. */
    private matrixObj: Matrix3D;

    /**
     * Initializes a new instance of the `ChartTransform3D` class.
     */
    constructor() {
        this.vector = new Vector3D(0, 0, 0);
        this.matrixObj = new Matrix3D();
    }

    /**
     * Creates a 3D transformation based on the specified size.
     *
     * @param {Size} size - The size of the viewing area.
     * @returns {Chart3DBasicTransform} - The 3D transformation.
     */
    public transform3D(size: Size): Chart3DBasicTransform {
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
     * @param {Chart3DBasicTransform} transform - The 3D transformation to apply.
     * @returns {void} - The 3D transformation.
     */
    public transform(transform: Chart3DBasicTransform): void {
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
     * @param {Chart3DBasicTransform} transform - The 3D transformation.
     * @returns {void}
     */
    private updatePerspective(angle: number, transform: Chart3DBasicTransform): void {
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
     * @param {Chart3DVector} vector3D - The 3D vector to transform.
     * @param {Chart3DBasicTransform} transform - The 3D transformation.
     * @param {Matrix3D} chartObj - Optional custom matrix object for transformation.
     * @returns {Chart3DLocation} - The screen coordinates.
     */
    public toScreen(vector3D: Chart3DVector, transform: Chart3DBasicTransform, chartObj?: Matrix3D): Chart3DLocation {
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
     * @param {Chart3DBasicTransform} transform - The 3D transformation.
     * @returns {void}
     */

    private setViewMatrix(matrix: number[][], transform: Chart3DBasicTransform): void {
        if (transform.viewMatrix === matrix) {
            return;
        }
        transform.viewMatrix = matrix;
        transform.needUpdate = true;
    }

    /**
     * Calculates the final result matrix based on the current state.
     *
     * @param {Chart3DBasicTransform} transform - The 3D transformation.
     * @param {Matrix3D} matrixobj - Optional custom matrix object for transformation.
     * @returns {number[][]} - The final result matrix.
     */

    public result(transform: Chart3DBasicTransform, matrixobj?: Matrix3D): number[][] {
        let chartObj: Matrix3D = transform.chartObj ? transform.chartObj : this.matrixObj;
        if (!chartObj) {
            chartObj = matrixobj;
        }
        if (!transform.needUpdate) {
            return transform.resultMatrix;
        }
        const matrixObj: Matrix3D = this.matrixObj ? this.matrixObj : matrixobj;
        transform.resultMatrix = chartObj.getMatrixMultiplication(matrixObj.getInterval(transform.centeredMatrix), transform.perspective);
        transform.resultMatrix = chartObj.getMatrixMultiplication(transform.resultMatrix, transform.viewMatrix);
        transform.resultMatrix = chartObj.getMatrixMultiplication(transform.resultMatrix, transform.centeredMatrix);
        transform.needUpdate = false;
        return transform.resultMatrix;
    }

    /**
     * Sets the center in the transformation state.
     *
     * @param {Chart3DVector} center - The new center vector.
     * @param {Chart3DBasicTransform} transform - The 3D transformation.
     * @returns {void}
     */
    private setCenter(center: Chart3DVector, transform: Chart3DBasicTransform): void {
        transform.centeredMatrix = this.matrixObj.transform(-center.x, -center.y, -center.z);
        transform.needUpdate = true;
    }
}

/**
 * Represents a 3D graphics rendering utility for drawing and managing 3D elements in a chart.
 *
 */
export class Graphics3D {
    /** The vector class. */
    private vector: Vector3D = new Vector3D(0, 0, 0);

    /**
     * Adds a visual polygon to the 3D chart and returns its identifier.
     *
     * @param {Chart3DPolygon} polygon - The polygon to add.
     * @param {Chart3D} chart - The 3D chart.
     * @returns {number} - The identifier of the added polygon.
     */
    public addVisual(polygon: Chart3DPolygon, chart: Chart3D): number {
        if (polygon == null || polygonObj.test()) {
            return -1;
        }
        return bspTreeObj.add(polygon, chart);
    }

    /**
     * Prepares the view for rendering based on specified parameters.
     *
     * @param {number} perspectiveAngle - The perspective angle.
     * @param {number} depth - The depth of the view.
     * @param {number} rotation - The rotation angle.
     * @param {number} tilt - The tilt angle.
     * @param {Size} size - The size of the viewing area.
     * @param {Chart3D} chart - The 3D chart.
     * @returns {void}
     */
    public prepareView(perspectiveAngle: number, depth: number, rotation: number, tilt: number, size: Size, chart: Chart3D): void {

        if (chart3DRender.transform == null) {
            chart3DRender.transform = chart.transform3D.transform3D(size);
        }
        else {
            chart3DRender.transform.viewingArea = size;
        }
        if (!chart3DRender.tree) {
            chart3DRender.tree = [];
        }
        chart3DRender.transform.rotation = rotation;
        chart3DRender.transform.tilt = tilt;
        chart3DRender.transform.depth = depth;
        chart3DRender.transform.perspectiveAngle = perspectiveAngle;
        chart.transform3D.transform(chart3DRender.transform);
        chart3DRender.tree[chart.chart3D.id] = bspTreeObj.build();
    }

    /**
     * Renders the 3D view on the specified panel element.
     *
     * @param {Element} panel - The panel element to render the view on.
     * @param {Chart3D} chart - The 3D chart.
     * @param {number} rotation - The rotation angle.
     * @param {number} tilt - The tilt angle.
     * @param {Size} size - The size of the viewing area.
     * @param {number} perspectiveAngle - The perspective angle.
     * @param {number} depth - The depth of the view.
     * @returns {void}
     */
    public view(panel?: Element, chart?: Chart3D, rotation?: number, tilt?: number, size?: Size,
                perspectiveAngle?: number, depth?: number): void {
        const MaxValue: number = 32767;
        if (arguments.length === 2) {
            if (panel == null) {
                return;
            }
            const eyeVector: Chart3DVector = this.vector.vector3D(0, 0, MaxValue);
            this.drawNode3D(chart3DRender.tree[chart.chart3D.id], eyeVector, panel, chart);
        } else {
            if (panel == null) {
                return;
            }
            if (chart3DRender.transform == null) {
                chart3DRender.transform = chart.transform3D.transform3D(size);
            } else {
                chart3DRender.transform.viewingArea = size;
            }

            chart3DRender.transform.rotation = rotation;
            chart3DRender.transform.tilt = tilt;
            chart3DRender.transform.depth = depth;
            chart3DRender.transform.perspectiveAngle = perspectiveAngle;
            chart.transform3D.transform(chart3DRender.transform);
            const eye: Chart3DVector = this.vector.vector3D(0, 0, MaxValue);
            this.drawNode3D(chart3DRender.tree[chart.chart3D.id], eye, panel, chart);
        }
    }

    /**
     * Draws a 3D element based on the specified Binary Space Partitioning Node.
     *
     * @param {Chart3DBspNode} bspElement - The Binary Space Partitioning Node representing the 3D element.
     * @param {Chart3D} chart - The 3D chart.
     * @returns {void}
     */
    public draw3DElement(bspElement: Chart3DBspNode, chart: Chart3D): void {
        if (bspElement.plane.element) {
            if (bspElement.plane.element.tag === 'text' || bspElement.plane.element.tag === 'dataLabel') {
                polygonObj.drawText(bspElement.plane, chart);
            } else if (bspElement.plane.element.tag === 'template') {
                polygonObj.drawTemplate(bspElement.plane, chart);
            } else {
                polygonObj.drawLine(bspElement.plane, chart);
            }
        } else {
            polygonObj.draw(bspElement.plane, chart);
        }
    }

    /**
     * Draws the 3D nodes starting from the root based on the eye vector.
     *
     * @param {Chart3DBspNode} bspElement - The root Binary Space Partitioning Node.
     * @param {Chart3DVector} eyeVector - The eye vector.
     * @param {Element} panel - The panel element to render the view on.
     * @param {Chart3D} chart - The 3D chart.
     * @returns {void}
     */
    public drawNode3D(bspElement: Chart3DBspNode, eyeVector: Chart3DVector, panel: Element, chart: Chart3D): void {
        if (bspElement === null || chart3DRender.transform == null) {
            return;
        }
        const isVector: boolean = true;
        while (isVector) {
            const r: number = vector.vector3DAdd(
                polygonObj.getNormal(chart.transform3D.result(chart3DRender.transform), bspElement.plane.vectorPoints),
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
 * Represents a binary tree builder for 3D polygons in a chart.
 *
 */
export class BinaryTreeBuilder {
    /** A small value used for epsilon comparisons to handle floating-point inaccuracies.*/
    private epsilon: number = 0.0005;
    /** The 3D chart. */
    private chart: Chart3D;
    constructor(chart?: Chart3D) {
        this.chart = chart;
    }

    /**
     * Adds a polygon to the binary tree and returns its index.
     *
     * @param {Chart3DPolygon} polygon - The polygon to add.
     * @param {Chart3D} chart - The 3D chart.
     * @returns {number} - The index of the added polygon.
     */
    public add(polygon: Chart3DPolygon, chart: Chart3D): number {
        this.chart = chart;
        chart.polygons.push(polygon);
        return chart.polygons.length - 1;
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
     * @param {Chart3DVector} point - The vector representing the point.
     * @param {number} index - The index of the point.
     * @param {string} result - The result classification.
     * @returns {Chart3DPolyAttributes} - The created PolyAttributes object.
     */
    public vector3DIndexClassification(point: Chart3DVector, index: number, result: string): Chart3DPolyAttributes {
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
     * @param {Chart3DVector} point - The point to classify.
     * @param {Chart3DPolygon} polygon - The polygon for classification.
     * @returns {string} - The classification result ('OnPlane', 'OnBack', 'OnFront').
     */
    public classifyPoint(point: Chart3DVector, polygon: Chart3DPolygon): string {
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
     * @param {Chart3DPolygon} refPolygon - The reference polygon.
     * @param {Chart3DPolygon} classPolygon - The polygon to classify.
     * @returns {string} - The classification result ('OnPlane', 'ToRight', 'ToLeft', 'Unknown').
     */
    public classifyPolygon(refPolygon: Chart3DPolygon, classPolygon: Chart3DPolygon): string {
        let result: string = 'Unknown';
        const points: Chart3DVector[] = classPolygon.points;
        if (points == null) {
            return result;
        }
        let onBack: number = 0;
        let onFront: number = 0;
        let onPlane: number = 0;
        const normal: Chart3DVector = refPolygon.normal;
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
     * @param {Chart3DPolygon} splitPolygon - The polygon to split.
     * @param {Chart3DPolygon} refPolygon - The reference polygon for splitting.
     * @returns {Chart3DPolyCollections} - The resulting back and front parts.
     * @private
     */
    public splitPolygon(splitPolygon: Chart3DPolygon, refPolygon: Chart3DPolygon): Chart3DPolyCollections {
        const backPoint: Chart3DPolygon[] = [];
        const frontPoint: Chart3DPolygon[] = [];

        if (splitPolygon.points != null) {
            const polyPoints: Chart3DPolyAttributes[] = [];
            const backPartPoints: Chart3DPolyAttributes[] = [];
            const frontPartPoints: Chart3DPolyAttributes[] = [];

            let outputs: Chart3DVector[];
            let inputs: Chart3DVector[];

            const count: number = splitPolygon.points.length;
            for (let i: number = 0; i < count; i++) {
                const pointB: Chart3DVector = splitPolygon.points[i as number];
                const pointC: Chart3DVector = splitPolygon.points[this.getNext(i + 1, count)];
                const sideB: string = this.classifyPoint(pointB, refPolygon);
                const sideC: string = this.classifyPoint(pointC, refPolygon);
                const attributeB: Chart3DPolyAttributes = this.vector3DIndexClassification(pointB, polyPoints.length, sideB);
                polyPoints.push(attributeB);
                if (sideB !== sideC && sideB !== 'OnPlane' && sideC !== 'OnPlane') {
                    const vectorValue: Chart3DVector = vector.vector3DMinus(pointB, pointC);
                    const direction: Chart3DVector = vector.vector3DMinus(vector.vector3DStarMultiply(refPolygon.normal,
                                                                                                      -refPolygon.d), pointC);

                    const signedDistance: number = vector.vector3DAdd(direction, refPolygon.normal);
                    const intersectionParameter: number = signedDistance / vector.vector3DAdd(refPolygon.normal, vectorValue);
                    const intersectionPoint: Chart3DVector = vector.vector3DPlus(
                        pointC, vector.vector3DStarMultiply(vectorValue, intersectionParameter));
                    const attributeIntersection: Chart3DPolyAttributes = this.vector3DIndexClassification(intersectionPoint, polyPoints.length, 'OnPlane');

                    polyPoints.push(attributeIntersection);
                    backPartPoints.push(attributeIntersection);
                    frontPartPoints.push(attributeIntersection);
                } else if (sideB === 'OnPlane') {
                    const pointA: Chart3DVector = splitPolygon.points[this.getNext(i - 1, count)];
                    const sideA: string = this.classifyPoint(pointA, refPolygon);
                    if (sideA === sideC) {
                        continue;
                    }
                    if (sideA !== 'OnPlane' && sideC !== 'OnPlane') {
                        backPartPoints.push(attributeB);
                        frontPartPoints.push(attributeB);
                    } else if (sideA === 'OnPlane') {
                        switch (sideC) {
                        case 'OnBack':
                            backPartPoints.push(attributeB);
                            break;
                        case 'OnFront':
                            frontPartPoints.push(attributeB);
                            break;
                        }
                    } else if (sideC === 'OnPlane') {
                        switch (sideA) {
                        case 'OnBack':
                            backPartPoints.push(attributeB);
                            break;
                        case 'OnFront':
                            frontPartPoints.push(attributeB);
                            break;
                        }
                    }
                }
            }

            if (frontPartPoints.length !== 0 || backPartPoints.length !== 0) {
                for (let i: number = 0; i < backPartPoints.length - 1; i += 2) {
                    const backAttribute1: Chart3DPolyAttributes = backPartPoints[i as number];
                    const backAttribute2: Chart3DPolyAttributes = backPartPoints[i + 1];
                    backAttribute1.cuttingBackPoint = true;
                    backAttribute2.cuttingBackPoint = true;
                    backAttribute1.alterCuttingBackPairIndex = backAttribute2.index;
                    backAttribute2.alterCuttingBackPairIndex = backAttribute1.index;
                }

                for (let i: number = 0; i < frontPartPoints.length - 1; i += 2) {
                    const frontAttribute1: Chart3DPolyAttributes  = frontPartPoints[i as number];
                    const frontAttribute2: Chart3DPolyAttributes  = frontPartPoints[i + 1];
                    frontAttribute1.cuttingFrontPoint = true;
                    frontAttribute2.cuttingFrontPoint = true;
                    frontAttribute1.alterCuttingFrontPairIndex = frontAttribute2.index;
                    frontAttribute2.alterCuttingFrontPairIndex = frontAttribute1.index;
                }

                for (let i: number = 0; i < backPartPoints.length - 1; i++) {
                    const backAttribute1: Chart3DPolyAttributes = backPartPoints[i as number];
                    if (backAttribute1.alreadyCutBack) {
                        continue;
                    }
                    outputs = this.cutOutBackPolygon(polyPoints, backAttribute1);

                    if (outputs.length > 2) {
                        const polygon1: Chart3DPolygon = polygonObj.polygon3D(outputs, splitPolygon);
                        backPoint.push({ ...polygon1 });
                    }
                }

                for (let i: number = 0; i < frontPartPoints.length - 1; i++) {
                    const backAttribute2: Chart3DPolyAttributes = frontPartPoints[i as number];
                    if (backAttribute2.alreadyCutFront) {
                        continue;
                    }
                    inputs = this.cutOutFrontPolygon(polyPoints, backAttribute2);
                    if (inputs.length > 2) {
                        const polygon2: Chart3DPolygon = polygonObj.polygon3D(inputs, splitPolygon);
                        frontPoint.push({ ...polygon2 });
                    }
                }
            }
        } else {
            backPoint.push(splitPolygon);
            frontPoint.push(splitPolygon);
        }

        return { backPolygon: backPoint, frontPolygon: frontPoint };
    }

    /**
     * Cuts out the front part of a polygon based on the PolyAttributes.
     *
     * @param {Chart3DPolyAttributes[]} polyPoints - The PolyAttributes array of the polygon.
     * @param {Chart3DPolyAttributes} initialVertex - The PolyAttributes representing the cutting point.
     * @returns {Chart3DVector[]} - The resulting points of the front part.
     */
    private cutOutFrontPolygon(polyPoints: Chart3DPolyAttributes[], initialVertex: Chart3DPolyAttributes): Chart3DVector[] {
        const points: Chart3DVector[] = [];
        let currentVertex: Chart3DPolyAttributes = initialVertex;
        const isVector: boolean = true;
        while (isVector) {
            currentVertex.alreadyCutFront = true;
            points.push(currentVertex.vector);

            const currentVertexPair: Chart3DPolyAttributes = polyPoints[currentVertex.alterCuttingFrontPairIndex];

            if (currentVertex.cuttingFrontPoint) {
                if (!currentVertexPair.alreadyCutFront) {
                    currentVertex = currentVertexPair;
                } else {
                    const previousVertexOnBack: Chart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index - 1,
                                                                                                polyPoints.length)];
                    const nextVertexOnBack: Chart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index + 1, polyPoints.length)];

                    if (previousVertexOnBack.result === 'OnFront' && !previousVertexOnBack.alreadyCutFront) {
                        currentVertex = previousVertexOnBack;
                    } else if (nextVertexOnBack.result === 'OnFront' && !nextVertexOnBack.alreadyCutFront) {
                        currentVertex = nextVertexOnBack;
                    } else {
                        return points;
                    }
                }
            } else {
                const previousVertexOnBack: Chart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index - 1, polyPoints.length)];
                const nextVertexOnBack: Chart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index + 1, polyPoints.length)];

                if (previousVertexOnBack.result !== 'OnBack' && !previousVertexOnBack.alreadyCutFront) {
                    currentVertex = previousVertexOnBack;
                } else if (nextVertexOnBack.result !== 'OnBack' && !nextVertexOnBack.alreadyCutFront) {
                    currentVertex = nextVertexOnBack;
                } else {
                    return points;
                }
            }
        } return null;
    }

    /**
     * Cuts out the back part of a polygon based on the PolyAttributes.
     *
     * @param {Chart3DPolyAttributes[]} polyPoints - The PolyAttributes array of the polygon.
     * @param {Chart3DPolyAttributes} initialVertex - The PolyAttributes representing the cutting point.
     * @returns {Chart3DVector[]} - The resulting points of the back part.
     */
    private cutOutBackPolygon(polyPoints: Chart3DPolyAttributes[], initialVertex: Chart3DPolyAttributes): Chart3DVector[] {
        const points: Chart3DVector[] = [];
        let currentVertex: Chart3DPolyAttributes = initialVertex;
        const isVector: boolean = true;
        while (isVector) {
            currentVertex.alreadyCutBack = true;
            points.push(currentVertex.vector);

            const currentVertexPair: Chart3DPolyAttributes = polyPoints[currentVertex.alterCuttingBackPairIndex];

            if (currentVertex.cuttingBackPoint) {
                if (!currentVertexPair.alreadyCutBack) {
                    currentVertex = currentVertexPair;
                } else {
                    const previousVertexOnBack: Chart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index - 1,
                                                                                                polyPoints.length)];
                    const nextVertexOnBack: Chart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index + 1, polyPoints.length)];

                    if (previousVertexOnBack.result === 'OnBack' && !previousVertexOnBack.alreadyCutBack) {
                        currentVertex = previousVertexOnBack;
                    } else if (nextVertexOnBack.result === 'OnBack' && !nextVertexOnBack.alreadyCutBack) {
                        currentVertex = nextVertexOnBack;
                    } else {
                        return points;
                    }
                }
            } else {
                const previousVertexOnBack: Chart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index - 1, polyPoints.length)];
                const nextVertexOnBack: Chart3DPolyAttributes = polyPoints[this.getNext(currentVertex.index + 1, polyPoints.length)];

                if (previousVertexOnBack.result !== 'OnFront' && !previousVertexOnBack.alreadyCutBack) {
                    currentVertex = previousVertexOnBack;
                } else if (nextVertexOnBack.result !== 'OnFront' && !nextVertexOnBack.alreadyCutBack) {
                    currentVertex = nextVertexOnBack;
                } else {
                    return points;
                }
            }
        } return null;
    }

    /**
     * Builds a Binary Space Partitioning from a list of polygons.
     *
     * @param {Chart3DPolygon[]} [points] - The list of polygons to build the tree from.
     * @returns {Chart3DBspNode} - The root node of the Binary Space Partitioning tree.
     */
    public build(points?: Chart3DPolygon[]): Chart3DBspNode {
        if (!points) {
            return this.build(this.chart.polygons);
        } else {
            const inputPolygons: Chart3DPolygon[] = points;
            if (inputPolygons.length < 1) {
                return null;
            }
            const bspNode: Chart3DBspNode = { back: null, front: null, plane: null };
            const plane: Chart3DPolygon = inputPolygons[0];
            bspNode.plane = plane;
            const polygonsToLeft: Chart3DPolygon[] = [];
            const polygonsToRight: Chart3DPolygon[] = [];

            for (let i: number = 1, len: number = inputPolygons.length; i < len; i++) {
                const currentPolygon: Chart3DPolygon = inputPolygons[i as number];

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
                    if (currentPolygon.element && (currentPolygon.element.tag === 'line' || currentPolygon.element.tag === 'text')) {
                        polygonsToLeft.push(currentPolygon);
                    } else {
                        const result: Chart3DPolyCollections = this.splitPolygon(currentPolygon, plane);
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
 * The Svg3DRenderer class provides methods for rendering SVG graphics in a 3D context.
 */
export class Svg3DRenderer {
    /**
     * Gets a Chart3DStringBuilder instance for constructing strings.
     *
     * @returns {Chart3DStringBuilder} - The StringBuilder instance.
     */
    public getStringBuilder(): Chart3DStringBuilder {
        const data: string[] = [];
        let counter: number = 0;

        return {
            append: function (text: string): Chart3DStringBuilder{
                data[counter++] = text;
                return this;
            },

            remove: function (i: number, j?: number): Chart3DStringBuilder {
                data.splice(i, j || 1);
                return this;
            },

            insert: function (i: number, text: string): Chart3DStringBuilder {
                data.splice(i, 0, text);
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
     * @returns {Chart3DColorFormat | null} - The parsed color format (Red green Blue) or null if parsing fails.
     */
    public hexToValue(hexColorCode: string): Chart3DColorFormat | null {
        let result: RegExpExecArray | null;
        let values: string[];
        if (hexColorCode.indexOf('rgba(') === 0) {
            values = hexColorCode.slice(5, -1).split(',');
            return values ? {
                red: parseInt(values[0], 10),
                green: parseInt(values[1], 10),
                blue: parseInt(values[2], 10),
                alpha: parseFloat(values[3])
            } : null;
        } else if (hexColorCode.indexOf('rgb(') === 0) {
            values = hexColorCode.slice(4, -1).split(',');
            return values ? {
                red: parseInt(values[0], 10),
                green: parseInt(values[1], 10),
                blue: parseInt(values[2], 10)
            } : null;
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
     * Converts a Chart3DColorFormat object to its corresponding color string.
     *
     * @param {Chart3DColorFormat} color - The color in Chart3DColorFormat.
     * @returns {string} - The color string representation.
     */
    public hexColor(color: Chart3DColorFormat): string {
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
        if (color.indexOf('rgba(') === 0 || color.indexOf('rgb(') === 0) {
            const rgbaValues: string[] = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',');
            if (rgbaValues.length === 3 || rgbaValues.length === 4) {
                return rgbaValues.every((val: string) => {
                    const num: number = parseFloat(val);
                    return !isNaN(num) && num >= 0 && num <= 255;
                });
            }
        } else if (color.indexOf('#') === 0) {
            const hex: string = color.substring(1);
            return (hex.length === 3 || hex.length === 6) && /^[0-9A-Fa-f]{3,6}$/.test(hex);
        }
        return false;
    }

    /**
     * Draws text on an SVG element.
     *
     * @param {any} options - The options for drawing the text.
     * @param {string | string[]} label - The text label.
     * @param {FontModel} font - The font settings for the text.
     * @param {Chart3D} chart - The 3D chart instance.
     * @returns {Element} - The created SVG text element.
     */
    public drawText(options: Chart3DTextOption | SVGCanvasAttributes, label: string | string[], font: FontModel, chart: Chart3D): Element {
        let text: Element = document.getElementById(options.id);
        if (text === null) {
            text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        }
        if (label.length > 1 && typeof label !== 'string') {
            let dy: number = 0;
            for (let i: number = 0; i < label.length; i++) {
                const tspanElement: Element = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                tspanElement.textContent = label[i as number];
                tspanElement.setAttribute('x', String(options.x));
                tspanElement.setAttribute('dy', String(dy));
                text.appendChild(tspanElement);
                dy = measureText(label[i as number], font, chart.themeStyle.axisLabelFont).height;
            }
        } else {
            text.textContent = label as string;
        }
        text = chart.svgRenderer.setElementAttributes(options as SVGCanvasAttributes, text);
        return text;
    }

    /**
     * Transforms 3D coordinates to visible 2D coordinates on the chart.
     *
     * @param {Chart3DSeries} currentSeries - The current 3D series.
     * @param {number} x - The x-coordinate in 3D space.
     * @param {number} y - The y-coordinate in 3D space.
     * @param {Chart3D} chart - The 3D chart instance.
     * @returns {Chart3DLocation} - The transformed 2D coordinates.
     */
    public transform3DToVisible(currentSeries: Chart3DSeries, x: number, y: number, chart: Chart3D): Chart3DLocation {
        if (currentSeries.xAxis != null && currentSeries.yAxis != null) {
            const valueType: string = currentSeries.xAxis.valueType;
            const xlogarithmicBase: number = 10; // Replace with the actual logarithmic base if needed
            const xIsLogarithmic: boolean = valueType === 'Logarithmic';
            // Apply logarithmic transformation if necessary
            if (xIsLogarithmic && x > 0) {
                x = Math.log(x) / Math.log(xlogarithmicBase);
            }

            const ylogarithmicBase: number = currentSeries.yAxis.logBase;
            const yIsLogarithmic: boolean = currentSeries.yAxis.valueType === 'Logarithmic';
            // Apply logarithmic transformation if necessary
            if (yIsLogarithmic && y > 0) {
                y = Math.log(y) / Math.log(ylogarithmicBase);
            }

            // Adjust the coordinates based on inverted axes
            if (chart.requireInvertedAxis) {
                const left: number = chart.chartAxisLayoutPanel.seriesClipRect.x;
                const top: number = chart.chartAxisLayoutPanel.seriesClipRect.y;
                const pointX: number = left + currentSeries.yAxis.rect.width * valueToCoefficients(y, currentSeries.yAxis);
                const pointY: number = top + currentSeries.xAxis.rect.height * (1 - valueToCoefficients(x, currentSeries.xAxis));
                return { x: pointX, y: pointY };
            } else {
                const left: number = currentSeries.xAxis.rect.x;
                const top: number = currentSeries.yAxis.rect.y;
                const newX: number = left + Math.round(currentSeries.xAxis.rect.width * valueToCoefficients(x, currentSeries.xAxis));
                const newY: number = top + Math.round(currentSeries.yAxis.rect.height * (1 - valueToCoefficients(y, currentSeries.yAxis)));
                return { x: newX, y: newY };
            }
        }
        // Return a default Point if xAxis and yAxis are null
        return { x: 0, y: 0 };
    }
}

/**
 * Represents a 3D polygon in a chart.
 *
 */
export class Polygon3D {
    /** A small constant used for numerical comparisons. */
    private epsilon: number = 0.00001;
    /** A small constant used for numerical comparisons. */
    private normal: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };
    /** A small constant used for numerical comparisons. */
    private vector: Vector3D = new Vector3D(0, 0, 0);
    /** A small constant used for numerical comparisons. */
    private vectorPoints: Chart3DVector[] = [];
    /** A small constant used for numerical comparisons. */
    private d: number;
    /** A small constant used for numerical comparisons. */
    private matrixObj: Matrix3D = new Matrix3D();
    /** A small constant used for numerical comparisons. */
    private tabIndex: boolean = true;

    /**
     * Creates a 3D polygon.
     *
     * @param {Chart3DVector[]} [points] - An array of 3D vectors representing points on the polygon.
     * @param {any} [tag] - Additional information or metadata for the polygon.
     * @param {number} [index] - An index associated with the polygon.
     * @param {string} [stroke] - The stroke color of the polygon.
     * @param {number} [strokeThickness] - The thickness of the polygon's stroke.
     * @param {number} [opacity] - The opacity of the polygon.
     * @param {string} [fill] - The fill color of the polygon.
     * @param {string} [name] - The name or identifier of the polygon.
     * @param {Element} [parent] - The parent element to which the polygon belongs.
     * @param {string} [text] - Additional text associated with the polygon.
     * @returns {Chart3DPolygon} - Returns the created polygon.
     */
    public polygon3D(points?: Chart3DVector[], tag?: any, index?: number, stroke?: string, strokeThickness?: number,
                     opacity?: number, fill?: string, name?: string, parent?: Element, text?: string ): Chart3DPolygon {
        if (arguments.length === 3) {
            this.calculateNormal(points, tag, index);
            return null;
        } else if (arguments.length === 2) {
            //points = arguments[0];
            this.calculateNormal(points[0], points[1], points[2]);
            this.vectorPoints = points;
            this.calculateNormal(this.vectorPoints);
            const polygon: Chart3DPolygon = tag;
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
            const polygon: Chart3DPolygon = {
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
     * Creates a 3D line.
     *
     * @param {Chart3DTickElement} line - The tick elements associated with the line.
     * @param {number} x1 - The x-coordinate of the starting point.
     * @param {number} y1 - The y-coordinate of the starting point.
     * @param {number} x2 - The x-coordinate of the ending point.
     * @param {number} y2 - The y-coordinate of the ending point.
     * @param {number} depth - The depth or z-coordinate of the line in 3D space.
     * @returns {Chart3DPolygon} - Returns the created 3D line as a polygon.
     */
    public createLine(line: Chart3DTickElement, x1: number, y1: number, x2: number, y2: number, depth: number): Chart3DPolygon {
        const strokeThickness: number = line.width;
        const vectorCollection: Chart3DVector[] = [];
        vectorCollection[0] = this.vector.vector3D(x1, y1, depth);
        vectorCollection[1] = this.vector.vector3D(x1 + strokeThickness, y2 + strokeThickness, depth);
        vectorCollection[2] = this.vector.vector3D(x2, y2, depth);
        return this.line3D(line, vectorCollection);
    }

    /**
     *  Creates a 3D line polygon based on the given tick elements and points.
     *
     * @param {Chart3DTickElement} element - The tick elements associated with the line.
     * @param {Chart3DVector[]} points - The array of 3D vector points defining the line in 3D space.
     * @returns {Chart3DPolygon} - Returns the created 3D line polygon.
     */
    public line3D(element: Chart3DTickElement, points: Chart3DVector[]): Chart3DPolygon  {
        const plane: Chart3DPolygon = this.polygon3D(points);
        plane.element = element;
        return plane;
    }

    /**
     * Creates a 3D text polygon based on the given label element and points.
     *
     * @param {Chart3DLabelElement} element - The label element associated with the text.
     * @param {Chart3DVector[]} points - The array of 3D vector points defining the position of the text in 3D space.
     * @returns {Chart3DPolygon} - Returns the created 3D text polygon.
     */
    public text3D(element: Chart3DLabelElement, points: Chart3DVector[]): Chart3DPolygon {
        const plane: Chart3DPolygon = this.polygon3D(points);
        plane.element = element;
        return plane;
    }

    /**
     * Creates a 3D cylinder based on the given vectors, chart, and styling parameters.
     *
     * @param {Chart3DVector} v1 - The start vector of the cylinder.
     * @param {Chart3DVector} v2 - The end vector of the cylinder.
     * @param {Chart3D} chart - The 3D chart to which the cylinder belongs.
     * @param {number} index - The index of the cylinder.
     * @param {string} type - The type of the cylinder.
     * @param {string} stroke - The stroke color of the cylinder.
     * @param {string} fill - The fill color of the cylinder.
     * @param {number} strokeThickness - The thickness of the stroke.
     * @param {number} opacity - The opacity of the cylinder.
     * @param {string} name - The name of the cylinder.
     * @param {Element} parent - The parent element of the cylinder.
     * @returns {Chart3DPolygon[]} - Returns an array of polygons representing the 3D cylinder.
     */
    public createCylinder(
        v1: Chart3DVector, //top left front vecotr.
        v2: Chart3DVector, // bottom right back vector.
        chart: Chart3D,
        index: number,
        type: string,
        stroke: string,
        fill: string,
        strokeThickness: number,
        opacity: number,
        name: string,
        parent: Element
    ): Chart3DPolygon[] {
        let i: number = 0; //cylinder path count.
        let offsetX: number;
        let offsetY: number;
        let offsetZ: number;
        let vectorCollection: Chart3DVector[];
        let pathCount: number = 24;
        const theta: number = 360 / pathCount;
        const degreeToRadian: number = Math.PI / 180;
        const centerZ: number = (v1.z + v2.z) / 2;
        const result: Chart3DPolygon[] = [];
        const outPoints: { Y: number; Z: number }[] = [];
        const topVector: Chart3DVector[] = [];
        const bottomVector: Chart3DVector[] = [];
        const radiusB: number = (v2.y - v1.y) < (v2.z - v1.z) ? (v2.y - v1.y) / 2 : (v2.z - v1.z) / 2;
        const radiusC: number = (v2.x - v1.x) < (v2.z - v1.z) ? (v2.x - v1.x) / 2 : (v2.z - v1.z) / 2;
        const centerX: number = (v1.x + v2.x) / 2;
        const centerY: number = (v1.y + v2.y) / 2;
        switch (type) {
        case 'Bar':
        case 'StackingBar':
        case 'StackingBar100':
            pathCount++;
            while (pathCount--) {
                offsetY = centerY + radiusB * Math.cos((i * theta) * degreeToRadian);
                offsetZ = centerZ + radiusB * Math.sin((i * theta) * degreeToRadian);
                outPoints[i as number] = { Y: offsetY, Z: offsetZ };
                topVector.push(this.vector.vector3D(v1.x, outPoints[i as number].Y, outPoints[i as number].Z));
                bottomVector.push(this.vector.vector3D(v2.x, outPoints[i as number].Y, outPoints[i as number].Z));
                if (i > 0) {
                    vectorCollection = [
                        this.vector.vector3D(v1.x, outPoints[i - 1].Y, outPoints[i - 1].Z),
                        this.vector.vector3D(v2.x, outPoints[i - 1].Y, outPoints[i - 1].Z),
                        this.vector.vector3D(v2.x, outPoints[i as number].Y, outPoints[i as number].Z),
                        this.vector.vector3D(v1.x, outPoints[i as number].Y, outPoints[i as number].Z)
                    ];
                    result[i + 1] = this.polygon3D(vectorCollection, chart, index, fill, 0, opacity, fill, ('-' + (i + 1).toString() + '-' + name), parent);
                    graphics.addVisual(result[i + 1], chart);
                }
                i++;
            }
            break;
        case 'Column':
        case 'StackingColumn':
        case 'StackingColumn100':
            pathCount++;
            while (pathCount--) {
                offsetX = centerX + radiusC * Math.cos((i * theta) * degreeToRadian);
                offsetZ = centerZ + radiusC * Math.sin((i * theta) * degreeToRadian);
                outPoints[i as number] = { Y: offsetX, Z: offsetZ };
                topVector.push(this.vector.vector3D(outPoints[i as number].Y, v1.y, outPoints[i as number].Z));
                bottomVector.push(this.vector.vector3D(outPoints[i as number].Y, v2.y, outPoints[i as number].Z));
                if (i > 0) {
                    vectorCollection = [
                        this.vector.vector3D(outPoints[i - 1].Y, v1.y, outPoints[i - 1].Z),
                        this.vector.vector3D(outPoints[i - 1].Y, v2.y, outPoints[i - 1].Z),
                        this.vector.vector3D(outPoints[i as number].Y, v2.y, outPoints[i as number].Z),
                        this.vector.vector3D(outPoints[i as number].Y, v1.y, outPoints[i as number].Z)
                    ];
                    result[i + 1] = this.polygon3D(vectorCollection, chart, index, fill, 0, opacity, fill, '-' + (i + 1).toString() + '-' + name, parent);
                    graphics.addVisual(result[i + 1], chart);
                }
                i++;
            }
            break;
        }

        result[0] = this.polygon3D(bottomVector, chart, index, stroke, 0, opacity, fill, '-0-' + name, parent);
        result[1] = this.polygon3D(topVector, chart, index, stroke, strokeThickness, opacity, fill, '-1-' + name, parent);
        graphics.addVisual(result[0], chart);
        graphics.addVisual(result[1], chart);
        return result;
    }

    /**
     * Creates a 3D box based on the given vectors, chart, and styling parameters.
     *
     * @param {Chart3DVector} v1 - The start vector of the box.
     * @param {Chart3DVector} v2 - The end vector of the box.
     * @param {Chart3D} chart - The 3D chart to which the box belongs.
     * @param {number} index - The index of the box.
     * @param {string} stroke - The stroke color of the box.
     * @param {string} fill - The fill color of the box.
     * @param {number} strokeThickness - The thickness of the stroke.
     * @param {number} opacity - The opacity of the box.
     * @param {boolean} inverse - A boolean indicating whether to inverse the box.
     * @param {string} name - The name of the box.
     * @param {Element} parent - The parent element of the box.
     * @param {string} [text] - Optional text associated with the box.
     * @returns {Chart3DPolygon[]} - Returns an array of polygons representing the 3D box.
     *
     */
    public createBox(
        v1: Chart3DVector, //top left front vecotr.
        v2: Chart3DVector, // bottom right back vector.
        chart: Chart3D,
        index: number,
        stroke: string,
        fill: string,
        strokeThickness: number,
        opacity: number,
        inverse: boolean,
        name: string,
        parent: Element,
        text?: string
    ): Chart3DPolygon[] {
        const result: Chart3DPolygon[] = [];

        const point1: Chart3DVector[] = [
            this.vector.vector3D(v1.x, v1.y, v1.z),
            this.vector.vector3D(v2.x, v1.y, v1.z),
            this.vector.vector3D(v2.x, v2.y, v1.z),
            this.vector.vector3D(v1.x, v2.y, v1.z)
        ];

        const point2: Chart3DVector[] = [
            this.vector.vector3D(v1.x, v1.y, v2.z),
            this.vector.vector3D(v2.x, v1.y, v2.z),
            this.vector.vector3D(v2.x, v2.y, v2.z),
            this.vector.vector3D(v1.x, v2.y, v2.z)
        ];

        const point3: Chart3DVector[]  = [
            this.vector.vector3D(v1.x, v1.y, v2.z),
            this.vector.vector3D(v2.x, v1.y, v2.z),
            this.vector.vector3D(v2.x, v1.y, v1.z),
            this.vector.vector3D(v1.x, v1.y, v1.z)
        ];

        const point4: Chart3DVector[]  = [
            this.vector.vector3D(v1.x, v2.y, v2.z),
            this.vector.vector3D(v2.x, v2.y, v2.z),
            this.vector.vector3D(v2.x, v2.y, v1.z),
            this.vector.vector3D(v1.x, v2.y, v1.z)
        ];

        const point5: Chart3DVector[]  = [
            this.vector.vector3D(v1.x, v1.y, v1.z),
            this.vector.vector3D(v1.x, v1.y, v2.z),
            this.vector.vector3D(v1.x, v2.y, v2.z),
            this.vector.vector3D(v1.x, v2.y, v1.z)
        ];

        const point6: Chart3DVector[]  = [
            this.vector.vector3D(v2.x, v1.y, v1.z),
            this.vector.vector3D(v2.x, v1.y, v2.z),
            this.vector.vector3D(v2.x, v2.y, v2.z),
            this.vector.vector3D(v2.x, v2.y, v1.z)
        ];

        if (name) {
            result[0] = this.polygon3D(point1, chart, index, stroke, strokeThickness, opacity, fill, '-0-' + name, parent, text);
            result[1] = this.polygon3D(point2, chart, index, stroke, strokeThickness, opacity, fill, '-1-' + name, parent, text);
            result[2] = this.polygon3D(point3, chart, index, stroke, strokeThickness, opacity, fill, '-2-' + name, parent, text);
            result[3] = this.polygon3D(point4, chart, index, stroke, strokeThickness, opacity, fill, '-3-' + name, parent, text);
            result[4] = this.polygon3D(point5, chart, index, stroke, strokeThickness, opacity, fill, '-4-' + name, parent, text);
            result[5] = this.polygon3D(point6, chart, index, stroke, strokeThickness, opacity, fill, '-5-' + name, parent, text);
        } else {
            result[0] = this.polygon3D(point1, chart, index, stroke, strokeThickness, opacity, fill, '-0-' + index, parent, text);
            result[1] = this.polygon3D(point2, chart, index, stroke, strokeThickness, opacity, fill, '-1-' + index, parent, text);
            result[2] = this.polygon3D(point3, chart, index, stroke, strokeThickness, opacity, fill, '-2-' + index, parent, text);
            result[3] = this.polygon3D(point4, chart, index, stroke, strokeThickness, opacity, fill, '-3-' + index, parent, text);
            result[4] = this.polygon3D(point5, chart, index, stroke, strokeThickness, opacity, fill, '-4-' + index, parent, text);
            result[5] = this.polygon3D(point6, chart, index, stroke, strokeThickness, opacity, fill, '-5-' + index, parent, text);
        }

        if (inverse) {
            graphics.addVisual(result[0], chart);
            graphics.addVisual(result[1], chart);
            graphics.addVisual(result[2], chart);
            graphics.addVisual(result[3], chart);
            graphics.addVisual(result[4], chart);
            graphics.addVisual(result[5], chart);
        } else {
            graphics.addVisual(result[5], chart);
            graphics.addVisual(result[4], chart);
            graphics.addVisual(result[0], chart);
            graphics.addVisual(result[1], chart);
            graphics.addVisual(result[2], chart);
            graphics.addVisual(result[3], chart);
        }

        return result;
    }

    /**
     * Calculates the normal vector for a 3D polygon based on the provided points.
     *
     * @param {...Chart3DVector} args - Variable number of vector3d arguments representing points of the polygon.
     * @returns {void}
     */
    public calculateNormal(...args: any[]): void {
        if (args.length >= 3) {
            // Relative information of the points
            const vector1: Chart3DVector = args[0];
            const vector2: Chart3DVector = args[1];
            const vector3: Chart3DVector = args[2];
            const vector4: Chart3DVector = this.vector.vector3DMinus(vector1, vector2);
            const vector5: Chart3DVector = this.vector.vector3DMinus(vector3, vector2);
            const normal: Chart3DVector = this.vector.vector3DMultiply(vector4, vector5);

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
            const Points: Chart3DVector[] = args[0];
            this.calculateNormal(Points[0], Points[1], Points[2], args[1]);
            for (let i: number = 3; (i < Points.length) && (this.test()); i++) {
                this.calculateNormal(Points[i as number], Points[0], Points[i / 2]);
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
     * Transforms the vector points of the specified polygon using the provided matrix.
     *
     * @param {number[][]} matrix - The transformation matrix.
     * @param {Chart3DPolygon} polygon - The polygon to transform.
     * @returns {void}
     */

    public transform(matrix: number[][], polygon: Chart3DPolygon): void {
        if (polygon.points != null) {
            for (let i: number = 0; i < polygon.points.length; i++) {
                polygon.vectorPoints[i as number] = polygon.points[i as number] =
                    matrixObj.getMatrixVectorMultiple(matrix, polygon.points[i as number]);
            }
            this.calculateNormal(polygon.vectorPoints, polygon);
        }
    }

    /**
     *  Gets the normal vector based on the transformed points using the specified transformation matrix.
     *
     * @param {number[][]} transform - The transformation matrix.
     * @param {Chart3DVector[]} [vectorPoints] - The vector points.
     * @returns {Chart3DVector} - Returns the normal vector.
     * @private
     */

    public getNormal(transform: number[][], vectorPoints?: Chart3DVector[]): Chart3DVector {
        let normal: Chart3DVector;
        if (vectorPoints != null) {
            normal = this.vector.getNormal(this.matrixObj.getMatrixVectorMultiple(transform, vectorPoints[0]),
                                           matrixObj.getMatrixVectorMultiple(transform, vectorPoints[1]),
                                           this.matrixObj.getMatrixVectorMultiple(transform, vectorPoints[2]));
            for (let i: number = 3; (i < vectorPoints.length) && !this.vector.isValid(normal) && vectorPoints[i / 2]; i++) {
                const v1: Chart3DVector = matrixObj.getMatrixVectorMultiple(transform, vectorPoints[i as number]);
                const v2: Chart3DVector = matrixObj.getMatrixVectorMultiple(transform, vectorPoints[0]);
                const v3: Chart3DVector = matrixObj.getMatrixVectorMultiple(transform, vectorPoints[i / 2]);
                normal = this.vector.getNormal(v1, v2, v3);
            }
        }
        else {
            normal = matrixObj.getMatrixVectorAnd(transform);
            this.vector.normalize();
        }
        return normal;
    }

    /**
     * A method for creating text element.
     *
     * @param {Chart3DVector} position - text position.
     * @param {Chart3DLabelElement} element - text element.
     * @param {number} xLength - text element x value.
     * @param {number} yLength - text element y value.
     * @returns {Chart3DPolygon} - Returns the polygon.
     */
    public createTextElement(position: Chart3DVector, element: Chart3DLabelElement, xLength: number, yLength: number): Chart3DPolygon {
        const vectorCollection: Chart3DVector[] = [];
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
     * Draws a template on the specified 3D chart panel.
     *
     * @param {Chart3DPolygon} panel - The 3D polygon representing the panel on which the template will be drawn.
     * @param {Chart3D} chart - The 3D chart to which the panel belongs.
     * @returns {void}
     */
    public drawLine(panel: Chart3DPolygon, chart: Chart3D): void {
        const transform: Chart3DBasicTransform = chart3DRender.transform;
        if (transform == null) {
            return;
        }
        const actual3DPosition1: Chart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[0], transform);
        const actual3DPosition2: Chart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[2], transform);
        const optionsLine: Chart3DLineAttributes = {
            'id': panel.element.id,
            'x1': actual3DPosition1.x,
            'y1': actual3DPosition1.y,
            'x2': actual3DPosition2.x,
            'y2': actual3DPosition2.y,
            'stroke-dasharray': '',
            'stroke-width': (panel.element as Chart3DTickElement).width,
            'stroke': (panel.element as Chart3DTickElement).stroke,
            'opacity': (panel.element as Chart3DTickElement).opacity
        };
        chart.chart3D.appendChild(chart.svgRenderer.drawLine(optionsLine));
        if (chart.previousID && chart.isTouch) {
            const previousElement: HTMLElement = document.getElementById(chart.previousID);
            const currentElement: HTMLElement = document.getElementById(optionsLine.id);

            if (previousElement && currentElement) {
                currentElement.parentNode.insertBefore(currentElement, previousElement.nextSibling);
            }
        }
        chart.previousID = optionsLine.id;
    }

    /**
     * Draws text on the specified 3D chart panel.
     *
     * @param {Chart3DPolygon} panel - The 3D polygon representing the panel on which the text will be drawn.
     * @param {Chart3D} chart - The 3D chart to which the panel belongs.
     * @returns {void}
     */
    public drawTemplate(panel: Chart3DPolygon, chart: Chart3D): void {
        const element: Chart3DLabelElement = panel.element;
        const transform: Chart3DBasicTransform = chart3DRender.transform;
        if (transform == null) {
            return;
        }
        const label: Chart3DDataElement = element.label as Chart3DDataElement;
        const actual3DPosition: Chart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[0], transform);
        chart.dataLabel3DModule.createDataLabelTemplate(label.series.dataLabelElement, label.series, label.series.dataLabel,
                                                        label.series.visiblePoints[label.pointIndex], element.argsData,
                                                        label.pointIndex, false, actual3DPosition);
    }

    /**
     * Draws a data label symbol for a specific data point in a three-dimensional series.
     *
     * @param {Chart3DPolygon} panel - The 3D polygon representing the panel on which the text will be drawn.
     * @param {Chart3D} chart - The 3D chart to which the panel belongs.
     * @returns {void}
     */
    public drawText(panel: Chart3DPolygon, chart : Chart3D): void {
        const element: Chart3DLabelElement = panel.element as Chart3DLabelElement;
        const transform: Chart3DBasicTransform = chart3DRender.transform;
        if (transform == null) {
            return;
        }
        const actual3DPosition: Chart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[0], transform);
        const x: number = actual3DPosition.x;
        const y: number = actual3DPosition.y;
        if (element.tag === 'text') {
            const options: Chart3DTextOption = {
                'id': element.id,
                'x': x,
                'y': y,
                'fill': element.font.color || element.fill,
                'font-size': element.font.size,
                'font-family': element.font.fontFamily,
                'font-style': element.font.fontStyle,
                'font-weight': element.font.fontWeight,
                'opacity': element.font.opacity,
                'text-anchor': element.textAnchor,
                'cursor': 'default',
                'transform': element.angle ? 'rotate(' + element.angle + ',' + (x) + ',' + y + ')' : ''
            };
            const textElement: Element = chart.svg3DRenderer.drawText(
                options, element.label.text, panel.element.font, chart);
            if (element.id.indexOf('-axis-title') > -1) {
                textElement.setAttribute('aria-hidden', 'true');
            }
            chart.chart3D.append(textElement);
        }
        else {
            const series: Chart3DSeries = element.series;
            const labelFormat: string = (series.yAxis && series.yAxis.labelFormat) ? series.yAxis.labelFormat : '';
            const pointText: string = (element.point.text) ? element.point.text : element.point.y + labelFormat.substring(labelFormat.indexOf('}') + 1);
            const textOffset: Size = measureText(pointText, series.dataLabel.font, chart.themeStyle.datalabelFont);
            const margin: MarginModel = series.dataLabel.margin;
            const width: number = textOffset.width + margin.left + margin.right;
            const height: number = textOffset.height + margin.top + margin.bottom;
            const location: Chart3DLocation = { x: actual3DPosition.x, y: actual3DPosition.y };
            const xXalue: number = location.x - (margin.left) / 2 + (margin.right) / 2;
            const yValue: number = location.y - (margin.top) / 2 - (height / margin.top) + (margin.bottom) / 2;
            const seriesIndex: number = series.index;
            this.dataLabelSymbol(seriesIndex, series, element.pointIndex, xXalue, yValue, width, height, chart);
        }
    }

    /**
     * Draws a data label symbol for a specific data point in a three-dimensional series.
     *
     * @param {number} seriesIndex - The index of the series to which the data point belongs.
     * @param {Chart3DSeries} series - The three-dimensional series containing the data point.
     * @param {number} pointIndex - The index of the data point within the series.
     * @param {number} x - The x-coordinate of the center of the symbol.
     * @param {number} y - The y-coordinate of the center of the symbol.
     * @param {number} width - The width of the symbol.
     * @param {number} height - The height of the symbol.
     * @param {Chart3D} chart - The three-dimensional chart containing the series.
     * @returns {void}
     */
    private dataLabelSymbol(seriesIndex: number, series: Chart3DSeries, pointIndex: number, x: number,
                            y: number, width: number, height: number, chart: Chart3D): void {
        const path: string = 'M' + ' ' + (x + (-width / 2)) + ' ' +
            (y + (-height / 2)) + ' ' + 'L' + ' ' + (x + (width / 2)) +
            ' ' + (y + (-height / 2)) + ' ' + 'L' + ' ' + (x + (width / 2)) +
            ' ' + (y + (height / 2)) + ' ' + 'L' + ' ' + (x + (-width / 2)) +
            ' ' + (y + (height / 2)) + ' ' + 'L' + ' ' + (x + (-width / 2)) +
            ' ' + (y + (-height / 2)) + ' z';

        const Rectoptions: PathAttributes = {
            id: chart.element.id + '-svg' + '-data-label-series-' + seriesIndex + '-point-' + pointIndex,
            fill: series.dataLabel.fill,
            'stroke-width': series.dataLabel.border.width,
            'stroke-dasharray': series.dataLabel.border.dashArray,
            stroke: series.dataLabel.border.color,
            opacity: series.dataLabel.opacity,
            visibility: '',
            d: path
        };
        const element: Element = chart.svgRenderer.drawPath(Rectoptions);
        chart.chart3D.append(element);
    }

    /**
     * Draws a three-dimensional polygon on the specified chart.
     *
     * @param {Chart3DPolygon} panel - The polygon to be drawn.
     * @param {Chart3D} chart - The three-dimensional chart on which the polygon is to be drawn.
     * @returns {void}
     */
    public draw(panel: Chart3DPolygon, chart: Chart3D): void {
        if (panel.vectorPoints == null || panel.vectorPoints.length <= 0) {
            return;
        }
        const transform: Chart3DBasicTransform = chart3DRender.transform;
        const pathDirection: Chart3DStringBuilder = chart.svg3DRenderer.getStringBuilder();
        let color: string = panel.fill;
        const format: boolean = chart.svg3DRenderer.checkColorFormat(color);
        if (!format) {
            if (color !== 'transparent') {
                color = colorNameToHex(color);
            }
        }
        const figure: { StartPoint: Chart3DLocation } = { StartPoint: null };
        if (transform != null) {
            figure.StartPoint = chart.transform3D.toScreen(panel.vectorPoints[0], transform);
            pathDirection.append('M' + ' ' + (figure.StartPoint.x) + ' ' + (figure.StartPoint.y) + ' ');
            for (let i: number = 0; i < panel.vectorPoints.length; i++) {
                const lineSegment: Chart3DLocation = chart.transform3D.toScreen(panel.vectorPoints[i as number], transform);
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
        const options: Chart3DPathOptions  = {
            'id': chart.element.id + '-svg' + panel.name,
            'name': name,
            'fill': color,
            'stroke': '',
            'stroke-width': panel.strokeThickness,
            'opacity': panel.opacity,
            'd': direction
        };
        const element: Element = chart.svgRenderer.drawPath(options);
        if (panel.text) {
            element.setAttribute('aria-label', panel.text);
            element.setAttribute('role', 'img');
        }
        if (panel.name && panel.name.indexOf('-wall-brush') > -1) {
            element.setAttribute('aria-hidden', 'true');
        }
        if (element.id.indexOf('0-region-series-0-point-0') > -1) {
            if (this.tabIndex) {
                element.setAttribute('tabindex', '0');
            } else {
                const elements: NodeListOf<Element> = panel.polygonElement.parent.querySelectorAll('[id*="0-region-series-0-point-0"]');
                if (elements.length > 0) {
                    elements[elements.length - 1].removeAttribute('tabindex');
                }
                element.setAttribute('tabindex', '0');
            }
            this.tabIndex = false;
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
     * Applies a lightening effect to the given color by reducing its red, green and blue components.
     *
     * @param {string} color - The input color in hexadecimal format.
     * @param {Chart3D} chart - The three-dimensional chart associated with the color.
     * @returns {string} - The lightened color in hexadecimal format.
     */
    public applyXLight(color: string, chart: Chart3D): string {
        const RGB: Chart3DColorFormat = chart.svg3DRenderer.hexToValue(color);
        RGB.red = parseInt((RGB.red * 0.7).toString(), 10);
        RGB.green = parseInt((RGB.green * 0.7).toString(), 10);
        RGB.blue = parseInt((RGB.blue * 0.7).toString(), 10);
        return chart.svg3DRenderer.hexColor(RGB);
    }

    /**
     * Applies a lightening effect to the given color by reducing its red, green and blue components with a focus on the Z-axis.
     *
     * @param {string} color - The input color in hexadecimal format.
     * @param {Chart3D} chart - The three-dimensional chart associated with the color.
     * @returns {string} - The lightened color in hexadecimal format.
     */
    public applyZLight(color: string, chart: Chart3D): string {
        const RGB: Chart3DColorFormat = chart.svg3DRenderer.hexToValue(color);
        RGB.red = parseInt((RGB.red * 0.9).toString(), 10);
        RGB.green = parseInt((RGB.green * 0.9).toString(), 10);
        RGB.blue = parseInt((RGB.blue * 0.9).toString(), 10);
        return chart.svg3DRenderer.hexColor(RGB);
    }
}

const vector: Vector3D = new Vector3D(0, 0, 0);
const matrixObj: Matrix3D = new Matrix3D();
const bspTreeObj: BinaryTreeBuilder = new BinaryTreeBuilder();
const polygonObj: Polygon3D = new Polygon3D();
const graphics: Graphics3D = new Graphics3D();

/**
 * Gets the minimum delta value between adjacent data points on a given axis in a three-dimensional chart.
 *
 * @param {Chart3DAxis} axis - The three-dimensional axis for which the delta value is calculated.
 * @param {Chart3DSeries[]} seriesCollection - Collection of three-dimensional series in the chart.
 * @returns {number} - The minimum delta value between adjacent data points on the specified axis.
 */
export function getMinPointsDeltaValue(axis: Chart3DAxis, seriesCollection: Chart3DSeries[]): number {
    let minDelta: number = Number.MAX_VALUE;
    let xValues: Object[];
    let minVal: number;
    let seriesMin: number;
    for (let index: number = 0; index < seriesCollection.length; index++) {
        const series: Chart3DSeries = seriesCollection[index as number];
        xValues = [];
        if (series.visible &&
            (axis.name === series.xAxisName || (axis.name === 'primaryXAxis' && series.xAxisName === null))) {
            xValues = series.points.map((point: Chart3DPoint) => {
                return point.xValue;
            });
            xValues.sort((first: Object, second: Object) => { return <number>first - <number>second; });
            if (xValues.length === 1) {
                seriesMin = (axis.valueType === 'DateTime' && series.xMin === series.xMax) ? (series.xMin - 25920000) : series.xMin;
                minVal = <number>xValues[0] - (!isNullOrUndefined(seriesMin) ?
                    seriesMin : axis.visibleRange.min);
                if (minVal !== 0) {
                    minDelta = Math.min(minDelta, minVal);
                }
            } else {
                for (let index: number = 0; index < xValues.length; index++) {
                    const value: Object = xValues[index as number];
                    if (index > 0 && value) {
                        minVal = <number>value - <number>xValues[index - 1];
                        if (minVal !== 0) {
                            minDelta = Math.min(minDelta, minVal);
                        }
                    }
                }
            }
        }
    }
    if (minDelta === Number.MAX_VALUE) {
        minDelta = 1;
    }

    return minDelta;
}
/**
 * Converts a numeric value to a coefficient based on the given 3D axis.
 *
 * @param {number} value - The numeric value to be converted.
 * @param {Chart3DAxis} axis - The 3D axis for reference.
 * @returns {number} - The coefficient value.
 * @private
 */
export function valueToCoefficients(value: number, axis: Chart3DAxis): number {
    const range: VisibleRangeModel = axis.visibleRange;
    const result: number = (value - <number>range.min) / (range.delta);
    const isInverse: boolean = axis.isAxisInverse;
    return isInverse ? (1 - result) : result;
}
