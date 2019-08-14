import { PdfColorSpace } from './enum';
import { Operators } from './../input-output/pdf-operators';
import { Dictionary } from './../collections/dictionary';
import { PdfNumber } from './../primitives/pdf-number';
import { PdfArray } from './../primitives/pdf-array';
/**
 * Implements structures and routines working with `color`.
 * ```typescript
 * // create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // add a new page to the document
 * let page1 : PdfPage = document.pages.add();
 * // set the font
 * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
 * //
 * // set color
 * let brushColor : PdfColor = new PdfColor(0, 0, 0);
 * //
 * // create black brush
 * let blackBrush : PdfSolidBrush = new PdfSolidBrush(brushColor);
 * // draw the text
 * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(0, 0));
 * // save the document
 * document.save('output.pdf');
 * // destroy the document
 * document.destroy();
 * ```
 * @default black color
 */
export class PdfColor {
    //Fields
    /**
     * Holds `RGB colors` converted into strings.
     * @private
     */
    private static rgbStrings : Dictionary<number, Object> = new Dictionary<number, Object>();
    /**
     * Holds Gray scale colors converted into strings for `stroking`.
     * @private
     */
    private static grayStringsSroke : Dictionary<number, Object> = new Dictionary<number, Object>();
    /**
     * Holds Gray scale colors converted into strings for `filling`.
     * @private
     */
    private static grayStringsFill : Dictionary<number, Object> = new Dictionary<number, Object>();
    /**
     * Value of `Red` channel.
     * @private
     */
    private redColor : number;
    /**
     * Value of `Cyan` channel.
     * @private
     */
    private cyanColor : number;
    /**
     * Value of `Green` channel.
     * @private
     */
    private greenColor : number;
    /**
     * Value of `Magenta` channel.
     * @private
     */
    private magentaColor : number;
    /**
     * Value of `Blue` channel.
     * @private
     */
    private blueColor : number;
    /**
     * Value of `Yellow` channel.
     * @private
     */
    private yellowColor : number;
    /**
     * Value of `Black` channel.
     * @private
     */
    private blackColor : number;
    /**
     * Value of `Gray` channel.
     * @private
     */
    private grayColor : number;
    /**
     * `Alpha` channel.
     * @private
     */
    private alpha : number;
    /**
     * Shows if the color `is empty`.
     * @private
     */
    private filled : boolean;
    /**
     * `Max value` of color channel.
     * @private
     */
    public static readonly maxColourChannelValue : number = 255.0;

    //constructor
    /**
     * Initialize a new instance for `PdfColor` class.
     */
    public constructor()
    public constructor(color1 : PdfColor)
    public constructor(color1 : number, color2 : number, color3 : number)
    public constructor(color1 : number, color2 : number, color3 : number, color4 : number)
    public constructor(color1 ?: number|PdfColor, color2 ?: number, color3 ?: number, color4 ?: number) {
        if (color1 instanceof PdfColor) {
            this.redColor = color1.r;
            this.greenColor = color1.g;
            this.blueColor = color1.b;
            this.grayColor = color1.gray;
            this.alpha = color1.alpha;
            this.filled = (this.alpha !== 0);
        } else {
            this.cyanColor = 0;
            this.magentaColor = 0;
            this.yellowColor = 0;
            this.blackColor = 0;
            this.grayColor = 0;
            if ( typeof color4 === 'undefined') {
                //doubt-byte/float
               this.redColor = color1;
               this.greenColor = color2;
               this.blueColor = color3;
               this.alpha = PdfColor.maxColourChannelValue;
               this.filled = true;
               this.assignCMYK(color1, color2, color3);
           } else {
               this.redColor = color2;
               this.greenColor = color3;
               this.blueColor = color4;
               this.alpha = color1;
               this.filled = true;
               this.assignCMYK(color2, color3, color4);
           }
        }
    }
    /**
     * `Calculate and assign` cyan, megenta, yellow colors from rgb values..
     * @private
     */
    private assignCMYK(r : number, g : number, b : number) : void {
        let red : number = r / PdfColor.maxColourChannelValue;
        let green : number = g / PdfColor.maxColourChannelValue;
        let blue : number = b / PdfColor.maxColourChannelValue;
        let black : number = PdfNumber.min(1 - red, 1 - green, 1 - blue);
        let cyan : number = (black === 1.0) ? 0 : (1 - red - black) / (1 - black);
        let magenta : number = (black === 1.0) ? 0 : (1 - green - black) / (1 - black);
        let yellow : number = (black === 1.0) ? 0 : (1 - blue - black) / (1 - black);
        this.blackColor = black;
        this.cyanColor = cyan;
        this.magentaColor = magenta;
        this.yellowColor = yellow;
    }

