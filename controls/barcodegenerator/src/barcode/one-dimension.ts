import { BarcodeBase } from './barcode-base';
import { BarcodeRenderer } from './rendering/renderer';
import { BaseAttributes } from './rendering/canvas-interface';
import { Rect } from './primitives/rect';
import { createMeasureElements, measureText } from './utility/dom-util';
import { Size } from './primitives/size';
import { DisplayTextModel } from './primitives/displaytext-model';
import { MarginModel } from './primitives/margin-model';
import { BarcodeType } from './enum/enum';

/**
 * onedimension class is used to render all type of one dimensional shapes
 */
export abstract class OneDimension extends BarcodeBase {

    private getInstance(id: string): BarcodeRenderer {
        const barCode: HTMLElement = document.getElementById(id);
        const barcodeRenderer: BarcodeRenderer = new BarcodeRenderer(barCode.id, this.isSvgMode);
        return barcodeRenderer;
    }


    /**
     * Return the drawable size of the rectangle .
     *
     * @returns {Rect} Return the drawable size of the rectangle.
     *  @param {MarginModel} margin - Specifies the filename of the barcode image to be download.
     *  @param {number} w - Specifies the filename of the barcode image to be download.
     *  @param {number} h - Defines the format of the barcode to be exported
     * @private
     */
    public getDrawableSize(margin: MarginModel, w: number, h: number): Rect {
        const topMargin: number = ((this.isSvgMode ? margin.bottom : margin.bottom * 1.5)
            + (this.isSvgMode ? margin.top : margin.top * 1.5));
        const rightMargin: number = ((this.isSvgMode ? margin.right : margin.right * 1.5)
            + (this.isSvgMode ? margin.left : margin.left * 1.5));
        const barcodeSize: Rect = new Rect(margin.left, margin.top, (w - rightMargin), h - topMargin);
        return barcodeSize;
    }

    private getBaseAttributes(
        width: number, height: number, offSetX: number, offsetY: number,
        color: string, string?: string, stringSize?: number, visibility?: boolean, fontStyle?: string):
        BaseAttributes {
        const options: BaseAttributes = {
            width: width, height: height, x: offSetX, y: offsetY, color: color, string: string,
            stringSize: stringSize, visibility: visibility, fontStyle: fontStyle
        };
        if (!this.isSvgMode) {
            options.height = options.height / 1.5;
        }
        if (string && !this.isSvgMode) {
            const scaleValue: number = this.margin.bottom * 1.5 - this.margin.bottom;
            options.y += scaleValue;
        }
        return options;
    }

    private getBarLineRatio(code: string[] | string, widthValue: number): number {
        const type: string = this.type;
        if (type === 'Code39' || type === 'Code32' || type === 'Code39Extension' || type === 'Code11') {
            // total number of line for single width lines
            const singlewidth: number = code.length * ((type === 'Code39' || type === 'Code32' || type === 'Code39Extension') ? 6 : 3);
            // total number of line for double width lines
            const doublwidth: number = code.length * ((type === 'Code39' || type === 'Code32' || type === 'Code39Extension') ? 3 : 2) * 2;
            return (widthValue / (doublwidth + singlewidth + code.length - 1));
        } else if (type === 'Code128A' || type === 'Code128B' || type === 'Code128C' || type === 'Code128') {
            const lineCount: number = (code[0] as string).length;
            return (widthValue / (lineCount + code.length - 1));
        } else if (type === 'Code93Extension') {
            let count: number = 0;
            for (let i: number = 0; i < code.length; i++) {
                const numberOfDigits: string = code[i];
                for (let j: number = 0; j < numberOfDigits.length; j++) {
                    count += Number(numberOfDigits[j]);
                }
            }
            return widthValue / count;
        } else {
            let lineCount: number = 0;
            for (let i: number = 0; i < code.length; i++) {
                const numberOfDigits: number = code[i].length;
                lineCount += numberOfDigits;
            }
            let additionalValue: number;
            if (type === 'Ean8' || type === 'Ean13' || type === 'UpcA') {
                additionalValue = 2;
            } else if (type === 'Code93') {
                additionalValue = -code.length + 1;
            }
            return (widthValue / (additionalValue ? ((lineCount + code.length - 1) + additionalValue) : (lineCount + code.length - 1)));
        }
    }

