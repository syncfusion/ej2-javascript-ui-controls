import { BaseAttributes } from '../barcode/rendering/canvas-interface';
import { MarginModel } from '../barcode/primitives/margin-model';
import { QRInputMode, QRCodeVersion, ErrorCorrectionLevel, QuietZone } from '../barcode/enum/enum';
import { PdfQRBarcodeValues } from './qr-barcode-values';
import { ErrorCorrectionCodewords } from './qr-error-correction';
import { createMeasureElements, measureText } from '../barcode/utility/dom-util';
import { Size } from '../barcode/primitives/size';
import { DisplayTextModel } from '../barcode/primitives/displaytext-model';
import { BarcodeRenderer } from '../barcode/rendering/renderer';

/**
 * Qrcode used to calculate the Qrcode control
 */
export class QRCode {

    private mVersion: QRCodeVersion = QRCodeVersion.Version01;

    private mInputMode: QRInputMode = 'NumericMode';

    private validInput: boolean = true;
    /**
     * Total bits required in mixing mode.
     */
    private totalBits: number = 0;

    /**
     * Holds the data of Function Pattern.
     */
    private mModuleValue: ModuleValue[][] = [];

    private mDataAllocationValues: ModuleValue[][] = [[], []];

    private mQrBarcodeValues: PdfQRBarcodeValues;

    /**
     * Set version for mixing mode.
     */
    private mixVersionERC: boolean = true;
    /**
     * Data to be currently encoded in Mixing Mode
     */
    private mixExecutablePart: string = null;

    /**
     * Count of mixing mode blocks.
     */
    private mixDataCount: number = 0;
    /**
     * Holds the Number of Modules.
     */
    private mNoOfModules: number = 21;

    /**
     * Check if User Mentioned Mode
     */
    private mIsUserMentionedMode: boolean = false;

    private chooseDefaultMode: boolean = false;

    /** @private */
    public text: string;

    private mixRemainingPart: string = null;

    private isXdimension: boolean = false;

    private mXDimension: number = 1;

    /**
     * Get or Private set the XDimension values.
     *
     * @returns {number}Get or Private set the XDimension values..
     * @private
     */
    public get XDimension(): number {
        return this.mXDimension;
    }
    /**
     *  Get or Private set the XDimension values.
     *
     * @param {number} value - Get or Private set the XDimension values.
     * @private
     */
    public set XDimension(value: number) {
        this.mXDimension = value;
    }


    private get inputMode(): QRInputMode {
        return this.mInputMode;
    }


    private set inputMode(value: QRInputMode) {
        this.mInputMode = value;
        this.mIsUserMentionedMode = true;
    }

    /**
     *Get or Private set the version
     *
     * @returns {QRCodeVersion}Get or Private set the version
     * @private
     */
    public get version(): QRCodeVersion {
        return this.mVersion;
    }
    /**
     *  Get or Private set the version
     *
     * @param {QRCodeVersion} value - Get or Private set the version
     * @private
     */
    public set version(value: QRCodeVersion) {
        this.mVersion = value;
        this.mNoOfModules = (this.mVersion - 1) * 4 + 21;
        if (value !== QRCodeVersion.Auto) {
            this.mIsUserMentionedVersion = true;
        }
    }
    private mIsEci: boolean = false;

    /** @private */
    public mIsUserMentionedErrorCorrectionLevel: boolean = false;

    private isSvgMode: boolean;

    private mEciAssignmentNumber: number = 3;

    /** @private */
    public mIsUserMentionedVersion: boolean = false;

    /** @private */
    public mErrorCorrectionLevel: ErrorCorrectionLevel = ErrorCorrectionLevel.Low;

    private textList: string[] = [];

    private mode: QRInputMode[] = [];


    private getBaseAttributes(
        width: number, height: number, offSetX: number, offsetY: number,
        color: string, strokeColor?: string):
        BaseAttributes {
        const options: BaseAttributes = {
            width: width, height: height, x: offSetX, y: offsetY, color: color, strokeColor: strokeColor
        };
        return options;
    }

    private getInstance(id: string): BarcodeRenderer {
        const barCode: HTMLElement = document.getElementById(id);
        const barcodeRenderer: BarcodeRenderer = new BarcodeRenderer(barCode.id, this.isSvgMode);
        return barcodeRenderer;
    }


    private drawImage(canvas: HTMLCanvasElement, options: BaseAttributes[]): void {
        // render image for the qrcode generator
        const barcodeRenderer: BarcodeRenderer = this.getInstance(canvas.id);
        for (let i: number = 0; i < options.length; i++) {
            barcodeRenderer.renderRectElement(canvas as HTMLCanvasElement, options[i]);
        }
    }

    /**
     * Draw the QR cpde in SVG.\
     *
     * @returns {boolean} Draw the barcode SVG .
     *  @param {HTMLElement} char - Provide the char to render .
     *  @param {HTMLElement} canvas - Provide the canvas element .
     *  @param {HTMLElement} height - Provide the height for the canvas element .
     *  @param {HTMLElement} width - Provide the width for the canvas element .
     *  @param {HTMLElement} margin - Provide the margin for thecanvas element .
     *  @param {HTMLElement} displayText - Provide display text for the canvas element .
     *  @param {HTMLElement} mode - Provide the mode to render .
     *  @param {HTMLElement} foreColor - Provide the color for the barcode to render.
     * @private
     */
    public draw(
        char: string, canvas: HTMLElement, height: number, width: number,
        margin?: MarginModel, displayText?: DisplayTextModel, mode?: boolean, foreColor?: string):
        boolean {
        this.isSvgMode = mode;
        this.generateValues();
        if (this.validInput) {
            let size: number;
            const actualWidth: number = width - (margin.left + margin.right);
            let actualHeight: number = height - (margin.top + margin.bottom);
            size = (actualWidth >= actualHeight) ? actualHeight : actualWidth;


            let dimension: number = this.XDimension;
            const quietZone: number = QuietZone.All;

            let x: number = (actualWidth >= size) ? (actualWidth - size) / 2 : 0;
            let y: number = (actualHeight >= size) ? (actualHeight - size) / 2 : 0;
            y += margin.top; x += margin.left;


            const textBounds: BaseAttributes = this.drawDisplayText(
                canvas as HTMLCanvasElement, x, y, size,
                actualHeight, displayText, char, margin, foreColor);
            actualHeight -= (textBounds.height);
            if (displayText.margin.bottom > 0) {
                if (displayText.position === 'Top') {
                    y += (displayText.margin.bottom);
                    actualHeight -= (displayText.margin.bottom);
                } else {
                    actualHeight -= displayText.margin.bottom;
                }
            }
            if (displayText.margin.top > 0) {
                if (displayText.position === 'Top') {
                    y += (displayText.margin.top);
                    actualHeight -= (displayText.margin.top);
                } else {
                    actualHeight -= displayText.margin.top;
                }
            }
            size = (actualWidth >= actualHeight) ? actualHeight : actualWidth;
            const moduleCount: number = this.mNoOfModules + 2 * quietZone + 1;
            dimension = size / moduleCount;
            this.isXdimension = true;
            width = (this.mNoOfModules + 2 * quietZone) * dimension;
            height = (this.mNoOfModules + 2 * quietZone) * dimension;

            const w: number = this.mNoOfModules + 2 * quietZone;
            const h: number = this.mNoOfModules + 2 * quietZone;

            const optionsCollection: BaseAttributes[] = [];

            for (let i: number = 0; i < w; i++) {
                for (let j: number = 0; j < h; j++) {
                    let color: string;
                    color = (this.mModuleValue[i][j].isBlack) ? foreColor : 'white';

                    if (this.mDataAllocationValues[j][i].isFilled) {
                        if (this.mDataAllocationValues[j][i].isBlack) {
                            color = foreColor;
                        }
                    }
                    if (color !== 'white') {
                        const options: BaseAttributes = this.getBaseAttributes(
                            dimension, dimension, x,
                            displayText.position === 'Bottom' ? y : y + textBounds.height / 2, color);
                        optionsCollection.push(options);
                    }
                    x = x + dimension;
                }
                y = y + dimension;
                x = ((actualWidth >= size) ? (actualWidth - size) / 2 : 0) + margin.left;
            }
            this.drawImage(canvas as HTMLCanvasElement, optionsCollection);
            this.mModuleValue = undefined;
            this.mDataAllocationValues = undefined;
            return true;
        } else {
            return false;
        }
    }


