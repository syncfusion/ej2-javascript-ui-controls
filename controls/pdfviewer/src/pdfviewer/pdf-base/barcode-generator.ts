import { DataMatrixGenerator, DataMatrixGeneratorModel, ErrorCorrectionLevel, PDF417ErrorCorrectionLevel, PDF417Generator, PDF417GeneratorModel, QRCodeGenerator, QRCodeGeneratorModel } from '@syncfusion/ej2-barcode-generator';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

/**
 * @private
 * @hidden
 * @param {string} value - The value to encode.
 * @param {{ width: number, height: number }} bounds - The field size in pixels.
 * @param {IBarcodeRenderOptions} [options] - Optional symbology / colors / EC level.
 * @returns {HTMLElement} The barcode element wrapper.
 */
export function renderBarcodeField(value: string, bounds: { width: number, height: number }, options?: IBarcodeRenderOptions): HTMLElement {
    const symbology: string = (options && options.symbology) ? options.symbology : 'PDF417';
    const wrapper: HTMLElement = document.createElement('div');
    wrapper.style.width = bounds.width + 'px';
    wrapper.style.height = bounds.height + 'px';
    wrapper.style.overflow = 'hidden';
    wrapper.setAttribute('data-barcode-wrapper', 'true');
    wrapper.setAttribute('data-barcode-symbology', symbology);
    const target: HTMLElement = document.createElement('div');
    target.style.width = '100%';
    target.classList.add('barcode_element');
    target.style.height = '100%';
    wrapper.appendChild(target);
    return wrapper;
}

/**
 * @private
 * @hidden
 * @param {HTMLElement} wrapper - The wrapper from `renderBarcodeField`.
 * @param {string} value - The payload.
 * @param {{ width: number, height: number }} bounds - The field size in pixels.
 * @param {IBarcodeRenderOptions} [options] - Optional colors / EC level.
 * @returns {any} The generator instance, or null / empty.
 */
export function mountBarcodeGenerator(wrapper: HTMLElement, value: string, bounds: { width: number, height: number },
                                      options?: IBarcodeRenderOptions): any {
    const symbology: string = (options && options.symbology) ? options.symbology : 'PDF417';
    if (value === null || value === undefined) {
        return null;
    }
    let target: HTMLElement = wrapper.querySelector('div') as HTMLElement;
    if (!target) {
        target = document.createElement('div');
        target.classList.add('barcode_element');
        target.style.width = '100%';
        target.style.height = '100%';
        wrapper.appendChild(target);
    }
    const generator: any = createBarcodeGenerator(symbology, target, value, bounds, options);
    (wrapper as any).__barcodeGenerator = generator;
    (wrapper as any).__barcodeSymbology = symbology;
    return generator;
}

/**
 * @private
 * @hidden
 * @param {string} symbology - One of QRCode / DataMatrix / PDF417.
 * @param {HTMLElement} target - Element the generator renders into.
 * @param {string} value - The payload.
 * @param {{ width: number, height: number }} bounds - The field size in pixels.
 * @param {IBarcodeRenderOptions} [options] - Optional colors / EC level.
 * @returns {any} The new generator instance.
 */
