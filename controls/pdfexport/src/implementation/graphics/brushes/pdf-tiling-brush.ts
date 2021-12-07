/**
 * PdfTilingBrush.ts class for EJ2-PDF
 */
import { PdfStreamWriter } from './../../input-output/pdf-stream-writer';
import { GetResourceEventHandler } from './../pdf-graphics';
import { PdfColorSpace } from './../enum';
import { PdfBrush } from './pdf-brush';
import { PointF, SizeF, RectangleF, Rectangle } from './../../drawing/pdf-drawing';
import { IPdfWrapper } from '../../../interfaces/i-pdf-wrapper';
import { PdfTransformationMatrix } from './../pdf-transformation-matrix';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { PdfArray } from './../../primitives/pdf-array';
import { PdfName } from '../../../../src/implementation/primitives/pdf-name';
import { PdfNumber } from './../../primitives/pdf-number';
import { PdfGraphics } from './../pdf-graphics';
import { PdfResources} from './../pdf-resources';
import { PdfStream } from './../../primitives/pdf-stream';
import { PdfPage } from './../../pages/pdf-page';
import { IPdfPrimitive } from './../../../interfaces/i-pdf-primitives';
/**
 * `PdfTilingBrush` Implements a colored tiling brush.
 */
export class PdfTilingBrush extends PdfBrush implements IPdfWrapper {
    //Fields
    /**
     * Local variable to store rectanble box.
     * @private
     */
    private mBox: Rectangle;
    /**
     * Local variable to store graphics.
     * @private
     */
    private mGraphics: PdfGraphics;
    /**
     * Local variable to store brush Stream.
     * @private
     */
    private brushStream: PdfStream;
    /**
     * Local variable to store brush Stream.
     * @private
     */
    private tempBrushStream: PdfStream;
    /**
     * Local variable to store resources.
     * @private
     */
    private mResources: PdfResources;
    /**
     * Local variable to store Stroking.
     * @private
     */
    private mStroking: boolean = false;
    /**
     * Local variable to store the page.
     * @private
     */
    private mPage: PdfPage;
    /**
     * Local variable to store the tile start location.
     * @private
     */
    private mLocation: PointF = new PointF(0, 0);
    /**
     * Local variable to store the Matrix.
     * @private
     */
    private mTransformationMatrix: PdfTransformationMatrix;
    /**
     * Local variable to store the dictionary properties.
     * @private
     */
    private mDictionaryProperties : DictionaryProperties = new DictionaryProperties();
    //Constructor
    /**
     * Initializes a new instance of the `PdfTilingBrush` class.
     * @public
     */
    public constructor(rectangle: Rectangle)
    /**
     * Initializes a new instance of the `PdfTilingBrush` class.
     * @public
     */
    public constructor(size: SizeF)
    /**
     * Initializes a new instance of the `PdfTilingBrush` class.
     * @public
     */
    public constructor(size: SizeF, page: PdfPage)
    /**
     * Initializes a new instance of the `PdfTilingBrush` class.
     * @public
     */
    public constructor(rectangle: Rectangle, page: PdfPage)
    /**
     * Initializes a new instance of the `PdfTilingBrush` class.
     * @public
     */
    public constructor(arg1?: Rectangle|SizeF, arg2?: PdfPage) {
        super();
        let rect : Rectangle = null;
        if (arg1 instanceof Rectangle) {
            rect = arg1;
        } else if (arg1 instanceof SizeF) {
            rect = new Rectangle(0, 0, arg1.width, arg1.height);
        }
        if (arg2 !== null && arg2 instanceof PdfPage) {
            this.mPage = arg2;
        }
        this.brushStream = new PdfStream();
        this.mResources = new PdfResources();
        this.brushStream.items.setValue(this.mDictionaryProperties.resources , this.mResources);
        this.setBox(rect);
        this.setObligatoryFields();
        if (arg2 !== null && arg2 instanceof PdfPage) {
            this.mPage = arg2;
            this.graphics.colorSpace = arg2.document.colorSpace;
        }
    }
    /**
     * Initializes a new instance of the `PdfTilingBrush` class.
     * @private
     * @param rectangle The size of the smallest brush cell.
     * @param page The Current Page Object.
     * @param location The Tile start location.
     * @param matrix The matrix.
     */
    private initialize(rectangle: Rectangle, page: PdfPage, location: PointF, matrix: PdfTransformationMatrix) : PdfTilingBrush {
        this.mPage = page;
        this.mLocation = location;
        this.mTransformationMatrix = matrix;
        this.tempBrushStream = this.brushStream;
        this.brushStream = new PdfStream();
        let tempResource : PdfResources = new PdfResources();
        this.brushStream.items.setValue(this.mDictionaryProperties.resources, tempResource);
        this.setBox(rectangle);
        this.setObligatoryFields();
        return this;
    }
    //Properties
    /**
     * Location representing the start position of the tiles.
     * @public
     */
    public get location(): PointF {
        return this.mLocation;
    }
    public set location(value: PointF)  {
        this.mLocation = value;
    }
    /**
     * Sets the obligatory fields.
     * @private
     */
    private setObligatoryFields() : void {
        this.brushStream.items.setValue(this.mDictionaryProperties.patternType, new PdfNumber(1));
        //  Tiling brush.
        this.brushStream.items.setValue(this.mDictionaryProperties.paintType, new PdfNumber(1));
        //  Coloured.
        this.brushStream.items.setValue(this.mDictionaryProperties.tilingType , new PdfNumber(1));
        //  Constant spacing.
        this.brushStream.items.setValue(this.mDictionaryProperties.xStep , new PdfNumber((this.mBox.right - this.mBox.left)));
        this.brushStream.items.setValue(this.mDictionaryProperties.yStep , new PdfNumber((this.mBox.bottom - this.mBox.top)));
        if ((this.mPage != null) && (this.mLocation != null)) {
            if ((this.mTransformationMatrix == null && typeof this.mTransformationMatrix === 'undefined')) {
                // Transform the tile origin to fit the location
                let tileTransform: number = (this.mPage.size.height % this.rectangle.size.height) - (this.mLocation.y);
                /* tslint:disable-next-line:max-line-length */
                this.brushStream.items.setValue(this.mDictionaryProperties.matrix, new PdfArray([1, 0, 0, 1, this.mLocation.x, tileTransform]));
            } else {
                let tileTransform: number = 0;
                // Transform the tile origin to fit the location
                let elements: number[] = this.mTransformationMatrix.matrix.elements;
                if ((this.mPage.size.height > this.rectangle.size.height)) {
                    tileTransform = (this.mTransformationMatrix.matrix.offsetY
                                - (this.mPage.size.height % this.rectangle.size.height));
                } else {
                    tileTransform = ((this.mPage.size.height % this.rectangle.size.height) + this.mTransformationMatrix.matrix.offsetY);
                }
                this.brushStream.items.setValue(this.mDictionaryProperties.matrix, new PdfArray([
                            elements[0], elements[1], elements[2], elements[3], elements[4], tileTransform]));
            }
        }
    }
    /**
     * Sets the BBox coordinates.
     * @private
     */
    private setBox(box: Rectangle) : void {
        this.mBox = box;
        let rect : RectangleF = new RectangleF(this.mBox.left, this.mBox.top, this.mBox.right, this.mBox.bottom);
        this.brushStream.items.setValue(this.mDictionaryProperties.bBox, PdfArray.fromRectangle(rect));
    }
    //Properties
    /**
     * Gets the boundary box of the smallest brush cell.
     * @public
     */
    public get rectangle(): Rectangle {
        return this.mBox;
    }
    /**
     * Gets the size of the smallest brush cell.
     * @public
     */
    public get size(): SizeF {
        return this.mBox.size;
    }
    /**
     * Gets Graphics context of the brush.
     */
    public get graphics(): PdfGraphics {
        if ((this.mGraphics == null && typeof this.mGraphics === 'undefined')) {
            let gr : GetResourceEventHandler = new GetResourceEventHandler(this);
            let g : PdfGraphics = new PdfGraphics(this.size, gr, this.brushStream);
            this.mGraphics = g;
            this.mResources = this.getResources();
            this.mGraphics.initializeCoordinates();
        }
        return this.mGraphics;
    }
    /**
     * Gets the resources and modifies the template dictionary.
     * @public
     */
    public getResources() : PdfResources {
        return this.mResources;
    }
    /**
     * Gets or sets a value indicating whether this PdfTilingBrush
     * is used for stroking operations.
     */
    public get stroking(): boolean {
        return this.mStroking;
    }
    public set stroking(value: boolean)  {
        this.mStroking = value;
    }
    //PdfBrush methods
    /**
     * Creates a new copy of a brush.
     * @public
     */
    public clone(): PdfBrush {
        let brush: PdfTilingBrush = this.initialize(this.rectangle, this.mPage, this.location, this.mTransformationMatrix);
        if ((this.mTransformationMatrix != null) && (this.mTransformationMatrix.matrix != null)) {
            /* tslint:disable-next-line:max-line-length */
            brush.brushStream.items.setValue(this.mDictionaryProperties.matrix , new PdfArray(this.mTransformationMatrix.matrix.elements));
        }
        brush.brushStream.data = this.tempBrushStream.data;
        brush.mResources = new PdfResources(this.mResources);
        brush.brushStream.items.setValue(this.mDictionaryProperties.resources, brush.mResources);
        return brush;
    }
    /**
     * Monitors the changes of the brush and modify PDF state respectfully.
     * @param brush The brush
     * @param streamWriter The stream writer
     * @param getResources The get resources delegate.
     * @param saveChanges if set to true the changes should be saved anyway.
     * @param currentColorSpace The current color space.
     */
    /* tslint:disable-next-line:max-line-length */
    public monitorChanges(brush: PdfBrush, streamWriter: PdfStreamWriter, getResources: GetResourceEventHandler, saveChanges: boolean, currentColorSpace: PdfColorSpace): boolean {
        let diff: boolean = false;
        if (brush !== this) {
            //  Set the Pattern colour space.
            streamWriter.setColorSpace('Pattern', this.mStroking);
            //  Set the pattern for non-stroking operations.
            let resources1 : PdfResources = getResources.getResources();
            let name1 : PdfName = resources1.getName(this);
            streamWriter.setColourWithPattern(null, name1, this.mStroking);
            diff = true;
        } else if (brush instanceof PdfTilingBrush) {
            //  Set the /Pattern colour space.
            streamWriter.setColorSpace('Pattern', this.mStroking);
            //  Set the pattern for non-stroking operations.
            let resources : PdfResources = getResources.getResources();
            let name: PdfName = resources.getName(this);
            streamWriter.setColourWithPattern(null, name, this.mStroking);
            diff = true;
        }
        return diff;
    }
    /**
     * Resets the changes, which were made by the brush. 
     * In other words resets the state to the initial one.
     * @param streamWriter The stream writer.
     */
    public resetChanges(streamWriter: PdfStreamWriter) : void {
        //  We shouldn't do anything to reset changes.
        //  All changes will be reset automatically by setting a new colour space.
    }
    /* tslint:enable */
    // IPdfWrapper Members
    /**
     * Gets the `element`.
     * @public
     */
    public get element() : IPdfPrimitive {
        return this.brushStream;
    }
}