
/**
 * Enum
 */

/**
 * Defines the rendering mode of the barcode. They are
 * * SVG
 * * Canvas
 */
export type RenderingMode =
    /** SVG - Renders the barcode objects as SVG elements */
    'SVG' |
    /** Canvas - Renders the barcode in a canvas */
    'Canvas';

/**
 * Defines the event of the barcode
 * * BarcodeEvent - Throws when an invalid input was given.
 */
export enum BarcodeEvent {
    'invalid'
}


/**
 * Defines the text alignment for the text to be rendered in the barcode. The text alignment types are
 * * Left
 * * Right
 * * Center
 */
export type Alignment =
    /** Left - Align the text to the left side of the barcode element. */
    'Left' |
    /** Left - Align the text to the right side of the barcode element. */
    'Right' |
    /** Left - Align the text to the center side of the barcode element. */
    'Center';


/**
 * Defines the text position for the text to be rendered in the barcode. The text positions are
 * * Bottom
 * * Top
 */
export type TextPosition =
    /** Bottom - Text will be rendered in the bottom of the barcode element. */
    'Bottom' |
    /** Top - Text will be rendered in the top of the barcode element. */
    'Top';


/**
 * Defines the quite zone for the Qr Code.
 */
/** @private */
export enum QuietZone {
    All = 1 << 1
}

/**
 * Defines the encoding type for the datamatrix code. They are
 * * Auto
 * * ASCII
 * * ASCIINumeric
 * * Base256
 */
export type DataMatrixEncoding =
    /** Auto - Encoding type will be automatically assigned for the given input. */
    'Auto' |
    /** ASCII - Accept only the ASCII values. */
    'ASCII' |
    /** ASCIINumeric - Accept only the ASCII numeric values. */
    'ASCIINumeric' |
    /** Base256 -Accept the base256 values */
    'Base256';



/**
 * Defines the size for the datamatrix code. The defined size are
 * * Auto
 * * Size10x10
 * * Size12x12
 * * Size14x14
 * * Size16x16
 * * Size18x18
 * * Size20x20
 * * Size22x22
 * * Size24x24
 * * Size26x26
 * * Size32x32
 * * Size36x36
 * * Size40x40
 * * Size44x44
 * * Size48x48
 * * Size52x52
 * * Size64x64
 * * Size72x72
 * * Size80x80
 * * Size88x88
 * * Size96x96
 * * Size104x104
 * * Size120x120
 * * Size132x132
 * * Size144x144
 * * Size8x18
 * * Size8x32
 * * Size12x26
 * * Size12x36
 * * Size16x36
 * * Size16x48
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */


export enum DataMatrixSize {
    /**
     * modules will be generated automatically.
     */
    Auto = 0,
    /**
     * will generate 10*10 modules.
     */
    Size10x10 = 1,
    /**
     * will generate 12*12 modules.
     */
    Size12x12 = 2,
    /**
     * will generate 14*14 modules.
     */
    Size14x14 = 3,
    /**
     * will generate 16*16 modules.
     */
    Size16x16 = 4,
    /**
     * will generate 18*18 modules.
     */
    Size18x18 = 5,
    /**
     * will generate 20*20 modules.
     */
    Size20x20 = 6,
    /**
     * will generate 22*22 modules.
     */
    Size22x22 = 7,
    /**
     * will generate 24*24 modules.
     */
    Size24x24 = 8,
    /**
     * will generate 26*26 modules.
     */
    Size26x26 = 9,
    /**
     * will generate 32*32 modules.
     */
    Size32x32 = 10,
    /**
     * will generate 32*32 modules.
     */
    Size36x36 = 11,
    /**
     * will generate 40*40 modules.
     */
    Size40x40 = 12,
    /**
     * will generate 44*44 modules.
     */
    Size44x44 = 13,
    /**
     * will generate 48*48 modules.
     */
    Size48x48 = 14,
    /**
     * will generate 52*52 modules.
     */
    Size52x52 = 15,
    /**
     * will generate 64*64 modules.
     */
    Size64x64 = 16,
    /**
     * will generate 72*72 modules.
     */
    Size72x72 = 17,
    /**
     * will generate 80*80 modules.
     */
    Size80x80 = 18,
    /**
     * will generate 88*88 modules.
     */
    Size88x88 = 19,
    /**
     * will generate 96*96 modules.
     */
    Size96x96 = 20,
    /**
     * will generate 104*104 modules.
     */
    Size104x104 = 21,
    /**
     * will generate 120*120 modules.
     */
    Size120x120 = 22,
    /**
     * will generate 132*132 modules.
     */
    Size132x132 = 23,
    /**
     * will generate 144*144 modules.
     */
    Size144x144 = 24,
    /**
     * will generate 8*18 modules.
     */
    Size8x18 = 25,
    /**
     * will generate 8*32 modules.
     */
    Size8x32 = 26,
    /**
     * will generate 12*26 modules.
     */
    Size12x26 = 27,
    /**
     * will generate 12*36 modules.
     */
    Size12x36 = 28,
    /**
     * will generate 16*36 modules.
     */
    Size16x36 = 29,
    /**
     * will generate 16*48 modules.
     */
    Size16x48 = 30,

}