    private multipleWidth(codeValue: string, k: number, value: number): number {
        let number: number;
        if (codeValue[k] === '1' && codeValue[k + 1] === '1') {
            number = value + 1;
            return this.multipleWidth(codeValue, k + 1, number);
        }
        return value;

    }

    private barCodeType(type: BarcodeType): string {
        if (type === 'Code39' || type === 'UpcE' || type === 'Code39Extension') {
            return 'twoBars';
        } else if (type === 'UpcA' || type === 'Ean13' || type === 'Ean8') {
            return 'threeBars';
        } else {
            return 'noBars';
        }
    }

    private checkStartValueCondition(j: number, k: number, numberOfDigits: number, barType: string): boolean {
        if ((j === 1 && k === 0 && barType === 'twoBars' && this.type !== 'UpcE' ||
            (((j === 0 && k === numberOfDigits - 1) || j === 2 && k === numberOfDigits - 2)
                && (this.type === 'Ean8' || this.type === 'Ean13')))
            || (this.type === 'UpcE' && j === 2 && k === 0)
            || (this.type != 'UpcA' && barType === 'threeBars' && (j === 2 && k === numberOfDigits - 1))
            || this.type === 'UpcA' && ((j === 1 && k === numberOfDigits - 2)
                || (j === 3 && k === numberOfDigits - 2))
            || (barType === 'noBars' && j === 0 && k === 0)) {
            return true;
        } else {
            return false;
        }
    }

    private checkEndValueCondition(
        k: number, j: number, numberOfDigits: number, code: number[] | string[],
        temp?: boolean, doublwidth?: number):
        boolean {
        const type: string = this.type;
        if ((k === numberOfDigits && j === code.length - 2 && (type === 'Code39' || type === 'Code39Extension'))
            || (type === 'Code11' && j === code.length - 1 && k === numberOfDigits - 1)
            || type === 'Code93Extension' && j === code.length - 1 && k === numberOfDigits - 1
            || ((type === 'Ean8') && (j === 1 && k === numberOfDigits
                || j === code.length - 2 && k === numberOfDigits))
            || ((this.type === 'Ean13') && ((j === 2 && k === 1) || j === code.length - 2 && k === numberOfDigits))
            || (type === 'UpcA' && (j === 3 && k === 0 || j === 5 && (!temp ? (k === 1) : ((k === (doublwidth))))))
            || (type === 'UpcE' && (j === code.length - 2 && k === 1))
            || (type === 'Code93' && j === code.length - 1 && k === numberOfDigits - 1)
            || ((type !== 'Code39' && type !== 'Code39Extension'
                && type !== 'Ean8' && type !== 'Ean13') && j === code.length - 1 && k === numberOfDigits)) {
            return true;
        } else {
            return false;
        }
    }

    private getDisplayText(j: number, textProperty: DisplayTextModel): string {
        let text: string;
        if (this.type === 'Ean8') {
            text = j === 1 ? (this.value.substring(0, 4)) : (this.value.substring(4, 8));
        } else if (this.type === 'Ean13') {
            text = j === 2 ? (this.value.substring(1, 7)) : (this.value.substring(7));
        } else if (this.type === 'UpcA') {
            text = j === 3 ? ((this.value.substring(0, 6))) : (this.value.substring(6, 12));
        } else {
            text = textProperty.text ? textProperty.text : this.value;
        }
        return text;
    }

