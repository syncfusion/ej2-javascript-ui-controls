/**
 * PdfRadialGradientBrush.ts class for EJ2-PDF
 */
import { PdfColorSpace } from './../enum';
import { PdfColor } from './../pdf-color';
import { PdfBrush } from './pdf-brush';
import { PointF, RectangleF } from './../../drawing/pdf-drawing';
import { PdfDictionary} from '../../primitives/pdf-dictionary';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { PdfBoolean } from '../../primitives/pdf-boolean';
import { PdfArray } from './../../primitives/pdf-array';
import { PdfNumber } from './../../primitives/pdf-number';
import { PdfColorBlend  } from './pdf-color-blend';
import { PdfBlend } from './pdf-blend';
import { PdfGradientBrush } from './pdf-gradient-brush';
import { PdfExtend , ShadingType} from './enum';
/**
 * `PdfRadialGradientBrush` Represent radial gradient brush.
 * @private
 */
export class PdfRadialGradientBrush extends PdfGradientBrush {
    //Fields
    /**
     * Local varaible to store the point start.
     * @private
     */
    private mPointStart: PointF;
    /**
     * Local varaible to store the radius start.
     * @private
     */
    private mRadiusStart: number;
    /**
     * Local varaible to store the point End.
     * @private
     */
    private mPointEnd: PointF;
    /**
     * Local varaible to store the radius End.
     * @private
     */
    private mRadiusEnd: number;
    /**
     * Local varaible to store the colours.
     * @private
     */
    private mColour: PdfColor[];
    /**
     * Local varaible to store the colour blend.
     * @private
     */
    private mColourBlends: PdfColorBlend;
    /**
     * Local varaible to store the blend.
     * @private
     */
    private mBlend: PdfBlend;
    /**
     * Local varaible to store the boundaries.
     * @private
     */
    private mBoundaries: RectangleF;
    /**
     * Local varaible to store the dictionary properties.
     */
    private mDictionaryProperties : DictionaryProperties = new DictionaryProperties();
    //Constructor
    /**
     * Initializes a new instance of the `PdfRadialGradientBrush` class.
     * @public
     */
    /* tslint:disable-next-line:max-line-length */
    public constructor(centerStart: PointF, radiusStart: number, centerEnd: PointF, radiusEnd: number, colorStart: PdfColor, colorEnd: PdfColor) {
        super(new PdfDictionary());
        this.initialize(colorStart, colorEnd);
        if (radiusStart < 0) {
            throw new Error('ArgumentOutOfRangeException : radiusStart - The radius cannot be less then zero.');
        }
        if (radiusEnd < 0) {
            throw new Error('ArgumentOutOfRangeException : radiusEnd - The radius cannpt be less then zero.');
        }
        this.mPointEnd = centerEnd;
        this.mPointStart = centerStart;
        this.mRadiusStart = radiusStart;
        this.mRadiusEnd = radiusEnd;
        this.setPoints(this.mPointStart, this.mPointEnd, this.mRadiusStart, this.mRadiusEnd);
    }
    /**
     * Initializes a new instance of the `PdfRadialGradientBrush` class.
     * @param color1 The color1.
     * @param color2 The color2.
     */
    private initialize(color1: PdfColor, color2: PdfColor) : void {
        this.mColour = [ color1, color2];
        this.mColourBlends = new PdfColorBlend(2);
        this.mColourBlends.positions = [ 0, 1];
        this.mColourBlends.colors = this.mColour;
        this.initShading();
    }
    //Properties
    /**
     * Gets or sets a PdfBlend that specifies positions and factors that define a custom falloff for the gradient.
     * @public
     */
    public get blend(): PdfBlend {
        return this.mBlend;
    }
    public set blend(value: PdfBlend)  {
        if ((value == null)) {
            throw new Error('ArgumentNullException : Blend');
        }
        if ((this.mColour == null && typeof this.mColour === 'undefined')) {
            throw new Error('NotSupportedException : There is no starting and ending colours specified.');
        }
        this.mBlend = value;
        this.mColourBlends = this.mBlend.generateColorBlend(this.mColour, this.colorSpace);
        this.resetFunction();
    }
    /**
     * Gets or sets a ColorBlend that defines a multicolor radial gradient.
     * @public
     */
    public get interpolationColors(): PdfColorBlend {
        return this.mColourBlends;
    }
    public set interpolationColors(value: PdfColorBlend)  {
        if (value == null) {
            throw new Error('ArgumentNullException : InterpolationColors');
        }
        this.mBlend = null;
        this.mColour = null;
        this.mColourBlends = value;
        this.resetFunction();
    }
    /**
     * Gets or sets the starting and ending colors of the radial gradient.
     * @public
     */
    public get linearColors(): PdfColor[] {
        return this.mColour;
    }
    public set linearColors(value: PdfColor[]) {
        if ((value == null)) {
            throw new Error('ArgumentNullException : radial LinearColors');
        }
        if ((value.length < 2)) {
            throw new Error('ArgumentException : The array is too small LinearColors');
        }
        if ((this.mColour == null && typeof this.mColour === 'undefined')) {
            this.mColour = [value[0], value[1]];
        } else {
            this.mColour[0] = value[0];
            this.mColour[1] = value[1];
        }
        if ((this.mBlend == null && typeof this.mBlend === 'undefined')) {
            //  Set correct colour blend.
            this.mColourBlends = new PdfColorBlend(2);
            this.mColourBlends.colors = this.mColour;
            this.mColourBlends.positions = [0, 1];
        } else {
            this.mColourBlends = this.mBlend.generateColorBlend(this.mColour, this.colorSpace);
        }
        this.resetFunction();
    }
    /**
     * Gets or sets the rectangle.
     * @public
     */
    public get rectangle(): RectangleF {
        return this.mBoundaries;
    }
    public set rectangle(value: RectangleF)  {
        this.mBoundaries = value;
        this.bBox = PdfArray.fromRectangle(value);
    }
    /**
     * Gets or sets the value indicating whether the gradient
     *  should extend starting and ending points.
     * @public
     */
    public get extend(): PdfExtend {
        let result1 : PdfExtend = PdfExtend.None;
        let extend1 : PdfArray = (<PdfArray>(this.shading.items.getValue(this.mDictionaryProperties.extend)));
        if (extend1 !== null && typeof extend1 !== 'undefined') {
            let extStart : PdfBoolean = (<PdfBoolean>(extend1.items(0)));
            let extEnd : PdfBoolean = (<PdfBoolean>(extend1.items(1)));
            if (extStart.value) {
                result1 = (result1 | PdfExtend.Start);
            }
            if (extEnd.value) {
                result1 = (result1 | PdfExtend.End);
            }
        }
        return result1;
    }
    public set extend(value: PdfExtend)  {
        let extend : PdfArray = (<PdfArray>(this.shading.items.getValue(this.mDictionaryProperties.extend)));
        let extStart : PdfBoolean;
        let extEnd1 : PdfBoolean;
        if (extend == null && typeof extend === 'undefined') {
            extStart = new PdfBoolean(false);
            extEnd1 = new PdfBoolean(false);
            extend = new PdfArray();
            extend.add(extStart);
            extend.add(extEnd1);
            this.shading.items.setValue(this.mDictionaryProperties.extend, extend);
        } else {
            extStart = (<PdfBoolean>(extend.items(0)));
            extEnd1 = (<PdfBoolean>(extend.items(1)));
        }
    }
    //Implementation
    /**
     * Sets the points.
     * @param pointStart The point start.
     * @param pointEnd The point end.
     * @param radiusStart The radius start.
     * @param radiusEnd The radius end.
     */
    private setPoints(pointStart: PointF, pointEnd: PointF, radiusStart: number, radiusEnd: number) : void {
        let points: PdfArray = new PdfArray();
        points.add(new PdfNumber(pointStart.x));
        points.add(new PdfNumber(this.updateY(pointStart.y)));
        points.add(new PdfNumber(radiusStart));
        points.add(new PdfNumber(pointEnd.x));
        points.add(new PdfNumber(this.updateY(pointEnd.y)));
        if ((radiusStart !== radiusEnd)) {
            points.add(new PdfNumber(radiusEnd));
        } else {
            points.add(new PdfNumber(0));
        }
        this.shading.items.setValue(this.mDictionaryProperties.coords, points);
    }
    /**
     * Update y co-ordinate.
     * @param y Y co-ordinate.
     */
    private updateY(y: number): number {
        if (y !== 0) {
            return -y;
        } else {
            return y;
        }
    }
    /**
     * Initializess the shading dictionary.
     * @private
     */
    private initShading(): void {
        this.colorSpace = PdfColorSpace.Rgb;
        this.function = this.mColourBlends.getFunction(this.colorSpace);
        this.shading.items.setValue(this.mDictionaryProperties.shadingType, new PdfNumber((<number>(ShadingType.Radial))));
    }
    //Overrides
    /**
     * Creates a new copy of a brush.
     * @public
     */
    public clone(): PdfBrush {
        let rBrush: PdfRadialGradientBrush = this;
        rBrush.resetPatternDictionary(new PdfDictionary(this.patternDictionary));
        rBrush.shading = new PdfDictionary();
        rBrush.initShading();
        rBrush.setPoints(this.mPointStart, this.mPointEnd, this.mRadiusStart, this.mRadiusEnd);
        if ( rBrush instanceof PdfRadialGradientBrush) {
            if ((this.matrix !== null && typeof this.matrix !== 'undefined')) {
                rBrush.matrix = this.matrix.clone();
            }
        }
        if ((this.mColour !== null && typeof this.mColour !== 'undefined')) {
            rBrush.mColour = (<PdfColor[]>(this.mColour));
        }
        if ((this.blend !== null && typeof this.blend !== 'undefined')) {
            rBrush.blend = this.blend.clonePdfBlend();
        } else if ((this.interpolationColors !== null && typeof this.interpolationColors !== 'undefined')) {
            rBrush.interpolationColors = this.interpolationColors.cloneColorBlend();
        }
        rBrush.extend = this.extend;
        this.cloneBackgroundValue(rBrush);
        this.cloneAntiAliasingValue(rBrush);
        return rBrush;
    }
    /**
     * Resets the function.
     * @public
     */
    public resetFunction() : void {
        this.function = this.mColourBlends.getFunction(this.colorSpace);
    }
}