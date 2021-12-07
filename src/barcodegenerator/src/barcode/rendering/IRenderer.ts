/**
 * IRenderer interface
 */
/** @private */
export interface IBarcodeRenderer {
    // eslint-disable-next-line
    renderRootElement(attribute: Object, backGroundColor: string, width: number, height: number): HTMLElement;
    // eslint-disable-next-line
    renderRect(canvas: HTMLCanvasElement, attribute: Object, isText?: boolean): HTMLElement;
    // eslint-disable-next-line
    renderText(canvas: HTMLCanvasElement, attribute: Object): HTMLElement;
}