    private checkExtraHeight(j: number, type: string, code: number[] | string[]): boolean {
        if (((j === 0 || j === code.length - 1) && (type === 'Code39' || type === 'Code39Extension'))
            || ((type === 'Ean8' || type === 'Ean13') && (j === 0 || j === 2 || j === code.length - 1))
            || type === 'UpcA' && (j === 1 || j === code.length - 2 || j === code.length - 4)
            || type === 'UpcE' && (j === 1 || j === code.length - 2 || j === code.length - 4)) {
            return true;
        } else {
            return false;
        }
    }

    private getWidthValue(number: number, width: number, type: string): number {
        if (this.type !== 'Code93Extension') {
            if (number) {
                const dividerValue: number = type === 'Code32' ? 3 : 2;
                width = number % dividerValue ? 1 : 2;
            } else {
                width = 1;
            }
        }
        if (this.type === 'Code93Extension') {
            if (number && !(number % 4)) {
                width = 4;
            } else if (number && !(number % 2)) {
                width = 2;
            } else if (number && !(number % 3)) {
                width = 3;
            } else {
                width = 1;
            }
        }
        return width;
    }

    /* eslint:disable */
    /**
     * Returns the module name of the barcode
     *
     * @param {number[] | string[]} code - Returns the code as string or number collection.
     * @param {HTMLElement} canvas - Returns the canvas.
     * @param {string} isUpcE - Returns the UPCE values as string.
     * @returns {void}  Calculate the barcode attribute
     * @private
     */
    public calculateBarCodeAttributes(code: number[] | string[], canvas: HTMLElement, isUpcE?: string): void {
        let temp: boolean = false; let canDoubleWidth: number;
        const barcodeSize: Rect = this.getDrawableSize(this.margin, this.width as number, this.height as number);
        if (barcodeSize.height > 0 && barcodeSize.width > 0) {
            let tempBaseAttributes: BaseAttributes; const options: BaseAttributes[] = []; let offsetX: number = barcodeSize.x;
            let ratio: number = this.getBarLineRatio(code as string[], barcodeSize.width);
            ratio = this.isSvgMode ? ratio : ratio / 1.5;
            let startValue: number = 0; let endValue: number; const type: string = this.type;
            const position: string = this.displayText.position; const scaleValue: number = this.isSvgMode ? 1 : 1.5;
            let textOptions: BaseAttributes; let textSize: Size; let textHeight: number; let textProperty: DisplayTextModel;
            for (let j: number = 0; j < code.length; j++) {
                const codeValue: string = code[j] as string;
                const check: boolean = (type !== 'UpcA' && type !== 'UpcE' && type !== 'Code11' && type !== 'Code93' && type !== 'Code93Extension');
                const barType: string = this.barCodeType(this.type);
                const extraHeight: boolean = this.checkExtraHeight(j, type, code);
                const numberOfDigits: number = codeValue.length;
                temp = false;
                for (let k: number = 0; check ? k <= numberOfDigits : k < numberOfDigits; k++) {
                    let renderText: boolean = false;
                    if (this.checkStartValueCondition(j, k, numberOfDigits, barType)) {
                        startValue = offsetX;
                    } else if (this.checkEndValueCondition(k, j, numberOfDigits, code, temp, canDoubleWidth)) {
                        endValue = offsetX;
                        if (this.type === 'UpcA' && temp && canDoubleWidth) {
                            endValue -= canDoubleWidth * ratio;
                        }
                        renderText = true;
                    }
                    const canDrawCheck: boolean = (type === 'Code39' || type === 'Code93Extension' || type === 'Code32' || type === 'Code11' || type === 'Code39Extension');
                    const candraw: boolean = canDrawCheck ? (k % 2 ? false : true) : (codeValue[k] === '1' ? true : false);
                    const string: string = codeValue.toString(); const number: number = Number(string[k]); let width: number;
                    width = this.getWidthValue(number, width, type); width = width * ratio; textProperty = this.displayText;
                    const text: string = this.getDisplayText(j, textProperty);
                    textOptions = this.getBaseAttributes(
                        undefined, undefined, startValue,
                        position === 'Bottom' ? (barcodeSize.y + barcodeSize.height) + 2 : (barcodeSize.y + textHeight) - 2,
                        this.foreColor, isUpcE || text, textProperty.size, textProperty.visibility, textProperty.font);
                    if (!textHeight) {
                        createMeasureElements(); textSize = measureText(textOptions); textHeight = (textSize.height / 2) + 2;
                    }
                    if (extraHeight) {
                        tempBaseAttributes = this.getBaseAttributes(
                            width, position === 'Top' && barType !== 'noBars' ? (barcodeSize.height - textHeight - this.displayText.margin.top) : (barcodeSize.height),
                            offsetX, position === 'Bottom' ? barcodeSize.y : barcodeSize.y + textHeight + this.displayText.margin.top, this.foreColor);
                    }
                    if ((type === 'Ean13') && k === 0 && j === 0 && textProperty.visibility) {
                        textOptions = this.getBaseAttributes(
                            undefined, undefined, startValue,
                            position === 'Bottom' ? (barcodeSize.y + barcodeSize.height) + 2 : ((barcodeSize.y + textHeight + this.displayText.margin.top) - 2) - this.displayText.margin.bottom,
                            this.foreColor, isUpcE || text, textProperty.size, textProperty.visibility, textProperty.font);
                        textOptions.string = this.value[0]; this.drawText(canvas as HTMLCanvasElement, textOptions);
                    }
                    if (!extraHeight || renderText || (type === 'UpcA' && extraHeight)) {
                        const checkCode: boolean = type === 'Code39' || type === 'Code32' || type === 'Code93Extension' || type === 'Code39Extension' || type === 'Code11';
                        const value: number = barcodeSize.height;
                        let barCodeHeight: number = (((value) - textHeight * scaleValue) > 0 ? ((value) - textHeight * scaleValue) : 0);
                        if (checkCode || type === 'Ean8' || type === 'Ean13') {
                            barCodeHeight = position === 'Top' && barType !== 'noBars' ? (barCodeHeight - textHeight) : barCodeHeight;
                            let height: number = extraHeight ? barcodeSize.height : barCodeHeight;
                            if (this.type !== 'Code39') {
                                height = position === 'Top' && barType !== 'noBars' ? (height - this.displayText.margin.top) - textHeight : height;
                            }
                            tempBaseAttributes = this.getBaseAttributes(
                                width, height, offsetX, position === 'Bottom' ? barcodeSize.y : barcodeSize.y + textHeight + this.displayText.margin.top, this.foreColor);
                        }
                        if ((!checkCode || (!renderText && !checkCode)) && (!renderText || this.type !== 'UpcE')) {
                            canDoubleWidth = this.multipleWidth((codeValue), k, 1); k += canDoubleWidth - 1;
                            if (canDoubleWidth > 1) {
                                temp = true;
                            }
                            const rectWidth: number = canDoubleWidth > 1 ? (canDoubleWidth * width) : width;
                            const rectHeight: number = (barcodeSize.height - textHeight * scaleValue);
                            let height: number = extraHeight ? barcodeSize.height : rectHeight;
                            height = position === 'Top' && barType !== 'noBars' ? (height - this.displayText.margin.top) - textHeight : height;
                            tempBaseAttributes = this.getBaseAttributes(
                                rectWidth, height, offsetX,
                                position === 'Bottom' ? barcodeSize.y : barcodeSize.y + textHeight + this.displayText.margin.top, this.foreColor);
                            offsetX = canDoubleWidth > 1 ? offsetX + (canDoubleWidth * (width)) : offsetX + (1 * (width));
                        }
                        if (renderText || !extraHeight) {
                            this.verticalTextMargin(textProperty, tempBaseAttributes, textOptions);
                        }
                        if (textProperty.visibility &&
                            ((endValue && type !== 'Ean8' && type !== 'Ean13' && type !== 'UpcA' && type !== 'UpcE')
                                || ((type === 'Ean8' || type === 'UpcA' || type === 'UpcE' || type === 'Ean13') && renderText))) {
                            if (!textProperty.margin.left && !textProperty.margin.right && (textProperty.text || type === 'UpcA')) {
                                this.updateOverlappedTextPosition(
                                    (endValue - startValue), textOptions, textSize, startValue, textProperty, endValue);
                            } else {
                                this.getAlignmentPosition(textOptions, endValue, startValue, textSize);
                            }
                            if (type === 'UpcA') {
                                let checkVAl: boolean = (textOptions.string === this.value.substr(0, 6)) ? true : false;
                                textOptions.string = checkVAl ? this.value.substr(0, 1) : textOptions.string.substr(0, 5);
                                let xPosition: number = checkVAl ? options[0].x / 2 : options[options.length - 1].x + textOptions.stringSize;
                                let yPosition: number = 0;
                                if (checkVAl) {
                                    let tempPosition: number = textOptions.x;
                                    textOptions.x = xPosition;
                                    yPosition = textOptions.y;
                                    this.drawText(canvas as HTMLCanvasElement, textOptions);
                                    textOptions.x = tempPosition;
                                    if (!this.isSvgMode) {
                                        textOptions.y = yPosition;
                                    }
                                    textOptions.string = this.value.substr(1, 5);
                                    this.updateOverlappedTextPosition((endValue - startValue), textOptions, textSize, startValue, textProperty, endValue);
                                } else {
                                    this.updateOverlappedTextPosition((endValue - startValue), textOptions, textSize, startValue, textProperty, endValue);
                                    yPosition = textOptions.y;
                                    this.drawText(canvas as HTMLCanvasElement, textOptions);
                                    if (!this.isSvgMode) {
                                        textOptions.y = yPosition;
                                    }
                                    textOptions.string = this.value.substr(11, 12);
                                    textOptions.x = xPosition;
                                }
                            }
                            this.alignDisplayText(textOptions, textProperty, startValue, endValue, textSize);
                            this.drawText(canvas as HTMLCanvasElement, textOptions);
                        }
                    }
                    if (candraw) {
                        options.push(tempBaseAttributes);
                    }
                    if (this.canIncrementCheck(type, j, code)) {
                        offsetX += (width);
                    }
                }
            }
            this.drawImage(canvas as HTMLCanvasElement, options);
        }
    }
    /* eslint:enable */

