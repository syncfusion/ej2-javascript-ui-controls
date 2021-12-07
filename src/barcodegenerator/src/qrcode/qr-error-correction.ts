
import { PdfQRBarcodeValues } from './qr-barcode-values';
import { QRCodeVersion, ErrorCorrectionLevel } from '../barcode/enum/enum';
/**
 * Qrcode used to calculate the Qrcode control
 */
export class ErrorCorrectionCodewords {

    /**
     * Holds the length
     */
    private mLength: number;

    /**
     * Holds the Error Correction Code Word
     */
    private eccw: number;

    /**
     * Holds the databits
     */
    private databits: number;

    /**
     * Holds the Data Code word
     */
    private mDataCodeWord: string[];

    /**
     * Holds G(x)
     */
    private gx: number[];

    /**
     * Holds all the values of Alpha
     */
    private alpha: number[] = [1, 2, 4, 8, 16, 32, 64, 128, 29, 58, 116, 232, 205, 135, 19, 38, 76, 152, 45, 90, 180, 117, 234, 201, 143,
        3, 6, 12, 24, 48, 96, 192, 157, 39, 78, 156, 37, 74, 148, 53, 106, 212, 181, 119, 238, 193, 159, 35, 70, 140, 5, 10, 20, 40, 80,
        160, 93, 186, 105, 210, 185, 111, 222, 161, 95, 190, 97, 194, 153, 47, 94, 188, 101, 202, 137, 15, 30, 60, 120, 240, 253, 231,
        211, 187, 107, 214, 177, 127, 254, 225, 223, 163, 91, 182, 113, 226, 217, 175, 67, 134, 17, 34, 68, 136, 13, 26, 52, 104, 208,
        189, 103, 206, 129, 31, 62, 124, 248, 237, 199, 147, 59, 118, 236, 197, 151, 51, 102, 204, 133, 23, 46, 92, 184, 109, 218, 169,
        79, 158, 33, 66, 132, 21, 42, 84, 168, 77, 154, 41, 82, 164, 85, 170, 73, 146, 57, 114, 228, 213, 183, 115, 230, 209, 191, 99,
        198, 145, 63, 126, 252, 229, 215, 179, 123, 246, 241, 255, 227, 219, 171, 75, 150, 49, 98, 196, 149, 55, 110, 220, 165, 87,
        174, 65, 130, 25, 50, 100, 200, 141, 7, 14, 28, 56, 112, 224, 221, 167, 83, 166, 81, 162, 89, 178, 121, 242, 249, 239, 195,
        155, 43, 86, 172, 69, 138, 9, 18, 36, 72, 144, 61, 122, 244, 245, 247, 243, 251, 235, 203, 139, 11, 22, 44, 88, 176, 125,
        250, 233, 207, 131, 27, 54, 108, 216, 173, 71, 142];

    /**
     * Holds the Decimal value
     */
    private decimalValue: number[];

    /**
     * Holds the values of QR Barcode
     */
    private mQrBarcodeValues: PdfQRBarcodeValues;

    /**
     * Sets and Gets the Data code word
     *
     * @param {string} value - Sets and Gets the Data code word
     * @private
     */
    public set DC(value: string[]) {
        this.mDataCodeWord = value;
    }



    /**
     * Sets and Gets the DataBits
     *
     * @param {string} value - Sets and Gets the DataBits
     * @private
     */
    public set DataBits(value: number) {
        this.databits = value;
    }



    /**
     * Sets and Gets the Error Correction Code Words
     *
     * @param {string} value - Sets and Gets the Error Correction Code Words
     * @private
     */
    public set Eccw(value: number) {
        this.eccw = value;
    }


    /**
     * Initializes Error correction code word
     *
     * @param {QRCodeVersion} version - version of the qr code
     * @param {ErrorCorrectionLevel} correctionLevel - defines the level of error correction.
     */
    constructor(version: QRCodeVersion, correctionLevel: ErrorCorrectionLevel) {
        this.mQrBarcodeValues = new PdfQRBarcodeValues(version, correctionLevel);
        let variable: string = 'DataCapacity';
        this.mLength = this.mQrBarcodeValues[variable];
        variable = 'NumberOfErrorCorrectingCodeWords';
        this.eccw = this.mQrBarcodeValues[variable];
    }



