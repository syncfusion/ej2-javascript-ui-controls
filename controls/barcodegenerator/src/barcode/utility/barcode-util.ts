
/**
 * Barcode util
 */
import { BarcodeRenderer } from './../../barcode/rendering/renderer';
import { QRCodeGeneratorModel } from '../../qrcode/qrcode-model';
import { DataMatrixGeneratorModel } from '../../datamatrix/datamatrix-model';
import { QRCodeGenerator } from '../../qrcode/qrcode';
import { DataMatrixGenerator } from '../../datamatrix/datamatrix';
import { BarcodeCanvasRenderer } from './../../barcode/rendering/canvas-renderer';
import { RenderingMode } from '../enum/enum';
import { BaseAttributes } from './../../barcode/rendering/canvas-interface';


/** @private */
export function removeChildElements(
    newProp: QRCodeGeneratorModel | DataMatrixGeneratorModel,
    barcodeCanvas: HTMLElement, mode: RenderingMode, id: string):
    BarcodeRenderer {
    let barCodeSVG: HTMLElement = barcodeCanvas;
    if (mode === 'SVG' && !newProp.mode) {
        barCodeSVG.innerHTML = '';
    } else if (newProp.mode) {
        barCodeSVG.parentNode.removeChild(barCodeSVG);
    }
    return new BarcodeRenderer(id, mode === 'SVG');
}

/** @private */
export function getBaseAttributes(
    width: number, height: number, offSetX: number, offsetY: number,
    color: string, strokeColor?: string):
    BaseAttributes {
    let options: BaseAttributes = {
        width: width, height: height, x: offSetX, y: offsetY, color: color, strokeColor: strokeColor
    };
    return options;
}

/** @private */
export function clearCanvas(view: QRCodeGenerator | DataMatrixGenerator, barcodeCanvas: HTMLCanvasElement): void {
    let width: number;
    let height: number;
    width = view.element.offsetWidth * 1.5;
    height = view.element.offsetHeight * 1.5;
    let ctx: CanvasRenderingContext2D = BarcodeCanvasRenderer.getContext(barcodeCanvas);
    ctx.clearRect(0, 0, width, height);
}

/** @private */
export function refreshCanvasBarcode(qrCodeGenerator: QRCodeGenerator | DataMatrixGenerator, barcodeCanvas: HTMLCanvasElement): void {
    clearCanvas(qrCodeGenerator, barcodeCanvas);
}
