export class _PdfFontMetrics {
    _name: string;
    _postScriptName: string;
    _firstChar: number;
    _lastChar: number;
    _subScriptSizeFactor: number;
    _superscriptSizeFactor: number;
    _widthTable: _WidthTable;
    _isUnicodeFont: boolean;
    _isBold: boolean;
}
export abstract class _WidthTable {
    abstract _itemAt(index: number): number;
    abstract _toArray(): number[];
}
export class _StandardWidthTable extends _WidthTable {
    widths: number[];
    constructor(widths: number[]) {
        super();
        this.widths = widths;
    }
    _itemAt(index: number): number {
        if (index < 0 || index >= this.widths.length) {
            throw new Error('The character is not supported by the font.');
        }
        return this.widths[<number>index];
    }
    _toArray(): number[] {
        return this.widths;
    }
}
export class _CjkWidthTable extends _WidthTable {
    widths: _CjkWidth[];
    _defaultWidth: number;
    constructor(defaultWidth: number) {
        super();
        this._defaultWidth = defaultWidth;
        this.widths = [];
    }
    _itemAt(index: number): number {
        let width: number = this._defaultWidth;
        this.widths.forEach((entry: _CjkWidth) => {
            if (index >= entry._from && index <= entry._to) {
                width = entry._itemAt(index);
            }
        });
        return width;
    }
    _toArray(): number[] {
        const array: number[] = [];
        this.widths.forEach((width: _CjkWidth) => {
            width._appendToArray(array);
        });
        return array;
    }
    _add(width: _CjkWidth): void {
        this.widths.push(width);
    }
}
export abstract class _CjkWidth {
    abstract get _from(): number;
    abstract get _to(): number;
    abstract _itemAt(index: number): number;
    abstract _appendToArray(array: number[]): void;
}
export class _CjkSameWidth extends _CjkWidth {
    _widthFrom: number;
    _widthTo: number;
    _width: number;
    constructor(from: number, to: number, width: number) {
        super();
        this._widthFrom = from;
        this._widthTo = to;
        this._width = width;
    }
    get _from(): number {
        return this._widthFrom;
    }
    get _to(): number {
        return this._widthTo;
    }
    _itemAt(index: number): number {
        if (index < this._from || index > this._to) {
            throw new Error('Index is out of range.');
        }
        return this._width;
    }
    _appendToArray(array: number[]): void {
        array.push(this._from, this._to, this._width);
    }
}
export class _CjkDifferentWidth extends _CjkWidth {
    _widthFrom: number;
    _widths: number[];
    constructor(from: number, widths: number[]) {
        super();
        this._widthFrom = from;
        this._widths = widths;
    }
    get _from(): number {
        return this._widthFrom;
    }
    get _to(): number {
        return this._widthFrom + this._widths.length - 1;
    }
    _itemAt(index: number): number {
        if (index < this._widthFrom || index > this._to) {
            throw new Error('Index is out of range.');
        }
        return this._widths[<number>index];
    }
    _appendToArray(array: number[]): void {
        array.push(this._from);
        array.forEach((entry: number) => {
            array.push(entry);
        });
    }
}
