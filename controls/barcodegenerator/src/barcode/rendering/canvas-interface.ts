/**
 * svg renderer
 */
import { createHtmlElement } from '../utility/dom-util';
import { IBarcodeRenderer } from './IRenderer';



/** @private */
export interface BaseAttributes {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    string?: string;
    stringSize?: number;
    visibility?: boolean;
    fontStyle?: string;
    id?: string;
    strokeColor?: string;
}

/** @private */
export interface EncodingResult {
    checksum: number;
    result: string;
}

/** @private */
export interface PdfDataMatrixSymbolAttribute {
    SymbolRow: number;
    SymbolColumn: number;
    HorizontalDataRegion: number;
    VerticalDataRegion: number;
    DataCodewords: number;
    CorrectionCodewords: number;
    InterleavedBlock: number;
    InterleavedDataBlock: number;
}

/** @private */
export interface Code93ExtendedValues {
    value: string;
    checkDigit: number;
    bars: string;
}
/** @private */
export interface Code93ExtendedArrayAttribute {
    character: string;
    keyword?: string;
    value?: string;
}

/** @private */
export interface ValidateEvent {
    message: string;
}
/** @private */
export class BarcodeSVGRenderer implements IBarcodeRenderer {
    /**
     * Draw the root element for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     * @param {Object} attribute - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderRootElement(attribute: Object): HTMLElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }

    /**
     * Draw the rect for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     *  @param {Object} canvas - Provide the canvas element .
     *  @param {Object} attribute - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderRect(canvas: Object, attribute: Object): HTMLElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
    /**
     * Draw the horizontal line for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     *  @param {Object} canvas - Provide the canvas element .
     *  @param {Object} attribute - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderLine(canvas: Object, attribute: Object): HTMLElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
    /**
     * Draw the text for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     *  @param {Object} canvas - Provide the canvas element .
     *  @param {Object} attribute - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderText(canvas: Object, attribute: Object): HTMLElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
}
