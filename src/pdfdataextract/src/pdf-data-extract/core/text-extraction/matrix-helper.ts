export class _MatrixHelper {
    _m11: number;
    _m12: number;
    _m21: number;
    _m22: number;
    _offsetX: number;
    _offsetY: number;
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
    _scale(scaleX: number, scaleY: number, centerX: number, centerY: number): _MatrixHelper {
        const scalingMatrix: _MatrixHelper = new _MatrixHelper(scaleX, 0, 0, scaleY, centerX, centerY);
        const resultMatrix: _MatrixHelper = scalingMatrix._multiply(this);
        return resultMatrix;
    }
    _clone(): _MatrixHelper {
        const matrix: _MatrixHelper = new _MatrixHelper(this._m11, this._m12, this._m21, this._m22, this._offsetX, this._offsetY);
        return matrix;
    }
    _setMatrix(m11: number, m12: number, m21: number, m22: number, offsetX: number, offsetY: number, type: _MatrixTypes): void {
        this._m11 = m11;
        this._m12 = m12;
        this._m21 = m21;
        this._m22 = m22;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._type = type;
    }
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
    _transform(x: number, y: number): [number, number] {
        const x2: number = x * this._m11 + y * this._m21 + this._offsetX;
        const y2: number = x * this._m12 + y * this._m22 + this._offsetY;
        return [x2, y2];
    }
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
    get _identity(): _MatrixHelper {
        return new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    }
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
export class _TransformationStack {
    _currentTransform: _MatrixHelper = new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
    _initialTransform: _MatrixHelper;
    _transformStack: _MatrixHelper[] = [];
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
    _pushTransform(transformMatrix: _MatrixHelper): void {
        this._transformStack.push(transformMatrix);
        let matrix: _MatrixHelper = new _MatrixHelper(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
        for (const current of this._transformStack) {
            matrix = this._multiplyMatrices(matrix, current);
        }
        this._currentTransform = matrix;
    }
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
enum _MatrixTypes {
    Identity,
    Scaling,
    Translation,
    scalingAndTranslation,
    Unknown
}
