/**
 * IRenderer interface
 */
/** @private */
export interface IBarcodeRenderer {
    renderRootElement(attribute: Object, backGroundColor: string, width: number, height: number): HTMLElement;
    renderRect(canvas: HTMLCanvasElement, attribute: Object, isText?: boolean): HTMLElement;
    renderText(canvas: HTMLCanvasElement, attribute: Object): HTMLElement;
}