    private drawText(canvas: HTMLCanvasElement, options: BaseAttributes): void {
        const barcodeRenderer: BarcodeRenderer = this.getInstance(canvas.id);
        barcodeRenderer.renderTextElement(canvas as HTMLCanvasElement, options);
    }


    private drawDisplayText(
        canvas: HTMLCanvasElement, x: number, y: number,
        width: number, height: number, text?: DisplayTextModel, value?: string, margin?: MarginModel, foreColor?: string)
        : BaseAttributes {
        const displayText: DisplayTextModel = text;
        createMeasureElements();
        const options: BaseAttributes = this.getBaseAttributes(width, height, x, y, 'black');
        options.string = (displayText.text ? displayText.text : value);
        options.color = foreColor;
        options.fontStyle = displayText.font;
        options.stringSize = displayText.size;
        options.visibility = displayText.visibility;
        const textSize: Size = measureText(options);
        const textHeight: number = (textSize.height / 2) + 2;
        options.height = textHeight;
        options.x = ((x + width / 2) - textSize.width / 2) + displayText.margin.left - displayText.margin.right;
        if (text.position === 'Bottom') {
            if (text.margin.top > 0) {
                options.y = ((y + height));
            }
            if (text.margin.bottom > 0) {
                options.y = ((y + height)) - displayText.margin.bottom;
            } else {
                if (margin.top < 10) {
                    options.y = height + textSize.height / 2;
                } else {
                    options.y = height + margin.top;
                }
            }
        } else {
            if (text.margin.top > 0) {
                options.y = y + text.margin.top + textSize.height / 2;
            } else {
                options.y = y + textSize.height / 2;
            }
        }
        if (text.visibility) {
            this.drawText(canvas as HTMLCanvasElement, options);
        }
        return options;
    }


    private generateValues(): void {
        this.mQrBarcodeValues = new PdfQRBarcodeValues(this.mVersion, this.mErrorCorrectionLevel);
        this.initialize();
        this.mQrBarcodeValues = new PdfQRBarcodeValues(this.mVersion, this.mErrorCorrectionLevel);
        for (let i: number = 0; i < this.mNoOfModules; i++) {
            // eslint-disable-next-line
            this.mModuleValue.push([0] as any);
            for (let j: number = 0; j < this.mNoOfModules; j++) {
                this.mModuleValue[i][j] = new ModuleValue();
            }
        }
        this.drawPDP(0, 0);
        this.drawPDP(this.mNoOfModules - 7, 0);
        this.drawPDP(0, this.mNoOfModules - 7);
        this.drawTimingPattern();
        if (this.mVersion !== 1) {
            const allignCoOrdinates: number[] = this.getAlignmentPatternCoOrdinates();
            for (const i of Object.keys(allignCoOrdinates)) {
                for (const j of Object.keys(allignCoOrdinates)) {
                    if (!this.mModuleValue[allignCoOrdinates[i]][allignCoOrdinates[j]].isPdp) {
                        this.drawAlignmentPattern(allignCoOrdinates[i], allignCoOrdinates[j]);
                    }
                }
            }
        }
        this.allocateFormatAndVersionInformation();
        let encodeData: boolean[] = null;
        encodeData = this.encodeData();
        this.dataAllocationAndMasking(encodeData);
        this.drawFormatInformation();
        this.addQuietZone();
        this.mQrBarcodeValues.FormatInformation = undefined;
        this.mQrBarcodeValues.NumberOfDataCodeWord = undefined;
        this.mQrBarcodeValues.NumberOfErrorCorrectingCodeWords = undefined;
        this.mQrBarcodeValues.VersionInformation = undefined;
        this.mQrBarcodeValues.alphanumericDataCapacityHigh = undefined;
        this.mQrBarcodeValues.alphanumericDataCapacityLow = undefined;
        this.mQrBarcodeValues.alphanumericDataCapacityMedium = undefined;
        this.mQrBarcodeValues.alphanumericDataCapacityQuartile = undefined;
        this.mQrBarcodeValues.binaryDataCapacityHigh = undefined;
        this.mQrBarcodeValues.dataCapacityValues = undefined;
        this.mQrBarcodeValues.endValues = undefined;
        this.mQrBarcodeValues.dataCapacityValues = undefined;
        this.mQrBarcodeValues = undefined;
        this.mIsUserMentionedVersion = undefined;
        this.mVersion = undefined;

    }