function createBarcodeGenerator(symbology: string, target: HTMLElement, value: string, bounds: { width: number, height: number },
                                options?: IBarcodeRenderOptions): any {
    const foreColor: string = (options && options.foreColor) ? options.foreColor : '#000000';
    const backColor: string = (options && options.backColor) ? options.backColor : '#ffffff';
    const ec: string = (options && options.errorCorrection) ? options.errorCorrection : 'Medium';
    const xDimension: number = (options && options.xDimension) ? options.xDimension : 4;
    const caption: string = (options && options.caption) ? options.caption : '';
    const isCaptionVisible: boolean = (!isNullOrUndefined(caption) && caption !== '');
    const safeValue: string = (value && value !== '')
        ? ((options && options.compressData === true) ? value.replace(/\s+/g, '') : value) : ' ';
    const baseProps: QRCodeGeneratorModel | DataMatrixGeneratorModel | PDF417GeneratorModel = {
        width: bounds.width + 'px',
        height: bounds.height + 'px',
        mode: 'SVG',
        value: safeValue,
        displayText: { visibility: isCaptionVisible, text: caption, size: 10 },
        backgroundColor: backColor,
        foreColor: foreColor,
        xDimension: xDimension,
        margin: {left: 0, right: 0, top: 0, bottom: 10}
    };
    let generator: any;
    if (symbology === 'QRCode') {
        (baseProps as QRCodeGeneratorModel).errorCorrectionLevel = qrErrorCorrectionToNumber(ec);
        generator = new QRCodeGenerator(baseProps as QRCodeGeneratorModel);
    } else if (symbology === 'DataMatrix') {
        generator = new DataMatrixGenerator(baseProps as DataMatrixGeneratorModel);
    } else {
        (baseProps as PDF417GeneratorModel).errorCorrectionLevel = pdf417ErrorCorrectionToEnum(ec);
        generator = new PDF417Generator(baseProps as PDF417GeneratorModel);
    }
    try {
        generator.appendTo(target);
    } catch (e) {
        // The target may be detached during destroy � swallow.
    }
    try {
        generator.dataBind();
    } catch (e) {
        // First-paint commit may fail if the target is detached � swallow.
    }
    return generator;
}

function pdf417ErrorCorrectionToEnum(ec: string): PDF417ErrorCorrectionLevel  {
    switch (ec) {
    case 'Level0':
        return PDF417ErrorCorrectionLevel.Level0;
    case 'Level1':
        return PDF417ErrorCorrectionLevel.Level1;
    case 'Level2':
        return PDF417ErrorCorrectionLevel.Level2;
    case 'Level3':
        return PDF417ErrorCorrectionLevel.Level3;
    case 'Level4':
        return PDF417ErrorCorrectionLevel.Level4;
    case 'Level6':
        return PDF417ErrorCorrectionLevel.Level6;
    case 'Level7':
        return PDF417ErrorCorrectionLevel.Level7;
    case 'Level8':
        return PDF417ErrorCorrectionLevel.Level8;
    default:
        return PDF417ErrorCorrectionLevel.Level5;
    }
}

function qrErrorCorrectionToNumber(ec: string): ErrorCorrectionLevel {
    switch (ec) {
    case 'Low':
        return ErrorCorrectionLevel.Low;
    case 'Quartile':
        return ErrorCorrectionLevel.Quartile;
    case 'High':
        return ErrorCorrectionLevel.High;
    default:
        return ErrorCorrectionLevel.Medium;
    }
}

export function isBarcodeRenderableAt(value: string,
                                      bounds: { width: number, height: number },
                                      options?: IBarcodeRenderOptions): boolean {
    const symbology: string = (options && options.symbology) ? options.symbology : 'PDF417';
    const container: HTMLElement = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.opacity = '0';
    const target: HTMLElement = document.createElement('div');
    target.classList.add('barcode_element');
    container.appendChild(target);
    document.body.appendChild(container);
    let generator: any = null;
    let isRenderable: boolean = false;
    try {
        generator = createBarcodeGenerator(symbology, target, value, bounds, options);
        const svg: SVGElement = container.querySelector('svg') as SVGElement;
        isRenderable = !isNullOrUndefined(svg) && svg.clientWidth > 60 && svg.clientHeight > 60 && svg.childNodes.length > 0;
    } catch (e) {
        isRenderable = false;
    } finally {
        if (generator) {
            try { generator.destroy(); } catch (e) { /* ignore */ }
        }
        container.remove();
    }
    return isRenderable;
}

/**
 * Options that drive the on-screen barcode glyph
 *
 * @hidden
 */
export interface IBarcodeRenderOptions {
    symbology?: string;
    foreColor?: string;
    backColor?: string;
    errorCorrection?: string;
    caption?: string;
    xDimension?: number;
    compressData?: boolean;
}