    /**
     *  Gets the Error correction code word
     *
     * @returns { number} Gets the Error correction code word
     * @private
     */
    public getErcw(): string[] {
        //const decimalRepresentation: number[];
        //let ecw: string[];
        this.decimalValue = [this.databits];

        switch (this.eccw) {
        case 7:
            this.gx = [0, 87, 229, 146, 149, 238, 102, 21];
            break;
        case 10:
            this.gx = [0, 251, 67, 46, 61, 118, 70, 64, 94, 32, 45];
            break;
        case 13:
            this.gx = [0, 74, 152, 176, 100, 86, 100, 106, 104, 130, 218, 206, 140, 78];
            break;
        case 15:
            this.gx = [0, 8, 183, 61, 91, 202, 37, 51, 58, 58, 237, 140, 124, 5, 99, 105];
            break;
        case 16:
            this.gx = [0, 120, 104, 107, 109, 102, 161, 76, 3, 91, 191, 147, 169, 182, 194, 225, 120];
            break;
        case 17:
            this.gx = [0, 43, 139, 206, 78, 43, 239, 123, 206, 214, 147, 24, 99, 150, 39, 243, 163, 136];
            break;
        case 18:
            this.gx = [0, 215, 234, 158, 94, 184, 97, 118, 170, 79, 187, 152, 148, 252, 179, 5, 98, 96, 153];
            break;
        case 20:
            this.gx = [0, 17, 60, 79, 50, 61, 163, 26, 187, 202, 180, 221, 225, 83, 239, 156, 164, 212, 212, 188, 190];
            break;
        case 22:
            this.gx = [0, 210, 171, 247, 242, 93, 230, 14, 109, 221, 53, 200, 74, 8, 172, 98, 80, 219, 134, 160, 105, 165, 231];
            break;
        case 24:
            this.gx = [0, 229, 121, 135, 48, 211, 117, 251, 126, 159, 180, 169, 152, 192, 226, 228, 218, 111, 0, 117, 232, 87,
                96, 227, 21];
            break;
        case 26:
            this.gx = [0, 173, 125, 158, 2, 103, 182, 118, 17, 145, 201, 111, 28, 165, 53, 161, 21, 245, 142, 13, 102, 48, 227, 153,
                145, 218, 70];
            break;
        case 28:
            this.gx = [0, 168, 223, 200, 104, 224, 234, 108, 180, 110, 190, 195, 147, 205, 27, 232, 201, 21, 43, 245, 87, 42, 195,
                212, 119, 242, 37, 9, 123];
            break;
        case 30:
            this.gx = [0, 41, 173, 145, 152, 216, 31, 179, 182, 50, 48, 110, 86, 239, 96, 222, 125, 42, 173, 226, 193, 224, 130,
                156, 37, 251, 216, 238, 40, 192, 180];
            break;
        }
        this.gx = this.getElement(this.gx, this.alpha);
        this.toDecimal(this.mDataCodeWord);
        const decimalRepresentation: number[]  = this.divide();
        const ecw: string[] = this.toBinary(decimalRepresentation);
        return ecw;
    }
    /* tslint:enable */



    /**
     * Convert to decimal
     *
     * @returns {void}Convert to decimal.
     * @param {string[]} inString - Provide the version for the QR code
     * @private
     */
    private toDecimal(inString: string[]): void {
        for (let i: number = 0; i < inString.length; i++) {
            this.decimalValue[i] = parseInt(inString[i], 2);
        }
    }


    /**
     * Convert decimal to binary.
     *
     * @returns {string[]}Convert decimal to binary.
     * @param {number[]} decimalRepresentation - Provide the version for the QR code
     * @private
     */
    private toBinary(decimalRepresentation: number[]): string[] {
        const toBinary: string[] = [];
        for (let i: number = 0; i < this.eccw; i++) {
            let str: string = '';
            const temp: string = decimalRepresentation[i].toString(2);
            if (temp.length < 8) {
                for (let j: number = 0; j < 8 - temp.length; j++) {
                    str += '0';
                }
            }
            toBinary[i] = str + temp;
        }
        return toBinary;
    }


    /**
     * Polynomial division.
     *
     * @returns {string[]}Polynomial division.
     * @private
     */
    private divide(): number[] {
        let messagePolynom: { [key: number]: number } = {};
        for (let i: number = 0; i < this.decimalValue.length; i++) {
            messagePolynom[this.decimalValue.length - 1 - i] = this.decimalValue[i];
        }

        let generatorPolynom: { [key: number]: number } = {};
        for (let i: number = 0; i < this.gx.length; i++) {
            generatorPolynom[this.gx.length - 1 - i] = this.findElement(this.gx[i], this.alpha);
        }
        let tempMessagePolynom: { [key: number]: number } = {};
        for (const poly of Object.keys(messagePolynom)) {
            tempMessagePolynom[Number(poly) + this.eccw] = messagePolynom[poly];
        }
        messagePolynom = tempMessagePolynom;

        const genLeadtermFactor: number = this.decimalValue.length + this.eccw - this.gx.length;

        tempMessagePolynom = {};
        for (const poly of Object.keys(generatorPolynom)) {
            tempMessagePolynom[Number(poly) + genLeadtermFactor] = generatorPolynom[poly];
        }
        generatorPolynom = tempMessagePolynom;

        let leadTermSource: { [key: number]: number } = messagePolynom;
        for (let i: number = 0; i < Object.keys(messagePolynom).length; i++) {
            const largestExponent: number = this.findLargestExponent(leadTermSource);
            if (leadTermSource[largestExponent] === 0) {
                // First coefficient is already 0, simply remove it and continue
                delete leadTermSource[largestExponent];
            } else {
                const alphaNotation: { [key: number]: number } = this.convertToAlphaNotation(leadTermSource);
                let resPoly: { [key: number]: number } = this.multiplyGeneratorPolynomByLeadterm(
                    generatorPolynom, alphaNotation[this.findLargestExponent(alphaNotation)], i);
                resPoly = this.convertToDecNotation(resPoly);
                resPoly = this.xORPolynoms(leadTermSource, resPoly);
                leadTermSource = resPoly;
            }
        }

        //Add the error correction word count according to polynomial values.
        this.eccw = Object.keys(leadTermSource).length;
        const returnValue: number[] = [];
        for (const temp of Object.keys(leadTermSource)) {
            returnValue.push(leadTermSource[temp]);
        }
        return returnValue.reverse();
    }

