/**
 * Helper class for 2D affine matrix operations.
 *
 * @private
 */
export class _MatrixHelper {
    /**
     * Matrix value m11.
     *
     * @private
     */
    _m11: number;
    /**
     * Matrix value m12.
     *
     * @private
     */
    _m12: number;
    /**
     * Matrix value m21.
     *
     * @private
     */
    _m21: number;
    /**
     * Matrix value m22.
     *
     * @private
     */
    _m22: number;
    /**
     * X translation offset.
     *
     * @private
     */
    _offsetX: number;
    /**
     * Y translation offset.
     *
     * @private
     */
    _offsetY: number;
    /**
     * Cached matrix type classification.
     *
     * @private
     */
    _type: any; //eslint-disable-line
    constructor(m11: number, m12: number, m21: number, m22: number, offsetX: number, offSetY: number) {
        this._m11 = m11;
        this._m12 = m12;
        this._m21 = m21;
        this._m22 = m22;
        this._offsetX = offsetX;
        this._offsetY = offSetY;
        this._type = _MatrixTypes.Unknown;
        this._checkMatrixType();
    }
    /**
     * Scales the current matrix by the specified factors around a center point.
     *
     * @private
     * @param {number} scaleX - The scale factor along the X axis.
     * @param {number} scaleY - The scale factor along the Y axis.
     * @param {number} centerX - The X coordinate of the scaling center.
     * @param {number} centerY - The Y coordinate of the scaling center.
     * @returns {_MatrixHelper} A new matrix representing the scale applied to the current transform.
     */
    _scale(scaleX: number, scaleY: number, centerX: number, centerY: number): _MatrixHelper {
        const scalingMatrix: _MatrixHelper = new _MatrixHelper(scaleX, 0, 0, scaleY, centerX, centerY);
        const resultMatrix: _MatrixHelper = scalingMatrix._multiply(this);
        return resultMatrix;
    }
    /**
     * Creates a deep copy of the current matrix.
     *
     * @private
     * @returns {_MatrixHelper} A cloned matrix with identical components and type.
     */
    _clone(): _MatrixHelper {
        const matrix: _MatrixHelper = new _MatrixHelper(this._m11, this._m12, this._m21, this._m22, this._offsetX, this._offsetY);
        return matrix;
    }
    /**
     * Sets the matrix components and updates the matrix type.
     *
     * @private
     * @param {number} m11 - Component m11.
     * @param {number} m12 - Component m12.
     * @param {number} m21 - Component m21.
     * @param {number} m22 - Component m22.
     * @param {number} offsetX - Translation offset along X.
     * @param {number} offsetY - Translation offset along Y.
     * @param {_MatrixTypes} type - The matrix classification/type.
     * @returns {void}
     */
    _setMatrix(m11: number, m12: number, m21: number, m22: number, offsetX: number, offsetY: number, type: _MatrixTypes): void {
        this._m11 = m11;
        this._m12 = m12;
        this._m21 = m21;
        this._m22 = m22;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._type = type;
    }
    /**
     * Applies a translation to the current matrix.
     *
     * @private
     * @param {number} offsetX - The translation offset along X.
     * @param {number} offsetY - The translation offset along Y.
     * @returns {_MatrixHelper} The current matrix after translation (fluent).
     */
    _translate(offsetX: number, offsetY: number): _MatrixHelper {
        if (this._type === _MatrixTypes.Identity) {
            this._setMatrix(1.0, 0.0, 0.0, 1.0, offsetX, offsetY, _MatrixTypes.Translation);
        } else {
            if (this._type === _MatrixTypes.Unknown) {
                this._offsetX += offsetX;
                this._offsetY += offsetY;
            } else {
                this._offsetX += offsetX;
                this._offsetY += offsetY;
                this._type |= _MatrixTypes.Translation;
            }
        }
        return this;
    }
    /**
     * Transforms a point by the current matrix.
     *
     * @private
     * @param {number} x - X coordinate of the point to transform.
     * @param {number} y - Y coordinate of the point to transform.
     * @returns {[number, number]} The transformed point as a tuple [x, y].
     */
    _transform(x: number, y: number): [number, number] {
        const x2: number = x * this._m11 + y * this._m21 + this._offsetX;
        const y2: number = x * this._m12 + y * this._m22 + this._offsetY;
        return [x2, y2];
    }
    /**
     * Multiplies this matrix by another matrix.
     *
     * @private
     * @param {_MatrixHelper} matrix - The right-hand matrix to multiply with.
     * @returns {_MatrixHelper} The resulting product matrix.
     */
    _multiply(matrix: _MatrixHelper): _MatrixHelper {
        return new _MatrixHelper(
            this._m11 * matrix._m11 + this._m12 * matrix._m21,
            this._m11 * matrix._m12 + this._m12 * matrix._m22,
            this._m21 * matrix._m11 + this._m22 * matrix._m21,
            this._m21 * matrix._m12 + this._m22 * matrix._m22,
            this._offsetX * matrix._m11 + this._offsetY * matrix._m21 + matrix._offsetX,
            this._offsetX * matrix._m12 + this._offsetY * matrix._m22 + matrix._offsetY
        );
    }
    /**
     * Gets a new identity matrix.
     *
     * @private
     * @returns {_MatrixHelper} A new identity matrix.
     */
    get _identity(): _MatrixHelper {
        return new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    }
    /**
     * Re-evaluates and sets the matrix type based on its current components.
     *
     * @private
     * @returns {void}
     */
    _checkMatrixType(): void {
        this._type = _MatrixTypes.Identity;
        if (this._m21 !== 0.0 || this._m12 !== 0.0) {
            this._type = _MatrixTypes.Unknown;
            return;
        }
        if (this._m11 !== 1.0 || this._m22 !== 1.0)
        {
            this._type = _MatrixTypes.Scaling;
        }
        if (this._offsetX !== 0.0 || this._offsetY !== 0.0)
        {
            this._type |= _MatrixTypes.Translation;
        }
        if ((this._getTypeIndex(this._type) & 3) === this._getTypeIndex(_MatrixTypes.Identity))
        {
            this._type = _MatrixTypes.Identity;
        }
    }
    /**
     * Maps a matrix type to a compact index for internal checks/bitwise operations.
     *
     * @private
     * @param {_MatrixTypes} type - The matrix type to map.
     * @returns {number} The corresponding index (0..4).
     */
    _getTypeIndex(type: _MatrixTypes): number {
        switch (type) {
        case _MatrixTypes.Identity:
            return 0;
        case _MatrixTypes.Translation:
            return 1;
        case _MatrixTypes.Scaling:
            return 2;
        case _MatrixTypes.scalingAndTranslation:
            return 3;
        case _MatrixTypes.Unknown:
            return 4;
        }
    }
}
/**
 * Maintains a stack of 2D transform matrices and exposes the composed current transform.
 * The stack composes transforms in push order and caches the current product for fast access.
 *
 * @private
 */
