import { QuietZone, DataMatrixEncoding, DataMatrixSize } from '../barcode/enum/enum';
import { PdfDataMatrixSymbolAttribute } from '../barcode/rendering/canvas-interface';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { MarginModel } from '../barcode/primitives/margin-model';
import { Size } from '../barcode/primitives/size';
import { BarcodeRenderer } from '../barcode/rendering/renderer';
import { BaseAttributes } from '../barcode/rendering/canvas-interface';
import { Rect } from '../barcode/primitives/rect';
import { createMeasureElements, measureText } from '../barcode/utility/dom-util';
import { getBaseAttributes } from '../barcode/utility/barcode-util';

/**
 * DataMatrix used to calculate the DataMatrix barcode
 */
export class DataMatrix {



    /** @private */
    public encodingValue: DataMatrixEncoding;

    /** @private */
    public height: string | number;
    /** @private */
    public width: string | number;
    /** @private */
    public margin: MarginModel;
    /** @private */
    public displayText: DisplayTextModel;

    /** @private */
    public foreColor: string;


    /** @private */
    public isSvgMode: boolean;

    /** @private */
    public value: string;

    private barcodeRenderer: BarcodeRenderer;

    /** @private */
    public size: DataMatrixSize;

    private mXDimension: number = 1;

    private mDataMatrixArray: number[][] = [];

    private actualColumns: number;

    private actualRows: number;

    // eslint-disable-next-line
    /** @private */
    public set XDimension(value: number) {
        this.mXDimension = value;
    }

    private encodedCodeword: number[] | string;


    private mSymbolAttribute: PdfDataMatrixSymbolAttribute;


    private GetData(): number[] {
        const givenString: string = this.value;
        const asciiValue: number[] = [];
        for (let i: number = 0; i < givenString.length; i++) {
            asciiValue.push(givenString.charCodeAt(i));
        }
        return asciiValue;
    }


    private fillZero(destinationArray: number[]): number[] {
        for (let i: number = 0; i < destinationArray.length; i++) {
            destinationArray[i] = 0;
        }
        return destinationArray;
    }


    private DataMatrixNumericEncoder(dataCodeword: number[]): number[] {
        let destinationArray: number[] = dataCodeword;
        let isEven: boolean = true;
        if ((destinationArray.length % 2) === 1) {
            isEven = false;
            destinationArray = Array(dataCodeword.length + 1);
            destinationArray = this.fillZero(destinationArray);
            destinationArray = this.copy(dataCodeword, 0, destinationArray, 0, dataCodeword.length);
        }
        let result: number[] = Array(destinationArray.length / 2);
        result = this.fillZero(result);
        for (let i: number = 0; i < result.length; i++) {

            if (!isEven && i === result.length - 1) {
                result[i] = (destinationArray[2 * i] + 1);
            } else {
                result[i] = ((((destinationArray[2 * i] - 48) * 10) + (destinationArray[(2 * i) + 1] - 48)) + 130);
            }

        }
        return result;
    }


    private ComputeBase256Codeword(val: number, index: number): number {
        const num: number = ((149 * (index + 1)) % 255) + 1;
        const num2: number = val + num;

        if (num2 <= 255) { return num2; }

        return (num2 - 256);
    }


    private DataMatrixBaseEncoder(dataCodeword: number[]): number[] {
        let num: number = 1;

        if (dataCodeword.length > 249) {
            num++;
        }
        let result: number[] = Array((1 + num) + dataCodeword.length);
        result = this.fillZero(result);
        result[0] = 231;
        if (dataCodeword.length <= 249) {
            result[1] = dataCodeword.length;
        } else {
            result[1] = ((dataCodeword.length / 250) + 249);
            result[2] = (dataCodeword.length % 250);
        }
        result = this.copy(dataCodeword, 0, result, 1 + num, dataCodeword.length);
        for (let i: number = 1; i < result.length; i++) {
            result[i] = this.ComputeBase256Codeword(result[i], i);
        }

        return result;
    }



