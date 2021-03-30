
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


/**
 * Draw the root element for the barcode.\
 *
 * @returns {BarcodeRenderer} Draw the barcode SVG .
 * @param {QRCodeGeneratorModel} newProp - Provide the new property element .
 * @param {HTMLElement} barcodeCanvas - Provide the canvas element .
 * @param {RenderingMode} mode - Provide rendering mode .
 * @param {string} id - Provide id for the element .
 * @private
 */
export function removeChildElements(
    newProp: QRCodeGeneratorModel | DataMatrixGeneratorModel,
    barcodeCanvas: HTMLElement, mode: RenderingMode, id: string):
    BarcodeRenderer {
    const barCodeSVG: HTMLElement = barcodeCanvas;
    if (mode === 'SVG' && !newProp.mode) {
        barCodeSVG.innerHTML = '';
    } else if (newProp.mode) {
        barCodeSVG.parentNode.removeChild(barCodeSVG);
    }
    return new BarcodeRenderer(id, mode === 'SVG');
}

/**
 * Get the attributes for the barcodes.\
 *
 * @returns {BaseAttributes} Get the attributes for the barcodes .
 * @param {QRCodeGeneratorModel} width - Provide the canvas element .
 * @param {number} height - Provide the height of the  element .
 * @param {number} offSetX - Provide the offset X for the  element .
 * @param {number} offsetY - Provide the offset X for the element .
 * @param {string} color - Provide the color for the element .
 * @param {string} strokeColor - Provide the stroke color for the element .
 * @private
 */
export function getBaseAttributes(
    width: number, height: number, offSetX: number, offsetY: number,
    color: string, strokeColor?: string):
    BaseAttributes {
    const options: BaseAttributes = {
        width: width, height: height, x: offSetX, y: offsetY, color: color, strokeColor: strokeColor
    };
    return options;
}

/**
 * Clear the canvas element.\
 *
 * @returns {void} Clear the canvas element .
 * @param {QRCodeGenerator} view - Provide the view .
 * @param {HTMLCanvasElement} barcodeCanvas - Provide the canvas element .
 * @private
 */
export function clearCanvas(view: QRCodeGenerator | DataMatrixGenerator, barcodeCanvas: HTMLCanvasElement): void {
    const width: number = view.element.offsetWidth * 1.5;
    const height: number = view.element.offsetHeight * 1.5;
    const  ctx: CanvasRenderingContext2D = BarcodeCanvasRenderer.getContext(barcodeCanvas);
    ctx.clearRect(0, 0, width, height);
}

/**
 * Refresh the canvas barcode.\
 *
 * @returns {void} Refresh the canvas barcode .
 * @param {QRCodeGenerator} qrCodeGenerator - Provide the qr code element .
 * @param {HTMLCanvasElement} barcodeCanvas - Provide the canvas element .
 * @private
 */
export function refreshCanvasBarcode(qrCodeGenerator: QRCodeGenerator | DataMatrixGenerator, barcodeCanvas: HTMLCanvasElement): void {
    clearCanvas(qrCodeGenerator, barcodeCanvas);
}

/**
 * Will download the barode .\
 *
 * @returns {void} Will download the barode as image .
 * @param {QRCodeGenerator} type - Provide the qr code element .
 * @param {HTMLCanvasElement} fileName - Provide the canvas element .
 * @param {HTMLCanvasElement} url - Provide the url string value .
 * @private
 */
export function triggerDownload(type: string, fileName: string, url: string): void {
    const anchorElement: HTMLAnchorElement = document.createElement('a');
    anchorElement.download = fileName + '.' + type.toLocaleLowerCase();
    anchorElement.href = url;
    anchorElement.click();
}

/**
 * Will export the barode .\
 *
 * @returns {string} Will download the barode as image .
 * @param {QRCodeGenerator} exportType - Provide the export type .
 * @param {HTMLCanvasElement} fileName - Provide the file name .
 * @param {HTMLCanvasElement} element - Provide the url string value .
 * @param {HTMLCanvasElement} isReturnBase64 - Provide the url string value .
 * @param {HTMLCanvasElement} code - Provide the url string value .
 * @private
 */
export function exportAsImage(exportType: string, fileName: string, element: Element, isReturnBase64: boolean,
                              code: BarcodeGenerator | QRCodeGenerator | DataMatrixGenerator): Promise<string> {
    const returnValue: Promise<string> = imageExport(exportType, fileName, element, isReturnBase64, code);
    if (returnValue instanceof Promise) {
        returnValue.then((data: string) => {
            return data;
        });
    }
    return returnValue;
}

/**
 * Will export the barode as image.\
 *
 * @returns {string} Will download the barode as image .
 * @param {QRCodeGenerator} type - Provide the export type .
 * @param {HTMLCanvasElement} fileName - Provide the file name .
 * @param {HTMLCanvasElement} element - Provide the url string value .
 * @param {HTMLCanvasElement} isReturnBase64 - Provide the url string value .
 * @param {HTMLCanvasElement} code - Provide the url string value .
 * @private
 */
export function imageExport(type: string, fileName: string, element: Element, isReturnBase64: boolean,
                            code: BarcodeGenerator | QRCodeGenerator | DataMatrixGenerator): Promise<string> {
    // eslint-disable-next-line
    const promise: Promise<string> = new Promise((resolve: any, reject: any) => {
        // eslint-disable-next-line
        const canvas: any = element.children[0];
        /* tslint:enable */
        const serializer: string = 'XMLSerializer';
        const canvasElement: HTMLCanvasElement = document.createElement('canvas');
        canvasElement.height = element.clientHeight;
        canvasElement.width = element.clientWidth;
        const context: CanvasRenderingContext2D = canvasElement.getContext('2d');
        const image: HTMLImageElement = new Image();
        image.onload = () => {
            context.drawImage(image, 0, 0);
            if (!isReturnBase64) {
                triggerDownload(
                    type, fileName, canvasElement.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
                resolve(null);
            } else {
                const base64String: string = (type === 'JPG') ? canvasElement.toDataURL('image/jpg') :
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