    private canIncrementCheck(type: string, j: number, code: number[] | string[]): boolean {
        if ((type === 'Code39' || type === 'Code32' || type === 'Code39Extension' || type === 'Code93Extension'
            || type === 'Code11') || (type === 'UpcE' && (j === 1 || j === code.length - 2)) ||
            ((type === 'Ean8' || type === 'Ean13') && (j === 0 || j === code.length - 1 || j === 2))) {
            return true;
        } else {
            return false;
        }
    }
    private verticalTextMargin(textProperty: DisplayTextModel, tempBaseAttributes: BaseAttributes, textOptions: BaseAttributes): void {
        if (textProperty.margin.top && tempBaseAttributes.height - textProperty.margin.top > 0) {
            if (textProperty.margin.top > 0 && textProperty.position === 'Bottom') {
                tempBaseAttributes.height -= textProperty.margin.top;
            } else {
                textOptions.y += textProperty.margin.top;
            }
        }
        if (textProperty.margin.bottom && tempBaseAttributes.height - textProperty.margin.bottom > 0) {
            if (textProperty.margin.bottom > 0) {
                textOptions.y -= textProperty.margin.bottom;
                if (this.displayText.position === 'Bottom') {
                    tempBaseAttributes.height -= textProperty.margin.bottom;
                }
            } else {
                textOptions.y -= textProperty.margin.bottom;
            }
        }
    }


