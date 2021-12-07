/**
 * PdfSampledFunction.ts class for EJ2-PDF
 * Implements PDF Sampled Function.
 */
import { PdfArray } from './../../primitives/pdf-array';
import { PdfFunction} from './pdf-function';
import { PdfStream } from './../../primitives/pdf-stream';
import { PdfNumber} from './../../primitives/pdf-number';
export class PdfSampledFunction extends PdfFunction {
    //Constructor
    /**
     * Initializes a new instance of the `PdfSampledFunction` class.
     * @public
     */
    public constructor()
    /**
     * Initializes a new instance of the `PdfSampledFunction` class.
     * @public
     */
    public constructor(domain: number[], range: number[], sizes: number[], samples: number[])
    /**
     * Initializes a new instance of the `PdfSampledFunction` class.
     * @public
     */
    public constructor(domain?: number[], range?: number[], sizes?: number[], samples?: number[]) {
        super(new PdfStream());
        if (typeof domain === 'undefined') {
            this.dictionary.items.setValue(this.mDictionaryProperties.functionType, new PdfNumber(0));
        } else {
            this.dictionary.items.setValue(this.mDictionaryProperties.functionType, new PdfNumber(0));
            this.checkParams(domain, range, sizes, samples);
            this.setDomainAndRange(domain, range);
            this.setSizeAndValues(sizes, samples);
        }
    }
    // Helper methods
    /**
     * Checks the input parameters. 
     */
    private checkParams(domain: number[], range: number[], sizes: number[], samples: number[]) : void {
        let rLength: number = range.length;
        let dLength: number = domain.length;
        let sLength: number = samples.length;
        let frameLength: number = (rLength * (dLength / 4));
    }
    /**
     * Sets the domain and range.
     */
    private setDomainAndRange(domain: number[], range: number[]) : void {
        this.domain = new PdfArray(domain);
        this.range = new PdfArray(range);
    }
    /**
     * Sets the size and values.
     */
    private setSizeAndValues(sizes: number[], samples: number[]) : void {
        let s: PdfStream = (<PdfStream>(this.dictionary));
        this.dictionary.items.setValue(this.mDictionaryProperties.size, new PdfArray(sizes));
        this.dictionary.items.setValue(this.mDictionaryProperties.bitsPerSample, new PdfNumber(8));
        s.writeBytes(samples);
    }
}
