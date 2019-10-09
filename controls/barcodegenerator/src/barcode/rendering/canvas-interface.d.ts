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
export declare class BarcodeSVGRenderer implements IBarcodeRenderer {
    /**   @private  */
    renderRootElement(attribute: Object): HTMLElement;
    /**   @private  */
    renderRect(canvas: Object, attribute: Object): HTMLElement;
    /**   @private  */
    renderLine(canvas: Object, attribute: Object): HTMLElement;
    /**   @private  */
    renderText(canvas: Object, attribute: Object): HTMLElement;
}
