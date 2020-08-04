
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
import { BarcodeGenerator } from '../barcode';


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

/** @private */
export function triggerDownload(type: string, fileName: string, url: string): void {
    let anchorElement: HTMLAnchorElement = document.createElement('a');
    anchorElement.download = fileName + '.' + type.toLocaleLowerCase();
    anchorElement.href = url;
    anchorElement.click();
}

/** @private */
export function exportAsImage(exportType: string, fileName: string, element: Element, isReturnBase64: boolean,
                              code: BarcodeGenerator | QRCodeGenerator | DataMatrixGenerator): Promise<string> {
    let returnValue: Promise<string> = this.imageExport(exportType, fileName, element, isReturnBase64, code);
    if (returnValue instanceof Promise) {
        returnValue.then((data: string) => {
            return data;
        });
    }
    return returnValue;
}

/** @private */
export function imageExport(type: string, fileName: string, element: Element, isReturnBase64: boolean,
                            code: BarcodeGenerator | QRCodeGenerator | DataMatrixGenerator): Promise<string> {
    /* tslint:disable */
    let promise: Promise<string> = new Promise((resolve: any, reject: any) => {
        let canvas: any = element.children[0];
        /* tslint:enable */
        let serializer: string = 'XMLSerializer';
        let canvasElement: HTMLCanvasElement = document.createElement('canvas');
        canvasElement.height = element.clientHeight;
        canvasElement.width = element.clientWidth;
        let context: CanvasRenderingContext2D = canvasElement.getContext('2d');
        let image: HTMLImageElement = new Image();
        image.onload = () => {
            context.drawImage(image, 0, 0);
            if (!isReturnBase64) {
                this.triggerDownload(
                    type, fileName, canvasElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
                resolve(null);
            } else {
                let base64String: string = (type === 'JPG') ? canvasElement.toDataURL('image/jpg') :
                    canvasElement.toDataURL('image/png');
                resolve(base64String);
            }
        };
        if (code.mode === 'Canvas') {
            image.src = (type === 'JPG') ? canvas.toDataURL('image/jpg') : canvas.toDataURL('image/png');
            canvasElement.height = element.clientHeight * 1.5;
            canvasElement.width = element.clientWidth * 1.5;
            context.scale(2 / 3, 2 / 3);
        } else {
            image.src = window.URL.createObjectURL(
                new Blob([new window[serializer]().serializeToString(element.children[0])], { type: 'image/svg+xml' }
                ));
        }
    });
    return promise;
}