    private xORPolynoms(messagePolynom: { [key: number]: number }, resPolynom: { [key: number]: number }): { [key: number]: number } {
        const resultPolynom: { [key: number]: number } = {};
        let longPoly: { [key: number]: number } = {};
        let shortPoly: { [key: number]: number } = {};

        if (Object.keys(messagePolynom).length >= Object.keys(resPolynom).length) {
            longPoly = messagePolynom;
            shortPoly = resPolynom;
        } else {
            longPoly = resPolynom;
            shortPoly = messagePolynom;
        }
        const messagePolyExponent: number = this.findLargestExponent(messagePolynom);

        const shortPolyExponent: number = this.findLargestExponent(shortPoly);
        let i: number = Object.keys(longPoly).length - 1;
        for (const longPolySingle of Object.keys(longPoly)) {
            resultPolynom[messagePolyExponent - i] = longPoly[longPolySingle] ^ (Object.keys(shortPoly).length > i ?
                shortPoly[shortPolyExponent - i] : 0);
            i--;
        }
        const resultPolyExponent: number = this.findLargestExponent(resultPolynom);
        delete resultPolynom[resultPolyExponent];
        return resultPolynom;
    }
    private multiplyGeneratorPolynomByLeadterm(
        genPolynom: { [key: number]: number }, leadTermCoefficient: number, lowerExponentBy: number): { [key: number]: number } {
        const tempPolynom: { [key: number]: number } = {};

        for (const treeNode of Object.keys(genPolynom)) {
            tempPolynom[Number(treeNode) - lowerExponentBy] = (genPolynom[treeNode] + leadTermCoefficient) % 255;
        }
        return tempPolynom;
    }

    private convertToDecNotation(poly: { [key: number]: number }): { [key: number]: number } {
        const tempPolynom: { [key: number]: number } = {};
        for (const treeNode of Object.keys(poly)) {
            tempPolynom[treeNode] = this.getIntValFromAlphaExp(poly[treeNode], this.alpha);
        }
        return tempPolynom;
    }

    private convertToAlphaNotation(polynom: { [key: number]: number }): { [key: number]: number } {
        const tempPolynom: { [key: number]: number } = {};
        for (const poly of Object.keys(polynom)) {
            if (polynom[poly] !== 0) {
                tempPolynom[poly] = this.findElement(polynom[poly], this.alpha);
            }
        }
        return tempPolynom;
    }

    private findLargestExponent(polynom: { [key: number]: number }): number {
        let largCo: number = 0;
        for (const poly of Object.keys(polynom)) {
            if (Number(poly) > largCo) {
                largCo = Number(poly);
            }
        }
        return largCo;
    }

    private getIntValFromAlphaExp(element: number, alpha: number[]): number {
        if (element > 255) {
            element = element - 255;
        }
        return alpha[element];
    }



    /**
     * Find the element in the alpha
     *
     * @returns {number}Find the element in the alpha.
     * @param {QRCodeVersion} element - Provide the element for the Qr code
     * @param {ErrorCorrectionLevel} alpha -provide the number
     * @private
     */
    private findElement(element: number, alpha: number[]): number {
        let j: number;
        for (j = 0; j < alpha.length; j++) {
            if (element === alpha[j]) { break; }
        }
        return j;
    }

    /**
     * Gets g(x) of the element
     */
    /**
     * Gets g(x) of the element
     *
     * @returns {number}Gets g(x) of the element .
     * @param {QRCodeVersion} element - Provide the element for the Qr code
     * @param {ErrorCorrectionLevel} alpha -provide the number
     * @private
     */
    private getElement(element: number[], alpha: number[]): number[] {
        const gx: number[] = [element.length];
        for (let i: number = 0; i < element.length; i++) {
            if (element[i] > 255) {
                element[i] = element[i] - 255;
            }
            gx[i] = alpha[element[i]];
        }
        return gx;
    }
}