/**
 * Defines the type of the barcode to be generated. The barcode types are
 * * Code39
 * * Code128
 * * Code128A
 * * Code128B
 * * Code128C
 * * Codabar
 * * Ean8
 * * Ean13
 * * UpcA
 * * UpcE
 * * Code11
 * * Code93
 * * Code93Extension
 * * Code39Extension
 * * Code32
 */
export type BarcodeType =
    /** code39 - render the code39 barcode */
    'Code39' |
    /** code128 - render the code128 barcode */
    'Code128' |
    /** code128A - render the code128A barcode */
    'Code128A' |
    /** code128B - render the code128B barcode */
    'Code128B' |
    /** code128C - render the code128C barcode */
    'Code128C' |
    /** Codabar - render the codabar barcode */
    'Codabar' |
    /** Ean8 - render the Ean8 barcode */
    'Ean8' |
    /** Ean8 - render the Ean8 barcode */
    'Ean13' |
    /** UpcA - render the UpcA barcode */
    'UpcA' |
    /** UpcE - render the UpcE barcode */
    'UpcE' |
    /** Code11 - render the code11 barcode */
    'Code11' |
    /** Code93 - render the code93 barcode */
    'Code93' |
    /** Code93Extension - render the Code93Extension barcode */
    'Code93Extension' |
    /** Code39EXTD - render the code39EXTD barcode */
    'Code39Extension' |
    /** Code32 - render the Code32 barcode */
    'Code32' ;



/**
 * Defines the Qrcode input mode. The QR input modes are
 * * NumericMode
 * * BinaryMode
 * * AlphaNumericMode
 */
export type QRInputMode =
    /** NumericMode - Changes its mode to numericMode when the given input is numeric. */
    'NumericMode' |
    /** BinaryMode - Changes its mode to BinaryMode when the given input is numeric or smaller case or both. */
    'BinaryMode' |
    /** AlphaNumericMode - Changes its mode to AlphaNumericMode when the given is numeric or upper case or both. */
    'AlphaNumericMode';



/**
 * Defines the Qrcode QRCodeVersion. They are
 * * Auto
 * * Version01
 * * Version02
 * * Version03
 * * Version04
 * * Version05
 * * Version06
 * * Version07
 * * Version08
 * * Version09
 * * Version10
 * * Version11
 * * Version12
 * * Version13
 * * Version14
 * * Version15
 * * Version16
 * * Version17
 * * Version18
 * * Version19
 * * Version20
 * * Version21
 * * Version22
 * * Version23
 * * Version24
 * * Version25
 * * Version26
 * * Version27
 * * Version28
 * * Version29
 * * Version30
 * * Version31
 * * Version32
 * * Version33
 * * Version34
 * * Version35
 * * Version36
 * * Version37
 * * Version38
 * * Version39
 * * Version40
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */

