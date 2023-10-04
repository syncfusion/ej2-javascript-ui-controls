/**
 * PdfTransformationMatrix.ts class for EJ2-PDF
 */
import { PointF } from './../drawing/pdf-drawing';
import { PdfNumber } from './../primitives/pdf-number';
/**
 * Class for representing Root `transformation matrix`.
 */
export class PdfTransformationMatrix {
    // Constants
    /**
     * Value for `angle converting`.
     * @default Math.PI / 180.0
     * @private
     */
    private static readonly degRadFactor : number = Math.PI / 180.0;
    /**
     * Value for `angle converting`.
     * @default 180.0 / Math.PI
     * @private
     */
    private readonly radDegFactor : number = 180.0 / Math.PI;
    // Fields
    /**
     * `Transformation matrix`.
     * @private
     */
    private transformationMatrix : Matrix;

    // Properties
    /**
     * Gets or sets the `internal matrix object`.
     * @private
     */
    public get matrix() : Matrix {
        return this.transformationMatrix;
    }
    public set matrix(value : Matrix) {
        this.transformationMatrix = value;
    }
    // Constructors
    /**
     * Initializes object of `PdfTransformationMatrix` class.
     * @private
     */
    public constructor()
    /**
     * Initializes object of `PdfTransformationMatrix` class.
     * @private
     */
    public constructor(value : boolean)
    public constructor(value ? : boolean) {
        if (typeof value === 'undefined') {
            this.transformationMatrix = new Matrix(1.00, 0.00, 0.00, 1.00, 0.00, 0.00);
        } else {
            this.transformationMatrix = new Matrix(1.00, 0.00, 0.00, -1.00, 0.00, 0.00);
        }
    }
    // Public methods
    /**
     * `Translates` coordinates by specified coordinates.
     * @private
     */
    public translate(offsetX : number, offsetY : number) : void {
        this.transformationMatrix.translate(offsetX, offsetY);
    }
    /**
     * `Scales` coordinates by specified coordinates.
     * @private
     */
    public scale(scaleX : number, scaleY : number) : void {
        this.transformationMatrix.elements[0] = scaleX;
        this.transformationMatrix.elements[3] = scaleY;
    }
    /**
     * `Rotates` coordinate system in counterclockwise direction.
     * @private
     */
    public rotate(angle : number) : void {
        //Convert from degree to radian 
        angle = (angle * Math.PI) / 180;
        //Rotation 
        this.transformationMatrix.elements[0] = Math.cos(angle);
        this.transformationMatrix.elements[1] = Math.sin(angle);
        this.transformationMatrix.elements[2] = -Math.sin(angle);
        this.transformationMatrix.elements[3] = Math.cos(angle);
    }
    // Overrides
    /**
     * Gets `PDF representation`.
     * @private
     */
    public toString() : string {
        let builder : string = '';
        let whitespace : string = ' ';
        for (let i : number = 0, len : number = this.transformationMatrix.elements.length; i < len; i++) {
            let temp : number = this.matrix.elements[i];
            builder += PdfNumber.floatToString(this.transformationMatrix.elements[i]);
            builder += whitespace;
        }
        return builder;
    }
    // Implementation
    /**
     * `Multiplies` matrices (changes coordinate system.)
     * @private
     */
    public multiply(matrix : PdfTransformationMatrix) : void {
        this.transformationMatrix.multiply(matrix.matrix);
    }
    /**
     * Converts `degrees to radians`.
     * @private
     */
    public static degreesToRadians(degreesX : number) : number {
        return this.degRadFactor * degreesX;
    }
    /**
     * Converts `radians to degrees`.
     * @private
     */
    public radiansToDegrees(radians : number) : number {
        return this.radDegFactor * radians;
    }
    /**
     * `Clones` this instance of PdfTransformationMatrix.
     * @private
     */
    public clone() : PdfTransformationMatrix {
        return this;
    }
}
export class Matrix {
    //Fields
    /**
     * `elements` in the matrix.
     * @private
     */
    private metrixElements : number[];
    // Constructor
    /**
     * Initializes a new instance of the `Matrix` class.
     * @private
     */
    public constructor()
    /**
     * Initializes a new instance of the `Matrix` class with number array.
     * @private
     */
    public constructor(elements : number[])
    /**
     * Initializes a new instance of the `Matrix` class.
     * @private
     */
    public constructor(m11 : number, m12 : number, m21 : number, m22 : number, dx : number, dy : number)
    public constructor(arg1 ?: number|number[], arg2 ?: number, arg3 ?: number, arg4 ?: number, arg5 ?: number, arg6 ?: number) {
        if (typeof arg1 === 'undefined') {
            this.metrixElements = [];
        } else if (typeof arg1 === 'number') {
            this.metrixElements = [];
            this.metrixElements.push(arg1);
            this.metrixElements.push(arg2);
            this.metrixElements.push(arg3);
            this.metrixElements.push(arg4);
            this.metrixElements.push(arg5);
            this.metrixElements.push(arg6);
        } else {
            this.metrixElements = arg1;
        }
    }
    // Properties
    /**
     * Gets the `elements`.
     * @private
     */
    public get elements() : number[] {
        return this.metrixElements;
    }
    /**
     * Gets the off set `X`.
     * @private
     */
    public get offsetX() : number {
        return this.metrixElements[4];
    }
    /**
     * Gets the off set `Y`.
     * @private
     */
    public get offsetY() : number {
        return this.metrixElements[5];
    }
    // Implementation
    /**
     * `Translates` coordinates by specified coordinates.
     * @private
     */
    public translate(offsetX : number, offsetY : number) : void {
        this.metrixElements[4] = offsetX;
        this.metrixElements[5] = offsetY;
    }
    /**
     * `Translates` the specified offset X.
     * @private
     */
    public transform(point : PointF) : PointF {
        let x : number = point.x;
        let y : number = point.y;
        let x2 : number = x * this.elements[0] + y * this.elements[2] + this.offsetX;
        let y2 : number = x * this.elements[1] + y * this.elements[3] + this.offsetY;
        return new PointF(x2, y2);
    }
    /**
     * `Multiplies matrices` (changes coordinate system.)
     * @private
     */
    public multiply(matrix : Matrix) : void {
        let tempMatrix : number[] = [];
        tempMatrix.push(this.elements[0] * matrix.elements[0] + this.elements[1] * matrix.elements[2]);
        tempMatrix[1] = (this.elements[0] * matrix.elements[1] + this.elements[1] * matrix.elements[3]);
        tempMatrix[2] = (this.elements[2] * matrix.elements[0] + this.elements[3] * matrix.elements[2]);
        tempMatrix[3] = (this.elements[2] * matrix.elements[1] + this.elements[3] * matrix.elements[3]);
        tempMatrix[4] = (this.offsetX * matrix.elements[0] + this.offsetY * matrix.elements[2] + matrix.offsetX);
        tempMatrix[5] = (this.offsetX * matrix.elements[1] + this.offsetY * matrix.elements[3] + matrix.offsetY);
        for (let i : number = 0; i < tempMatrix.length; i++) {
            this.elements[i] = tempMatrix[i];
        }
    }
    // IDisposable Members
    /**
     * `Dispose` this instance of PdfTransformationMatrix class.
     * @private
     */
    public dispose() : void {
        this.metrixElements = null;
    }
    // ICloneable Members
    /**
     * `Clones` this instance of PdfTransformationMatrix class.
     * @private
     */
    public clone() : Object {
        let m : Matrix = new Matrix(this.metrixElements);
        return m;
    }
}