    private getAlignmentPosition(textOptions: BaseAttributes, endValue: number, startValue: number, textSize: Size): void {
        if (this.displayText.alignment === 'Center') {
            textOptions.x += (((endValue - startValue)) / 2) - textSize.width * .5;
        } else if (this.displayText.alignment === 'Left') {
            textOptions.x = startValue;
        } else {
            textOptions.x = endValue - textSize.width;
        }
    }

    /**
     *Will draw the image for the barcode .
     *
     * @param {HTMLCanvasElement} canvas  Barcode canvas element.
     * @param {BaseAttributes []} options Barcode attributes .
     * @function drawImage
     * @returns {void} Export the barcode as an image in the specified image type and downloads it in the browser.
     * @memberof Barcode
     * @private
     */
    public drawImage(
        canvas: HTMLCanvasElement, options: BaseAttributes[])
        : void {
        const barcodeRenderer: BarcodeRenderer = this.getInstance(canvas.id);
        for (let i: number = 0; i < options.length; i++) {
            barcodeRenderer.renderRectElement(canvas as HTMLCanvasElement, options[i]);
        }
    }


    private updateDisplayTextSize(
        options: BaseAttributes, size: Size, endValue: number, startValue: number, textProperty: DisplayTextModel):
        void {
        if (options.x + size.width > endValue || (options.x < startValue) && options.stringSize > 2) {
            // eslint-disable-next-line
            const rightAlign: boolean = options.x < startValue && textProperty.margin.right ? true : false;
            if (options.x < startValue && textProperty.margin.right) {
                // if the displaytext rendering overlaps the barcode then need to reduce the displaytext size gradually by 2
                options.stringSize -= 2;
                const newSize: Size = measureText(options);
                // used to get the middle value for the text as well the total barcode size
                options.x += (((endValue - startValue)) / 2) - newSize.width * .5;
                const diff: number = textProperty.margin.right - (endValue - (options.x + size.width));
                options.x -= diff;
                this.updateDisplayTextSize(options, newSize, endValue, startValue, textProperty);
            }
        }
    }