export enum QRCodeVersion {
    /**
     * Specifies the default version.
     */
    Auto = 0,
    /**
     * Specifies version 1 (21 x 21 modules).
     */
    Version01 = 1,
    /**
     * Specifies version 2 (25 x 25 modules).
     */
    Version02 = 2,
    /**
     * Specifies version 3 (29 x 29 modules).
     */
    Version03 = 3,
    /**
     * Specifies version 4 (33 x 33 modules).
     */
    Version04 = 4,
    /**
     * Specifies version 5 (37 x 37 modules).
     */
    Version05 = 5,
    /**
     * Specifies version 6 (41 x 41 modules).
     */
    Version06 = 6,
    /**
     * Specifies version 7 (45 x 45 modules).
     */
    Version07 = 7,
    /**
     * Specifies version 8 (49 x 49 modules).
     */
    Version08 = 8,
    /**
     * Specifies version 9 (53 x 53 modules).
     */
    Version09 = 9,
    /**
     * Specifies version 10 (57 x 57 modules).
     */
    Version10 = 10,
    /**
     * Specifies version 11 (61 x 61 modules).
     */
    Version11 = 11,
    /**
     * Specifies version 12 (65 x 65 modules).
     */
    Version12 = 12,
    /**
     * Specifies version 13 (69 x 69 modules).
     */
    Version13 = 13,
    /**
     * Specifies version 14 (73 x 73 modules).
     */
    Version14 = 14,
    /**
     * Specifies version 15 (77 x 77 modules).
     */
    Version15 = 15,
    /**
     * Specifies version 17 (85 x 85 modules).
     */
    Version16 = 16,
    /**
     * Specifies version 17 (85 x 85 modules).
     */
    Version17 = 17,
    /**
     * Specifies version 18 (89 x 89 modules).
     */
    Version18 = 18,
    /**
     * Specifies version 19 (93 x 93 modules).
     */
    Version19 = 19,
    /**
     * Specifies version 20 (97 x 97 modules).
     */
    Version20 = 20,
    /**
     * Specifies version 21 (101 x 101 modules).
     */
    Version21 = 21,
    /**
     * Specifies version 22 (105 x 105 modules).
     */
    Version22 = 22,
    /**
     * Specifies version 23 (109 x 109 modules).
     */
    Version23 = 23,
    /**
     * Specifies version 24 (113 x 113 modules).
     */
    Version24 = 24,
    /**
     * Specifies version 25 (117 x 117 modules).
     */
    Version25 = 25,
    /**
     * Specifies version 26 (121 x 121 modules).
     */
    Version26 = 26,
    /**
     * Specifies version 27 (125 x 125 modules).
     */
    Version27 = 27,
    /**
     * Specifies version 28 (129 x 129 modules).
     */
    Version28 = 28,
    /**
     * Specifies version 29 (133 x 133 modules).
     */
    Version29 = 29,
    /**
     * Specifies version 30 (137 x 137 modules).
     */
    Version30 = 30,
    /**
     * Specifies version 31 (141 x 141 modules).
     */
    Version31 = 31,
    /**
     * Specifies version 32 (145 x 145 modules).
     */
    Version32 = 32,
    /**
     * Specifies version 33 (149 x 149 modules).
     */
    Version33 = 33,
    /**
     * Specifies version 34 (153 x 153 modules).
     */
    Version34 = 34,
    /**
     * Specifies version 35 (157 x 157 modules).
     */
    Version35 = 35,
    /**
     * Specifies version 36 (161 x 161 modules).
     */
    Version36 = 36,
    /**
     * Specifies version 37 (165 x 165 modules).
     */
    Version37 = 37,
    /**
     * Specifies version 38 (169 x 169 modules).
     */
    Version38 = 38,
    /**
     * Specifies version 39 (173 x 173 modules).
     */
    Version39 = 39,
    /**
     * Specifies version 40 (177 x 177 modules).
     */
    Version40 = 40,
}


/**
 * Indicated the recovery capacity of the qrcode. The default capacity levels are
 * * Low
 * * Medium
 * * Quartile
 * * High
 *
 * @aspNumberEnum
 * @IgnoreSingular
 */
export enum ErrorCorrectionLevel {

    /**
     * The Recovery capacity is 7%(approx.)
     */
    Low = 7,

    /**
     * The Recovery capacity is 15%(approx.)
     */
    Medium = 15,

    /**
     * The Recovery capacity is 25%(approx.)
     */
    Quartile = 25,

    /**
     * The Recovery capacity is 30%(approx.)
     */
    High = 30
}

/**
 * Defines the format of the barcode to be exported
 * JPG - Barcode will be exported as JPG file.
 * PNG - Barcode will be exported as PNG file.
 *
 * @IgnoreSingular
 */
export type BarcodeExportType  =
    /** Barcode will be exported as JPG file. */
    'JPG' |

    /** Barcode will be exported as PNG file */
    'PNG';