    private copy(
        sourceArray: number[], sourceIndex: number, destinationArray: number[],
        destinationIndex: number, length: number):
        number[] {
        for (let i: number = 0; i < length; i++) {
            destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i];
        }
        return destinationArray;

    }


    private DataMatrixEncoder(dataCodeword: number[]): number[] {
        const result: number[] = dataCodeword;
        let index: number = 0;
        for (let i: number = 0; i < dataCodeword.length; i++) {
            //checks the codeword is digit or not.
            if (dataCodeword[i] >= 48 && dataCodeword[i] <= 57) {
                let prevIndex: number = 0;

                if (i !== 0) {
                    prevIndex = index - 1;
                }

                const prevValue: number = (result[prevIndex] - 1);

                let priorValue: number = 0;
                if (i !== 0 && index !== 1) {

                    priorValue = result[prevIndex - 1];
                }
                //Check the prevValue is digit or non convertable value
                //if it is true ,then combine the 2 digits
                if (priorValue !== 235 && prevValue >= 48 && prevValue <= 57) {
                    result[prevIndex] = (10 * (prevValue - 0) + (dataCodeword[i] - 0) + 130);

                } else {
                    result[index++] = (dataCodeword[i] + 1);
                }
            } else if (dataCodeword[i] < 127) {
                result[index++] = (dataCodeword[i] + 1);
            } else {
                result[index] = 235;
                result[index++] = (((dataCodeword[i] - 127)));
            }
        }
        let encodedData: number[] = Array(index);
        encodedData = this.fillZero(encodedData);
        encodedData = result;
        return encodedData;
    }


    private PrepareDataCodeword(dataCodeword: number[]): number[] | string {
        if (this.encodingValue === 'Auto' || this.encodingValue === 'ASCIINumeric') {
            let number: boolean = true;
            // eslint-disable-next-line
            const extended: boolean = false;
            // eslint-disable-next-line
            const num: number = 0;
            const data: number[] = dataCodeword;
            let encoding: string = 'ASCII';
            for (let i: number = 0; i < data.length; i++) {
                if ((data[i] < 48) || (data[i] > 57)) {
                    number = false;
                }
            }
            if (number) {
                encoding = 'ASCIINumeric';
            }
            if (this.encodingValue === 'ASCIINumeric' && this.encodingValue !== encoding) {
                return 'Data contains invalid characters and cannot be encoded as ASCIINumeric.';
            }
            this.encodingValue = encoding as DataMatrixEncoding;
        }
        let result: number[] = [];
        switch (this.encodingValue) {
        case 'ASCII':
            result = this.DataMatrixEncoder(dataCodeword);
            break;
        case 'ASCIINumeric':
            result = this.DataMatrixNumericEncoder(dataCodeword);
            break;
        case 'Base256':
            result = this.DataMatrixBaseEncoder(dataCodeword);
            break;
        }
        return result;
    }


    private PdfDataMatrixSymbolAttribute(
        symbolRow: number, symbolColumn: number, horizontalDataRegion: number,
        verticalDataRegion: number, dataCodewords: number, correctionCodewords: number,
        interleavedBlock: number, interleavedDataBlock: number):
        PdfDataMatrixSymbolAttribute {
        const mSymbolAttribute: PdfDataMatrixSymbolAttribute = {
            SymbolRow: symbolRow,
            SymbolColumn: symbolColumn,
            HorizontalDataRegion: horizontalDataRegion,
            VerticalDataRegion: verticalDataRegion,
            DataCodewords: dataCodewords,
            CorrectionCodewords: correctionCodewords,
            InterleavedBlock: interleavedBlock,
            InterleavedDataBlock: interleavedDataBlock
        };
        return mSymbolAttribute;
    }



    private getmSymbolAttributes(): PdfDataMatrixSymbolAttribute[] {
        const getmSymbolAttributeValue: PdfDataMatrixSymbolAttribute[] = [];
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(10, 10, 1, 1, 3, 5, 1, 3));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(12, 12, 1, 1, 5, 7, 1, 5));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(14, 14, 1, 1, 8, 10, 1, 8));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(16, 16, 1, 1, 12, 12, 1, 12));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(18, 18, 1, 1, 18, 14, 1, 18));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(20, 20, 1, 1, 22, 18, 1, 22));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(22, 22, 1, 1, 30, 20, 1, 30));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(24, 24, 1, 1, 36, 24, 1, 36));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(26, 26, 1, 1, 44, 28, 1, 44));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(32, 32, 2, 2, 62, 36, 1, 62));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(36, 36, 2, 2, 86, 42, 1, 86));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(40, 40, 2, 2, 114, 48, 1, 114));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(44, 44, 2, 2, 144, 56, 1, 144));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(48, 48, 2, 2, 174, 68, 1, 174));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(52, 52, 2, 2, 204, 84, 2, 102));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(64, 64, 4, 4, 280, 112, 2, 140));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(72, 72, 4, 4, 368, 144, 4, 92));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(80, 80, 4, 4, 456, 192, 4, 114));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(88, 88, 4, 4, 576, 224, 4, 144));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(96, 96, 4, 4, 696, 272, 4, 174));

        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(104, 104, 4, 4, 816, 336, 6, 136));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(120, 120, 6, 6, 1050, 408, 6, 175));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(132, 132, 6, 6, 1304, 496, 8, 163));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(144, 144, 6, 6, 1558, 620, 10, 156));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(8, 18, 1, 1, 5, 7, 1, 5));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(8, 32, 2, 1, 10, 11, 1, 10));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(12, 26, 1, 1, 16, 14, 1, 16));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(12, 36, 2, 1, 22, 18, 1, 22));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(16, 36, 2, 1, 32, 24, 1, 32));
        getmSymbolAttributeValue.push(this.PdfDataMatrixSymbolAttribute(16, 48, 2, 1, 49, 28, 1, 49));
        return getmSymbolAttributeValue;

    }


    private PadCodewords(dataCWLength: number, temp: number[], codeword: number[]): number[] {
        let l: number = temp.length;
        const ms: number[] = [];
        for (let i: number = 0; i < l; i++) {
            ms.push(temp[i]);
        }
        if (l < dataCWLength) {
            ms.push(129);
        }
        l = ms.length;
        while (l < dataCWLength) {	// more padding
            let v: number = 129 + (((l + 1) * 149) % 253) + 1;	// see Annex H
            if (v > 254) {
                v -= 254;
            }
            ms.push(v);

            l = ms.length;
        }
        codeword = Array(ms.length);
        codeword = ms;
        return codeword;
    }
    private EccProduct(a: number, b: number): number {
        if (a === 0 || b === 0) {
            return 0;
        }
        let mLog: number[] = Array(256);
        mLog = this.CreateLogArrays(true);
        let mALog: number[] = Array(256);
        mALog = this.CreateLogArrays(false);
        return mALog[(mLog[a] + mLog[b]) % 255];
    }

    /**
     *  Validate the given input to check whether the input is valid one or not.\
     *
     * @returns {boolean | string}  Validate the given input to check whether the input is valid one or not .
     * @param {HTMLElement} char - Provide the canvas element .
     * @param {HTMLElement} characters - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    private validateInput(char: string, characters: string): boolean | string {
        return char;
    }



    private ComputeErrorCorrection(): number[] | string {
        let dataLength: number = this.encodedCodeword.length;
        this.mSymbolAttribute = this.PdfDataMatrixSymbolAttribute(0, 0, 0, 0, 0, 0, 0, 0);
        let mSymbolAttributes: PdfDataMatrixSymbolAttribute[] = this.getmSymbolAttributes();
        if (!this.size) {
            mSymbolAttributes = this.getmSymbolAttributes();
            for (let i: number = 0; i < mSymbolAttributes.length; i++) {
                const attr: PdfDataMatrixSymbolAttribute = mSymbolAttributes[i];
                if (attr.DataCodewords >= dataLength) {
                    this.mSymbolAttribute = attr;
                    break;
                }
            }
        } else {
            this.mSymbolAttribute = mSymbolAttributes[this.size - 1];
        }
        let temp: number[];
        if (this.mSymbolAttribute.DataCodewords > dataLength) {
            temp = this.PadCodewords(this.mSymbolAttribute.DataCodewords, (this.encodedCodeword as number[]), temp);
            this.encodedCodeword = Array(temp.length);
            this.encodedCodeword = temp;
            dataLength = this.encodedCodeword.length;
        } else if (this.mSymbolAttribute.DataCodewords === 0) {
            return (this.validateInput('Data cannot be encoded as barcode', undefined) as string);

        } else if (this.mSymbolAttribute.DataCodewords < dataLength) {
            // eslint-disable-next-line
            const r: string = this.mSymbolAttribute.SymbolRow.toString();
            // eslint-disable-next-line
            const c: string = this.mSymbolAttribute.SymbolColumn.toString();
            return 'Data too long for {0}x{1} barcode.';
        }
        const k: number = this.mSymbolAttribute.CorrectionCodewords;
        let ctArray: number[] = [];
        ctArray = this.create1DMatrixArray(k + this.mSymbolAttribute.DataCodewords, ctArray);
        const step: number = this.mSymbolAttribute.InterleavedBlock;
        const symbolDataWords: number = this.mSymbolAttribute.DataCodewords;
        const blockErrorWords: number = this.mSymbolAttribute.CorrectionCodewords / step;
        const total: number = symbolDataWords + blockErrorWords * step;
        const mrsPolynomial: number[] = this.CreateRSPolynomial(step, this.mSymbolAttribute);
        const mBlockLength: number = 68;
        let b: number[] = [];
        b = this.create1DMatrixArray(mBlockLength, b);
        for (let block: number = 0; block < step; block++) {
            for (let bI: number = 0; bI < b.length; bI++) {
                b[bI] = 0;
            }
            for (let i: number = block; i < symbolDataWords; i += step) {
                const val: number = this.EccSum(b[blockErrorWords - 1], (this.encodedCodeword[i] as number));
                for (let j: number = blockErrorWords - 1; j > 0; j--) {
                    b[j] = this.EccSum(b[j - 1], this.EccProduct(mrsPolynomial[j], val));
                }
                b[0] = this.EccProduct(mrsPolynomial[0], val);
            }
            let blockDataWords: number = 0;
            if (block >= 8 && this.size & DataMatrixSize.Size144x144) {
                blockDataWords = this.mSymbolAttribute.DataCodewords / step;
            } else {
                blockDataWords = this.mSymbolAttribute.InterleavedDataBlock;
                let bIndex: number = blockErrorWords;
                for (let i: number = block + (step * blockDataWords); i < total; i += step) {
                    ctArray[i] = b[--bIndex];

                }
                if (bIndex !== 0) {
                    return 'Error in error correction code generation!';
                }

            }
        }
        if (ctArray.length > k) {
            const tmp: number[] = ctArray;
            ctArray = [];
            ctArray = this.create1DMatrixArray(k, ctArray);
            let z: number = 0;

            for (let i: number = tmp.length - 1; i > this.mSymbolAttribute.DataCodewords; i--) {
                ctArray[z++] = tmp[i];
            }
        }
        return ctArray.reverse();
    }

    private CreateLogArrays(value: boolean): number[] {
        const mLog: number[] = Array(256);
        const maLog: number[] = Array(256);

        mLog[0] = -255;
        maLog[0] = 1;

        for (let i: number = 1; i <= 255; i++) {
            maLog[i] = maLog[i - 1] * 2;

            if (maLog[i] >= 256) {
                maLog[i] = maLog[i] ^ 301;
            }

            mLog[maLog[i]] = i;

        }
        if (value) {
            return mLog;
        } else {
            return maLog;
        }
    }
    private EccSum(a: number, b: number): number {
        return (a ^ b);
    }
    private EccDoublify(a: number, b: number): number {
        if (a === 0) {
            return 0;
        }
        if (b === 0) {
            return a;
        }
        let mLog: number[] = Array(256);
        mLog = this.CreateLogArrays(true);
        let maLog: number[] = Array(256);
        maLog = this.CreateLogArrays(false);
        return maLog[(mLog[a] + b) % 255];
    }



    private CreateRSPolynomial(step: number, mSymbolAttribute: PdfDataMatrixSymbolAttribute): number[] {
        const mBlockLength: number = 69;
        const mrsPolynomial: number[] = Array(mBlockLength);
        const blockErrorWords: number = mSymbolAttribute.CorrectionCodewords / step;
        for (let i: number = 0; i < mrsPolynomial.length; i++) {
            mrsPolynomial[i] = 0x01;
        }
        for (let i: number = 1; i <= blockErrorWords; i++) {
            for (let j: number = i - 1; j >= 0; j--) {
                mrsPolynomial[j] = this.EccDoublify(mrsPolynomial[j], i);
                if (j > 0) {
                    mrsPolynomial[j] = this.EccSum(mrsPolynomial[j], mrsPolynomial[j - 1]);
                }
            }
        }
        return mrsPolynomial;
    }





    private PrepareCodeword(dataCodeword: number[]): number[] | string {
        this.encodedCodeword = this.PrepareDataCodeword(dataCodeword);

        if (isNaN((this.encodedCodeword[0] as number))) {
            return this.encodedCodeword;
        }
        const correctCodeword: string | number[] = this.ComputeErrorCorrection();
        if ((isNaN(correctCodeword[0] as number))) {
            return correctCodeword as string;
        }
        this.encodedCodeword = (this.encodedCodeword as number[]);
        const finalCodeword: number[] = Array(this.encodedCodeword.length + (correctCodeword as number[]).length);
        this.copyArray(finalCodeword, 0, this.encodedCodeword);
        this.copyArray(finalCodeword, this.encodedCodeword.length, (correctCodeword as number[]));
        return finalCodeword;
    }



    private copyArray(array: number[], index: number, correctCodeword: number[]): void {
        for (let i: number = 0; i < correctCodeword.length; i++) {
            array[index + i] = correctCodeword[i];
        }

    }

    private ecc200placementbit(array: number[], NR: number, NC: number, r: number, c: number, p: number, b: number): void {
        if (r < 0) {
            r += NR;
            c += 4 - ((NR + 4) % 8);
        }
        if (c < 0) {
            c += NC;
            r += 4 - ((NC + 4) % 8);
        }
        array[r * NC + c] = (p << 3) + b;
    }
    private ecc200placementblock(array: number[], NR: number, NC: number, r: number, c: number, p: number): void {
        this.ecc200placementbit(array, NR, NC, r - 2, c - 2, p, 7);
        this.ecc200placementbit(array, NR, NC, r - 2, c - 1, p, 6);
        this.ecc200placementbit(array, NR, NC, r - 1, c - 2, p, 5);
        this.ecc200placementbit(array, NR, NC, r - 1, c - 1, p, 4);
        this.ecc200placementbit(array, NR, NC, r - 1, c - 0, p, 3);
        this.ecc200placementbit(array, NR, NC, r - 0, c - 2, p, 2);
        this.ecc200placementbit(array, NR, NC, r - 0, c - 1, p, 1);
        this.ecc200placementbit(array, NR, NC, r - 0, c - 0, p, 0);
    }

    private ecc200placementcornerD(array: number[], NR: number, NC: number, p: number): void {
        this.ecc200placementbit(array, NR, NC, NR - 1, 0, p, 7);
        this.ecc200placementbit(array, NR, NC, NR - 1, NC - 1, p, 6);
        this.ecc200placementbit(array, NR, NC, 0, NC - 3, p, 5);
        this.ecc200placementbit(array, NR, NC, 0, NC - 2, p, 4);
        this.ecc200placementbit(array, NR, NC, 0, NC - 1, p, 3);
        this.ecc200placementbit(array, NR, NC, 1, NC - 3, p, 2);
        this.ecc200placementbit(array, NR, NC, 1, NC - 2, p, 1);
        this.ecc200placementbit(array, NR, NC, 1, NC - 1, p, 0);
    }
    private ecc200placementcornerA(array: number[], NR: number, NC: number, p: number): void {
        this.ecc200placementbit(array, NR, NC, NR - 1, 0, p, 7);
        this.ecc200placementbit(array, NR, NC, NR - 1, 1, p, 6);
        this.ecc200placementbit(array, NR, NC, NR - 1, 2, p, 5);
        const value: number = 4;
        this.ecc200placementbit(array, NR, NC, 0, NC - 2, p, value);
        this.ecc200placementbit(array, NR, NC, 0, NC - 1, p, 3);
        const value1: number = 2;
        this.ecc200placementbit(array, NR, NC, 1, NC - 1, p, value1);
        this.ecc200placementbit(array, NR, NC, 2, NC - 1, p, 1);
        this.ecc200placementbit(array, NR, NC, 3, NC - 1, p, 0);
    }
    private ecc200placementcornerB(array: number[], NR: number, NC: number, p: number): void {
        const value: number = 7;
        this.ecc200placementbit(array, NR, NC, NR - 3, 0, p, value);
        this.ecc200placementbit(array, NR, NC, NR - 2, 0, p, 6);
        this.ecc200placementbit(array, NR, NC, NR - 1, 0, p, 5);
        this.ecc200placementbit(array, NR, NC, 0, NC - 4, p, 4);
        this.ecc200placementbit(array, NR, NC, 0, NC - 3, p, 3);
        this.ecc200placementbit(array, NR, NC, 0, NC - 2, p, 2);
        this.ecc200placementbit(array, NR, NC, 0, NC - 1, p, 1);
        this.ecc200placementbit(array, NR, NC, 1, NC - 1, p, 0);
    }

    private ecc200placementcornerC(array: number[], NR: number, NC: number, p: number): void {
        this.ecc200placementbit(array, NR, NC, NR - 3, 0, p, 7);
        this.ecc200placementbit(array, NR, NC, NR - 2, 0, p, 6);
        this.ecc200placementbit(array, NR, NC, NR - 1, 0, p, 5);
        this.ecc200placementbit(array, NR, NC, 0, NC - 2, p, 4);
        this.ecc200placementbit(array, NR, NC, 0, NC - 1, p, 3);
        this.ecc200placementbit(array, NR, NC, 1, NC - 1, p, 2);
        this.ecc200placementbit(array, NR, NC, 2, NC - 1, p, 1);
        this.ecc200placementbit(array, NR, NC, 3, NC - 1, p, 0);
    }


    private ecc200placement(array: number[], NR: number, NC: number): void {
        let r: number;
        let c: number;
        let p: number;
        for (let r: number = 0; r < NR; r++) {
            for (let c: number = 0; c < NC; c++) {
                array[r * NC + c] = 0;
            }
        }
        p = 1;
        r = 4;
        c = 0;
        do {
            // check corner
            if (r === NR && !(c !== 0)) {
                this.ecc200placementcornerA(array, NR, NC, p++);
            }
            if ((r === NR - 2) && !(c !== 0) && ((NC % 4) !== 0)) {
                this.ecc200placementcornerB(array, NR, NC, p++);
            }
            if (r === NR - 2 && !(c !== 0) && (NC % 8) === 4) {
                this.ecc200placementcornerC(array, NR, NC, p++);
            }
            if (r === NR + 4 && c === 2 && !((NC % 8) !== 0)) {
                this.ecc200placementcornerD(array, NR, NC, p++);
            }
            // up/right
            do {
                if (r < NR && c >= 0 && !(array[r * NC + c] !== 0)) {
                    this.ecc200placementblock(array, NR, NC, r, c, p++);
                }
                r -= 2;
                c += 2;
            }
            while (r >= 0 && c < NC);
            r++;
            c += 3;
            // down/left
            do {
                if (r >= 0 && c < NC && !(array[r * NC + c] !== 0)) {
                    this.ecc200placementblock(array, NR, NC, r, c, p++);
                }
                r += 2;
                c -= 2;
            }
            while (r < NR && c >= 0);
            r += 3;
            c++;
        }
        while (r < NR || c < NC);
        // unfilled corner
        if (!(array[NR * NC - 1] !== 0)) {
            array[NR * NC - 1] = array[NR * NC - NC - 2] = 1;
        }
    }

    private getActualRows(): number {
        return this.mSymbolAttribute.SymbolRow + (QuietZone.All);
    }

    private getActualColumns(): number {
        return this.mSymbolAttribute.SymbolColumn + (QuietZone.All);
    }


    private AddQuiteZone(tempArray2: number[][]): void {
        this.actualRows = this.getActualRows();
        this.actualColumns = this.getActualColumns();
        const w: number = this.actualRows;
        const h: number = this.actualColumns;
        const quietZone: number = QuietZone.All - 1;
        this.mDataMatrixArray = this.create2DMartixArray(w, h, this.mDataMatrixArray);
        // Top quietzone.
        for (let i: number = 0; i < h; i++) {
            this.mDataMatrixArray[0][i] = 0;
        }
        for (let i: number = quietZone; i < w - quietZone; i++) {
            // Left quietzone.
            this.mDataMatrixArray[i][0] = 0;

            for (let j: number = quietZone; j < h - quietZone; j++) {
                this.mDataMatrixArray[i][j] = tempArray2[i - quietZone][j - quietZone];
            }

            // Right quietzone.
            this.mDataMatrixArray[i][h - quietZone] = 0;
        }
        //Bottom quietzone.
        for (let i: number = 0; i < h; i++) {
            this.mDataMatrixArray[w - quietZone][i] = 0;
        }
    }



    private drawImage(
        canvas: HTMLCanvasElement, options: BaseAttributes[])
        : void {
        // render image for the datamtrix generator
        const barcodeRenderer: BarcodeRenderer = this.getInstance(canvas.id);
        for (let i: number = 0; i < options.length; i++) {
            barcodeRenderer.renderRectElement(canvas as HTMLCanvasElement, options[i]);
        }
    }



    private CreateMatrix(codeword: number[]): void {
        let x: number;
        let y: number;
        // let NC: number;
        // let NR: number;
        // const places: number[];
        const W: number = this.mSymbolAttribute.SymbolColumn;
        const H: number = this.mSymbolAttribute.SymbolRow;
        const FW: number = W / this.mSymbolAttribute.HorizontalDataRegion;
        const FH: number = H / this.mSymbolAttribute.VerticalDataRegion;
        const NC: number = W - 2 * (W / FW);
        const NR: number = H - 2 * (H / FH);
        const places: number[] = Array(NC * NR);
        this.ecc200placement(places, NR, NC);
        let matrix: number[] = [];
        matrix = this.create1DMatrixArray(W * H, matrix);
        for (let y: number = 0; y < H; y += FH) {
            for (let x: number = 0; x < W; x++) {
                matrix[y * W + x] = 1;
            }
            for (let x: number = 0; x < W; x += 2) {
                matrix[(y + FH - 1) * W + x] = 1;
            }
        }
        for (x = 0; x < W; x += FW) {
            for (y = 0; y < H; y++) { matrix[y * W + x] = 1; }
            for (y = 0; y < H; y += 2) { matrix[y * W + x + FW - 1] = 1; }
        }
        for (let y: number = 0; y < NR; y++) {
            for (let x: number = 0; x < NC; x++) {
                const v: number = places[(NR - y - 1) * NC + x];
                if (v === 1 || v > 7 && (codeword[(v >> 3) - 1] & (1 << (v & 7))) !== 0) {
                    matrix[(1 + Math.floor(y) + 2 * Math.floor(Math.floor(y) / Math.floor(FH - 2))) * Math.floor(W) +
                        1 + Math.floor(x) + 2 * Math.floor(Math.floor(x) / Math.floor(FW - 2))] = 1;
                }
            }
        }
        const w: number = this.mSymbolAttribute.SymbolColumn;
        const h: number = this.mSymbolAttribute.SymbolRow;
        let tempArray: number[][] = [];
        tempArray = this.create2DMartixArray(w, h, tempArray);
        for (let x1: number = 0; x1 < w; x1++) {
            for (let y1: number = 0; y1 < h; y1++) {
                tempArray[x1][y1] = matrix[w * y1 + x1];
            }
        }
        let tempArray2: number[][] = [];
        tempArray2 = this.create2DMartixArray(w, h, tempArray2);
        for (let i: number = 0; i < h; i++) {
            for (let j: number = 0; j < w; j++) {
                tempArray2[h - 1 - i][j] = tempArray[j][i];
            }
        }
        this.AddQuiteZone(tempArray2);
    }

    private create1DMatrixArray(w: number, tempArray: number[]): number[] {
        for (let i: number = 0; i < w; i++) {
            tempArray[i] = 0;
        }
        return tempArray;
    }

    private create2DMartixArray(w: number, h: number, tempArray: number[][]): number[][] {
        for (let i: number = 0; i < w; i++) {
            tempArray.push([i]);
            for (let j: number = 0; j < h; j++) {
                tempArray[i][j] = 0;
            }
        }
        return tempArray;
    }


    /**
     * Build the datamatrix.\
     *
     * @returns {number[] | string} Build the datamatrix .
     * @private
     */
    public BuildDataMatrix(): number[] | string {
        let codeword: number[] | string = [];
        codeword = (this.PrepareCodeword(this.GetData()));
        if ((isNaN(codeword[0] as number))) {
            return (codeword as string);
        } else {
            this.CreateMatrix(codeword as number[]);
            return this.mDataMatrixArray[0];
        }
    }



    private drawText(canvas: HTMLCanvasElement, options: BaseAttributes): void {
        const barcodeRenderer: BarcodeRenderer = this.getInstance(canvas.id);
        barcodeRenderer.renderTextElement(canvas as HTMLCanvasElement, options);
    }




    private getInstance(id: string): BarcodeRenderer {
        const barCode: HTMLElement = document.getElementById(id);
        const barcodeRenderer: BarcodeRenderer = new BarcodeRenderer(barCode.id, this.isSvgMode);
        return barcodeRenderer;
    }



    private drawDisplayText(
        canvas: HTMLCanvasElement, x: number, y: number, width: number,
        height: number, scaleValue: number, foreColor: string):
        BaseAttributes {
        const displayText: DisplayTextModel = this.displayText;
        createMeasureElements();
        const textOptions: BaseAttributes = getBaseAttributes(width, height, x, y, 'black');
        textOptions.string = (displayText.text ? displayText.text : this.value);
        textOptions.fontStyle = displayText.font;
        textOptions.color = foreColor;
        textOptions.stringSize = displayText.size;
        textOptions.visibility = displayText.visibility;
        let textSize: Size = measureText(textOptions);
        if (!this.isSvgMode) {
            textSize = { width: textSize.width * scaleValue, height: textSize.height * scaleValue };
        }
        const textHeight: number = (textSize.height / 2) + (this.isSvgMode ? 2 : 2 * 1.5);
        textOptions.height = textHeight;
        if (width > textSize.width) {
            if (this.displayText.alignment === 'Center') {
                textOptions.x += (((x + width - x)) / 2) - textSize.width * .5;
            } else if (this.displayText.alignment === 'Left') {
                textOptions.x = x + this.displayText.margin.left;
            } else {
                textOptions.x = (((this.width as number) - this.margin.left) - textSize.width) - this.displayText.margin.right;
            }
        }
        if (textOptions.x < x) {
            textOptions.x = x;
        }

        if (this.displayText.position === 'Bottom') {
            if (this.displayText.margin.top > 0) {
                textOptions.y = ((y + height));
            }
            if (this.displayText.margin.bottom > 0) {
                textOptions.y = ((y + height)) - displayText.margin.bottom;
            } else {
                if (this.margin.top < 10) {
                    textOptions.y = height + textSize.height / 2;
                } else {
                    textOptions.y = height + this.margin.top;
                }
            }
        } else {
            if (this.displayText.margin.top > 0) {
                textOptions.y = y + this.displayText.margin.top + textSize.height / 2;
            } else {
                textOptions.y = y + textSize.height / 2;
            }
        }
        if (this.displayText.visibility) {
            if (!this.isSvgMode) {
                textOptions.stringSize = textOptions.stringSize * 1.5;
            }
            this.drawText(canvas as HTMLCanvasElement, textOptions);
        }
        return textOptions;
    }

    private getDrawableSize(margin: MarginModel, actualWidth: number, actualHeight: number): Rect | number {
        const barcodeSize: number = (actualWidth >= actualHeight) ? actualHeight : actualWidth;
        return barcodeSize;
    }

    /**
     * Draw the barcode SVG.\
     *
     * @returns {void} Draw the barcode SVG .
     *  @param {HTMLElement} canvas - Provide the canvas element .
     * @private
     */
    public draw(canvas: HTMLElement):
    void {
        const scaleValue: number = 1.5;
        const isSvg: boolean = this.isSvgMode;
        const isSquareMatrix: boolean = this.size < 25;
        let dimension: number = this.mDataMatrixArray.length;
        const width: number = (this.width as number);
        const height: number = (this.height as number);
        let dimensionX: number;
        let dimensionY: number;
        const leftValue: number = this.margin.left;
        const rightValue: number = this.margin.right;
        const topValue: number = this.margin.top;
        const bottomVal: number = this.margin.bottom;
        const actualWidth: number = width - ((isSvg ? leftValue : leftValue * scaleValue) + (isSvg ? rightValue : rightValue * scaleValue));
        let actualHeight: number = height - ((isSvg ? topValue : topValue * scaleValue) + (isSvg ? bottomVal : bottomVal * scaleValue));
        let size: number = (this.getDrawableSize(this.margin, actualWidth, actualHeight) as number);
        size = (actualWidth >= actualHeight) ? actualHeight : actualWidth;
        let x: number = (actualWidth - size) / 2;
        let y: number = (actualHeight - size) / 2;
        y += isSvg ? this.margin.top : this.margin.top * scaleValue;
        x += isSvg ? this.margin.left : this.margin.left * scaleValue;
        const textBounds: BaseAttributes = this.drawDisplayText(
            canvas as HTMLCanvasElement, x, y, size, actualHeight, scaleValue, this.foreColor);
        actualHeight -= (textBounds.height);
        if (this.displayText.margin.bottom > 0) {
            if (this.displayText.position === 'Top') {
                y += (this.displayText.margin.bottom);
                actualHeight -= (this.displayText.margin.bottom);
            } else {
                actualHeight -= this.displayText.margin.bottom;
            }
        }
        if (this.displayText.margin.top > 0) {
            if (this.displayText.position === 'Top') {
                y += (this.displayText.margin.top);
                actualHeight -= (this.displayText.margin.top);
            } else {
                actualHeight -= this.displayText.margin.top;
            }
        }
        size = (actualWidth >= actualHeight) ? actualHeight : actualWidth;
        if (!isSquareMatrix) {
            dimensionX = size / this.mDataMatrixArray[0].length;
            dimensionY = size / this.mDataMatrixArray.length;
        }

        dimension = size / this.mDataMatrixArray.length;

        const w: number = this.actualRows; const h: number = this.actualColumns;
        let option: BaseAttributes;
        const options: BaseAttributes[] = [];
        for (let i: number = 0; i < w; i++) {
            for (let j: number = 0; j < h; j++) {
                let color: string;
                if (this.mDataMatrixArray[i][j] === 1) {
                    color = this.foreColor;
                } else {
                    color = 'white';
                }
                if (color !== 'white') {
                    option = getBaseAttributes(
                        isSquareMatrix ? dimension : dimensionX,
                        isSquareMatrix ? dimension : dimensionY, x,
                        this.displayText.position === 'Bottom' ? y : y + textBounds.height / 2, color);
                    options.push(option);
                }
                x = x + (isSquareMatrix ? dimension : dimensionX);
            }
            y = y + (isSquareMatrix ? dimension : dimensionY);
            x = ((actualWidth - size) / 2) + (isSvg ? this.margin.left : this.margin.left * scaleValue);
        }
        this.drawImage(canvas as HTMLCanvasElement, options);
        this.mDataMatrixArray = undefined;
    }
}
