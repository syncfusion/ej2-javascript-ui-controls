import { HAlignType, VAlignType, LineStyle } from './enum';
/**
 * CellStyle class
 * @private
 */
export class CellStyle {
    public name: string;
    public index: number;

    public backColor: string;
    public numFmtId: number;
    public borders: Borders;


    public fontName: string;
    public fontSize: number;
    public fontColor: string;
    public italic: boolean;
    public bold: boolean;
    public hAlign: HAlignType;
    public indent: number;
    public rotation: number;
    public vAlign: VAlignType;
    public underline: boolean;

    public wrapText: boolean;
    public numberFormat: string;
    public type: string;
    public isGlobalStyle: boolean;
    constructor() {
        this.numFmtId = 0;
        this.backColor = 'none';
        this.fontName = 'Calibri';
        this.fontSize = 10.5;
        this.fontColor = '#000000';
        this.italic = false;
        this.bold = false;
        this.underline = false;
        this.wrapText = false;
        this.hAlign = 'general';
        this.vAlign = 'bottom';
        this.indent = 0;
        this.rotation = 0;
        this.numberFormat = 'GENERAL';
        this.type = 'datetime';
        this.borders = new Borders();
        this.isGlobalStyle = false;
    }

}
/**
 * Font Class
 * @private
 */
export class Font {
    public b: boolean;
    public i: boolean;
    public u: boolean;
    public sz: number;
    public name: string;
    public color: string;
    constructor() {
        this.sz = 10.5;
        this.name = 'Calibri';
        this.u = false;
        this.b = false;
        this.i = false;
        this.color = 'FF000000';
    }
}

/**
 * CellXfs class
 * @private
 */
export class CellXfs {
    public numFmtId: number;
    public fontId: number;
    public fillId: number;
    public borderId: number;
    public xfId: number;
    public applyAlignment: number;
    public alignment: Alignment;
}
/**
 * Alignment class
 * @private
 */
export class Alignment {
    public horizontal: string;
    public vertical: string;
    public wrapText: number;
    public indent: number;
    public rotation: number;
}
/**
 * CellStyleXfs class
 * @private
 */
export class CellStyleXfs {
    public numFmtId: number;
    public fontId: number;
    public fillId: number;
    public borderId: number;
    public alignment: Alignment;
}
/**
 * CellStyles class
 * @private
 */
export class CellStyles {
    public name: string;
    public xfId: number;
    constructor() {
        this.name = 'Normal';
        this.xfId = 0;
    }
}
/**
 * NumFmt class
 * @private
 */
export class NumFmt {
    public numFmtId: number;
    public formatCode: string;
    constructor();
    constructor(id: number, code: string);
    constructor(id?: number, code?: string) {
        this.numFmtId = id;
        this.formatCode = code;
    }
}

/**
 * Border class
 * @private
 */
export class Border {
    public lineStyle: LineStyle;
    public color: string;
    constructor();
    constructor(mLine: LineStyle, mColor: string);
    constructor(mLine?: LineStyle, mColor?: string) {
        this.lineStyle = mLine;
        this.color = mColor;
    }
}

/**
 * Borders class
 * @private
 */
export class Borders {
    public left: Border;
    public right: Border;
    public bottom: Border;
    public top: Border;
    public all: Border;
    constructor() {
        this.left = new Border('none', '#FFFFFF');
        this.right = new Border('none', '#FFFFFF');
        this.top = new Border('none', '#FFFFFF');
        this.bottom = new Border('none', '#FFFFFF');
        this.all = new Border('none', '#FFFFFF');
    }
}