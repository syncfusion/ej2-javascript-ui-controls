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
    /**   @private  */
    public renderRootElement(attribute: Object): HTMLElement {
        let canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
    /**   @private  */
    public renderRect(canvas: Object, attribute: Object): HTMLElement {
        let canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
    /**   @private  */
    public renderLine(canvas: Object, attribute: Object): HTMLElement {
        let canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
    /**   @private  */
    public renderText(canvas: Object, attribute: Object): HTMLElement {
        let canvasObj: HTMLCanvasElement = createHtmlElement('canvase', attribute) as HTMLCanvasElement;
        return canvasObj;
    }
}