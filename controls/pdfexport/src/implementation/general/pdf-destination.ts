/**
 * PdfDestination.ts class for EJ2-PDF
 */
import { IPdfWrapper } from './../../interfaces/i-pdf-wrapper';
import { IPdfPrimitive } from './../../interfaces/i-pdf-primitives';
import { PointF, RectangleF } from './../drawing/pdf-drawing';
import { PdfPageBase } from './../pages/pdf-page-base';
import { PdfArray } from './../primitives/pdf-array';
import { PdfPage } from './../pages/pdf-page';
import { PdfPageRotateAngle } from './../pages/enum';
import { PdfDestinationMode } from './../general/enum';
import { PdfSection } from './../pages/pdf-section';
import { PdfReferenceHolder } from './../primitives/pdf-reference';
import { PdfName } from './../primitives/pdf-name';
import { PdfNumber } from './../primitives/pdf-number';
import { DictionaryProperties } from './../input-output/pdf-dictionary-properties';
/**
 * `PdfDestination` class represents an anchor in the document
 * where bookmarks or annotations can direct when clicked.
 */
export class PdfDestination implements IPdfWrapper {
    // Fields
    /**
     * Internal variable for accessing fields from `DictionryProperties` class.
     * @private
     */
    protected dictionaryProperties : DictionaryProperties = new DictionaryProperties();
    /**
     * Type of the `destination`.
     * @private
     */
    private destinationMode : PdfDestinationMode = PdfDestinationMode.Location;
    /**
     * `Zoom` factor.
     * @private
     * @default 0
     */
    private zoomFactor : number = 0;
    /**
     * `Location` of the destination.
     * @default new PointF() with 0 ,0 as co-ordinates
     * @private
     */
    private destinationLocation : PointF = new PointF(0, 0);
    /**
     * `Bounds` of the destination as RectangleF.
     * @default RectangleF.Empty
     * @private
     */
    private bounds : RectangleF = new RectangleF();
    /**
     * Parent `page` reference.
     * @private
     */
    private pdfPage : PdfPageBase;
    /**
     * Pdf primitive representing `this` object.
     * @private
     */
    private array : PdfArray = new PdfArray();
    // Constructors
    /**
     * Initializes a new instance of the `PdfDestination` class with page object.
     * @private
     */
    public constructor(page : PdfPageBase)
    /**
     * Initializes a new instance of the `PdfDestination` class with page object and location.
     * @private
     */
    public constructor(page : PdfPageBase, location : PointF)
    /**
     * Initializes a new instance of the `PdfDestination` class with page object and bounds.
     * @private
     */
    public constructor(page : PdfPageBase, rectangle : RectangleF)
    public constructor(arg1 : PdfPageBase, arg2 ?: RectangleF | PointF) {
            let angle : PdfPageRotateAngle = PdfPageRotateAngle.RotateAngle0;
            this.destinationLocation = new PointF(0,  this.destinationLocation.y);
            this.pdfPage = arg1;
            if (arg2 instanceof PointF) {
                this.destinationLocation = arg2;
            } else {
                this.bounds = arg2;
            }
    }
    // Properties
    /**
     * Gets and Sets the `zoom` factor.
     * @private
     */
    public get zoom() : number {
        return this.zoomFactor;
    }
    public set zoom(value : number) {
        this.zoomFactor = value;
        this.initializePrimitive();
    }
    /**
     * Gets and Sets the `page` object.
     * @private
     */
    public get page() : PdfPageBase {
        return this.pdfPage;
    }
    public set page(value : PdfPageBase) {
        this.pdfPage = value;
        this.initializePrimitive();
    }
    /**
     * Gets and Sets the destination `mode`.
     * @private
     */
    public get mode() : PdfDestinationMode {
        return this. destinationMode;
    }
    public set mode(value : PdfDestinationMode) {
        this.destinationMode = value;
        this.initializePrimitive();
    }
    /**
     * Gets and Sets the `location`.
     * @private
     */
    public get location() : PointF {
        return this.destinationLocation;
    }
    public set location(value : PointF) {
        this.destinationLocation = value;
        this.initializePrimitive();
    }
    /**
     * `Translates` co-ordinates to PDF co-ordinate system (lower/left).
     * @private
     */
    private pointToNativePdf(page : PdfPage, point : PointF) : PointF {
        let section : PdfSection = page.section;
        return section.pointToNativePdf(page, point);
    }
    /**
     * `In fills` array by correct values.
     * @private
     */
    private initializePrimitive() : void {
        this.array.clear();
        this.array.add(new PdfReferenceHolder(this.pdfPage));
        switch (this.destinationMode) {
            case PdfDestinationMode.Location:
                let simplePage : PdfPage = this.pdfPage as PdfPage;
                let point : PointF = new PointF();
                point = this.pointToNativePdf(simplePage, this.destinationLocation);
                this.array.add(new PdfName(this.dictionaryProperties.xyz));
                this.array.add(new PdfNumber(point.x));
                this.array.add(new PdfNumber(point.y));
                this.array.add(new PdfNumber(this.zoomFactor));
                break;
            case PdfDestinationMode.FitToPage:
                this.array.add(new PdfName(this.dictionaryProperties.fit));
                break;
        }
    }
    /**
     * Gets the `element` representing this object.
     * @private
     */
    public get element() : IPdfPrimitive {
        this.initializePrimitive();
        return this.array;
    }
}