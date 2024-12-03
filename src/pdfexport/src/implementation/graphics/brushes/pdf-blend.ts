/**
 * PdfBlend.ts class for EJ2-PDF
 */
import { PdfColorSpace } from './../enum';
import { PdfColor } from './../pdf-color';
import { PdfColorBlend } from './pdf-color-blend';
/**
 * `PdfBlend` Represents the blend color space
 * @private
 */
export class PdfBlend {
    //Constants
    /**
     * precision of the GCD calculations.
     * @private
     */
    private precision: number = 1000;
    //Fields
    /**
     * Local variable to store the count.
     * @private
     */
    private mCount: number;
    /**
     * Local variable to store the positions.
     * @private
     */
    private mPositions: number[];
    /**
     * Local variable to store the factors
     * @private.
     */
    private mFactors: number[];
    //Constructor
    /**
     * Initializes a new instance of the `PdfBlend` class.
     * @public
     */
    public constructor ()
    /**
     * Initializes a new instance of the `PdfBlend` class.
     * @public
     */
    public constructor (count : number)
    public constructor (count ?: number) {
        //
    }
    //Properties
    /**
     * Gets or sets the array of factor to the blend.
     * @public
     */
    public get factors(): number[] {
        return this.mFactors;
    }
    public set factors(value: number[])  {
        if ((value == null)) {
            throw new Error('ArgumentNullException : Factors');
        }
        this.mFactors = value;
    }
    /**
     * 'positions' Gets or sets the array of positions
     * @public
     */
    public get positions(): number[] {
        return this.mPositions;
    }
    public set positions(value: number[]) {
        let positionarray: number[] = value;
        for (let i: number = 0; i < positionarray.length; i++) {
            if (((positionarray[i] < 0) || (positionarray[i] > 1))) {
                positionarray[i] = 0;
            }
        }
        this.mPositions = positionarray;
        this.mPositions = value;
    }
    /**
     * Gets the number of elements that specify the blend.
     * @protected
     */
    protected get count(): number {
        return this.mCount;
    }
    //Implementation
    /**
     * Generates a correct color blend.
     * @param colours The colours.
     * @param colorSpace The color space.
     */
    public generateColorBlend(colours: PdfColor[], colorSpace: PdfColorSpace): PdfColorBlend {
        if ((colours == null)) {
            throw new Error('ArgumentNullException : colours');
        }
        if ((this.positions == null)) {
            this.positions = [0];
        }
        let cBlend: PdfColorBlend = new PdfColorBlend(this.count);
        let positions: number[] = this.positions;
        let clrs: PdfColor[] = null;
        if ((positions.length === 1)) {
            positions = [3];
            positions[0] = 0;
            positions[1] = this.positions[0];
            positions[2] = 1;
            /* tslint:disable */
            clrs = new Array(3);
            clrs[0] = colours[0];
            clrs[1] = colours[0];
            clrs[2] = colours[1];
        } else {
            let c1: PdfColor = colours[0];
            let c2: PdfColor = colours[1];
            /* tslint:disable */
            clrs = new Array(this.count);
            let i: number = 0;
            let count : number = this.count;
            for (i = 0; i < count; ++i) {
                clrs[i] = this.interpolate(this.mFactors[i], c1, c2, colorSpace);
            }
        }
        cBlend.positions = positions;
        cBlend.colors = clrs;
        return cBlend;
    }
    /**
     * 'clonePdfBlend' Clones this instance.
     * @public
     */
    public clonePdfBlend(): PdfBlend {
        let blend: PdfBlend = this;
        if ((this.mFactors != null)) {
            blend.factors = (<number[]>(this.mFactors));
        }
        if ((this.positions != null)) {
            blend.positions = (<number[]>(this.positions));
        }
        return blend;
    }
    /**
     * Calculate the GCD of the specified values.
     * @param u The values.
     */
    protected gcd(u: number[]): number
    /**
     * Determines greatest common divisor of the specified u and v.
     * @param u The u.
     * @param v The v.
     */
    protected gcd(u: number, v: number): number
    protected gcd(u?: number|number[], v?: number): number {
        if ( typeof u === 'number' && typeof v === 'number' && typeof v !== 'undefined') {
            if (((u < 0) || (u > 1))) {
                throw new Error('ArgumentOutOfRangeException : u');
            }
            if (((v < 0) || (v > 1))) {
                throw new Error('ArgumentOutOfRangeException : v');
            }
            let iU: number = (<number>(Math.max(1, (u * this.precision))));
            let iV: number = (<number>(Math.max(1, (v * this.precision))));
            let iResult: number = this.gcdInt(iU, iV);
            let result: number = ((<number>(iResult)) / this.precision);
            return result;
        } else {
            let values : number[] = u as number[];
            if ((values == null)) {
                throw new Error('ArgumentNullException : values');
            }
            if ((values.length < 1)) {
                throw new Error('ArgumentException : Not enough values in the array. - values');
            }
            let gcd: number = values[0];
            if ((values.length > 1)) {
                let count: number = values.length;
                for (let i : number = 1; i < count; ++i) {
                    gcd = this.gcd(values[i], gcd);
                    if ((gcd === (1 / this.precision))) {
                        break;
                    }
                }
            }
            return gcd;
        }
    }
    /**
     * Calculate the GCD int of the specified values.
     * @param u The u.
     * @param v The v.
     */
    protected gcdInt(u: number, v: number): number {
        if ((u <= 0)) {
            throw new Error('ArgumentOutOfRangeException' + u + 'The arguments cannot be less or equal to zero.');
        }
        if ((v <= 0)) {
            throw new Error('ArgumentOutOfRangeException' + v + 'The arguments cannot be less or equal to zero.');
        }
        if (((u === 1) || (v === 1))) {
            return 1;
        }
        let shift: number = 0;
        while (this.isEven(u, v)) {
            ++shift;
            u >>= 1;
            v >>= 1;
        }
        while (((u & 1) <= 0)) {
            u >>= 1;
        }
        do {
            while ((v & 1) <= 0) {
                v >>= 1;
            }
            if (u > v) {
                let t : number = v; v = u; u = t;
            }
            v = v - u;
        } while (v !== 0);
        return (u << shift);
    }
    /**
     * Determines if the u value is even.
     * @param u The u value.
     */
    private isEven(u: number): boolean
    /**
     * Determines if both parameters are even numbers.
     * @param u The first value.
     * @param v The second value.
     */
    private isEven(u: number, v: number): boolean
    private isEven(arg1?: number, arg2?: number): boolean {
        if (typeof arg2 === 'number' && typeof arg2 !== 'undefined') {
            let result : boolean = true;
            result = (result && ((arg1 & 1) <= 0)); //  Is u even?
            result = (result && ((arg2 & 1) <= 0)); //  Is v even?
            return result;
        } else {
            return ((arg1 & 1) <= 0);
        }
    }
    /**
     * Interpolates the specified colours according to the t value.
     * @param t The t value, which show the imagine position on a line from 0 to 1.
     * @param v1 The minimal value.
     * @param v2 The maximal value.
     */
    protected interpolate(t: number, v1: number, v2: number): number
    /**
     * Interpolates the specified colours according to the t value.
     * @param t The t value, which show the imagine position on a line from 0 to 1.
     * @param color1 The minimal colour.
     * @param color2 The maximal colour.
     * @param colorSpace The color space.
     */
    protected interpolate(t: number, color1: PdfColor, color2: PdfColor, colorSpace: PdfColorSpace): PdfColor
    protected interpolate(t: number, color1: number|PdfColor, color2: number|PdfColor, colorSpace?: PdfColorSpace): PdfColor|number {
        if (color1 instanceof PdfColor) {
            let color: PdfColor = new PdfColor();
            switch (colorSpace) {
                case PdfColorSpace.Rgb:
                    let red: number = (<number>(this.interpolate(t, color1.red, (color2 as PdfColor).red)));
                    let green: number = (<number>(this.interpolate(t, color1.green, (color2 as PdfColor).green)));
                    let blue: number = (<number>(this.interpolate(t, color1.blue, (color2 as PdfColor).blue)));
                    color = new PdfColor(red, green, blue);
                    break;
                    case PdfColorSpace.GrayScale:
                    let gray: number = (<number>(this.interpolate(t, color1.gray, (color2 as PdfColor).gray)));
                    color = new PdfColor(gray);
                    break;
                case PdfColorSpace.Cmyk:
                    let cyan: number = (<number>(this.interpolate(t, color1.c, (color2 as PdfColor).c)));
                    let magenta: number = (<number>(this.interpolate(t, color1.m, (color2 as PdfColor).m)));
                    let yellow: number = (<number>(this.interpolate(t, color1.y, (color2 as PdfColor).y)));
                    let black: number = (<number>(this.interpolate(t, color1.k, (color2 as PdfColor).k)));
                    color = new PdfColor(cyan, magenta, yellow, black);
                    break;
            }
            return color;
        } else {
            let t0: number = 0;
            let t1: number = 1;
            let result: number = 0;
            if ((t === t0)) {
                result = color1;
            } else if ((t === t1)) {
                result = <number>color2;
            } else {
                result = (color1 + ((t - t0) * (((color2 as number) - color1) / (t1 - t0))));
            }
            return result;
        }
    }
}