import { BaseAttributes } from './rendering/canvas-interface';
import { Rect } from './primitives/rect';
import { MarginModel } from './primitives/margin-model';
import { DisplayTextModel } from './primitives/displaytext-model';
import { BarcodeType, Alignment, DataMatrixEncoding, DataMatrixSize } from './enum/enum';

/**
 * defines the common methods for the barcode
 */
export abstract class BarcodeBase {
    public abstract validateInput(char: string, characters: string): boolean | string
    public abstract drawImage(
        canvas: HTMLCanvasElement, options: BaseAttributes[], labelPosition: number,
        barcodeSize: Rect, endValue: number, textRender: string): void
    public abstract getDrawableSize(margin: MarginModel, widthValue: number, height: number): void
    public height: string | number;
    public width: string | number;
    public margin: MarginModel;
    public displayText: DisplayTextModel;
    public value: string;
    public foreColor: string;
    public type: BarcodeType;
    public isSvgMode: boolean;
    public alignment: Alignment;
    public enableCheckSum: boolean;
    public encodingValue: DataMatrixEncoding;
    public size: DataMatrixSize;
}
