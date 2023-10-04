/**
 * PdfColorBlend.ts class for EJ2-PDF
 */
import { PdfColorSpace } from './../enum';
import { PdfColor } from './../pdf-color';
import { PdfBrush } from './pdf-brush';
import { PdfFunction } from './../../general/functions/pdf-function';
import { PdfSampledFunction} from './../../general/functions/pdf-sampled-function';
import { PdfBlend } from './pdf-blend';
/**
 * `PdfColorBlend` Represents the arrays of colors and positions used for
 *  interpolating color blending in a multicolor gradient.
 * @private
 */
export class PdfColorBlend extends PdfBlend {
    //Fields
    /**
     * Array of colors.
     * @private
     */
    private mcolors: PdfColor[];
    /**
     * Local variable to store the brush.
     */
    private mbrush: PdfBrush;
    //Constructor
    /**
     * Initializes a new instance of the `PdfColorBlend` class.
     * @public
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfColorBlend` class.
     * @public
     */
    public constructor(count: number)
    public constructor(count?: number) {
        super();
        if (typeof count === 'number') {
            super(count);
        }
    }
    //Properties
    /**
     * Gets or sets the array of colors.
     * @public
     */
    public get colors(): PdfColor[] {
        return this.mcolors;
    }
    public set colors(value: PdfColor[])  {
        if ((value == null)) {
            throw new Error('ArgumentNullException : Colors');
        }
        this.mcolors = value;
    }
    //Implementation
    /**
     * Gets the function.
     * @param colorSpace The color space.
     * @public
     */
    public getFunction(colorSpace: PdfColorSpace): PdfFunction {
        let domain: number[] = [ 0, 1];
        let colourComponents: number = this.getColorComponentsCount(colorSpace);
        let maxComponentValue: number = this.getMaxComponentValue(colorSpace);
        let range: number[] = this.setRange(colourComponents, maxComponentValue);
        let func: PdfSampledFunction = null;
        if ((this.mbrush == null && typeof this.mbrush === 'undefined')) {
            let sizes: number[] = [1];
            let samplesCount: number;
            let step: number = 1;
            if (this.positions.length === 2) {
                samplesCount = 2;
            } else {
                let positions: number[] = this.positions;
                let intervals: number[] = this.getIntervals(positions);
                let gcd: number = this.gcd(intervals);
                step = gcd;
                samplesCount = ((<number>((1 / gcd))) + 1);
            }
            sizes[0] = samplesCount;
            let samples: number[] = this.getSamplesValues(colorSpace, samplesCount, maxComponentValue, step);
            func = new PdfSampledFunction(domain, range, sizes, samples);
            return func;
        }
        return func;
    }
    /**
     * 'cloneColorBlend' Clones this instance.
     * @public
     */
    public cloneColorBlend(): PdfColorBlend {
        let cBlend: PdfColorBlend = this;
        if ((this.mcolors != null && typeof this.mcolors !== 'undefined')) {
            cBlend.colors = (<PdfColor[]>(this.mcolors));
        }
        if ((this.positions != null && typeof this.positions !== 'undefined')) {
            cBlend.positions = (<number[]>(this.positions));
        }
        return cBlend;
    }
    /**
     * Sets the range.
     * @param colourComponents The colour components.
     * @param maxValue The max value.
     */
    private setRange(colourComponents: number, maxValue: number): number[] {
        let range: number[] = [(colourComponents * 2)];
        for (let i: number = 0; (i < colourComponents); ++i) {
            range[(i * 2)] = 0;
            range[((i * 2) + 1)] = 1;
        }
        return range;
    }
    /**
     * Calculates the color components count according to colour space.
     * @param colorSpace The color space.
     */
    private getColorComponentsCount(colorSpace: PdfColorSpace): number {
        let count: number = 0;
        switch (colorSpace) {
            case PdfColorSpace.Rgb:
                count = 3;
                break;
            case PdfColorSpace.Cmyk:
                count = 4;
                break;
            case PdfColorSpace.GrayScale:
                count = 1;
                break;
            default:
                throw new Error('ArgumentException - Unsupported color space: ' + colorSpace + ' colorSpace');
        }
        return count;
    }
    /**
     * Gets samples values for specified colour space.
     * @param colorSpace The color space.
     * @param sampleCount The sample count.
     * @param maxComponentValue The max component value.
     * @param step The step.
     */
    private getSamplesValues(colorSpace: PdfColorSpace, sampleCount: number, maxComponentValue: number, step: number): number[] {
        let values: number[];
        switch (colorSpace) {
            case PdfColorSpace.GrayScale:
                values = this.getGrayscaleSamples(sampleCount, maxComponentValue, step);
                break;
            case PdfColorSpace.Cmyk:
                values = this.getCmykSamples(sampleCount, maxComponentValue, step);
                break;
            case PdfColorSpace.Rgb:
                values = this.getRgbSamples(sampleCount, maxComponentValue, step);
                break;
            default:
                throw new Error('ArgumentException - Unsupported color space: ' + colorSpace + ' colorSpace');
        }
        return values;
    }
    /**
     * Gets the grayscale samples.
     * @param sampleCount The sample count.
     * @param maxComponentValue The max component value.
     * @param step The step.
     */
    private getGrayscaleSamples(sampleCount: number, maxComponentValue: number, step: number): number[] {
        let values: number[] = [(sampleCount * 2)];
        for (let i: number = 0; (i < sampleCount); ++i) {
            let color: PdfColor = this.getNextColor(i, step, PdfColorSpace.GrayScale);
            let index: number = (i * 2);
        }
        return values;
    }
    /**
     * Gets the RGB samples.
     * @param sampleCount The sample count.
     * @param maxComponentValue The max component value.
     * @param step The step.
     */
    private getRgbSamples(sampleCount: number, maxComponentValue: number, step: number): number[] {
        let values: number[] = [(sampleCount * 3)];
        for (let i: number = 0; (i < sampleCount); ++i) {
            let color: PdfColor = this.getNextColor(i, step, PdfColorSpace.Rgb);
            let index: number = (i * 3);
            values[index] = color.r;
            values[(index + 1)] = color.g;
            values[(index + 2)] = color.b;
        }
        return values;
    }
    /**
     * Gets the CMYK samples.
     * @param sampleCount The sample count.
     * @param maxComponentValue The max component value.
     * @param step The step.
     */
    private getCmykSamples(sampleCount: number, maxComponentValue: number, step: number): number[] {
        let values: number[] = [(sampleCount * 4)];
        for (let i: number = 0; (i < sampleCount); i++) {
            let color: PdfColor = this.getNextColor(i, step, PdfColorSpace.Cmyk);
            let index: number = (i * 4);
            values[index] = (<number>((color.c * maxComponentValue)));
            values[(index + 1)] = (<number>((color.m * maxComponentValue)));
            values[(index + 2)] = (<number>((color.y * maxComponentValue)));
            values[(index + 3)] = (<number>((color.k * maxComponentValue)));
        }
        return values;
    }
    /**
     * Calculates the color that should be at the specified index.
     * @param index The index.
     * @param step The step.
     * @param colorSpace The color space.
     */
    private getNextColor(index: number, step: number, colorSpace: PdfColorSpace): PdfColor {
        let position: number = (step * index);
        let indexHi: number;
        let indexLow: number;
        let result : { indexLow : number, indexHi : number} = this.getIndices(position, indexLow, indexHi);
        indexLow = result.indexLow;
        indexHi = result.indexHi;
        let color: PdfColor;
        if (indexLow === indexHi) {
            color = this.mcolors[indexLow];
        } else {
            let positionLow: number = this.positions[indexLow];
            let positionHi: number = this.positions[indexHi];
            let colorLow: PdfColor = this.mcolors[indexLow];
            let colorHi: PdfColor = this.mcolors[indexHi];
            let t: number = ((position - positionLow) / (positionHi - positionLow));
            color = this.interpolate(t, colorLow, colorHi, colorSpace);
        }
        return color;
    }
    /**
     * Gets the indices.
     * @param position The position.
     * @param indexLow The index low.
     * @param indexHi The index hi.
     */
    private getIndices(position: number, indexLow: number, indexHi: number) : { indexLow : number, indexHi : number} {
        let positions: number[] = this.positions;
        indexLow = 0;
        indexHi = 0;
        for (let i: number = 0; (i < this.mcolors.length); ++i) {
            let currPos: number = positions[i];
            if ((currPos === position)) {
                indexHi = i;
                indexLow = i;
                break;
            } else if ((currPos > position)) {
                indexHi = i;
                break;
            }
            indexLow = i;
            indexHi = i;
        }
        return { indexLow : indexLow, indexHi : indexHi };
    }
    /**
     * Calculates the max component value.
     * @param colorSpace The color space.
     */
    private getMaxComponentValue(colorSpace: PdfColorSpace) : number {
        let result: number = 0;
        switch (colorSpace) {
            case PdfColorSpace.Cmyk:
            case PdfColorSpace.Rgb:
                result = 255;
                break;
            case PdfColorSpace.GrayScale:
                result = 65535;
                break;
            default:
                throw new Error('ArgumentException - Unsupported color space: ' + colorSpace + 'colorSpace');
        }
        return result;
    }
    /**
     * Gets an intervals array from the positions array.
     * @param positions The positions array.
     */
    private getIntervals(positions: number[]): number[] {
        let count: number = positions.length;
        let intervals: number[] = [(count - 1)];
        let prev: number = positions[0];
        for (let i: number = 1; (i < count); ++i) {
            let v: number = positions[i];
            intervals[(i - 1)] = (v - prev);
            prev = v;
        }
        return intervals;
    }
}