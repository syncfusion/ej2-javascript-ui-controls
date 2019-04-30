import { PdfColor } from './../pdf-color';
import { PdfStreamWriter } from './../../input-output/pdf-stream-writer';
import { GetResourceEventHandler } from './../pdf-graphics';
import { PdfColorSpace } from './../enum';
import { PdfBrush } from './pdf-brush';
/**
 * Represents a brush that fills any object with a solid color.
 * ```typescript
 * // create a new PDF document
 * let document : PdfDocument = new PdfDocument();
 * // add a pages to the document
 * let page1 : PdfPage = document.pages.add();
 * // set font
 * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
 * // set brush
 * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
 * // draw the text
 * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(10, 10));
 * // save the document
 * document.save('output.pdf');
 * // destroy the document
 * document.destroy();
 * ```
 */
export class PdfSolidBrush extends PdfBrush {
    //Fields
    /**
     * The `colour` of the brush.
     * @private
     */
    public pdfColor : PdfColor;
    /**
     * Indicates if the brush is `immutable`.
     * @private
     */
    private bImmutable : boolean;
    /**
     * The `color space` of the brush.
     * @private
     */
    private colorSpace : PdfColorSpace;
    //Constructors
    /**
     * Initializes a new instance of the `PdfSolidBrush` class.
     * ```typescript
     * // create a new PDF document
     * let document : PdfDocument = new PdfDocument();
     * // add a pages to the document
     * let page1 : PdfPage = document.pages.add();
     * // set font
     * let font : PdfStandardFont = new PdfStandardFont(PdfFontFamily.Helvetica, 20);
     * // set brush
     * let blackBrush : PdfSolidBrush = new PdfSolidBrush(new PdfColor(0, 0, 0));
     * // draw the text
     * page1.graphics.drawString('Hello World', font, blackBrush, new PointF(10, 10));
     * // save the document
     * document.save('output.pdf');
     * // destroy the document
     * document.destroy();
     * ```
     * @param color color of the brush
     */
    public constructor(color : PdfColor) {
        super();
        this.pdfColor = color;
    }
    //Properties
    /**
     * Gets or sets the `color` of the brush.
     * @private
     */
    public get color() : PdfColor {
        return this.pdfColor;
    }
    public set color(value : PdfColor) {
        this.pdfColor = value;
    }
    //Implementation
    /**
     * `Monitors` the changes of the brush and modify PDF state respectively.
     * @private
     */
    public monitorChanges(brush : PdfBrush, streamWriter : PdfStreamWriter, getResources : GetResourceEventHandler,
                          saveChanges : boolean, currentColorSpace : PdfColorSpace) : boolean {
        if (streamWriter == null) {
            throw new Error('ArgumentNullException:streamWriter');
        }
        let diff : boolean = false;
        if (brush == null) {
            diff = true;
            streamWriter.setColorAndSpace(this.pdfColor, currentColorSpace, false);
            return diff;
        } else {
            let sBrush : PdfSolidBrush = brush as PdfSolidBrush;
            diff = true;
            streamWriter.setColorAndSpace(this.pdfColor, currentColorSpace, false);
            return diff;
        }
    }
    /**
     * `Resets` the changes, which were made by the brush.
     * @private
     */
    public resetChanges(streamWriter : PdfStreamWriter) : void {
        streamWriter.setColorAndSpace(new PdfColor(0, 0, 0), PdfColorSpace.Rgb, false);
    }
}