    //Properties
    // public static get Empty():PdfColor
    // {
    //     return this.s_emptyColor
    // }
    /**
     * Gets or sets `Red` channel value.
     * @private
     */
    public get r() : number {
        return this.redColor;
    }
    public set r(value : number) {
        this.redColor = value;
        this.assignCMYK(this.redColor, this.greenColor, this.blueColor);
        this.filled = true;
    }
    /**
     * Gets the `Red` color
     * @private
     */
    public get red() : number {
        return (this.r / PdfColor.maxColourChannelValue);
    }
    /**
     * Gets or sets `Blue` channel value.
     * @private
     */
    public get b() : number {
        return this.blueColor;
    }
    public set b(value : number) {
        this.blueColor = value;
        this.assignCMYK(this.redColor, this.greenColor, this.blueColor);
        this.filled = true;
    }
    /**
     * Gets the `blue` color.
     * @private
     */
    public get blue() : number {
        return (this.b / PdfColor.maxColourChannelValue);
    }
    /**
     *  Gets or sets `Green` channel value.
     * @private
     */
    public get g() : number {
        return this.greenColor;
    }
    public set g(value : number) {
        this.greenColor = value;
        this.assignCMYK(this.redColor, this.greenColor, this.blueColor);
        this.filled = true;
    }
    /**
     * Gets the `Green` color.
     * @private
     */
    public get green() : number {
        return (this.g / PdfColor.maxColourChannelValue);
    }
    /**
     * Gets or sets `Gray` channel value.
     * @private
     */
    public get gray() : number
    {
        return ((((this.redColor + this.greenColor) + this.blueColor)) / (PdfColor.maxColourChannelValue * 3));
    }
    public set gray(value : number) {
        if (value < 0) {
            this.grayColor = 0;
        } else if (value > 1) {
            this.grayColor = 1;
        } else {
            this.grayColor = value;
        }
        this.r = (this.grayColor * PdfColor.maxColourChannelValue);
        this.g = (this.grayColor * PdfColor.maxColourChannelValue);
        this.b = (this.grayColor * PdfColor.maxColourChannelValue);
        this.assignCMYK(this.redColor, this.greenColor, this.blueColor);
        this.filled = true;
    }
    /**
     * Gets whether the PDFColor `is Empty` or not.
     * @private
     */
    public get isEmpty() : boolean
    {
        return !this.filled;
    }
    /**
     * Gets or sets `Alpha` channel value.
     * @private
     */
    public get a() : number
    {
        return this.alpha;
    }
    public set a(value : number) {
        if (value < 0) {
            this.alpha = 0;
        } else {
            // if (this.alpha !== value) {
            this.alpha = value;
            // }
        }
        this.filled = true;
    }
    //Public methods
    /**
     * Converts `PDFColor to PDF string` representation.
     * @private
     */
    public toString(colorSpace : PdfColorSpace, stroke : boolean) : string {
        if (this.isEmpty) {
            return '';
        }
        return this.rgbToString(stroke);
    }
    /**
     * Sets `RGB` color.
     * @private
     */
    private rgbToString(ifStroking : boolean) : string {
        let r : number = this.r;
        let g : number = this.g;
        let b : number = this.b;
        let key : number = (r << 16) + (g << 8) + b;
        if (ifStroking) {
            key += 1 << 24;
        }
        let colour : string = '';
        let obj : Object = null;
        if (PdfColor.rgbStrings.containsKey(key)) {
            obj = PdfColor.rgbStrings.getValue(key);
        }
        if (obj == null) {
            let red : number = r / PdfColor.maxColourChannelValue;
            let green : number = g / PdfColor.maxColourChannelValue;
            let blue : number = b / PdfColor.maxColourChannelValue;
            if (ifStroking) {
                colour = red.toString() + ' ' + green.toString() + ' ' + blue.toString() + ' RG';
            } else {
                colour = red.toString() + ' ' + green.toString() + ' ' + blue.toString() + ' rg';
            }
            PdfColor.rgbStrings.setValue(key, colour);
        } else {
            colour = obj.toString();
        }
        return colour + Operators.newLine;
    }
    /**
     * Converts `colour to a PDF array`.
     * @private
     */
    public toArray(colorSpace : PdfColorSpace) : PdfArray {
        let array : PdfArray = new PdfArray();
        switch (colorSpace) {
            case PdfColorSpace.Rgb:
                array.add(new PdfNumber(this.red));
                array.add(new PdfNumber(this.green));
                array.add(new PdfNumber(this.blue));
                break;

            default:
                throw new Error('NotSupportedException : Unsupported colour space.');
        }
        return array;
    }
}