export class _TransformationStack {
    /**
     * Cached product of the current stack.
     *
     * @private
     */
    _currentTransform: _MatrixHelper = new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    /**
     * Base transform used when composing with the stack.
     *
     * @private
     */
    _initialTransform: _MatrixHelper;
    /**
     * Ordered transforms currently on the stack.'
     *
     * @private
     */
    _transformStack: _MatrixHelper[] = [];
    /**
     * Gets the composed transform: current stack * initial transform.
     * Returns the initial transform when the stack is empty.
     *
     * @private
     * @returns {_MatrixHelper} The current composed transform matrix.
     */
    get _CurrentTransform(): _MatrixHelper {
        if (this._transformStack.length === 0) {
            return this._initialTransform;
        }
        return this._multiplyMatrices(this._currentTransform, this._initialTransform);
    }
    constructor(initialTransform?: _MatrixHelper) {
        if (!initialTransform) {
            this._initialTransform = new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
        } else {
            this._initialTransform = initialTransform;
        }
    }
    /**
     * Pushes a transform onto the stack and recomputes the composed current transform.
     *
     * @private
     * @param {_MatrixHelper} transformMatrix - The transform to push.
     * @returns {void}
     */
    _pushTransform(transformMatrix: _MatrixHelper): void {
        this._transformStack.push(transformMatrix);
        let matrix: _MatrixHelper = new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
        for (const current of this._transformStack) {
            matrix = this._multiplyMatrices(matrix, current);
        }
        this._currentTransform = matrix;
    }
    /**
     * Pops the last transform from the stack and recomputes the composed current transform.
     *
     * @private
     * @returns {void}
     */
    _popTransform(): void {
        this._transformStack.pop();
        let matrix: _MatrixHelper = new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
        for (const current of this._transformStack) {
            matrix = this._multiplyMatrices(matrix, current);
        }
        this._currentTransform = matrix;
    }
    private _clear(): void {
        this._transformStack = [];
    }
    private _multiplyMatrices(matrix1: _MatrixHelper, matrix2: _MatrixHelper): _MatrixHelper {
        return matrix1._multiply(matrix2);
    }
}
/**
 * Enumerates matrix types used for fast-path logic and classification.
 *
 * @private
 */
enum _MatrixTypes {
    Identity,
    Scaling,
    Translation,
    scalingAndTranslation,
    Unknown
}