    /**
     * Draw the PDP in the given location
     *
     * @returns {void} Draw the PDP in the given location.
     * @param {string} x - The x co-ordinate.
     * @param {string} y - The y co-ordinate.
     * @private
     */
    private drawPDP(x: number, y: number): void {
        let i: number; let j: number;
        for (i = x, j = y; i < x + 7; i++ , j++) {
            this.mModuleValue[i][y].isBlack = true;
            this.mModuleValue[i][y].isFilled = true;
            this.mModuleValue[i][y].isPdp = true;

            this.mModuleValue[i][y + 6].isBlack = true;
            this.mModuleValue[i][y + 6].isFilled = true;
            this.mModuleValue[i][y + 6].isPdp = true;

            if (y + 7 < this.mNoOfModules) {
                this.mModuleValue[i][y + 7].isBlack = false;
                this.mModuleValue[i][y + 7].isFilled = true;
                this.mModuleValue[i][y + 7].isPdp = true;
            } else if (y - 1 >= 0) {
                this.mModuleValue[i][y - 1].isBlack = false;
                this.mModuleValue[i][y - 1].isFilled = true;
                this.mModuleValue[i][y - 1].isPdp = true;
            }

            this.mModuleValue[x][j].isBlack = true;
            this.mModuleValue[x][j].isFilled = true;
            this.mModuleValue[x][j].isPdp = true;

            this.mModuleValue[x + 6][j].isBlack = true;
            this.mModuleValue[x + 6][j].isFilled = true;
            this.mModuleValue[x + 6][j].isPdp = true;

            if (x + 7 < this.mNoOfModules) {
                this.mModuleValue[x + 7][j].isBlack = false;
                this.mModuleValue[x + 7][j].isFilled = true;
                this.mModuleValue[x + 7][j].isPdp = true;
            } else if (x - 1 >= 0) {
                this.mModuleValue[x - 1][j].isBlack = false;
                this.mModuleValue[x - 1][j].isFilled = true;
                this.mModuleValue[x - 1][j].isPdp = true;
            }

        }

        if (x + 7 < this.mNoOfModules && y + 7 < this.mNoOfModules) {
            this.mModuleValue[x + 7][y + 7].isBlack = false;
            this.mModuleValue[x + 7][y + 7].isFilled = true;
            this.mModuleValue[x + 7][y + 7].isPdp = true;
        } else if (x + 7 < this.mNoOfModules && y + 7 >= this.mNoOfModules) {
            this.mModuleValue[x + 7][y - 1].isBlack = false;
            this.mModuleValue[x + 7][y - 1].isFilled = true;
            this.mModuleValue[x + 7][y - 1].isPdp = true;
        } else if (x + 7 >= this.mNoOfModules && y + 7 < this.mNoOfModules) {
            this.mModuleValue[x - 1][y + 7].isBlack = false;
            this.mModuleValue[x - 1][y + 7].isFilled = true;
            this.mModuleValue[x - 1][y + 7].isPdp = true;
        }

        x++; y++;
        for (i = x, j = y; i < x + 5; i++ , j++) {
            this.mModuleValue[i][y].isBlack = false;
            this.mModuleValue[i][y].isFilled = true;
            this.mModuleValue[i][y].isPdp = true;

            this.mModuleValue[i][y + 4].isBlack = false;
            this.mModuleValue[i][y + 4].isFilled = true;
            this.mModuleValue[i][y + 4].isPdp = true;

            this.mModuleValue[x][j].isBlack = false;
            this.mModuleValue[x][j].isFilled = true;
            this.mModuleValue[x][j].isPdp = true;

            this.mModuleValue[x + 4][j].isBlack = false;
            this.mModuleValue[x + 4][j].isFilled = true;
            this.mModuleValue[x + 4][j].isPdp = true;
        }

        x++; y++;
        for (i = x, j = y; i < x + 3; i++ , j++) {
            this.mModuleValue[i][y].isBlack = true;
            this.mModuleValue[i][y].isFilled = true;
            this.mModuleValue[i][y].isPdp = true;

            this.mModuleValue[i][y + 2].isBlack = true;
            this.mModuleValue[i][y + 2].isFilled = true;
            this.mModuleValue[i][y + 2].isPdp = true;

            this.mModuleValue[x][j].isBlack = true;
            this.mModuleValue[x][j].isFilled = true;
            this.mModuleValue[x][j].isPdp = true;

            this.mModuleValue[x + 2][j].isBlack = true;
            this.mModuleValue[x + 2][j].isFilled = true;
            this.mModuleValue[x + 2][j].isPdp = true;
        }
        this.mModuleValue[x + 1][y + 1].isBlack = true;
        this.mModuleValue[x + 1][y + 1].isFilled = true;
        this.mModuleValue[x + 1][y + 1].isPdp = true;


    }

    /**
     * Draw the Timing Pattern
     *
     * @returns {void} Draw the PDP in the given location.
     * @private
     */
    private drawTimingPattern(): void {

        for (let i: number = 8; i < this.mNoOfModules - 8; i += 2) {
            this.mModuleValue[i][6].isBlack = true;
            this.mModuleValue[i][6].isFilled = true;

            this.mModuleValue[i + 1][6].isBlack = false;
            this.mModuleValue[i + 1][6].isFilled = true;

            this.mModuleValue[6][i].isBlack = true;
            this.mModuleValue[6][i].isFilled = true;

            this.mModuleValue[6][i + 1].isBlack = false;
            this.mModuleValue[6][i + 1].isFilled = true;

        }
        this.mModuleValue[this.mNoOfModules - 8][8].isBlack = true;
        this.mModuleValue[this.mNoOfModules - 8][8].isFilled = true;
    }


