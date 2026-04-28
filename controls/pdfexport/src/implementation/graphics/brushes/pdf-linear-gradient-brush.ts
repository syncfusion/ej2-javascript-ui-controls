/**
 * PdfLinearGradientBrush.ts class for EJ2-PDF
 */
import { PdfColorSpace } from './../enum';
import { PdfColor } from './../pdf-color';
import { PdfBrush } from './pdf-brush';
import { PointF, Rectangle } from './../../drawing/pdf-drawing';
import { PdfDictionary} from '../../primitives/pdf-dictionary';
import { DictionaryProperties } from './../../input-output/pdf-dictionary-properties';
import { PdfBoolean } from '../../primitives/pdf-boolean';
import { PdfArray } from './../../primitives/pdf-array';
import { PdfNumber } from './../../primitives/pdf-number';
import { PdfColorBlend  } from './pdf-color-blend';
import { PdfBlend } from './pdf-blend';
import { PdfGradientBrush } from './pdf-gradient-brush';
import { PdfExtend , PdfLinearGradientMode, ShadingType} from './enum';
/**
 * `PdfLinearGradientBrush` Implements linear gradient brush by using PDF axial shading pattern.
 * @private
 */
export class PdfLinearGradientBrush extends PdfGradientBrush {
    //Fields
    /**
     * Local variable to store the point start.
     * @private
     */
    private mPointStart: PointF;
    /**
     * Local variable to store the point end.
     */
    private mPointEnd: PointF;
    /**
     * Local variable to store the colours.
     */
    private mColours: PdfColor[];
    /**
     * Local variable to store the colour Blend.
     */
    private mColourBlend: PdfColorBlend;
    /**
     * Local variable to store the blend.
     * @private
     */
    private mBlend: PdfBlend;
    /**
     * Local variable to store the boundaries.
     * @private
     */
    private mBoundaries: Rectangle;
    /**
     * Local variable to store the dictionary properties.
     * @private
     */
    private mDictionaryProperties : DictionaryProperties = new DictionaryProperties();
    //Constructor
    /**
     * Initializes a new instance of the `PdfLinearGradientBrush` class.
     * @public
     */
    public constructor(point1: PointF, point2: PointF, color1: PdfColor, color2: PdfColor)
    /**
     * Initializes a new instance of the `PdfLinearGradientBrush` class.
     * @public
     */
    public constructor(rect: Rectangle, color1: PdfColor, color2: PdfColor, mode: PdfLinearGradientMode)
    /**
     * Initializes a new instance of the `PdfLinearGradientBrush` class.
     * @public
     */
    public constructor(rect: Rectangle, color1: PdfColor, color2: PdfColor, angle: number)
    /**
     * Initializes a new instance of the `PdfLinearGradientBrush` class.
     * @public
     */
    /* tslint:disable-next-line:max-line-length */
    public constructor(arg1: Rectangle|PdfColor|PointF, arg2: PointF|PdfColor, arg3 ?: PdfColor, arg4 ?: PdfColor|PdfLinearGradientMode|number) {
        super(new PdfDictionary());
        if (arg1 instanceof PointF && arg2 instanceof PointF && arg3 instanceof PdfColor && arg4 instanceof PdfColor) {
            this.initialize(arg3, arg4);
            this.mPointStart = arg1;
            this.mPointEnd = arg2;
            this.setPoints(this.mPointStart, this.mPointEnd);
        } else if (arg1 instanceof Rectangle) {
            this.initialize(arg2 as PdfColor, arg3);
            /* tslint:disable-next-line:max-line-length */
            if ((arg4 === PdfLinearGradientMode.BackwardDiagonal || arg4 === PdfLinearGradientMode.ForwardDiagonal || arg4 === PdfLinearGradientMode.Horizontal || arg4 === PdfLinearGradientMode.Vertical)) {
                this.mBoundaries = arg1 as Rectangle;
                switch (arg4) {
                    case PdfLinearGradientMode.BackwardDiagonal:
                        this.mPointStart = new PointF(arg1.right, arg1.top);
                        this.mPointEnd = new PointF(arg1.left, arg1.bottom);
                        break;
                    case PdfLinearGradientMode.ForwardDiagonal:
                        this.mPointStart = new PointF(arg1.left, arg1.top);
                        this.mPointEnd = new PointF(arg1.right, arg1.bottom);
                        break;
                    case PdfLinearGradientMode.Horizontal:
                        this.mPointStart = new PointF(arg1.left, arg1.top);
                        this.mPointEnd = new PointF(arg1.right, arg1.top);
                        break;
                    case PdfLinearGradientMode.Vertical:
                        this.mPointStart = new PointF(arg1.left, arg1.top);
                        this.mPointEnd = new PointF(arg1.left, arg1.bottom);
                        break;
                    default:
                        throw new Error('ArgumentException -- Unsupported linear gradient mode: ' + arg4 + ' mode');
                }
                this.setPoints(this.mPointStart, this.mPointEnd);
            } else if (typeof arg4 === 'number' && typeof arg4 !== 'undefined') {
                this.mBoundaries = arg1;
                arg4 = arg4 % 360;
                if ((arg4 === 0)) {
                    this.mPointStart = new PointF(arg1.left, arg1.top);
                    this.mPointEnd = new PointF(arg1.right, arg1.top);
                } else if ((arg4 === 90)) {
                    this.mPointStart = new PointF(arg1.left, arg1.top);
                    this.mPointEnd = new PointF(arg1.left, arg1.bottom);
                } else if ((arg4 === 180)) {
                    this.mPointEnd = new PointF(arg1.left, arg1.top);
                    this.mPointStart = new PointF(arg1.right, arg1.top);
                } else if ((arg4 === 270)) {
                    this.mPointEnd = new PointF(arg1.left, arg1.top);
                    this.mPointStart = new PointF(arg1.left, arg1.bottom);
                } else {
                    let d2r: number = (Math.PI / 180);
                    let radAngle: number = (arg4 * d2r);
                    let k: number = Math.tan(radAngle);
                    let x: number = (this.mBoundaries.left
                                + ((this.mBoundaries.right - this.mBoundaries.left) / 2));
                    let y: number = (this.mBoundaries.top
                                + ((this.mBoundaries.bottom - this.mBoundaries.top) / 2));
                    let centre: PointF = new PointF(x, y);
                    x = (this.mBoundaries.width / (2 * (<number>(Math.cos(radAngle)))));
                    y = (<number>((k * x)));
                    x = (x + centre.x);
                    y = (y + centre.y);
                    let p1: PointF = new PointF(x, y);
                    let cp1: PointF = this.subPoints(p1, centre);
                    //  P1 - P0
                    let p: PointF = this.choosePoint(arg4);
                    let coef: number = (this.mulPoints(this.subPoints(p, centre), cp1)
                                            / this.mulPoints(cp1, cp1));
                    this.mPointEnd = this.addPoints(centre, this.mulPoint(cp1, coef));
                    //  Parametric line equation.
                    this.mPointStart = this.addPoints(centre, this.mulPoint(cp1, (coef * -1)));
                }
                this.setPoints(this.mPointEnd, this.mPointStart);
            }
        }
    }
    /**
     * Initializes a new instance of the `PdfLinearGradientBrush` class.
     * @param color1 The starting color of the gradient.
     * @param color2 The end color of the gradient.
     */
    private initialize(color1: PdfColor, color2: PdfColor) : void {
        this.mColours = [ color1, color2];
        this.mColourBlend = new PdfColorBlend(2);
        this.mColourBlend.positions = [ 0, 1];
        this.mColourBlend.colors = this.mColours;
        this.initShading();
    }
    //Properties
    /**
     * Gets or sets a PdfBlend that specifies positions
     * and factors that define a custom falloff for the gradient.
     * @public
     */
    public get blend(): PdfBlend {
        return this.mBlend;
    }
    public set blend(value: PdfBlend)  {
        if ((value == null)) {
            throw new Error('ArgumentNullException : Blend');
        }
        if ((this.mColours == null)) {
            throw new Error('NotSupportedException : There is no starting and ending colours specified.');
        }
        this.mBlend = value;
        //  TODO: generate correct colour blend.
        this.mColourBlend = this.mBlend.generateColorBlend(this.mColours, this.colorSpace);
        this.resetFunction();
    }
    /**
     * Gets or sets a ColorBlend that defines a multicolor linear gradient.
     * @public
     */
    public get interpolationColors(): PdfColorBlend {
        return this.mColourBlend;
    }
    public set interpolationColors(value: PdfColorBlend)  {
        if ((value == null)) {
            throw new Error('ArgumentNullException : InterpolationColors');
        }
        this.mBlend = null;
        this.mColours = null;
        this.mColourBlend = value;
        this.resetFunction();
    }
    /**
     * Gets or sets the starting and ending colors of the gradient.
     * @public
     */
    public get linearColors(): PdfColor[] {
        return this.mColours;
    }
    public set linearColors(value: PdfColor[])  {
        if ((value == null)) {
            throw new Error('ArgumentNullException : LinearColors');
        }
        if ((value.length < 2)) {
            throw new Error('ArgumentException : The array is too small - LinearColors');
        }
        if ((this.mColours == null && typeof this.mColours === 'undefined')) {
            this.mColours = [value[0], value[1]];
        } else {
            this.mColours[0] = value[0];
            this.mColours[1] = value[1];
        }
        if ((this.mBlend == null && typeof this.mBlend === 'undefined')) {
            //  Set correct colour blend.
            this.mColourBlend = new PdfColorBlend(2);
            this.mColourBlend.colors = this.mColours;
            this.mColourBlend.positions = [0, 1];
        } else {
            this.mColourBlend = this.mBlend.generateColorBlend(this.mColours, this.colorSpace);
        }
        this.resetFunction();
    }
    /**
     * Gets a rectangular region that defines the boundaries of the gradient.
     * @public
     */
    public get rectangle(): Rectangle {
        return this.mBoundaries;
    }
    /**
     * Gets or sets the value indicating whether the gradient should extend starting and ending points.
     * @public
     */
    public get extend(): PdfExtend {
        let result: PdfExtend = PdfExtend.None;
        let extend: PdfArray = (<PdfArray>(this.shading.items.getValue(this.mDictionaryProperties.extend)));
        if ((extend != null)) {
            let extStart: PdfBoolean = (<PdfBoolean>(extend.items(0)));
            let extEnd: PdfBoolean = (<PdfBoolean>(extend.items(1)));
            if (extStart.value) {
                result = (result | PdfExtend.Start);
            }
            if (extEnd.value) {
                result = (result | PdfExtend.End);
            }
        }
        return result;
    }
    public set extend(value: PdfExtend) {
        let extend: PdfArray = (<PdfArray>(this.shading.items.getValue(this.mDictionaryProperties.extend)));
        let extStart: PdfBoolean;
        let extEnd: PdfBoolean;
        if ((extend == null)) {
            extStart = new PdfBoolean(false);
            extEnd = new PdfBoolean(false);
            extend = new PdfArray();
            extend.add(extStart);
            extend.add(extEnd);
            this.shading.items.setValue(this.mDictionaryProperties.extend, extend);
        } else {
            extStart = (<PdfBoolean>(extend.items(0)));
            extEnd = (<PdfBoolean>(extend.items(1)));
        }
        // extStart.value = ((value && PdfExtend.Start) > 0);
        // extEnd.value = ((value && PdfExtend.End) > 0);
    }
    //Implementation
    /**
     * Adds two points to each other.
     * @param point1 The point1.
     * @param point2 The point2.
     */
    private addPoints(point1: PointF, point2: PointF): PointF {
        let x: number = (point1.x + point2.x);
        let y: number = (point1.y + point2.y);
        let result: PointF = new PointF(x, y);
        return result;
    }
    /**
     * Subs the second point from the first one.
     * @param point1 The point1.
     * @param point2 The point2.
     */
    private subPoints(point1: PointF, point2: PointF): PointF {
        let x: number = (point1.x - point2.x);
        let y: number = (point1.y - point2.y);
        let result: PointF = new PointF(x, y);
        return result;
    }
    /**
     * Makes scalar multiplication of two points.
     * @param point1 The point1.
     * @param point2 The point2.
     */
    private mulPoints(point1: PointF, point2: PointF): number {
        let result: number = ((point1.x * point2.x) + (point1.y * point2.y));
        return result;
    }
    /**
     * Multiplies the point by the value specified.
     * @param point The point1.
     * @param value The value.
     */
    private mulPoint(point: PointF, value: number): PointF {
        point.x = (point.x * value);
        point.y = (point.y * value);
        return point;
    }
    /**
     * Choose the point according to the angle.
     * @param angle The angle.
     */
    private choosePoint(angle: number): PointF {
        let point: PointF = new PointF(0, 0);
        //  Choose the correct point.
        if ((angle < 90) && (angle > 0)) {
            point = new PointF(this.mBoundaries.right, this.mBoundaries.bottom);
        } else if ((angle < 180) && (angle > 90)) {
            point = new PointF(this.mBoundaries.left, this.mBoundaries.bottom);
        } else if ((angle < 270) && (angle > 180)) {
            point = new PointF(this.mBoundaries.left, this.mBoundaries.top);
        } else if (angle > 270) {
            point = new PointF(this.mBoundaries.right, this.mBoundaries.top);
        } else {
            throw new Error('PdfException - Internal error.');
        }
        return point;
    }
    /**
     * Sets the start and end points.
     * @param point1 The point1.
     * @param point2 The point2.
     */
    private setPoints(point1: PointF, point2: PointF) : void {
        let points: PdfArray = new PdfArray();
        points.add(new PdfNumber(point1.x));
        points.add(new PdfNumber(this.updateY(point1.y)));
        points.add(new PdfNumber(point2.x));
        points.add(new PdfNumber(this.updateY(point2.y)));
        this.shading.items.setValue(this.mDictionaryProperties.coords, points);
    }
    /**
     * Updates y co-ordinate.
     * @param y Y co-ordinate..
     */
    private updateY(y: number): number {
        if (y !== 0) {
            return -y;
        } else {
            return y;
        }
    }
    //Overrides
    /**
     * Initializes the shading dictionary.
     * @private
     */
    private initShading(): void {
        this.colorSpace = PdfColorSpace.Rgb;
        this.function = this.mColourBlend.getFunction(this.colorSpace);
        this.shading.items.setValue(this.mDictionaryProperties.shadingType, new PdfNumber((<number>(ShadingType.Axial))));
    }
    //Overrides
    /**
     * Creates a new copy of a brush.
     * @public
     */
    public clone(): PdfBrush {
        let brush: PdfLinearGradientBrush = this;
        brush.resetPatternDictionary(new PdfDictionary(this.patternDictionary));
        brush.shading = new PdfDictionary();
        brush.initShading();
        brush.setPoints(brush.mPointStart, brush.mPointEnd);
        if (brush !== null && brush instanceof PdfLinearGradientBrush) {
            if ((this.matrix != null && typeof this.matrix !== 'undefined')) {
                brush.matrix = this.matrix.clone();
            }
        }
        if ((this.mColours != null && typeof this.mColours !== 'undefined')) {
            brush.mColours = (<PdfColor[]>(this.mColours));
        }
        if ((this.blend != null && typeof this.blend !== 'undefined')) {
            brush.blend = this.blend.clonePdfBlend();
        } else if ((this.interpolationColors != null && typeof this.interpolationColors !== 'undefined')) {
            brush.interpolationColors = this.interpolationColors.cloneColorBlend();
        }
        brush.extend = this.extend;
        this.cloneBackgroundValue(brush);
        this.cloneAntiAliasingValue(brush);
        return brush;
    }
    /**
     * Resets the function.
     * @public
     */
    public resetFunction() : void {
        this.function = this.mColourBlend.getFunction(this.colorSpace);
    }
}