    private alignDisplayText(
        options: BaseAttributes, textProperty: DisplayTextModel, startValue: number, endValue: number, size: Size):
        void {
        let leftMargin: boolean = false;
        // have to adjust the displaytext position during the rendering of default displaytext size
        if ((textProperty.margin.left || textProperty.margin.right)) {
            if (options.x - startValue < textProperty.margin.left && textProperty.margin.left) {
                leftMargin = true;
                const diff: number = textProperty.margin.left - (options.x - startValue);
                options.x += diff;
                this.updateDisplayTextSize(options, size, endValue, startValue, textProperty);
            }
            if ((endValue - (options.x + size.width) < textProperty.margin.right) && textProperty.margin.right && !leftMargin) {
                const diff: number = textProperty.margin.right - (endValue - (options.x + size.width));
                options.x -= diff;
                this.updateDisplayTextSize(options, size, endValue, startValue, textProperty);
            } else if ((endValue - (options.x + size.width) < textProperty.margin.right)) {
                const newSize: Size = measureText(options);
                this.updateOverlappedTextPosition((endValue - startValue), options, newSize, startValue, textProperty, endValue);
                this.updateDisplayTextSize(options, newSize, endValue, startValue, textProperty);
            }
        }
    }


    private updateOverlappedTextPosition(
        width: number, options: BaseAttributes, size: Size, startValue: number, textProperty?: DisplayTextModel, endValue?: number):
        void {
        if ((size.width > width || textProperty) && (endValue - (options.x + size.width) <= textProperty.margin.right)
            && options.stringSize > 2) {
            options.stringSize -= !textProperty ? 2 : .2;
            const newSize: Size = measureText(options);
            this.updateOverlappedTextPosition(width, options, newSize, startValue, textProperty, endValue);
        } else if (!textProperty.margin.left && !textProperty.margin.right && options.stringSize > 2) {
            this.getAlignmentPosition(options, endValue, startValue, size);
        }
    }


    private drawText(canvas: HTMLCanvasElement, options: BaseAttributes): void {
        if (!this.isSvgMode) {
            options.y /= 1.5;
        }
        const barcodeRenderer: BarcodeRenderer = this.getInstance(canvas.id);
        barcodeRenderer.renderTextElement(canvas as HTMLCanvasElement, options);
    }
}