    /* tslint:disable */
    private initialize(): void {
        if (!this.mIsUserMentionedMode) {
            this.chooseDefaultMode = true;
        }
        let mode: QRInputMode = 'NumericMode';
        //const alphaCount: number = 0;
        //const numCount: number = 0;
        //const binaryCount: number = 0;
        for (let i: number = 0; i < this.text.length; i++) {
            // eslint-disable-next-line
            if (this.text.charCodeAt(i) < 58 && this.text.charCodeAt(i) > 47) {

            } else if ((this.text.charCodeAt(i) < 91 && this.text.charCodeAt(i) > 64) ||
                this.text[i] === '$' || this.text[i] === '%' || this.text[i] === '*' ||
                this.text[i] === '+' || this.text[i] === '-' || this.text[i] === '.' ||
                this.text[i] === '/' || this.text[i] === ':' || this.text[i] === ' ') {
                mode = 'AlphaNumericMode';
            } else if ((this.text.charCodeAt(i) >= 65377 && this.text.charCodeAt(i) <= 65439) ||
                (this.text.charCodeAt(i) >= 97 && this.text.charCodeAt(i) <= 122)) {

                mode = 'BinaryMode';
                break;
            } else {

                mode = 'BinaryMode';
                this.mIsEci = true;
                break;
            }
        }
        if (this.mIsUserMentionedMode) {
            if (mode !== this.mInputMode) {
                if (((mode === 'AlphaNumericMode' || mode === 'BinaryMode') && this.mInputMode === 'NumericMode')
                    || (mode === 'BinaryMode' && this.mInputMode === 'AlphaNumericMode')) {
                    this.validInput = false;
                    if (mode !== this.mInputMode) {
                        if (((mode === 'AlphaNumericMode' || mode === 'BinaryMode') && this.mInputMode === 'NumericMode')
                            || (mode === 'BinaryMode' && this.mInputMode === 'AlphaNumericMode')) {
                            this.validInput = false;
                        }
                    }
                }
            }
        }
        this.inputMode = mode;
        if (this.mIsEci === true) {
            for (let i: number = 0; i < this.text.length; i++) {
                if (this.text.charCodeAt(i) >= 32 && this.text.charCodeAt(i) <= 255) {
                    continue;
                }

            }
        }
        if (this.mixVersionERC) {

            if (!this.mIsUserMentionedVersion || (this.mVersion & QRCodeVersion.Auto)) {
                let dataCapacityOfVersions: number[] = null;
                if (this.mIsUserMentionedErrorCorrectionLevel) {
                    switch (this.mInputMode) {
                    case 'NumericMode':
                        switch (this.mErrorCorrectionLevel) {
                        case 7:
                            dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityLow;
                            break;
                        case 15:
                            dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityMedium;
                            break;
                        case 25:
                            dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityQuartile;
                            break;
                        case 30:
                            dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityHigh;
                            break;
                        }
                        break;
                    case 'AlphaNumericMode':
                        switch (this.mErrorCorrectionLevel) {
                        case 7:
                            dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityLow;
                            break;
                        case 15:
                            dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityMedium;
                            break;
                        case 25:
                            dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityQuartile;
                            break;
                        case 30:
                            dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityHigh;
                            break;
                        }
                        break;
                    case 'BinaryMode':
                        switch (this.mErrorCorrectionLevel) {
                        case 7:
                            dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityLow;
                            break;
                        case 15:
                            dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityMedium;
                            break;
                        case 25:
                            dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityQuartile;
                            break;
                        case 30:
                            dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityHigh;
                            break;
                        }
                        break;
                    }
                } else {
                    this.mErrorCorrectionLevel = ErrorCorrectionLevel.Medium;
                    switch (this.mInputMode) {
                    case 'NumericMode':
                        dataCapacityOfVersions = this.mQrBarcodeValues.numericDataCapacityMedium;
                        break;
                    case 'AlphaNumericMode':
                        dataCapacityOfVersions = this.mQrBarcodeValues.alphanumericDataCapacityMedium;
                        break;
                    case 'BinaryMode':
                        dataCapacityOfVersions = this.mQrBarcodeValues.binaryDataCapacityMedium;
                        break;
                    }
                }
                let i: number;
                for (i = 0; i < dataCapacityOfVersions.length; i++) {
                    if (dataCapacityOfVersions[i] > this.text.length) {
                        break;
                    }
                }
                this.version = i + 1;
            } else if (this.mIsUserMentionedVersion) {
                if (this.mIsUserMentionedErrorCorrectionLevel) {
                    let capacity: number = 0;
                    if (this.mInputMode === 'AlphaNumericMode') {
                        capacity = this.mQrBarcodeValues.getAlphanumericDataCapacity(this.mVersion, this.mErrorCorrectionLevel);
                    } else if (this.mInputMode === 'NumericMode') {
                        capacity = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, this.mErrorCorrectionLevel);
                    }
                    if (this.mInputMode === 'BinaryMode') {
                        capacity = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, this.mErrorCorrectionLevel);
                    }
                    if (capacity < this.text.length) {
                        if (!this.chooseDefaultMode) {
                            this.validInput = false;
                        } else {
                            this.mixVersionERC = false;
                        }
                    }
                } else {
                    let capacityLow: number = 0;
                    let capacityMedium: number = 0;
                    let capacityQuartile: number = 0;
                    let capacityHigh: number = 0;

                    if (this.mInputMode === 'AlphaNumericMode') {
                        capacityLow = this.mQrBarcodeValues.getAlphanumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Low);
                        capacityMedium = this.mQrBarcodeValues.getAlphanumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Medium);
                        capacityQuartile = this.mQrBarcodeValues.getAlphanumericDataCapacity(
                            this.mVersion, ErrorCorrectionLevel.Quartile);
                        capacityHigh = this.mQrBarcodeValues.getAlphanumericDataCapacity(this.mVersion, ErrorCorrectionLevel.High);

                    } else if (this.mInputMode === 'NumericMode') {

                        capacityLow = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Low);
                        capacityMedium = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Medium);
                        capacityQuartile = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, ErrorCorrectionLevel.Quartile);
                        capacityHigh = this.mQrBarcodeValues.getNumericDataCapacity(this.mVersion, ErrorCorrectionLevel.High);

                    } else if (this.mInputMode === 'BinaryMode') {
                        capacityLow = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, ErrorCorrectionLevel.Low);
                        capacityMedium = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, ErrorCorrectionLevel.Medium);
                        capacityQuartile = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, ErrorCorrectionLevel.Quartile);
                        capacityHigh = this.mQrBarcodeValues.getBinaryDataCapacity(this.mVersion, ErrorCorrectionLevel.High);

                    }

                    if (capacityHigh > this.text.length) {
                        this.mErrorCorrectionLevel = ErrorCorrectionLevel.High;
                    } else if (capacityQuartile > this.text.length) {
                        this.mErrorCorrectionLevel = ErrorCorrectionLevel.Quartile;
                    } else if (capacityMedium > this.text.length) {
                        this.mErrorCorrectionLevel = ErrorCorrectionLevel.Medium;
                    } else if (capacityLow > this.text.length) {
                        this.mErrorCorrectionLevel = ErrorCorrectionLevel.Low;
                    } else {
                        this.validInput = false;

                    }
                }
            }
        }
    }
    /* tslint:enable */



    /**
     * Adds quietzone to the QR Barcode..\
     *
     * @returns {void}  Adds quietzone to the QR Barcode. .
     * @private
     */
    private addQuietZone(): void {
        const quietZone: number = QuietZone.All;
        const w: number = this.mNoOfModules + 2 * quietZone;
        const h: number = this.mNoOfModules + 2 * quietZone;
        const tempValue1: ModuleValue[][] = [];
        const tempValue2: ModuleValue[][] = [];

        for (let i: number = 0; i < w; i++) {
            // tslint:disable-next-line:no-any
            // eslint-disable-next-line
            tempValue1.push([0] as any);
            // tslint:disable-next-line:no-any
            // eslint-disable-next-line
            tempValue2.push([0] as any);
            for (let j: number = 0; j < h; j++) {
                tempValue1[i][j] = new ModuleValue();
                tempValue2[i][j] = new ModuleValue();
            }
        }


        // Top quietzone.
        for (let i: number = 0; i < h; i++) {
            tempValue1[0][i] = new ModuleValue();
            tempValue1[0][i].isBlack = false;
            tempValue1[0][i].isFilled = false;
            tempValue1[0][i].isPdp = false;
            tempValue2[0][i] = new ModuleValue();
            tempValue2[0][i].isBlack = false;
            tempValue2[0][i].isFilled = false;
            tempValue2[0][i].isPdp = false;
        }

        for (let i: number = quietZone; i < w - quietZone; i++) {
            // Left quietzone.
            tempValue1[i][0] = new ModuleValue();
            tempValue1[i][0].isBlack = false;
            tempValue1[i][0].isFilled = false;
            tempValue1[i][0].isPdp = false;
            tempValue2[i][0] = new ModuleValue();
            tempValue2[i][0].isBlack = false;
            tempValue2[i][0].isFilled = false;
            tempValue2[i][0].isPdp = false;

            for (let j: number = quietZone; j < h - quietZone; j++) {
                tempValue1[i][j] = this.mModuleValue[i - quietZone][j - quietZone];
                tempValue2[i][j] = this.mDataAllocationValues[i - quietZone][j - quietZone];
            }

            // Right quietzone.
            tempValue1[i][h - quietZone] = new ModuleValue();
            tempValue1[i][h - quietZone].isBlack = false;
            tempValue1[i][h - quietZone].isFilled = false;
            tempValue1[i][h - quietZone].isPdp = false;
            tempValue2[i][h - quietZone] = new ModuleValue();
            tempValue2[i][h - quietZone].isBlack = false;
            tempValue2[i][h - quietZone].isFilled = false;
            tempValue2[i][h - quietZone].isPdp = false;
        }

        //Bottom quietzone.
        for (let i: number = 0; i < h; i++) {
            tempValue1[w - quietZone][i] = new ModuleValue();
            tempValue1[w - quietZone][i].isBlack = false;
            tempValue1[w - quietZone][i].isFilled = false;
            tempValue1[w - quietZone][i].isPdp = false;
            tempValue2[w - quietZone][i] = new ModuleValue();
            tempValue2[w - quietZone][i].isBlack = false;
            tempValue2[w - quietZone][i].isFilled = false;
            tempValue2[w - quietZone][i].isPdp = false;
        }

        this.mModuleValue = tempValue1;
        this.mDataAllocationValues = tempValue2;
    }


    /**
     * Draw the Format Information.\
     *
     * @returns {void} Draw the Format Information .
     * @private
     */
    private drawFormatInformation(): void {
        const formatInformation: number[] = this.mQrBarcodeValues.FormatInformation;

        let count: number = 0;
        for (let i: number = 0; i < 7; i++) {
            //Draw from 14 to 8
            if (i === 6) {
                this.mModuleValue[i + 1][8].isBlack = formatInformation[count] === 1 ? true : false;
            } else {
                this.mModuleValue[i][8].isBlack = formatInformation[count] === 1 ? true : false;
            }
            this.mModuleValue[8][this.mNoOfModules - i - 1].isBlack = formatInformation[count++] === 1 ? true : false;


        }
        count = 14;
        for (let i: number = 0; i < 7; i++) {
            //Draw from 0 to 6
            if (i === 6) {
                this.mModuleValue[8][i + 1].isBlack = formatInformation[count] === 1 ? true : false;
            } else {
                this.mModuleValue[8][i].isBlack = formatInformation[count] === 1 ? true : false;
            }
            this.mModuleValue[this.mNoOfModules - i - 1][8].isBlack = formatInformation[count--] === 1 ? true : false;
        }

        //Draw 7
        this.mModuleValue[8][8].isBlack = formatInformation[7] === 1 ? true : false;
        this.mModuleValue[8][this.mNoOfModules - 8].isBlack = formatInformation[7] === 1 ? true : false;

    }

    /**
     * Allocates the Encoded Data and then Mask
     *
     * @param Data - Encoded Data
     */
    /* tslint:disable */
    private dataAllocationAndMasking(data: boolean[]): void {
        this.mDataAllocationValues = [];
        for (let i: number = 0; i < this.mNoOfModules; i++) {
            // tslint:disable-next-line:no-any
            // eslint-disable-next-line
            this.mDataAllocationValues.push([0] as any);
            for (let j: number = 0; j < this.mNoOfModules; j++) {
                this.mDataAllocationValues[i][j] = new ModuleValue();
            }
        }
        let point: number = 0;

        for (let i: number = this.mNoOfModules - 1; i >= 0; i -= 2) {
            for (let j: number = this.mNoOfModules - 1; j >= 0; j--) {
                if (!(this.mModuleValue[i][j].isFilled && this.mModuleValue[i - 1][j].isFilled)) {
                    if (!this.mModuleValue[i][j].isFilled) {
                        if (point + 1 < data.length) {
                            this.mDataAllocationValues[i][j].isBlack = data[point++];
                        }
                        if ((i + j) % 3 === 0) {
                            this.mDataAllocationValues[i][j].isBlack = (this.mDataAllocationValues[i][j].isBlack) ? true : false;
                        } else {
                            this.mDataAllocationValues[i][j].isBlack = (this.mDataAllocationValues[i][j].isBlack) ? false : true;
                        }
                        this.mDataAllocationValues[i][j].isFilled = true;
                    }

                    if (!this.mModuleValue[i - 1][j].isFilled) {
                        if (point + 1 < data.length) {
                            this.mDataAllocationValues[i - 1][j].isBlack = data[point++];
                        }
                        if ((i - 1 + j) % 3 === 0) {
                            this.mDataAllocationValues[i - 1][j].isBlack = (this.mDataAllocationValues[i - 1][j].isBlack) ? true : false;
                        } else {
                            this.mDataAllocationValues[i - 1][j].isBlack = (this.mDataAllocationValues[i - 1][j].isBlack) ? false : true;
                        }
                        this.mDataAllocationValues[i - 1][j].isFilled = true;
                    }
                }
            }
            i -= 2;
            if (i === 6) { i--; }

            for (let k: number = 0; k < this.mNoOfModules; k++) {
                if (!(this.mModuleValue[i][k].isFilled && this.mModuleValue[i - 1][k].isFilled)) {
                    if (!this.mModuleValue[i][k].isFilled) {
                        if (point + 1 < data.length) {
                            this.mDataAllocationValues[i][k].isBlack = data[point++];
                        }
                        if ((i + k) % 3 !== 0) {
                            this.mDataAllocationValues[i][k].isBlack = (this.mDataAllocationValues[i][k].isBlack) ? false : true;
                        } else {
                            this.mDataAllocationValues[i][k].isBlack = (this.mDataAllocationValues[i][k].isBlack) ? true : false;
                        }
                        this.mDataAllocationValues[i][k].isFilled = true;
                    }
                    if (!this.mModuleValue[i - 1][k].isFilled) {
                        if (point + 1 < data.length) {
                            this.mDataAllocationValues[i - 1][k].isBlack = data[point++];
                        }
                        if ((i - 1 + k) % 3 !== 0) {
                            this.mDataAllocationValues[i - 1][k].isBlack = (this.mDataAllocationValues[i - 1][k].isBlack) ? false : true;
                        } else {
                            this.mDataAllocationValues[i - 1][k].isBlack = (this.mDataAllocationValues[i - 1][k].isBlack) ? true : false;
                        }
                        this.mDataAllocationValues[i - 1][k].isFilled = true;
                    }
                }
            }
        }
        for (let i: number = 0; i < this.mNoOfModules; i++) {
            for (let j: number = 0; j < this.mNoOfModules; j++) {
                if (!this.mModuleValue[i][j].isFilled) {
                    const flag: boolean = this.mDataAllocationValues[i][j].isBlack;
                    if (flag) {
                        this.mDataAllocationValues[i][j].isBlack = false;
                    } else {
                        this.mDataAllocationValues[i][j].isBlack = true;
                    }
                }
            }
        }
    }
    /* tslint:enable */


    /**
     *  Allocates Format and Version Information.\
     *
     * @returns {void}  Allocates Format and Version Information.
     * @private
     */
    private allocateFormatAndVersionInformation(): void {
        for (let i: number = 0; i < 9; i++) {
            this.mModuleValue[8][i].isFilled = true;
            this.mModuleValue[i][8].isFilled = true;
        }
        for (let i: number = this.mNoOfModules - 8; i < this.mNoOfModules; i++) {
            this.mModuleValue[8][i].isFilled = true;
            this.mModuleValue[i][8].isFilled = true;
        }
        if (this.mVersion > 6) {
            const versionInformation: number[] = this.mQrBarcodeValues.VersionInformation;
            let count: number = 0;
            for (let i: number = 0; i < 6; i++) {
                for (let j: number = 2; j >= 0; j--) {
                    this.mModuleValue[i][this.mNoOfModules - 9 - j].isBlack = versionInformation[count] === 1 ? true : false;
                    this.mModuleValue[i][this.mNoOfModules - 9 - j].isFilled = true;

                    this.mModuleValue[this.mNoOfModules - 9 - j][i].isBlack = versionInformation[count++] === 1 ? true : false;
                    this.mModuleValue[this.mNoOfModules - 9 - j][i].isFilled = true;
                }
            }
        }
    }


    /**
     *Draw the Alignment Pattern in the given location.\
     *
     * @returns {void} Draw the Alignment Pattern in the given location .
     *  @param {HTMLElement} x - Provide the canvas element .
     *  @param {HTMLElement} y - Provide the canvas element .
     * @private
     */
    private drawAlignmentPattern(x: number, y: number): void {
        let i: number; let j: number;
        for (i = x - 2, j = y - 2; i < x + 3; i++ , j++) {
            this.mModuleValue[i][y - 2].isBlack = true;
            this.mModuleValue[i][y - 2].isFilled = true;

            this.mModuleValue[i][y + 2].isBlack = true;
            this.mModuleValue[i][y + 2].isFilled = true;

            this.mModuleValue[x - 2][j].isBlack = true;
            this.mModuleValue[x - 2][j].isFilled = true;

            this.mModuleValue[x + 2][j].isBlack = true;
            this.mModuleValue[x + 2][j].isFilled = true;
        }

        for (i = x - 1, j = y - 1; i < x + 2; i++ , j++) {
            this.mModuleValue[i][y - 1].isBlack = false;
            this.mModuleValue[i][y - 1].isFilled = true;

            this.mModuleValue[i][y + 1].isBlack = false;
            this.mModuleValue[i][y + 1].isFilled = true;

            this.mModuleValue[x - 1][j].isBlack = false;
            this.mModuleValue[x - 1][j].isFilled = true;

            this.mModuleValue[x + 1][j].isBlack = false;
            this.mModuleValue[x + 1][j].isFilled = true;
        }
        this.mModuleValue[x][y].isBlack = true;
        this.mModuleValue[x][y].isFilled = true;
    }


    /**
     *Gets the Allignment pattern coordinates of the current version.\
     *
     * @returns {number[]}Gets the Allignment pattern coordinates of the current version. .
     * @private
     */
    private getAlignmentPatternCoOrdinates(): number[] {
        let allign: number[] = null;
        switch ((this.mVersion)) {
        case 2:
            allign = [6, 18]; break;
        case 3:
            allign = [6, 22]; break;
        case 4:
            allign = [6, 26]; break;
        case 5:
            allign = [6, 30]; break;
        case 6:
            allign = [6, 34]; break;
        case 7:
            allign = [6, 22, 38]; break;
        case 8:
            allign = [6, 24, 42]; break;
        case 9:
            allign = [6, 26, 46]; break;
        case 10:
            allign = [6, 28, 50]; break;
        case 11:
            allign = [6, 30, 54]; break;
        case 12:
            allign = [6, 32, 58]; break;
        case 13:
            allign = [6, 34, 62]; break;
        case 14:
            allign = [6, 26, 46, 66]; break;
        case 15:
            allign = [6, 26, 48, 70]; break;
        case 16:
            allign = [6, 26, 50, 74]; break;
        case 17:
            allign = [6, 30, 54, 78]; break;
        case 18:
            allign = [6, 30, 56, 82]; break;
        case 19:
            allign = [6, 30, 58, 86]; break;
        case 20:
            allign = [6, 34, 62, 90]; break;
        case 21:
            allign = [6, 28, 50, 72, 94]; break;
        case 22:
            allign = [6, 26, 50, 74, 98]; break;
        case 23:
            allign = [6, 30, 54, 78, 102]; break;
        case 24:
            allign = [6, 28, 54, 80, 106]; break;
        case 25:
            allign = [6, 32, 58, 84, 110]; break;
        case 26:
            allign = [6, 30, 58, 86, 114]; break;
        case 27:
            allign = [6, 34, 62, 90, 118]; break;
        case 28:
            allign = [6, 26, 50, 74, 98, 122]; break;
        case 29:
            allign = [6, 30, 54, 78, 102, 126]; break;
        case 30:
            allign = [6, 26, 52, 78, 104, 130]; break;
        case 31:
            allign = [6, 30, 56, 82, 108, 134]; break;
        case 32:
            allign = [6, 34, 60, 86, 112, 138]; break;
        case 33:
            allign = [6, 30, 58, 86, 114, 142]; break;
        case 34:
            allign = [6, 34, 62, 90, 118, 146]; break;
        case 35:
            allign = [6, 30, 54, 78, 102, 126, 150]; break;
        case 36:
            allign = [6, 24, 50, 76, 102, 128, 154]; break;
        case 37:
            allign = [6, 28, 54, 80, 106, 132, 158]; break;
        case 38:
            allign = [6, 32, 58, 84, 110, 136, 162]; break;
        case 39:
            allign = [6, 26, 54, 82, 110, 138, 166]; break;
        case 40:
            allign = [6, 30, 58, 86, 114, 142, 170]; break;

        }
        return allign;
    }

    /**
     * Encode the Input Data
     */
    /* tslint:disable */
    private encodeData(): boolean[] {

        let encodeData: boolean[] = [];
        switch (this.mInputMode) {
        case 'NumericMode':
            encodeData.push(false); encodeData.push(false); encodeData.push(false); encodeData.push(true);
            break;
        case 'AlphaNumericMode':
            encodeData.push(false); encodeData.push(false); encodeData.push(true); encodeData.push(false);
            break;
        case 'BinaryMode':
            if (this.mIsEci) {
                //Add ECI Mode Indicator
                encodeData.push(false); encodeData.push(true); encodeData.push(true); encodeData.push(true);

                //Add ECI assignment number
                const numberInBool: boolean[] = this.stringToBoolArray(this.mEciAssignmentNumber.toString(), 8);
                // eslint-disable-next-line
                for (let x of Object.keys(numberInBool)) {
                    encodeData.push(numberInBool[x]);
                }
            }
            encodeData.push(false); encodeData.push(true); encodeData.push(false); encodeData.push(false);
            break;

        }

        let numberOfBitsInCharacterCountIndicator: number = 0;
        if (this.mVersion < 10) {
            switch (this.mInputMode) {
            case 'NumericMode':
                numberOfBitsInCharacterCountIndicator = 10; break;
            case 'AlphaNumericMode':
                numberOfBitsInCharacterCountIndicator = 9; break;
            case 'BinaryMode':
                numberOfBitsInCharacterCountIndicator = 8; break;
            }
        } else if (this.mVersion < 27) {
            switch (this.mInputMode) {
            case 'NumericMode':
                numberOfBitsInCharacterCountIndicator = 12; break;
            case 'AlphaNumericMode':
                numberOfBitsInCharacterCountIndicator = 11; break;
            case 'BinaryMode':
                numberOfBitsInCharacterCountIndicator = 16; break;
            }
        } else {
            switch (this.mInputMode) {
            case 'NumericMode':
                numberOfBitsInCharacterCountIndicator = 14; break;
            case 'AlphaNumericMode':
                numberOfBitsInCharacterCountIndicator = 13; break;
            case 'BinaryMode':
                numberOfBitsInCharacterCountIndicator = 16; break;
            }
        }

        const numberOfBitsInCharacterCountIndicatorInBool: boolean[] = this.intToBoolArray(
            this.text.length, numberOfBitsInCharacterCountIndicator);

        for (let i: number = 0; i < numberOfBitsInCharacterCountIndicator; i++) {
            encodeData.push(numberOfBitsInCharacterCountIndicatorInBool[i]);
        }
        if (this.mInputMode === 'NumericMode') {
            const dataStringArray: string[] = this.text.split('');
            let number: string = '';
            for (let i: number = 0; i < dataStringArray.length; i++) {
                let numberInBool: boolean[];
                number += dataStringArray[i];

                if (i % 3 === 2 && i !== 0 || i === dataStringArray.length - 1) {
                    if (number.toString().length === 3) {
                        numberInBool = this.stringToBoolArray(number, 10);
                    } else if (number.toString().length === 2) {
                        numberInBool = this.stringToBoolArray(number, 7);
                    } else {
                        numberInBool = this.stringToBoolArray(number, 4);
                    }
                    number = '';
                    for (const x of Object.keys(numberInBool)) { encodeData.push(numberInBool[x]); }
                }
            }
        } else if (this.mInputMode === 'AlphaNumericMode') {
            const dataStringArray: string[] = this.text.split('');
            let numberInString: string = '';
            let number: number = 0;
            for (let i: number = 0; i < dataStringArray.length; i++) {
                let numberInBool: boolean[];
                numberInString += dataStringArray[i];

                if (i % 2 === 0 && i + 1 !== dataStringArray.length) {
                    number = 45 * this.mQrBarcodeValues.getAlphaNumericValues(dataStringArray[i]);
                }
                if (i % 2 === 1 && i !== 0) {
                    number += this.mQrBarcodeValues.getAlphaNumericValues(dataStringArray[i]);
                    numberInBool = this.intToBoolArray(number, 11);
                    number = 0;
                    for (const x of Object.keys(numberInBool)) { encodeData.push(numberInBool[x]); }
                    numberInString = '';
                }
                if (i !== 1 && numberInString !== '') {
                    if (i + 1 === dataStringArray.length && numberInString.length === 1) {
                        number = this.mQrBarcodeValues.getAlphaNumericValues(dataStringArray[i]);
                        numberInBool = this.intToBoolArray(number, 6);
                        number = 0;
                        for (const x of Object.keys(numberInBool)) { encodeData.push(numberInBool[x]); }
                    }
                }
            }
        } else if (this.mInputMode === 'BinaryMode') {
            const dataStringArray: string[] = this.text.split('');
            for (let i: number = 0; i < dataStringArray.length; i++) {
                let number: number = 0;
                if ((this.text.charCodeAt(i) >= 32 && this.text.charCodeAt(i) <= 126) || (this.text.charCodeAt(i) >= 161 &&
                    this.text.charCodeAt(i) <= 255 || (this.text.charCodeAt(i) === 10 || this.text.charCodeAt(i) === 13))) {
                    number = dataStringArray[i].charCodeAt(0);
                } else if (this.text.charCodeAt(i) >= 65377 && this.text.charCodeAt(i) <= 65439) {
                    number = dataStringArray[i].charCodeAt(0) - 65216;
                } else if ((this.text.charCodeAt(i) >= 1025 && this.text.charCodeAt(i) <= 1119)) {
                    number = dataStringArray[i].charCodeAt(0) - 864;
                } else {
                    this.validInput = false;
                }

                const numberInBool: boolean[] = this.intToBoolArray(number, 8);
                // eslint-disable-next-line
                for (let x of Object.keys(numberInBool)) { encodeData.push(numberInBool[x]); }
            }
        }

        if (this.mixDataCount === 0) {
            for (let i: number = 0; i < 4; i++) {
                if (encodeData.length / 8 === this.mQrBarcodeValues.NumberOfDataCodeWord) {
                    break;
                } else { encodeData.push(false); }
            }

            for (; ;) {  //Add Padding Bits
                if (encodeData.length % 8 === 0) {
                    break;
                } else { encodeData.push(false); }
            }

            for (; ;) {
                if (encodeData.length / 8 === this.mQrBarcodeValues.NumberOfDataCodeWord) {
                    break;
                } else {
                    encodeData.push(true); encodeData.push(true); encodeData.push(true); encodeData.push(false);
                    encodeData.push(true); encodeData.push(true); encodeData.push(false); encodeData.push(false);
                }
                if (encodeData.length / 8 === this.mQrBarcodeValues.NumberOfDataCodeWord) {
                    break;
                } else {
                    encodeData.push(false); encodeData.push(false); encodeData.push(false); encodeData.push(true);
                    encodeData.push(false); encodeData.push(false); encodeData.push(false); encodeData.push(true);
                }
            }

            let dataBits: number = this.mQrBarcodeValues.NumberOfDataCodeWord;
            let blocks: number[] = this.mQrBarcodeValues.NumberOfErrorCorrectionBlocks;

            let totalBlockSize: number = blocks[0];
            if (blocks.length === 6) {
                totalBlockSize = blocks[0] + blocks[3];
            }

            const ds1: string[][] = [];

            let testEncodeData: boolean[] = encodeData;
            if (blocks.length === 6) {

                const dataCodeWordLength: number = blocks[0] * blocks[2] * 8;
                testEncodeData = [];
                for (let i: number = 0; i < dataCodeWordLength; i++) {
                    testEncodeData.push(encodeData[i]);
                }
            }

            let dsOne: string[][] = [];
            dsOne = this.createBlocks(testEncodeData, blocks[0]);

            for (let i: number = 0; i < blocks[0]; i++) {
                ds1[i] = this.splitCodeWord(dsOne, i, testEncodeData.length / 8 / blocks[0]);
            }

            if (blocks.length === 6) {
                testEncodeData = [];
                for (let i: number = blocks[0] * blocks[2] * 8; i < encodeData.length; i++) {
                    testEncodeData.push(encodeData[i]);
                }

                let dsTwo: string[][] = [];
                dsTwo = this.createBlocks(testEncodeData, blocks[3]);

                for (let i: number = blocks[0], count: number = 0; i < totalBlockSize; i++) {
                    ds1[i] = this.splitCodeWord(dsTwo, count++, testEncodeData.length / 8 / blocks[3]);
                }
            }
            encodeData = null;
            encodeData = [];
            for (let i: number = 0; i < 125; i++) {
                for (let k: number = 0; k < totalBlockSize; k++) {
                    for (let j: number = 0; j < 8; j++) {
                        if (i < ds1[k].length) {
                            encodeData.push(ds1[k][i][j] === '1' ? true : false);
                        }
                    }
                }
            }

            const ec: ErrorCorrectionCodewords = new ErrorCorrectionCodewords(this.mVersion, this.mErrorCorrectionLevel);
            dataBits = this.mQrBarcodeValues.NumberOfDataCodeWord;
            const eccw: number = this.mQrBarcodeValues.NumberOfErrorCorrectingCodeWords;
            blocks = this.mQrBarcodeValues.NumberOfErrorCorrectionBlocks;


            if (blocks.length === 6) {
                ec.DataBits = (dataBits - blocks[3] * blocks[5]) / blocks[0];
            } else {
                ec.DataBits = dataBits / blocks[0];
            }
            ec.Eccw = eccw / totalBlockSize;

            const polynomial: string[][] = [];
            let count: number = 0;

            for (let i: number = 0; i < blocks[0]; i++) {
                ec.DC = ds1[count];
                polynomial[count++] = ec.getErcw();
            }
            if (blocks.length === 6) {
                ec.DataBits = (dataBits - blocks[0] * blocks[2]) / blocks[3];

                for (let i: number = 0; i < blocks[3]; i++) {
                    ec.DC = ds1[count];
                    polynomial[count++] = ec.getErcw();
                }
            }
            if (blocks.length !== 6) {
                for (let i: number = 0; i < polynomial[0].length; i++) {
                    for (let k: number = 0; k < blocks[0]; k++) {
                        for (let j: number = 0; j < 8; j++) {
                            if (i < polynomial[k].length) {
                                encodeData.push(polynomial[k][i][j] === '1' ? true : false);
                            }
                        }
                    }
                }
            } else {
                for (let i: number = 0; i < polynomial[0].length; i++) {
                    for (let k: number = 0; k < totalBlockSize; k++) {
                        for (let j: number = 0; j < 8; j++) {
                            if (i < polynomial[k].length) {
                                encodeData.push(polynomial[k][i][j] === '1' ? true : false);
                            }
                        }
                    }
                }
            }
        }
        return encodeData;
    }
    /* tslint:enable */


    /**
     *  Converts string value to Boolean\
     *
     * @returns {boolean[]}  Converts string value to Boolean .
     *  @param {HTMLElement} numberInString - Provide the canvas element .
     *  @param {number} noOfBits - Provide the canvas element .
     * @private
     */
    private stringToBoolArray(numberInString: string, noOfBits: number): boolean[] {
        const numberInBool: boolean[] = [];
        const dataStringArray: string[] = numberInString.split('');
        let number: number = 0;
        for (let i: number = 0; i < dataStringArray.length; i++) {
            number = number * 10 + dataStringArray[i].charCodeAt(0) - 48;
        }

        for (let i: number = 0; i < noOfBits; i++) {
            numberInBool[noOfBits - i - 1] = ((number >> i) & 1) === 1;
        }
        return numberInBool;
    }


    /**
     *  Converts Integer value to Boolean\
     *
     * @returns {boolean[]}  Converts Integer value to Boolean .
     * @param {HTMLElement} number -The Integer value .
     * @param {number} noOfBits - Number of Bits .
     * @private
     */
    private intToBoolArray(number: number, noOfBits: number): boolean[] {
        const numberInBool: boolean[] = [];
        for (let i: number = 0; i < noOfBits; i++) {
            numberInBool[noOfBits - i - 1] = ((number >> i) & 1) === 1;
        }
        return numberInBool;
    }



    /**
     *  Splits the Code words\
     *
     * @returns {boolean[]}  Splits the Code words .
     * @param {HTMLElement} ds -The Encoded value Blocks .
     * @param {number} blk - Index of Block Number .
     * @param {number} count -  Length of the Block .
     * @private
     */
    private splitCodeWord(ds: string[][], blk: number, count: number): string[] {
        const ds1: string[] = [];
        for (let i: number = 0; i < count; i++) { ds1.push(ds[blk][i]); }
        return ds1;
    }

    /**
     *  Creates the Blocks\
     *
     * @returns {boolean[]} Creates the Blocks .
     * @param {HTMLElement} encodeData -The Encoded value. .
     * @param {number} noOfBlocks -Number of Blocks .
     * @private
     */
    private createBlocks(encodeData: boolean[], noOfBlocks: number): string[][] {

        const ret: string[][] = [];
        const cols: number = encodeData.length / 8 / noOfBlocks;

        let stringValue: string = '';
        let i: number = 0;
        let blockNumber: number = 0;

        for (let i: number = 0; i < noOfBlocks; i++) {
            // tslint:disable-next-line:no-any
            // eslint-disable-next-line
            ret.push([0] as any);
            for (let j: number = 0; j < cols; j++) {
                ret[i][j] = '';
            }
        }

        for (let j: number = 0; j < encodeData.length; j++) {
            if (j % 8 === 0 && j !== 0) {
                ret[blockNumber][i] = stringValue;
                stringValue = '';
                i++;
                if (i === (encodeData.length / noOfBlocks / 8)) {
                    blockNumber++;
                    i = 0;
                }
            }
            stringValue += encodeData[j] ? '1' : '0';
        }
        ret[blockNumber][i] = stringValue;
        return ret;
    }
}


/** @private */
export class ModuleValue {
    public isBlack: boolean;
    public isFilled: boolean;
    public isPdp: boolean;
    constructor() {
        this.isBlack = false;
        this.isFilled = false;
        this.isPdp = false;
    }
}
